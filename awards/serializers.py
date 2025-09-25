from rest_framework import serializers
from django.utils import translation
from .models import Award, AwardsPageInfo

# Helper function to reduce code duplication
def get_translated_field(obj, field_name, default_lang="uz"):
    lang = translation.get_language() or default_lang
    return getattr(obj, f"{field_name}_{lang}", getattr(obj, field_name, ""))

class AwardSerializer(serializers.ModelSerializer):
    project = serializers.SerializerMethodField()
    award = serializers.SerializerMethodField()
    organization = serializers.SerializerMethodField()

    class Meta:
        model = Award
        fields = ['id', 'year', 'project', 'award', 'organization', 'image']

    def get_project(self, obj):
        return get_translated_field(obj, 'project')

    def get_award(self, obj):
        return get_translated_field(obj, 'award')

    def get_organization(self, obj):
        return get_translated_field(obj, 'organization')


class AwardsPageInfoSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    subtitle = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = AwardsPageInfo
        fields = ['title', 'subtitle', 'description']

    def get_title(self, obj):
        return get_translated_field(obj, 'title')

    def get_subtitle(self, obj):
        return get_translated_field(obj, 'subtitle')

    def get_description(self, obj):
        return get_translated_field(obj, 'description')


class AwardsPageDataSerializer(serializers.Serializer):
    page_info = AwardsPageInfoSerializer()
    awards = AwardSerializer(many=True)