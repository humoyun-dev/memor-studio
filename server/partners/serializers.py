from rest_framework import serializers
from .models import Partner

class PartnerListSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Partner
        fields = ("id", "slug", "name", "type", "url", "logo_url")

    def get_logo_url(self, obj):
        req = self.context.get("request")
        if obj.logo:
            url = obj.logo.url
            return req.build_absolute_uri(url) if req else url
        return None

class PartnerDetailSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Partner
        fields = ("id", "slug", "name", "type", "url", "logo_url", "description")

    def get_logo_url(self, obj):
        req = self.context.get("request")
        if obj.logo:
            url = obj.logo.url
            return req.build_absolute_uri(url) if req else url
        return None