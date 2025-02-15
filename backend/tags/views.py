from django.utils.functional import empty
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Tag
from .serializers import TagSyncSerializer


class SyncTagsView(APIView):
    """
    Syncs multiple tags from the frontend to the backend.
    """

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        for tag_data in request.data:
            tag_data.pop("synced", None)

        # Validate the incoming payload
        payload_serializer = TagSyncSerializer(data=request.data, many=True)
        if not payload_serializer.is_valid():
            return Response(payload_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        payload = list(payload_serializer.validated_data) if isinstance(
            payload_serializer.validated_data, list) else []

        print(type(payload_serializer.validated_data),
              payload_serializer.validated_data)

        synced_ids = []
        for tag_data in payload:
            tag_id = tag_data.get("id")
            is_deleted = tag_data.get("deleted")
            tag_data.pop("deleted", None)

            if is_deleted:
                Tag.objects.filter(id=tag_id).delete()
                continue

            if tag_id < 0 or (tag_id == 0 and not Tag.objects.filter(id=0).exists()):
                new_tag = Tag.objects.create(**tag_data)
                synced_ids.append({"temp_id": tag_id, "new_id": new_tag.id})
            else:
                try:
                    tag_instance = Tag.objects.get(id=tag_id)
                    for key, value in tag_data.items():
                        setattr(tag_instance, key, value)
                    tag_instance.save()
                    synced_ids.append({"existing_id": tag_id})
                except Tag.DoesNotExist:
                    new_tag = Tag.objects.create(**tag_data)
                    synced_ids.append(
                        {"temp_id": tag_id, "new_id": new_tag.id})

        # Return synced tag IDs
        return Response({"synced": synced_ids}, status=status.HTTP_200_OK)
