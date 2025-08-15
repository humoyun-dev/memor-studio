from rest_framework import serializers
from .models import TeamMember

class TeamListSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = TeamMember
        fields = ("id", "slug", "name", "role", "photo_url")

    def get_photo_url(self, obj):
        req = self.context.get("request")
        if obj.photo:
            url = obj.photo.url
            return req.build_absolute_uri(url) if req else url
        return None

class TeamDetailSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = TeamMember
        fields = ("id", "slug", "name", "role", "photo_url", "bio", "socials")

    def get_photo_url(self, obj):
        req = self.context.get("request")
        if obj.photo:
            url = obj.photo.url
            return req.build_absolute_uri(url) if req else url
        return None