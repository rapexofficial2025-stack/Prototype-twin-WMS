from django.db.models import Sum
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.warehouse.models import Asset, Dock, Room, WarehouseArea
from apps.warehouse.permissions import IsMachineRoomAuthorized
from apps.warehouse.serializers import AssetSerializer, DockSerializer, RoomTwinSerializer, WarehouseAreaSerializer


class RoomListView(ListAPIView):
    """Feeds the Dashboard's Cold Room Status cards."""
    queryset = Room.objects.all().order_by('room_number')
    serializer_class = RoomTwinSerializer


class RoomTwinView(RetrieveAPIView):
    """GET /api/warehouse/rooms/<room_number>/twin/ — the full location grid
    for one room, consumed by the React Three Fiber Digital Twin to replace
    the previous hash-based fake occupancy."""
    serializer_class = RoomTwinSerializer
    lookup_field = 'room_number'
    lookup_url_kwarg = 'room_number'
    queryset = Room.objects.prefetch_related('locations__tags__batch__item', 'locations__tags__customer')


class WarehouseAreaListView(ListAPIView):
    """GET /api/warehouse/areas/?type=cold_storage — feeds the Warehouse
    module's Cold Storage / Dry Warehouse / Chiller Room section tabs.
    `type` matches WarehouseArea.AREA_TYPE_CHOICES; omit it to list every area."""
    serializer_class = WarehouseAreaSerializer
    queryset = WarehouseArea.objects.select_related('room').all()

    def get_queryset(self):
        qs = super().get_queryset()
        area_type = self.request.query_params.get('type')
        if area_type:
            qs = qs.filter(area_type=area_type)
        return qs


class DockListView(ListAPIView):
    """GET /api/warehouse/docks/ — feeds the Warehouse module's Loading Area section."""
    queryset = Dock.objects.all()
    serializer_class = DockSerializer


class AssetListView(ListAPIView):
    """GET /api/warehouse/assets/?type=forklift — feeds the Warehouse
    module's Assets section. `type` matches Asset.ASSET_TYPE_CHOICES."""
    serializer_class = AssetSerializer
    queryset = Asset.objects.select_related('assigned_user', 'current_location').all()

    def get_queryset(self):
        qs = super().get_queryset()
        asset_type = self.request.query_params.get('type')
        if asset_type:
            qs = qs.filter(asset_type=asset_type)
        return qs


class MachineRoomView(APIView):
    """GET /api/warehouse/machine-room/ — Super Admin / Warehouse Manager /
    Supervisor / Authorized Maintenance only (Phase W-01 spec §6/§10).
    Structure and access control only: no equipment telemetry yet."""
    permission_classes = [IsMachineRoomAuthorized]

    EQUIPMENT_CATEGORIES = [
        {'key': 'refrigeration', 'label': 'Refrigeration Equipment'},
        {'key': 'compressor', 'label': 'Compressor'},
        {'key': 'evaporator', 'label': 'Evaporator'},
        {'key': 'condenser', 'label': 'Condenser'},
        {'key': 'generator', 'label': 'Generator'},
        {'key': 'electrical', 'label': 'Electrical Systems'},
        {'key': 'temperature_control', 'label': 'Temperature Control Systems'},
    ]

    def get(self, request):
        return Response({
            'equipmentCategories': self.EQUIPMENT_CATEGORIES,
            'telemetry': None,
            'message': 'Machine Room structure ready. Equipment monitoring is a later phase.',
        })


class WarehouseSummaryView(APIView):
    """GET /api/warehouse/summary/ — aggregate counts for the Warehouse
    module's landing-page section cards."""

    def _area_summary(self, *area_types):
        areas = WarehouseArea.objects.filter(area_type__in=area_types)
        capacity = areas.aggregate(total=Sum('capacity'))['total'] or 0
        occupied = areas.aggregate(total=Sum('occupied'))['total'] or 0
        return {
            'count': areas.count(),
            'capacity': capacity,
            'occupied': occupied,
            'utilizationPct': round((occupied / capacity) * 100, 1) if capacity else 0,
        }

    def get(self, request):
        docks = Dock.objects.all()
        return Response({
            'coldStorage': self._area_summary('cold_storage', 'blast_freezer', 'anteroom'),
            'dryWarehouse': self._area_summary('dry_warehouse'),
            'chillerRoom': self._area_summary('chiller_room'),
            'loadingArea': {
                'docks': docks.count(),
                'available': docks.filter(status='available').count(),
                'active': docks.filter(status='active').count(),
                'waiting': docks.filter(status='reserved').count(),
            },
            'assets': Asset.objects.count(),
        })
