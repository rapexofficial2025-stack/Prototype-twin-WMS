import re
import uuid

from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.models import Customer, Item
from apps.stock.models import Batch, StockLedger, Tag
from apps.stock.serializers import LedgerEntrySerializer, ReceiveLineResponseSerializer, ReceiveLineSerializer, TagScanSerializer, TagScanUpdateSerializer
from apps.warehouse.models import Location, Room

LEVEL_LETTERS = 'ABCDEFG'
LOCATION_CODE_RE = re.compile(r'^RM(?P<room>\d+)-CO(?P<column>\d+)-L(?P<level>[A-Za-z])-D(?P<depth>\d+)$')


class StockLedgerListView(ListAPIView):
    """GET /api/stock/ledger/?customer=&item=&location=&batch= — feeds the
    Stock Ledger report page. Filtering can be extended as query params grow."""
    serializer_class = LedgerEntrySerializer
    queryset = StockLedger.objects.select_related('tag__batch__item', 'location', 'customer')

    def get_queryset(self):
        qs = super().get_queryset()
        customer = self.request.query_params.get('customer')
        location = self.request.query_params.get('location')
        batch = self.request.query_params.get('batch')
        if customer:
            qs = qs.filter(customer_id=customer)
        if location:
            qs = qs.filter(location_id=location)
        if batch:
            qs = qs.filter(tag__batch__batch_no=batch)
        return qs


def _resolve_location(location_code: str) -> Location:
    """Parses a twin-style code like RM1-CO4-LA-D1 (room/column/level-letter/
    1-indexed depth) into a Location row, auto-creating the Room/Location if
    this is the first time stock has ever gone there."""
    match = LOCATION_CODE_RE.match(location_code.strip().upper())
    if not match:
        raise ValueError(f'Unrecognized location code: {location_code}')
    room_number = int(match.group('room'))
    column = int(match.group('column'))
    level = LEVEL_LETTERS.index(match.group('level'))
    depth = int(match.group('depth')) - 1
    side = 'left' if column <= 15 else 'right'

    room, _ = Room.objects.get_or_create(room_number=room_number, defaults={'room_name': f'Cold Room {room_number:02d}'})
    location, _ = Location.objects.get_or_create(room=room, side=side, column=column, level=level, depth=depth)
    return location


class ReceiveLineView(APIView):
    """POST /api/stock/receive/ — the write-path behind Add Stock.

    One call = one pallet: gets-or-creates the Customer/Item/Batch/Location,
    creates a Tag, and writes the matching StockLedger acceptance entry.
    Moving/withdrawing that pallet afterwards goes through the ledger store
    (transfer/withdrawal/adjustment), never by editing this row."""

    def post(self, request):
        payload = ReceiveLineSerializer(data=request.data)
        payload.is_valid(raise_exception=True)
        data = payload.validated_data

        try:
            location = _resolve_location(data['locationCode'])
        except ValueError as exc:
            return Response({'locationCode': [str(exc)]}, status=status.HTTP_400_BAD_REQUEST)

        customer, _ = Customer.objects.get_or_create(customer_name=data['customerName'], defaults={'customer_no': f'CUST-{uuid.uuid4().hex[:8].upper()}'})
        item, _ = Item.objects.get_or_create(customer=customer, item_name=data['itemName'], defaults={'packaging': data.get('packaging', 'Box')})
        batch, _ = Batch.objects.get_or_create(
            item=item, batch_no=data.get('batch') or f'B-{uuid.uuid4().hex[:8].upper()}',
            defaults={'production_date': data.get('productionDate'), 'expiration_date': data.get('expirationDate')},
        )

        quantity = data['quantity']
        avg_weight = data.get('avgWeight') or 0
        tag = Tag.objects.create(
            tag_no=f'TAG-{uuid.uuid4().hex[:10].upper()}', batch=batch, customer=customer, location=location,
            quantity=quantity, avg_weight=avg_weight, total_weight=quantity * avg_weight,
        )

        last_entry = StockLedger.objects.filter(customer=customer, tag__batch__item=item).order_by('-created_at').first()
        running_balance = (last_entry.running_balance if last_entry else 0) + quantity
        StockLedger.objects.create(
            doc_type='acceptance', document_no=f'RCV-{tag.tag_no}', tag=tag, location=location, customer=customer,
            quantity=quantity, weight=quantity * avg_weight, running_balance=running_balance,
        )

        return Response(ReceiveLineResponseSerializer(tag).data, status=status.HTTP_201_CREATED)


class TagScanView(APIView):
    """Backs the Checker/Warehouseman/Operator scanner app.

    GET  /api/stock/tags/<tag_no>/scan/ — locator + editable fields for the
         scanned pallet.
    POST /api/stock/tags/<tag_no>/scan/ — confirm an update (quantity, UOM,
         layer count, and/or a move to a new location). Writes one
         StockLedger adjustment row, stamps last_scanned_at, and — if the
         location changed — relies on apps/stock/signals.py to recompute
         Location.status and mirror it to Firebase, so the 3D twin and the
         Locator/Logistics Coordinator dashboards update immediately.
    """

    def get_object(self, tag_no):
        return get_object_or_404(Tag.objects.select_related('batch__item', 'customer', 'location__room'), tag_no=tag_no)

    def get(self, request, tag_no):
        tag = self.get_object(tag_no)
        return Response(TagScanSerializer(tag).data)

    def post(self, request, tag_no):
        tag = self.get_object(tag_no)
        payload = TagScanUpdateSerializer(data=request.data)
        payload.is_valid(raise_exception=True)
        data = payload.validated_data

        previous_quantity = tag.quantity
        previous_location = tag.location

        if 'quantity' in data:
            tag.quantity = data['quantity']
            tag.total_weight = tag.quantity * tag.avg_weight
        if 'uom' in data:
            tag.uom = data['uom']
        if 'qty_per_layer' in data:
            tag.qty_per_layer = data['qty_per_layer']
        if 'location_id' in data:
            tag.location = get_object_or_404(Location, pk=data['location_id'])
        tag.last_scanned_at = timezone.now()
        tag.save()

        quantity_delta = tag.quantity - previous_quantity
        previous_location_id = previous_location.id if previous_location else None
        location_moved = previous_location_id != tag.location_id
        if quantity_delta != 0 or location_moved:
            last_entry = StockLedger.objects.filter(customer=tag.customer, tag__batch__item=tag.batch.item).order_by('-created_at').first()
            running_balance = (last_entry.running_balance if last_entry else 0) + quantity_delta
            StockLedger.objects.create(
                doc_type='adjustment',
                document_no=f'SCAN-{tag.tag_no}-{int(tag.last_scanned_at.timestamp())}',
                tag=tag,
                location=tag.location,
                customer=tag.customer,
                quantity=quantity_delta,
                weight=quantity_delta * tag.avg_weight,
                running_balance=running_balance,
            )

        return Response(TagScanSerializer(tag).data)
