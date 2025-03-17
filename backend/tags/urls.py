from django.urls import path, re_path
from rest_framework.routers import DefaultRouter

from .views import DeleteAllTagsView, ListTagsView, SyncTagsView

urlpatterns = [
    path("tags/sync/", SyncTagsView.as_view(), name="sync-tags"),
    path("tags/", ListTagsView.as_view(), name="list-tags"),  # Add this line
    path("tags/delete-all/", DeleteAllTagsView.as_view(),
         name="delete-all-tags"),  # New DELETE endpoint
]
