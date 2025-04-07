from django.urls import path
from .views import DeleteAllSessionsView, ListSessionsView, SyncSessionsView

urlpatterns = [
    path("sessions/sync/", SyncSessionsView.as_view(), name="sync-sessions"),
    path("sessions/", ListSessionsView.as_view(), name="list-sessions"),
    path("sessions/delete-all/", DeleteAllSessionsView.as_view(), name="delete-all-sessions"),
] 