from django.db.models import Q
from rest_framework import viewsets
from core.mixins import I18NMixin, DeferTranslatedBodiesMixin
from .models import Vacancy
from .serializers import VacancyListSerializer, VacancyDetailSerializer

class VacancyViewSet(DeferTranslatedBodiesMixin, I18NMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Vacancy.objects.all()
    lookup_field = "slug"
    body_field_name = "description"

    def get_serializer_class(self):
        return VacancyDetailSerializer if self.action == "retrieve" else VacancyListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        p = self.request.query_params

        if p.get("active") in {"1","true","True"}:
            qs = qs.filter(is_active=True)

        if dept := p.get("department"):
            qs = qs.filter(department__icontains=dept)

        if loc := p.get("location"):
            qs = qs.filter(location__icontains=loc)

        if et := p.get("type"):
            qs = qs.filter(employment_type=et)

        if sr := p.get("seniority"):
            qs = qs.filter(seniority=sr)

        if tg := p.get("tag"):
            qs = qs.filter(tags__contains=[tg])

        if q := p.get("q"):
            qs = qs.filter(Q(title__icontains=q) | Q(description__icontains=q))

        ordering = p.get("ordering")
        if ordering in ("published_at", "-published_at"):
            qs = qs.order_by(ordering, "-id")
        else:
            qs = qs.order_by("-published_at", "-id")
        return qs