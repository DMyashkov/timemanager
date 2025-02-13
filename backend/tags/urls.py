from django.conf.urls import url
from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import SyncTagsView

urlpatterns = [
    path("tags/sync/", SyncTagsView.as_view(), name="sync-tags"),
]
