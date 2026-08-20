from rest_framework import serializers

from apps.warehouse.models import Asset, Dock, Location, Room, WarehouseArea


class LocationTwinSerializer(serializers.ModelSerializer):
    locationCode = serializers.CharField(source='location_code', read_only=True)
    tagNo = serializers.SerializerMethodField()
    itemName = serializers.SerializerMethodField()
    customerName = serializers.SerializerMethodField()
    quantity = serializers.SerializerMethodField()
    batchNo = serializers.SerializerMethodField()
    expirationDate = serializers.SerializerMethodField()

    class Meta:
        model = Location
        fields = ['id', 'side', 'column', 'level', 'depth', 'status', 'locationCode', 'tagNo', 'itemName', 'customerName', 'quantity', 'batchNo', 'expirationDate']

    def _active_tag(self, obj: Location):
        if not hasattr(obj, '_active_tag_cache'):
            obj._active_tag_cache = obj.tags.filter(status='in_storage').select_related('batch__item', 'customer').first()
        return obj._active_tag_cache

    def get_tagNo(self, obj):
        tag = self._active_tag(obj)
        return tag.tag_no if tag else None

    def get_itemName(self, obj):
        tag = self._active_tag(obj)
        return tag.batch.item.item_name if tag else None

    def get_customerName(self, obj):
        tag = self._active_tag(obj)
        return tag.customer.customer_name if tag else None

    def get_quantity(self, obj):
        tag = self._active_tag(obj)
        return tag.quantity if tag else None

    def get_batchNo(self, obj):
        tag = self._active_tag(obj)
        return tag.batch.batch_no if tag else None

    def get_expirationDate(self, obj):
        tag = self._active_tag(obj)
        return tag.batch.expiration_date if tag else None


class RoomTwinSerializer(serializers.ModelSerializer):
    locations = LocationTwinSerializer(many=True, read_only=True)
    occupancy = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = ['id', 'room_number', 'room_code', 'room_name', 'room_type', 'target_temp_c', 'columns_left', 'columns_right', 'levels', 'depth', 'capacity_locations', 'locations', 'occupancy']

    def get_occupancy(self, obj: Room):
        total = obj.locations.count()
        occupied = obj.locations.filter(status='occupied').count()
        reserved = obj.locations.filter(status='reserved').count()
        blocked = obj.locations.filter(status='blocked').count()
        return {
            'total': total,
            'occupied': occupied,
            'reserved': reserved,
            'blocked': blocked,
            'available': total - occupied - reserved - blocked,
            'occupancyPct': round((occupied / total) * 100, 1) if total else 0,
        }


class WarehouseAreaSerializer(serializers.ModelSerializer):
    """Feeds the Warehouse module's Cold Storage / Dry Warehouse / Chiller
    Room section tabs and their landing-page summary cards."""

    areaCode = serializers.CharField(source='area_code')
    areaName = serializers.CharField(source='area_name')
    areaType = serializers.CharField(source='area_type')
    targetTempC = serializers.DecimalField(source='target_temp_c', max_digits=5, decimal_places=1, read_only=True, allow_null=True)
    available = serializers.IntegerField(read_only=True)
    utilizationPct = serializers.FloatField(source='utilization_pct', read_only=True)
    roomNumber = serializers.IntegerField(source='room.room_number', read_only=True, allow_null=True, default=None)

    class Meta:
        model = WarehouseArea
        fields = ['id', 'areaCode', 'areaName', 'areaType', 'floor', 'capacity', 'occupied', 'available', 'utilizationPct', 'targetTempC', 'status', 'roomNumber']


class DockSerializer(serializers.ModelSerializer):
    """Feeds the Warehouse module's Loading Area section."""

    dockCode = serializers.CharField(source='dock_code')
    activityStartedAt = serializers.DateTimeField(source='activity_started_at', read_only=True, allow_null=True)

    class Meta:
        model = Dock
        fields = ['id', 'dockCode', 'status', 'activity', 'reference', 'activityStartedAt']


class AssetSerializer(serializers.ModelSerializer):
    """Feeds the Warehouse module's Assets section."""

    assetCode = serializers.CharField(source='asset_code')
    assetType = serializers.CharField(source='asset_type')
    serialNumber = serializers.CharField(source='serial_number', required=False, allow_blank=True)
    assignedUser = serializers.CharField(source='assigned_user.get_username', read_only=True, default=None)
    currentLocation = serializers.CharField(source='current_location.area_code', read_only=True, default=None)
    maintenanceDate = serializers.DateField(source='maintenance_date', required=False, allow_null=True)

    class Meta:
        model = Asset
        fields = ['id', 'assetCode', 'assetType', 'brand', 'model', 'serialNumber', 'status', 'assignedUser', 'currentLocation', 'maintenanceDate', 'notes']
