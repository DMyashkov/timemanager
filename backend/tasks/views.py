import json

from django.utils.functional import empty
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Task
from .serializers import TaskSyncSerializer, TaskSyncWithDeletedSerializer


class ListTasksView(ListAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSyncSerializer
    permission_classes = [IsAuthenticated]


class SyncTasksView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        for task_data in request.data:
            task_data.pop("synced", None)

        print("TASKS BEFORE SERIALIZER:")
        print(json.dumps(request.data, indent=4, sort_keys=True))

        # Validate the incoming payload
        payload_serializer = TaskSyncWithDeletedSerializer(
            data=request.data, many=True)
        if not payload_serializer.is_valid():
            return Response(payload_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        payload = list(payload_serializer.validated_data) if isinstance(
            payload_serializer.validated_data, list) else []

        print("TASKS AFTER SERIALIZER:")
        print(json.dumps(payload, indent=4, sort_keys=True))

        for task_data in payload:
            task_id = task_data.get("id")
            is_deleted = task_data.pop("deleted", None)
            print("For task with title", task_data.get(
                "title"), " is_deleted:", is_deleted)

            if task_id is None:
                return Response({"error": "ID field is required"}, status=status.HTTP_400_BAD_REQUEST)

            if is_deleted:
                Task.objects.filter(id=task_id).delete()
                continue

            try:
                task_instance = Task.objects.get(id=task_id)
                for key, value in task_data.items():
                    setattr(task_instance, key, value)
                task_instance.save()
            except Task.DoesNotExist:
                Task.objects.create(**task_data)

        return Response({"message": "Tasks synced successfully"}, status=status.HTTP_200_OK)


class DeleteAllTasksView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        """
        Deletes all tasks for the authenticated user.
        """
        deleted_count, _ = Task.objects.all().delete()  # Delete all records

        return Response(
            {"message": f"Deleted {deleted_count} tasks successfully."},
            status=status.HTTP_200_OK
        )
