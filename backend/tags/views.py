from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Tag
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
