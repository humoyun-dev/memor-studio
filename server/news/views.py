from rest_framework import viewsets
from django.db.models import Q
from datetime import date

from .models import News
from .serializers import NewsListSerializer, NewsDetailSerializer
from core.mixins import I18NMixin, TranslatedSlugLookupMixin, DeferTranslatedBodiesMixin

class NewsViewSet(TranslatedSlugLookupMixin, DeferTranslatedBodiesMixin, I18NMixin, viewsets.ReadOnlyModelViewSet):
    queryset = News.objects.all()
    lookup_field = "slug"

    def get_serializer_class(self):
        return NewsDetailSerializer if self.action == "retrieve" else NewsListSerializer

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx

    @staticmethod
    def _parse_iso(d: str):
        try:
            return date.fromisoformat(d)
        except Exception:
            return None

    def get_queryset(self):
        qs = super().get_queryset()
        p = self.request.query_params

        q_text = p.get("q")
        if q_text:
            qs = qs.filter(Q(title__icontains=q_text) | Q(body__icontains=q_text))

        tag = p.get("tag")
        if tag:
            qs = qs.filter(tags__contains=[tag])

        d_from = self._parse_iso(p.get("from")) if p.get("from") else None
        d_to   = self._parse_iso(p.get("to")) if p.get("to") else None
        if d_from:
            qs = qs.filter(date__gte=d_from)
        if d_to:
            qs = qs.filter(date__lte=d_to)

        ordering = p.get("ordering")
        qs = qs.order_by(ordering, "-id") if ordering in ("date", "-date") else qs.order_by("-date", "-id")
        return qs