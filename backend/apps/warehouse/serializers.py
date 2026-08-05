from rest_framework import serializers

from apps.warehouse.models import Location, Room


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
        fields = ['id', 'room_number', 'room_name', 'room_type', 'target_temp_c', 'columns_left', 'columns_right', 'levels', 'depth', 'capacity_locations', 'locations', 'occupancy']

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
