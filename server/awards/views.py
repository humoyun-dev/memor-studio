from datetime import date
from django.db.models import Q, Count
from rest_framework import viewsets
from core.mixins import I18NMixin, DeferTranslatedBodiesMixin
from .models import Award
from .serializers import AwardListSerializer, AwardDetailSerializer

class AwardViewSet(DeferTranslatedBodiesMixin, I18NMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Award.objects.all()
    body_field_name = "description"

    def get_serializer_class(self):
        return AwardDetailSerializer if self.action == "retrieve" else AwardListSerializer

    def get_queryset(self):
        qs = super().get_queryset().annotate(Count("projects", distinct=True)).prefetch_related("projects")
        p = self.request.query_params

        q_text = p.get("q")
        if q_text:
            qs = qs.filter(
                Q(title__icontains=q_text) |
                Q(organization__icontains=q_text) |
                Q(nomination__icontains=q_text) |
                Q(description__icontains=q_text)
            )

        d_from = p.get("from")
        d_to   = p.get("to")
        if d_from:
            qs = qs.filter(date__gte=d_from)
        if d_to:
            qs = qs.filter(date__lte=d_to)

        ordering = p.get("ordering")
        qs = qs.order_by(ordering, "-id") if ordering in ("date", "-date") else qs.order_by("-date", "-id")
        return qs