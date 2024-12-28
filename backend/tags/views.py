from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Tag, TagIndex
from .serializers import TagSerializer


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    @action(detail=True, methods=['GET'])
    def children(self, request, pk=None):
        """Get all child tags of the current tag."""
        tag = self.get_object()
        children = tag.children.all()
        serializer = TagSerializer(children, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['GET'])
    def tree(self, request):
        """Return the entire nested tree of tags."""
        tags = Tag.objects.filter(parent=None)
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        # Set defaults if createdAt or updatedAt are not provided
        created_at = serializer.validated_data.get(
            'created_at', timezone.now())
        updated_at = serializer.validated_data.get('updated_at', created_at)
        serializer.save(created_at=created_at, updated_at=updated_at)

    def perform_update(self, serializer):
        # Default updatedAt to now if not provided
        updated_at = serializer.validated_data.get(
            'updated_at', timezone.now())
        serializer.save(updated_at=updated_at)


def generate_data_index():
    """Recreate the dataIndex from the database."""
    tags = Tag.objects.prefetch_related('children').all()
    index = {}

    def recursive_index(tag, path=[]):
        index[tag.id] = {
            'item': {
                'id': tag.id,
                'title': tag.title,
                'type': tag.type,
                'productive': tag.productive,
                'lapName': tag.lap_name,
                'colorPreset': tag.color_preset,
            },
            'children': [child.id for child in tag.children.all()],
            'path': path,
        }
        for child in tag.children.all():
            recursive_index(child, path + [tag.id])

    root_tags = tags.filter(parent=None)
    for tag in root_tags:
        recursive_index(tag)

    return index


class RebuildDataIndexView(APIView):
    """View to rebuild the DataIndex and save it to the database."""
    permission_classes = [
        IsAuthenticated]  # 🔥 Restrict access to authenticated users only

    def post(self, request):  # 🔥 Ensure this method is a POST method
        data_index = generate_data_index()
        TagIndex.objects.update_or_create(
            id=1,  # Single row to store the index (singleton pattern)
            defaults={'data_index': data_index}
        )
        return Response({"message": "Data index rebuilt successfully!"}, status=status.HTTP_201_CREATED)


class GetDataIndexView(APIView):
    """View to get the existing DataIndex from the database."""
    permission_classes = [
        IsAuthenticated]  # 🔥 Restrict access to authenticated users only

    def get(self, request):  # 🔥 Ensure this method is a GET method
        try:
            tag_index = TagIndex.objects.get(id=1)
            return Response(tag_index.data_index)
        except TagIndex.DoesNotExist:
            return Response({"error": "DataIndex does not exist. Please rebuild it."})
