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


# Create your models here.
