from django.contrib import admin

from apps.warehouse.models import Location, Room


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ['room_number', 'room_name', 'room_type', 'target_temp_c', 'capacity_locations']


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ['location_code', 'room', 'side', 'column', 'level', 'depth', 'status', 'dock_number']
    list_filter = ['room', 'status', 'side']
