from rest_framework import serializers
from .models import Project

class PartnerMiniSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()

class ProjectListSerializer(serializers.ModelSerializer):
    cover_url = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ("id", "slug", "title", "category", "location", "year", "area", "cover_url", "tags")

    def get_cover_url(self, obj):
        req = self.context.get("request")
        if obj.cover:
            url = obj.cover.url
            return req.build_absolute_uri(url) if req else url
        return None

class ProjectDetailSerializer(serializers.ModelSerializer):
    cover_url = serializers.SerializerMethodField()
    partners = serializers.SerializerMethodField()
    gallery = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            "id", "slug", "title", "category", "location", "year", "area",
            "cover_url", "tags", "description", "partners", "gallery"
        )

    def get_cover_url(self, obj):
        req = self.context.get("request")
        if obj.cover:
            url = obj.cover.url
            return req.build_absolute_uri(url) if req else url
        return None

    def get_partners(self, obj):
        return [{"id": p.id, "name": p.name} for p in getattr(obj, "partners", []).all()]

    def get_gallery(self, obj):
        out = []
        req = self.context.get("request")
        for m in getattr(obj, "gallery", []).all():
            url = None
            if m.file:
                url = m.file.url
            elif m.url:
                url = m.url
            if url and req:
                url = req.build_absolute_uri(url)
            if url:
                out.append(url)
        return out