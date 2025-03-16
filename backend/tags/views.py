import json

from django.utils.functional import empty
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Tag
from .serializers import TagSyncSerializer, TagSyncWithDeletedSerializer


class ListTagsView(ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSyncSerializer
    permission_classes = [IsAuthenticated]


class SyncTagsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        for tag_data in request.data:
            tag_data.pop("synced", None)

        print("BEFORE SERIALIZER:")
        print(json.dumps(request.data, indent=4, sort_keys=True))

        # Validate the incoming payload
        payload_serializer = TagSyncWithDeletedSerializer(
            data=request.data, many=True)
        if not payload_serializer.is_valid():
            # print("Serializer ERRRRRROOOORS:", payload_serializer.errors)
            return Response(payload_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        payload = list(payload_serializer.validated_data) if isinstance(
            payload_serializer.validated_data, list) else []

        print("AFTER SERIALIZER:")
        print(json.dumps(payload_serializer.validated_data, indent=4, sort_keys=True))

        for tag_data in payload:
            tag_id = tag_data.get("id")
            is_deleted = tag_data.pop("deleted", None)

            # print("Tag ID:", tag_id)
            # print("Payload:", payload)

            if tag_id is None:
                return Response({"error": "ID field is required"}, status=status.HTTP_400_BAD_REQUEST)

            if is_deleted:
                Tag.objects.filter(id=tag_id).delete()
                continue

            try:
                tag_instance = Tag.objects.get(id=tag_id)
                for key, value in tag_data.items():
                    setattr(tag_instance, key, value)
                tag_instance.save()
            except Tag.DoesNotExist:
                Tag.objects.create(**tag_data)

        return Response({"message": "Tags synced successfully"}, status=status.HTTP_200_OK)
