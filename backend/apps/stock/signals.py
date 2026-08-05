from django.db.models.signals import post_delete, post_save, pre_save
from django.dispatch import receiver

from apps.stock.models import Tag


@receiver(pre_save, sender=Tag)
def _remember_previous_location(sender, instance: Tag, **kwargs):
    """Stash the location this tag was at before the save, so the post_save
    handler can free it if the tag just moved (transfer/withdrawal)."""
    if instance.pk:
        previous = Tag.objects.filter(pk=instance.pk).only('location_id').first()
        instance._previous_location_id = previous.location_id if previous else None
    else:
        instance._previous_location_id = None


def _recompute_location_status(location):
    if location is None:
        return
    has_active_tag = location.tags.filter(status='in_storage').exists()
    new_status = 'occupied' if has_active_tag else 'empty'
    if location.status in ('reserved', 'blocked'):
        return  # manual overrides aren't cleared by tag movement
    if location.status != new_status:
        location.status = new_status
        location.save(update_fields=['status'])  # triggers the Firebase mirror signal


@receiver(post_save, sender=Tag)
def sync_location_on_tag_save(sender, instance: Tag, **kwargs):
    previous_location_id = getattr(instance, '_previous_location_id', None)
    if previous_location_id and previous_location_id != instance.location_id:
        from apps.warehouse.models import Location
        _recompute_location_status(Location.objects.filter(pk=previous_location_id).first())
    _recompute_location_status(instance.location)


@receiver(post_delete, sender=Tag)
def sync_location_on_tag_delete(sender, instance: Tag, **kwargs):
    _recompute_location_status(instance.location)
