from django.shortcuts import render
import json

from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Session
from .serializers import SessionSyncSerializer, SessionSyncWithDeletedSerializer

class ListSessionsView(ListAPIView):
    queryset = Session.objects.all()
    serializer_class = SessionSyncSerializer
    permission_classes = [IsAuthenticated]

class SyncSessionsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        for session_data in request.data:
            session_data.pop("synced", None)

        print("BEFORE SERIALIZER:")
        print(json.dumps(request.data, indent=4, sort_keys=True))

        # Validate the incoming payload
        payload_serializer = SessionSyncWithDeletedSerializer(
            data=request.data, many=True)
        if not payload_serializer.is_valid():
            return Response(payload_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        payload = list(payload_serializer.validated_data) if isinstance(
            payload_serializer.validated_data, list) else []

        print("AFTER SERIALIZER:")
        print(json.dumps(payload_serializer.validated_data, indent=4, sort_keys=True))

        for session_data in payload:
            session_id = session_data.get("id")
            is_deleted = session_data.pop("deleted", None)

            if session_id is None:
                return Response({"error": "ID field is required"}, status=status.HTTP_400_BAD_REQUEST)

            if is_deleted:
                Session.objects.filter(id=session_id).delete()
                continue

            try:
                session_instance = Session.objects.get(id=session_id)
                for key, value in session_data.items():
                    setattr(session_instance, key, value)
                session_instance.save()
            except Session.DoesNotExist:
                Session.objects.create(**session_data)

        return Response({"message": "Sessions synced successfully"}, status=status.HTTP_200_OK)

class DeleteAllSessionsView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        """
        Deletes all sessions for the authenticated user.
        """
        deleted_count, _ = Session.objects.all().delete()
        return Response(
            {"message": f"Deleted {deleted_count} sessions successfully."},
            status=status.HTTP_200_OK
        )
