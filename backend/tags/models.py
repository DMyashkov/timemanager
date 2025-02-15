from django.core.exceptions import ValidationError
from django.db import models


class Tag(models.Model):
    class TagType(models.TextChoices):
        ACTIVITY = 'activity', 'Activity'
        PROJECT = 'project', 'Project'

    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    module_type = models.CharField(max_length=20, choices=TagType.choices)
    color_preset = models.CharField(max_length=50)
    productive = models.BooleanField(default=True)
    lap_name = models.CharField(max_length=100)

    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )

    children = models.JSONField(default=list, blank=True, null=True)

    def __str__(self):
        return f'{self.title} ({self.module_type})'
