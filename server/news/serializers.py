from rest_framework import serializers
from .models import News

class NewsListSerializer(serializers.ModelSerializer):
    cover_url = serializers.SerializerMethodField()

    class Meta:
        model = News
        fields = ("id", "slug", "title", "date", "cover_url", "tags")

    def get_cover_url(self, obj):
        req = self.context.get("request")
        if obj.cover:
            url = obj.cover.url
            return req.build_absolute_uri(url) if req else url
        return None


class NewsDetailSerializer(serializers.ModelSerializer):
    cover_url = serializers.SerializerMethodField()

    class Meta:
        model = News
        fields = ("id", "slug", "title", "date", "cover_url", "tags", "body")

    def get_cover_url(self, obj):
        req = self.context.get("request")
        if obj.cover:
            url = obj.cover.url
            return req.build_absolute_uri(url) if req else url
        return None