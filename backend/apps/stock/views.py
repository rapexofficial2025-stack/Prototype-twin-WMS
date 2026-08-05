from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.stock.models import StockLedger, Tag
from apps.stock.serializers import LedgerEntrySerializer, TagScanSerializer, TagScanUpdateSerializer
from apps.warehouse.models import Location


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
