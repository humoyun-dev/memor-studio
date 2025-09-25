from rest_framework import serializers
from django.utils import translation
from .models import News, Category


class CategorySerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name"]

    def get_name(self, obj):
        lang = translation.get_language() or "uz"
        return getattr(obj, f"name_{lang}", obj.name)


class NewsListSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    categories = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = News
        fields = ["id", "title", "image", "is_published", "created_at", "categories"]

    def get_title(self, obj):
        lang = translation.get_language() or "uz"
        return getattr(obj, f"title_{lang}", obj.title)


class NewsDetailSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()
    categories = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = News
        fields = [
            "id",
            "title",
            "content",
            "image",
            "is_published",
            "created_at",
            "updated_at",
            "categories",
        ]

    def get_title(self, obj):
        lang = translation.get_language() or "uz"
        return getattr(obj, f"title_{lang}", obj.title)

    def get_content(self, obj):
        lang = translation.get_language() or "uz"
        return getattr(obj, f"content_{lang}", obj.content)
