from django.contrib.auth.models import User
from django.db.models.signals import (post_delete, post_save, pre_delete,
                                      pre_save)
from django.dispatch import receiver

from .models import Tag, TagIndex


def get_data_index():
    """Helper to get the data index from the database."""
    tag_index, created = TagIndex.objects.get_or_create(id=1)
    return tag_index


@receiver(post_save, sender=User)
def create_root_activity_for_user(sender, instance, created, **kwargs):
    """Ensure each new user has a root activity."""
    if created:  # Only create for new users
        if not Tag.objects.filter(parent=None, title="Root Activity", type=Tag.TagType.ACTIVITY).exists():
            Tag.objects.create(
                title="Root Activity",
                description="This is the root activity for the user.",
                type=Tag.TagType.ACTIVITY,
                color_preset="green",
                productive=True,
                lap_name="Root Lap",
            )


@receiver(post_save, sender=Tag)
def update_tag_index_on_save(sender, instance, created, **kwargs):
    """Update the data index when a Tag is created or updated."""
    tag_index = get_data_index()
    data_index = tag_index.data_index

    # Handle new tag or update existing tag
    parent_path = []
    if instance.parent_id:
        parent_entry = data_index.get(instance.parent_id)
        parent_path = parent_entry["path"] + \
            [parent_entry["item"]["title"]] if parent_entry else []

    data_index[instance.id] = {
        "item": {
            "id": instance.id,
            "title": instance.title,
            "type": instance.type,
            "lapName": instance.lap_name,
            "productive": instance.productive,
            "colorPreset": instance.color_preset,
        },
        "path": parent_path,  # Ancestors only
        "children": [child.id for child in instance.children.all()],
    }

    tag_index.data_index = data_index
    tag_index.save()


@receiver(pre_delete, sender=Tag)
def update_tag_index_on_delete(sender, instance, **kwargs):
    """Update the data index when a Tag is deleted."""
    tag_index = get_data_index()
    data_index = tag_index.data_index

    def recursively_delete_children(tag_id):
        """Recursively delete all children from data_index."""
        if tag_id in data_index:
            child_ids = data_index[tag_id]['children']
            for child_id in child_ids:
                recursively_delete_children(child_id)
            del data_index[tag_id]

    # Remove the tag from its parent's children list
    if instance.parent_id:
        parent_entry = data_index.get(instance.parent_id)
        if parent_entry:
            parent_entry['children'] = [
                child for child in parent_entry['children'] if child != instance.id]

    # Recursively delete the tag and all of its children
    recursively_delete_children(instance.id)

    tag_index.data_index = data_index
    tag_index.save()
