from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    tagId = serializers.IntegerField(source='activity_id', required=False, allow_null=True)

    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'date',
            'activity',
            'project',
            'priority',
            'completed',
            'deleted',
            'synced',
            'created_at',
            'updated_at',
            'tagId',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def to_internal_value(self, data):
        """
        Converts incoming camelCase JSON keys to snake_case for Django model.
        """
        converted_data = {
            "id": data.get("id"),
            "title": data.get("title"),
            "description": data.get("description"),
            "date": data.get("date"),
            "activity_id": data.get("tagId"),
            "priority": data.get("priority"),
            "completed": data.get("completed"),
            "deleted": data.get("deleted", False),
            "synced": data.get("synced", True),
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
            "tagId": representation["tagId"],
            "priority": representation["priority"],
            "completed": representation["completed"],
            "deleted": representation["deleted"],
            "synced": representation["synced"],
        } 