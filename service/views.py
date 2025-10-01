from rest_framework import viewsets, permissions
from .models import Service
from .serializers import ServiceSerializer


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):  # ✅ faqat GET ruxsat
    queryset = Service.objects.filter(is_active=True).order_by("-created_at")
    serializer_class = ServiceSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"  # detail uchun slug ishlatamiz
