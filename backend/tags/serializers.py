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
        converted_data = super().to_internal_value(data)

        converted_data["deleted"] = data.get("deleted", -1) 

        return converted_data
