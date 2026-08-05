from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.core.firebase import push_location_status
from apps.warehouse.models import Location


@receiver(post_save, sender=Location)
def mirror_location_to_firebase(sender, instance: Location, **kwargs):
    """Whenever a location's status changes (receiving, withdrawal, transfer,
    or adjustment all funnel through Location.status), push the new snapshot
    to Firebase so the 3D twin updates live without polling."""
    tag = instance.tags.filter(status='in_storage').select_related('batch__item', 'customer').first()
    payload = {
        'status': instance.status,
        'column': instance.column,
        'side': instance.side,
        'level': instance.level,
        'depth': instance.depth,
        'tagNo': tag.tag_no if tag else None,
        'itemName': tag.batch.item.item_name if tag else None,
        'customerName': tag.customer.customer_name if tag else None,
        'quantity': float(tag.quantity) if tag else None,
        'batchNo': tag.batch.batch_no if tag else None,
        'expirationDate': tag.batch.expiration_date.isoformat() if tag and tag.batch.expiration_date else None,
    }
    push_location_status(instance.room_id, instance.id, payload)
