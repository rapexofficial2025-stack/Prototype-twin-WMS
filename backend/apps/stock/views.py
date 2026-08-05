from rest_framework.generics import ListAPIView

from apps.stock.models import StockLedger
from apps.stock.serializers import LedgerEntrySerializer


class StockLedgerListView(ListAPIView):
    """GET /api/stock/ledger/?customer=&item=&location=&batch= — feeds the
    Stock Ledger report page. Filtering can be extended as query params grow."""
    serializer_class = LedgerEntrySerializer
    queryset = StockLedger.objects.select_related('tag__batch__item', 'location', 'customer')

    def get_queryset(self):
        qs = super().get_queryset()
        customer = self.request.query_params.get('customer')
        location = self.request.query_params.get('location')
        batch = self.request.query_params.get('batch')
        if customer:
            qs = qs.filter(customer_id=customer)
        if location:
            qs = qs.filter(location_id=location)
        if batch:
            qs = qs.filter(tag__batch__batch_no=batch)
        return qs
