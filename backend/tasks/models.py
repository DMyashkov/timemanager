from django.db import models
from tags.models import Tag


class Task(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    date = models.BigIntegerField(null=True, blank=True)  # Unix timestamp
    priority = models.IntegerField(null=True, blank=True)
    completed = models.BooleanField(default=False)
    tag_id = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f'{self.title} ({self.date})'

