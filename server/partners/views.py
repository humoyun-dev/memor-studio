from django.db.models import Q
from rest_framework import viewsets
from core.mixins import I18NMixin
from .models import Partner
from .serializers import PartnerListSerializer, PartnerDetailSerializer

class PartnerViewSet(I18NMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Partner.objects.all()
    lookup_field = "slug"

    def get_serializer_class(self):
        return PartnerDetailSerializer if self.action == "retrieve" else PartnerListSerializer

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx

    def get_queryset(self):
        qs = super().get_queryset()
        p = self.request.query_params

        q_text = p.get("q")
        if q_text:
            qs = qs.filter(Q(name__icontains=q_text) | Q(description__icontains=q_text))

        typ = p.get("type")
        if typ:
            qs = qs.filter(type__icontains=typ)

        ordering = p.get("ordering")
        qs = qs.order_by(ordering) if ordering in ("name", "-name") else qs.order_by("name")
        return qs