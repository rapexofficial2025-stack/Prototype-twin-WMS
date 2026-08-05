from django.urls import path

from apps.stock.views import StockLedgerListView

urlpatterns = [
    path('ledger/', StockLedgerListView.as_view(), name='stock-ledger'),
]
