import logging

from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import DeleteAllTasksView, TaskViewSet, sync_tasks

logger = logging.getLogger(__name__)

urlpatterns = [
    path('tasks/',
         TaskViewSet.as_view({'get': 'list', 'post': 'create'}), name='list-tasks'),
    path('tasks/sync/', sync_tasks, name='sync-tasks'),
    path('tasks/delete-all/', DeleteAllTasksView.as_view(), name='delete-all-tasks'),
]
