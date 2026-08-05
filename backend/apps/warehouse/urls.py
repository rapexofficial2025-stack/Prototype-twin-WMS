from django.urls import path

from apps.warehouse.views import RoomListView, RoomTwinView

urlpatterns = [
    path('rooms/', RoomListView.as_view(), name='room-list'),
    path('rooms/<int:room_number>/twin/', RoomTwinView.as_view(), name='room-twin'),
]
