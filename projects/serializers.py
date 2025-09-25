from rest_framework import serializers
from django.utils import translation
from .models import Project, ProjectImage, ProjectVideo, Category


# Helper function for multilingual fields
def get_translated_field(obj, field_name):
    lang = translation.get_language() or 'en'
    return getattr(obj, f'{field_name}_{lang}', getattr(obj, field_name, ''))


# Serializers
class CategorySerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name"]

    def get_name(self, obj):
        return get_translated_field(obj, 'name')


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ["id", "image"]


class ProjectVideoSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()

    class Meta:
        model = ProjectVideo
        fields = ["id", "title", "video_url"]

    def get_title(self, obj):
        return get_translated_field(obj, 'title')


class ProjectBaseSerializer(serializers.ModelSerializer):
    """Base serializer with multilingual support"""
    title = serializers.SerializerMethodField()
    categories = CategorySerializer(many=True, read_only=True)

    def get_title(self, obj):
        return get_translated_field(obj, 'title')


class ProjectListSerializer(ProjectBaseSerializer):
    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "hero_image",
            "categories",
            "created_at",
            "updated_at",
        ]


class ProjectDetailSerializer(ProjectBaseSerializer):
    body = serializers.SerializerMethodField()
    features = serializers.SerializerMethodField()
    client = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    images = ProjectImageSerializer(many=True, read_only=True)
    videos = ProjectVideoSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "body",
            "hero_image",
            "client",
            "location",
            "type",
            "features",
            "status",
            "year",
            "categories",
            "images",
            "videos",
            "created_at",
            "updated_at",
        ]

    def get_body(self, obj):
        return get_translated_field(obj, 'body')

    def get_features(self, obj):
        return get_translated_field(obj, 'features')

    def get_client(self, obj):
        return get_translated_field(obj, 'client')

    def get_location(self, obj):
        return get_translated_field(obj, 'location')

    def get_type(self, obj):
        return get_translated_field(obj, 'type')

    def get_status(self, obj):
        return get_translated_field(obj, 'status')