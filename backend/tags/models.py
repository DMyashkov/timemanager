from django.core.exceptions import ValidationError
from django.db import models


class TagIndex(models.Model):
    """Model to store the entire DataIndex."""
    data_index = models.JSONField(default=dict)  # Store the entire DataIndex
    updated_at = models.DateTimeField(auto_now=True)  # Track updates

    def __str__(self):
        return f"TagIndex (Last updated: {self.updated_at})"


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

    created_at = models.DateTimeField(
        auto_now_add=False, default=None, null=True)
    updated_at = models.DateTimeField(
        auto_now_add=False, default=None, null=True)

    def __str__(self):
        return f'{self.title} ({self.type})'

    def get_full_path(self):
        """Recursively fetch the full path for the tag"""
        path = [self.title]
        parent = self.parent
        while parent:
            path.append(parent.title)
            parent = parent.parent
        return " / ".join(reversed(path))

    def save(self, *args, **kwargs):
        # Ensure there's always one root activity
        if not self.parent and self.type == self.TagType.ACTIVITY:
            existing_root = Tag.objects.filter(
                parent=None, type=self.TagType.ACTIVITY
            ).exclude(id=self.id).exists()
            if existing_root:
                raise ValidationError("There can only be one root activity.")
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Prevent deletion of the root activity
        if not self.parent and self.type == self.TagType.ACTIVITY:
            raise ValidationError("The root activity cannot be deleted.")
        super().delete(*args, **kwargs)


# Create your models here.
