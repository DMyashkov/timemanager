from django.db.models.query import QuerySet
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Tag
from .serializers import TagSerializer


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
        payload = request.data
        synced_ids = []
        for tag_data in payload:
            # If ID is null or 0, create new Tag
            tag_id = tag_data.get("id", None)

            if tag_id is None or tag_id == 0:
                serializer = TagSerializer(data=tag_data)
                serializer.is_valid(raise_exception=True)
                new_tag = serializer.save()
                synced_ids.append({"temp_id": tag_id, "new_id": new_tag.id})
            else:
                # Existing Tag -> update it
                try:
                    tag_instance = Tag.objects.get(id=tag_id)
                    serializer = TagSerializer(
                        tag_instance, data=tag_data, partial=True)
                    serializer.is_valid(raise_exception=True)
                    serializer.save()
                    # If the item is marked deleted, handle that logic or do a soft-delete
                    synced_ids.append({"existing_id": tag_id})
                except Tag.DoesNotExist:
                    # Possibly create a new one if your logic demands
                    serializer = TagSerializer(data=tag_data)
                    serializer.is_valid(raise_exception=True)
                    new_tag = serializer.save()
                    synced_ids.append(
                        {"temp_id": tag_id, "new_id": new_tag.id})

        return Response({"synced": synced_ids})
