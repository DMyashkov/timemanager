from rest_framework import serializers
from .models import Session

class SessionSyncSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()

    class Meta:
        model = Session
        fields = [
            'id',
            'tag_id',
            'start_time',
            'end_time',
            'total_work_time',
            'total_break_time',
            'intervals',
            'laps',
        ]

    def to_internal_value(self, data):
        """
        Converts incoming camelCase JSON keys to snake_case for Django model.
        """
        converted_data = {
            "id": data.get("id"),
            "tag_id": data.get("tagId"),
            "start_time": data.get("startTime"),
            "end_time": data.get("endTime"),
            "total_work_time": data.get("totalWorkTime"),
            "total_break_time": data.get("totalBreakTime"),
            "intervals": data.get("intervals"),
            "laps": data.get("laps"),
        }
        return super().to_internal_value(converted_data)

    def to_representation(self, instance):
        """
        Converts Django model fields (snake_case) to camelCase for JSON response.
        """
        representation = super().to_representation(instance)
        return {
            "id": representation["id"],
            "tagId": representation["tag_id"],
            "startTime": representation["start_time"],
            "endTime": representation["end_time"],
            "totalWorkTime": representation["total_work_time"],
            "totalBreakTime": representation["total_break_time"],
            "intervals": representation["intervals"],
            "laps": representation["laps"],
        }

class SessionSyncWithDeletedSerializer(SessionSyncSerializer):
    deleted = serializers.IntegerField(required=False)

    class Meta(SessionSyncSerializer.Meta):
        fields = SessionSyncSerializer.Meta.fields + ['deleted']

    def to_internal_value(self, data):
        """
        Ensure `deleted` is preserved if provided, otherwise set to -1.
        """
        converted_data = super().to_internal_value(data)
        converted_data["deleted"] = data.get("deleted", -1)
        return converted_data 
