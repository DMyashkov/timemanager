from django.db.models.signals import (post_delete, post_save, pre_delete,
                                      pre_save)
from django.dispatch import receiver

from .models import Tag, TagIndex


def get_data_index():
    """Helper to get the data index from the database."""
    tag_index, created = TagIndex.objects.get_or_create(id=1)
    return tag_index


@receiver(post_save, sender=Tag)
def update_tag_index_on_save(sender, instance, created, **kwargs):
    """Update the data index when a Tag is created or updated."""
    tag_index = get_data_index()
    data_index = tag_index.data_index

    if created:  # When a new tag is created
        data_index[instance.id] = {
            'item': {
                'id': instance.id,
                'title': instance.title,
                'type': instance.type,
                'productive': instance.productive,
                'lapName': instance.lap_name,
                'colorPreset': instance.color_preset,
            },
            'children': [],
            'path': instance.get_full_path().split(" / ")
        }

        # Add the new tag to its parent's children if it has a parent
        if instance.parent_id:
            parent_entry = data_index.get(instance.parent_id)
            if parent_entry:
                parent_entry['children'].append(instance.id)

    else:  # Update an existing tag
        if instance.id in data_index:
            entry = data_index[instance.id]
            entry['item'].update({
                'title': instance.title,
                'type': instance.type,
                'productive': instance.productive,
                'lapName': instance.lap_name,
                'colorPreset': instance.color_preset,
            })

            # If the parent has changed, update the parent-child relationship
            old_parent_id = entry['path'][-2] if len(
                entry['path']) > 1 else None
            new_parent_id = instance.parent_id

            if old_parent_id != new_parent_id:
                # Remove from old parent's children
                if old_parent_id and old_parent_id in data_index:
                    data_index[old_parent_id]['children'].remove(instance.id)

                # Add to new parent's children
                if new_parent_id and new_parent_id in data_index:
                    data_index[new_parent_id]['children'].append(instance.id)

            # Update the path to reflect any parent changes
            entry['path'] = instance.get_full_path().split(" / ")

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
