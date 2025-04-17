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
        return Task.objects.all()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sync_tasks(request):
    tasks_data = request.data
    
    for task_data in tasks_data:
        task_id = task_data.get('id')
        if task_id:
            # Update existing task
            try:
                task = Task.objects.get(id=task_id)
                serializer = TaskSerializer(task, data=task_data, partial=True)
                if serializer.is_valid():
                    serializer.save()
            except Task.DoesNotExist:
                # Create new task if it doesn't exist
                serializer = TaskSerializer(data=task_data)
                if serializer.is_valid():
                    serializer.save()
        else:
            # Create new task
            serializer = TaskSerializer(data=task_data)
            if serializer.is_valid():
                serializer.save()
    
    # Return all tasks
    tasks = Task.objects.all()
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