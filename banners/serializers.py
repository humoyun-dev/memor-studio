from rest_framework import serializers
from django.utils import translation
from .models import Carousel, BannersVideo


class CarouselSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    body = serializers.SerializerMethodField()

    class Meta:
        model = Carousel
        fields = ["id", "title", "body", "image", "video"]

    def get_title(self, obj):
        lang = translation.get_language() or "uz"
        return getattr(obj, f"title_{lang}", getattr(obj, "title", ""))

    def get_body(self, obj):
        lang = translation.get_language() or "uz"
        return getattr(obj, f"body_{lang}", getattr(obj, "body", ""))

class BannersVideoSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()

    class Meta:
        model = BannersVideo
        fields = ["id", "title", "video"]

    def get_title(self, obj):
        lang = translation.get_language() or "uz"
        return getattr(obj, f"title_{lang}", getattr(obj, "title", ""))