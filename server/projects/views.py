from datetime import date
from django.db.models import Q
from rest_framework import viewsets
from core.mixins import I18NMixin, DeferTranslatedBodiesMixin
from .models import Project
from .serializers import ProjectListSerializer, ProjectDetailSerializer

class ProjectViewSet(DeferTranslatedBodiesMixin, I18NMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.all()
    lookup_field = "slug"
    body_field_name = "description"  # defer description_{lang} in list

    def get_serializer_class(self):
        return ProjectDetailSerializer if self.action == "retrieve" else ProjectListSerializer

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx

    @staticmethod
    def _parse_iso(v):
        try:
            return date.fromisoformat(v)
        except Exception:
            return None

    def get_queryset(self):
        qs = super().get_queryset().prefetch_related("partners", "gallery")
        p = self.request.query_params

        q_text = p.get("q")
        if q_text:
            qs = qs.filter(Q(title__icontains=q_text) | Q(description__icontains=q_text))

        tag = p.get("tag")
        if tag:
            qs = qs.filter(tags__contains=[tag])

        cat = p.get("category")
        if cat:
            qs = qs.filter(category__icontains=cat)

        loc = p.get("location")
        if loc:
            qs = qs.filter(location__icontains=loc)

        y_from = self._parse_iso(f"{p.get('year_from')}-01-01") if p.get("year_from") else None
        y_to   = self._parse_iso(f"{p.get('year_to')}-12-31") if p.get("year_to") else None
        if y_from:
            qs = qs.filter(year__gte=y_from.year)
        if y_to:
            qs = qs.filter(year__lte=y_to.year)

        partner_id = p.get("partner")
        if partner_id:
            qs = qs.filter(partners__id=partner_id)

        ordering = p.get("ordering")
        if ordering in ("year", "-year"):
            qs = qs.order_by(ordering, "title")
        else:
            qs = qs.order_by("-year", "title")
        return qs