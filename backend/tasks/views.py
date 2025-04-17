from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(deleted=False)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sync_tasks(request):
    tasks_data = request.data
    
    for task_data in request.data:
        task_id = task_data.get('id')
        is_deleted = task_data.get('deleted', False)

        if is_deleted:
            if task_id != 0:  # Only delete if it's an existing task
                Task.objects.filter(id=task_id).delete()
            continue

        try:
            if task_id == 0:  # New task
                # Create new task without specifying ID
                serializer = TaskSerializer(data=task_data)
                if serializer.is_valid():
                    new_task = serializer.save()
                    task_data["id"] = new_task.id
            else:  # Update existing task
                task_instance = Task.objects.get(id=task_id)
                serializer = TaskSerializer(task_instance, data=task_data, partial=True)
                if serializer.is_valid():
                    serializer.save()
        except Task.DoesNotExist:
            if task_id != 0:  # Only try to create if it's a new task
                serializer = TaskSerializer(data=task_data)
                if serializer.is_valid():
                    new_task = serializer.save()
                    task_data["id"] = new_task.id
    
    # Return all non-deleted tasks
    tasks = Task.objects.filter(deleted=False)
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)


class DeleteAllTasksView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        """
        Deletes all tasks.
        """
        deleted_count, _ = Task.objects.all().delete()
        return Response(
            {"message": f"Deleted {deleted_count} tasks successfully."},
            status=status.HTTP_200_OK
        ) 