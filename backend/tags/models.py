from django.core.exceptions import ValidationError
from django.db import models


class Tag(models.Model):
    class TagType(models.TextChoices):
        ACTIVITY = 'activity', 'Activity'
        PROJECT = 'project', 'Project'

    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    type = models.CharField(max_length=20, choices=TagType.choices)
    color_preset = models.CharField(max_length=50, default='green')
    productive = models.BooleanField(default=True)
    lap_name = models.CharField(max_length=100, default='Lap')

    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        related_name='children',
        blank=True,
        null=True
    )

    path = models.JSONField(default=list, blank=True, null=True)
    children = models.JSONField(default=list, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.parent and self.type == self.TagType.ACTIVITY:
            existing_root = Tag.objects.filter(
                parent=None, type=self.TagType.ACTIVITY, deleted=False
            ).exclude(id=self.id).exists()
            if existing_root:
                raise ValidationError("There can only be one root activity.")

        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.title} ({self.type})'
