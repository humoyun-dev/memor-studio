from rest_framework import viewsets
from .models import Partners
from .serializers import PartnersSerializer

class PartnersViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows viewing partners only (no write operations).
    """
    queryset = Partners.objects.all().order_by("nom")
    serializer_class = PartnersSerializer
