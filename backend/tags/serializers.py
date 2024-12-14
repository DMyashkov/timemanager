from rest_framework import serializers

from .models import Tag


class RecursiveTagSerializer(serializers.Serializer):
    """Recursive serializer to handle infinite nesting of tags."""

    def to_representation(self, value):
        try:
            serializer = self.parent.parent.__class__(
                value, context=self.context)
            return serializer.data
        except Exception as e:
            print(f"Error in RecursiveTagSerializer: {e}")
            return {}


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
            'colorPreset',  # Use source for database field color_preset
            'productive',
            'lapName',  # Use source for database field lap_name
            'parent',
            'children',
            'createdAt',  # Use source for database field created_at
            'updatedAt'  # Use source for database field updated_at
        ]

    colorPreset = serializers.CharField(source='color_preset')
    lapName = serializers.CharField(source='lap_name')
    createdAt = serializers.DateTimeField(source='created_at')
    updatedAt = serializers.DateTimeField(source='updated_at')
