from django.contrib import admin

from apps.stock.models import Batch, StockLedger, Tag


@admin.register(Batch)
class BatchAdmin(admin.ModelAdmin):
    list_display = ['batch_no', 'item', 'production_date', 'expiration_date']


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['tag_no', 'batch', 'customer', 'location', 'quantity', 'uom', 'qty_per_layer', 'status']
    list_filter = ['status', 'location__room']


@admin.register(StockLedger)
class StockLedgerAdmin(admin.ModelAdmin):
    list_display = ['document_no', 'doc_type', 'tag', 'location', 'quantity', 'running_balance', 'created_at']
    list_filter = ['doc_type']
    readonly_fields = [f.name for f in StockLedger._meta.fields]

    def has_change_permission(self, request, obj=None):
        return False  # append-only ledger — no edits, even from admin

    def has_delete_permission(self, request, obj=None):
        return False
