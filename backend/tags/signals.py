from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import Tag, TagIndex
from .views import generate_data_index


@receiver(post_save, sender=Tag)
@receiver(post_delete, sender=Tag)
def update_tag_index(sender, instance, **kwargs):
    """Update the data index when a Tag is created, updated, or deleted."""
    data_index = generate_data_index()
    TagIndex.objects.update_or_create(
        id=1,  # Single row to store the index
        defaults={'data_index': data_index}
    )
