from django.contrib import admin

from apps.warehouse.models import Asset, Dock, Location, Room, WarehouseArea


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ['room_number', 'room_code', 'room_name', 'room_type', 'status', 'target_temp_c', 'capacity_locations']


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ['location_code', 'room', 'side', 'column', 'level', 'depth', 'status', 'dock_number']
    list_filter = ['room', 'status', 'side']


@admin.register(WarehouseArea)
class WarehouseAreaAdmin(admin.ModelAdmin):
    list_display = ['area_code', 'area_name', 'area_type', 'floor', 'status', 'capacity', 'occupied', 'target_temp_c']
    list_filter = ['area_type', 'status']


@admin.register(Dock)
class DockAdmin(admin.ModelAdmin):
    list_display = ['dock_code', 'status', 'activity', 'reference', 'activity_started_at']
    list_filter = ['status', 'activity']


@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display = ['asset_code', 'asset_type', 'brand', 'model', 'status', 'assigned_user', 'current_location', 'maintenance_date']
    list_filter = ['asset_type', 'status']
