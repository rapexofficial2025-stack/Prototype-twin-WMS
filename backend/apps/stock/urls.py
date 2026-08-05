from django.urls import path

from apps.stock.views import StockLedgerListView, TagScanView

urlpatterns = [
    path('ledger/', StockLedgerListView.as_view(), name='stock-ledger'),
    path('tags/<str:tag_no>/scan/', TagScanView.as_view(), name='tag-scan'),
]
