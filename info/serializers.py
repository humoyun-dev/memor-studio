from rest_framework import serializers
from django.utils import translation
from .models import CompanyInfo, Statistic, Leader


# Helper function for consistent language handling
def get_language_from_request(request, default='uz'):
    """Extract language from request with multiple fallback options"""
    if not request:
        return default

    # Check custom header (Next.js integration)
    lang = request.headers.get('accept-language')
    if lang:
        return lang

    # Fallback to Django's current language
    return translation.get_language() or default


def get_translated_field(obj, field_name, request=None, default_lang='uz'):
    """Get translated field value with proper fallback"""
    lang = get_language_from_request(request, default_lang)
    field_value = getattr(obj, f"{field_name}_{lang}", None)

    # Fallback to original field if translation doesn't exist
    if field_value is None:
        field_value = getattr(obj, field_name, '')

    return field_value


# Serializers
class StatisticSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = Statistic
        fields = ['title', 'value', 'description']

    def get_title(self, obj):
        return get_translated_field(obj, 'title', self.context.get('request'))

    def get_description(self, obj):
        return get_translated_field(obj, 'description', self.context.get('request'))


class LeaderSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    bio = serializers.SerializerMethodField()

    class Meta:
        model = Leader
        fields = ['id', 'name', 'title', 'bio', 'image']

    def get_name(self, obj):
        return get_translated_field(obj, 'name', self.context.get('request'))

    def get_title(self, obj):
        return get_translated_field(obj, 'title', self.context.get('request'))

    def get_bio(self, obj):
        return get_translated_field(obj, 'bio', self.context.get('request'))


class CompanyInfoSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    subtitle = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    statistics = StatisticSerializer(many=True, read_only=True)

    class Meta:
        model = CompanyInfo
        fields = ['title', 'subtitle', 'description', 'statistics']

    def get_title(self, obj):
        return get_translated_field(obj, 'title', self.context.get('request'))

    def get_subtitle(self, obj):
        return get_translated_field(obj, 'subtitle', self.context.get('request'))

    def get_description(self, obj):
        return get_translated_field(obj, 'description', self.context.get('request'))


class AboutPageSerializer(serializers.Serializer):
    company_info = CompanyInfoSerializer()
    leaders = LeaderSerializer(many=True)