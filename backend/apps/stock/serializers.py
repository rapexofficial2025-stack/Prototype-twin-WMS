from rest_framework import serializers

from apps.stock.models import StockLedger, Tag


class ReceiveLineSerializer(serializers.Serializer):
    """Body of one Add Stock row from the React UI. One call = one pallet."""
    customerName = serializers.CharField(max_length=200)
    itemName = serializers.CharField(max_length=200)
    batch = serializers.CharField(max_length=64, required=False, allow_blank=True)
    productionDate = serializers.DateField(required=False, allow_null=True)
    expirationDate = serializers.DateField(required=False, allow_null=True)
    packaging = serializers.CharField(max_length=50, required=False, allow_blank=True, default='Box')
    quantity = serializers.DecimalField(max_digits=10, decimal_places=2)
    avgWeight = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=0)
    locationCode = serializers.CharField(max_length=64)


class ReceiveLineResponseSerializer(serializers.ModelSerializer):
    tagNo = serializers.CharField(source='tag_no', read_only=True)
    itemName = serializers.CharField(source='batch.item.item_name', read_only=True)
    batch = serializers.CharField(source='batch.batch_no', read_only=True)
    room = serializers.CharField(source='location.room.room_name', read_only=True)
    location = serializers.CharField(source='location.location_code', read_only=True)
    productionDate = serializers.DateField(source='batch.production_date', read_only=True)
    expirationDate = serializers.DateField(source='batch.expiration_date', read_only=True)
    avgWeight = serializers.DecimalField(source='avg_weight', max_digits=10, decimal_places=2, read_only=True)
    totalWeight = serializers.DecimalField(source='total_weight', max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = Tag
        fields = ['tagNo', 'itemName', 'batch', 'room', 'location', 'productionDate', 'expirationDate', 'quantity', 'avgWeight', 'totalWeight']


class TagScanSerializer(serializers.ModelSerializer):
    """What the Checker/Warehouseman/Operator app shows after a QR scan.
    Locator fields (tagNo, locationCode, dockNumber) are read-only context;
    itemName/quantity/uom/qtyPerLayer are what gets edited and confirmed."""
    tagNo = serializers.CharField(source='tag_no', read_only=True)
    locationCode = serializers.CharField(source='location.location_code', read_only=True)
    dockNumber = serializers.CharField(source='location.dock_number', read_only=True)
    roomNumber = serializers.IntegerField(source='location.room.room_number', read_only=True)
    itemName = serializers.CharField(source='batch.item.item_name', read_only=True)
    batchNo = serializers.CharField(source='batch.batch_no', read_only=True)
    customerName = serializers.CharField(source='customer.customer_name', read_only=True)
    qtyPerLayer = serializers.IntegerField(source='qty_per_layer', read_only=True)
    lastScannedAt = serializers.DateTimeField(source='last_scanned_at', read_only=True)

    class Meta:
        model = Tag
        fields = ['tagNo', 'locationCode', 'dockNumber', 'roomNumber', 'itemName', 'batchNo', 'customerName', 'quantity', 'uom', 'qtyPerLayer', 'lastScannedAt', 'status']


class TagScanUpdateSerializer(serializers.Serializer):
    """Body of a confirmed scan update. location_id lets the Checker record
    a move (transfer) in the same action as a quantity/UOM correction."""
    quantity = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    uom = serializers.CharField(max_length=20, required=False)
    qty_per_layer = serializers.IntegerField(required=False, allow_null=True)
    location_id = serializers.IntegerField(required=False)


class LedgerEntrySerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(source='created_at', format='%Y-%m-%d', read_only=True)
    documentNo = serializers.CharField(source='document_no', read_only=True)
    type = serializers.CharField(source='doc_type', read_only=True)
    batch = serializers.CharField(source='tag.batch.batch_no', read_only=True)
    tagNo = serializers.CharField(source='tag.tag_no', read_only=True)
    location = serializers.CharField(source='location.location_code', read_only=True)
    itemDescription = serializers.CharField(source='tag.batch.item.item_name', read_only=True)
    avgWeight = serializers.DecimalField(source='tag.avg_weight', max_digits=10, decimal_places=2, read_only=True)
    runningBalance = serializers.DecimalField(source='running_balance', max_digits=12, decimal_places=2, read_only=True)
    productionDate = serializers.DateField(source='tag.batch.production_date', read_only=True)
    expirationDate = serializers.DateField(source='tag.batch.expiration_date', read_only=True)
    customerName = serializers.CharField(source='customer.customer_name', read_only=True)

    class Meta:
        model = StockLedger
        fields = ['id', 'date', 'documentNo', 'type', 'batch', 'tagNo', 'location', 'itemDescription', 'quantity', 'avgWeight', 'weight', 'runningBalance', 'productionDate', 'expirationDate', 'customerName']
