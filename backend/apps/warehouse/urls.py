from django.urls import path

from apps.warehouse.views import (
    AssetListView,
    DockListView,
    MachineRoomView,
    RoomListView,
    RoomTwinView,
    WarehouseAreaListView,
    WarehouseSummaryView,
)

urlpatterns = [
    path('rooms/', RoomListView.as_view(), name='room-list'),
    path('rooms/<int:room_number>/twin/', RoomTwinView.as_view(), name='room-twin'),
    path('areas/', WarehouseAreaListView.as_view(), name='area-list'),
    path('docks/', DockListView.as_view(), name='dock-list'),
    path('assets/', AssetListView.as_view(), name='asset-list'),
    path('machine-room/', MachineRoomView.as_view(), name='machine-room'),
    path('summary/', WarehouseSummaryView.as_view(), name='warehouse-summary'),
]
