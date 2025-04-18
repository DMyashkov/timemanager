from rest_framework import serializers

from .models import Task


class TaskSyncSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'date',
            'priority',
            'completed',
            'tag_id',
        ]

    def to_internal_value(self, data):
        """
        Converts incoming camelCase JSON keys to snake_case for Django model.
        """
        converted_data = {
            "id": data.get("id"),
            "title": data.get("title"),
            "description": data.get("description"),
            "date": data.get("date"),
            "priority": data.get("priority"),
            "completed": data.get("completed"),
            "tag_id": data.get("tagId"),
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
            "description": representation["description"],
            "date": representation["date"],
            "tagId": representation["tag_id"],
            "priority": representation["priority"],
            "completed": representation["completed"],
        }


class TaskSyncWithDeletedSerializer(TaskSyncSerializer):
    deleted = serializers.IntegerField(required=False)

    class Meta(TaskSyncSerializer.Meta):
        fields = TaskSyncSerializer.Meta.fields + ['deleted']

    def to_internal_value(self, data):
        """
        Ensure `deleted` is preserved if provided, otherwise set to -1.
        """
        converted_data = super().to_internal_value(data)

        converted_data["deleted"] = data.get("deleted", -1)  # 🔥 FIX HERE

        return converted_data

