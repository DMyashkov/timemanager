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
            'colorPreset',  
            'productive',
            'lapName', 
            'parent',
            'children',
            'createdAt',
            'updatedAt', 
        ]
        extra_kwargs = {
            'createdAt': {'required': False},
            'updatedAt': {'required': False},
        }

    colorPreset = serializers.CharField(source='color_preset')
    lapName = serializers.CharField(source='lap_name')
    createdAt = serializers.DateTimeField(source='created_at', required=False)
    updatedAt = serializers.DateTimeField(source='updated_at', required=False)

    def validate(self, attrs):
        # Ensure updatedAt is later than or equal to createdAt
        created_at = attrs.get('created_at', None)
        updated_at = attrs.get('updated_at', created_at)

        if created_at and updated_at and updated_at < created_at:
            raise serializers.ValidationError(
                "updatedAt cannot be earlier than createdAt.")
        return attrs
