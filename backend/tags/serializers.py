from rest_framework import serializers

from .models import Tag


class RecursiveTagSerializer(serializers.Serializer):
    """Recursive serializer to handle infinite nesting of tags."""

    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data


class TagSerializer(serializers.ModelSerializer):
    # Recursively serialize children
    children = RecursiveTagSerializer(many=True, read_only=True)

    class Meta:
        model = Tag
        fields = [
            'id',
            'title',
            'description',
            'type',
            'color_preset',
            'productive',
            'lap_name',
            'parent',
            'children',
            'created_at',
            'updated_at'
        ]
