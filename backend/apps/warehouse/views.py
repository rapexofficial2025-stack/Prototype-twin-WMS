from rest_framework.generics import ListAPIView, RetrieveAPIView

from apps.warehouse.models import Room
from apps.warehouse.serializers import RoomTwinSerializer


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
