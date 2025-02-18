from django.urls import path, re_path
from rest_framework.routers import DefaultRouter

from .views import ListTagsView, SyncTagsView

urlpatterns = [
    path("tags/sync/", SyncTagsView.as_view(), name="sync-tags"),
    path("tags/", ListTagsView.as_view(), name="list-tags"),  # Add this line
]
