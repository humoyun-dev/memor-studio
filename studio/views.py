from rest_framework import generics, status
from rest_framework.response import Response
from .models import StudioPage
from .serializers import StudioPageSerializer


class StudioPageListView(generics.ListAPIView):
    """List all studio pages"""
    queryset = StudioPage.objects.all()
    serializer_class = StudioPageSerializer


class StudioPageDetailView(generics.RetrieveAPIView):
    """Retrieve a single studio page with its videos and sections"""
    queryset = StudioPage.objects.all()
    serializer_class = StudioPageSerializer

class StudioPageLatestView(generics.RetrieveAPIView):
    """Always return the latest Studio Page"""
    serializer_class = StudioPageSerializer

    def get(self, request, *args, **kwargs):
        latest_page = StudioPage.objects.last()
        if not latest_page:
            return Response({'detail': 'No studio pages found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(latest_page)
        return Response(serializer.data)