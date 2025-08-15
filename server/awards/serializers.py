from rest_framework import serializers
from .models import Award

class AwardListSerializer(serializers.ModelSerializer):
    projects_total = serializers.SerializerMethodField()

    class Meta:
        model = Award
        fields = ("id", "title", "organization", "date", "projects_total")

    def get_projects_total(self, obj):
        return getattr(obj, "projects__count", None) or obj.projects.count()

class AwardDetailSerializer(serializers.ModelSerializer):
    projects = serializers.SerializerMethodField()

    class Meta:
        model = Award
        fields = ("id", "title", "organization", "nomination", "place", "score", "date", "description", "projects")

    def get_projects(self, obj):
        return [{"id": p.id, "slug": p.slug, "title": p.title} for p in obj.projects.all()]