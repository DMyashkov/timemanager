import logging

from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import DeleteAllTasksView, ListTasksView, SyncTasksView

logger = logging.getLogger(__name__)

urlpatterns = [
    path('tasks/sync/', SyncTasksView.as_view(), name='sync-tasks'),
    path('tasks/', ListTasksView.as_view(), name='sync-tasks'),
    path('tasks/delete-all/', DeleteAllTasksView.as_view(), name='delete-all-tasks'),
]
