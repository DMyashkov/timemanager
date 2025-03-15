from rest_framework import serializers

from .models import Tag


class TagSyncSerializer(serializers.ModelSerializer):
    deleted = serializers.BooleanField()
    id = serializers.IntegerField()

    class Meta:
        model = Tag
        fields = [
            'id',
            'title',
            'module_type',
            'color_preset',
            'productive',
            'lap_name',
            'parent',
            'children',
            'deleted',
        ]

    def to_internal_value(self, data):
        """
        Converts incoming camelCase JSON keys to snake_case for Django model.
        """
        converted_data = {
            "id": data.get("id"),
            "title": data.get("title"),
            # Convert camelCase to snake_case
            "module_type": data.get("moduleType"),
            "color_preset": data.get("colorPreset"),
            "productive": data.get("productive"),
            "lap_name": data.get("lapName"),
            "parent": data.get("parent"),
            "children": data.get("children"),
            "deleted": data.get("deleted"),
        }
        return super().to_internal_value(converted_data)

    def to_representation(self, instance):
        """
        Converts Django model fields (snake_case) to camelCase for JSON response.
        """
        representation = super().to_representation(instance)
        return {
            "id": representation["id"],
            "title": representation["title"],
            # Convert snake_case to camelCase
            "moduleType": representation["module_type"],
            "colorPreset": representation["color_preset"],
            "productive": representation["productive"],
            "lapName": representation["lap_name"],
            "parent": representation["parent"],
            "children": representation["children"],
            "deleted": representation["deleted"],
        }
