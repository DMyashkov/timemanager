# serializers.py
from rest_framework import serializers

from .models import Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = [
            'id',
            'title',
            'type',
            'color_preset',
            'productive',
            'lap_name',
            'parent',
            'path',
            'children_ids',
        ]

        extra_kwargs = {
            'color_preset': {'source': 'colorPreset'},
            'lap_name': {'source': 'lapName'},
            'children_ids': {'source': 'children'},
        }


class TagSyncSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False, allow_null=True)
    title = serializers.CharField(max_length=255)
    deleted = serializers.BooleanField(default=False)
    # Add other fields as required

