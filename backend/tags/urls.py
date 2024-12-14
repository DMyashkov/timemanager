from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import GetDataIndexView, RebuildDataIndexView, TagViewSet

router = DefaultRouter()
router.register(r'tags', TagViewSet)

urlpatterns = [
    path('tags/data_index/', GetDataIndexView.as_view(),
         name='data-index'),  # GET endpoint
    path('tags/rebuild_index/', RebuildDataIndexView.as_view(),
         name='rebuild-index'),  # POST endpoint
] + router.urls
