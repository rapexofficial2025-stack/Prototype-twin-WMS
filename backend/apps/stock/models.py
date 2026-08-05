from django.db import models

from apps.core.models import Customer, Item
from apps.warehouse.models import Location, Room

DOC_STATUS_CHOICES = [('draft', 'Draft'), ('saved', 'Saved'), ('posted', 'Posted')]


class Batch(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='batches')
    batch_no = models.CharField(max_length=64)
    production_date = models.DateField(null=True, blank=True)
    expiration_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.batch_no


class Tag(models.Model):
    """One row per physical pallet. Moving a tag to a new location, or
    changing its status, is what drives the live 3D twin — see
    apps/stock/signals.py."""
    STATUS_CHOICES = [('in_storage', 'In Storage'), ('withdrawn', 'Withdrawn'), ('transferred', 'Transferred'), ('adjusted', 'Adjusted')]

    tag_no = models.CharField(max_length=64, unique=True)
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name='tags')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='tags')
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True, related_name='tags')
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    avg_weight = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_weight = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    uom = models.CharField(max_length=20, default='box', help_text='Unit of measure, e.g. box, sack, carton.')
    qty_per_layer = models.PositiveIntegerField(null=True, blank=True, help_text='Stock layering: units per layer. Captured once by the Checker on first scan, editable afterwards.')
    last_scanned_at = models.DateTimeField(null=True, blank=True, help_text='Snapshot timestamp auto-captured at the moment a Checker/Operator confirms a scan update.')
    received_date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default='in_storage')

    def __str__(self):
        return self.tag_no


class StockLedger(models.Model):
    """Append-only. Never update or delete a row after insert — corrections
    go through a new Stock Adjustment entry, not an edit here."""
    DOC_TYPE_CHOICES = [('acceptance', 'Acceptance'), ('withdrawal', 'Withdrawal'), ('transfer', 'Transfer'), ('adjustment', 'Adjustment')]

    doc_type = models.CharField(max_length=16, choices=DOC_TYPE_CHOICES)
    document_no = models.CharField(max_length=64)
    tag = models.ForeignKey(Tag, on_delete=models.PROTECT, related_name='ledger_entries')
    location = models.ForeignKey(Location, on_delete=models.PROTECT, related_name='ledger_entries')
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name='ledger_entries')
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    weight = models.DecimalField(max_digits=12, decimal_places=2)
    running_balance = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.document_no} · {self.tag.tag_no} · {self.quantity:+}'
