from rest_framework import serializers

from .models import Tag


class TagSyncSerializer(serializers.ModelSerializer):
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
        ]

    def to_internal_value(self, data):
        """
        Converts incoming camelCase JSON keys to snake_case for Django model.
        """
        converted_data = {
            "id": data.get("id"),
            "title": data.get("title"),
            "module_type": data.get("moduleType"),
            "color_preset": data.get("colorPreset"),
            "productive": data.get("productive"),
            "lap_name": data.get("lapName"),
            "parent": data.get("parent"),
            "children": data.get("children"),
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
            "moduleType": representation["module_type"],
            "colorPreset": representation["color_preset"],
            "productive": representation["productive"],
            "lapName": representation["lap_name"],
            "parent": representation["parent"],
            "children": representation["children"],
        }


class TagSyncWithDeletedSerializer(TagSyncSerializer):
    deleted = serializers.IntegerField(required=False)

    class Meta(TagSyncSerializer.Meta):
        fields = TagSyncSerializer.Meta.fields + ['deleted']

    def to_internal_value(self, data):
        """
        Ensure `deleted` is preserved if provided, otherwise set to -1.
        """
        converted_data = super().to_internal_value(data)

        # Ensure `deleted` retains its value if present, otherwise default to -1
        converted_data["deleted"] = data.get("deleted", -1)  # 🔥 FIX HERE

        return converted_data


