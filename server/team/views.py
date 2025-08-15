from django.db.models import Q
from rest_framework import viewsets
from core.mixins import I18NMixin, DeferTranslatedBodiesMixin
from .models import TeamMember
from .serializers import TeamListSerializer, TeamDetailSerializer

class TeamViewSet(DeferTranslatedBodiesMixin, I18NMixin, viewsets.ReadOnlyModelViewSet):
    queryset = TeamMember.objects.all()
    lookup_field = "slug"
    body_field_name = "bio"

    def get_serializer_class(self):
        return TeamDetailSerializer if self.action == "retrieve" else TeamListSerializer

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx

    def get_queryset(self):
        qs = super().get_queryset()
        p = self.request.query_params

        q_text = p.get("q")
        if q_text:
            qs = qs.filter(Q(name__icontains=q_text) | Q(role__icontains=q_text) | Q(bio__icontains=q_text))

        ordering = p.get("ordering")
        qs = qs.order_by(ordering) if ordering in ("name", "-name") else qs.order_by("name")
        return qs