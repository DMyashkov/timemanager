# signals.py
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Tag


@receiver(post_save, sender=User)
def create_root_activity_for_user(sender, instance, created, **kwargs):
    """Only if you want every user to have a new Root Activity upon signup."""
    if created:
        if not Tag.objects.filter(parent=None, title="Root Activity", module_type=Tag.TagType.ACTIVITY).exists():
            Tag.objects.create(
                title="Root Activity",
                description="This is the root activity for the user.",
                module_type=Tag.TagType.ACTIVITY,
                color_preset="green",
                productive=True,
                lap_name="Root Lap",
            )
