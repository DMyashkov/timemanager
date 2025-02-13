from django.db.models.query import QuerySet
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Tag
from .serializers import TagSerializer, TagSyncSerializer


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self) -> QuerySet[Tag]:  # type: ignore
        """
        Return all Tags, excluding soft-deleted items.
       """
        return Tag.objects.filter(deleted=False)

    def destroy(self, request, *args, **kwargs):
        """
        Perform a soft delete by marking the instance as deleted.
        """
        instance = self.get_object()
        instance.deleted = True
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SyncTagsView(APIView):
    """
    Expects a payload like:
    [
      {
        "id": 123,   // or null for new
        "title": "...",
        "deleted": 0 or 1,
        ...
      },
      ...
    ]
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        payload_serializer = TagSyncSerializer(data=request.data, many=True)
        if not payload_serializer.is_valid():
            return Response(payload_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        payload = list(payload_serializer.validated_data) if isinstance(
            payload_serializer.validated_data, list) else []

        synced_ids = []
        for tag_data in payload:
            tag_id = tag_data.get("id", None)

            if tag_id is None or tag_id < 0:
                serializer = TagSerializer(data=tag_data)
                serializer.is_valid(raise_exception=True)
                new_tag = serializer.save()
                synced_ids.append({"temp_id": tag_id, "new_id": new_tag.id})
            else:
                try:
                    tag_instance = Tag.objects.get(id=tag_id)
                    serializer = TagSerializer(
                        tag_instance, data=tag_data, partial=True)
                    serializer.is_valid(raise_exception=True)
                    serializer.save()
                    synced_ids.append({"existing_id": tag_id})
                except Tag.DoesNotExist:
                    serializer = TagSerializer(data=tag_data)
                    serializer.is_valid(raise_exception=True)
                    new_tag = serializer.save()
                    synced_ids.append(
                        {"temp_id": tag_id, "new_id": new_tag.id})
        return Response({"synced": synced_ids})
