from rest_framework import serializers

from apps.stock.models import StockLedger


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
