from rest_framework import serializers

from .models import Tag


class TagSyncSerializer(serializers.ModelSerializer):
    deleted = serializers.BooleanField()

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
            'children',
            'deleted',
        ]
