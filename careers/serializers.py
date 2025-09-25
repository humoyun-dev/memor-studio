from rest_framework import serializers
from django.utils import translation
from .models import Job, JobApplication

# Serializers
class JobSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    department = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    requirements_list = serializers.ReadOnlyField()

    class Meta:
        model = Job
        fields = [
            'id', 'title', 'department', 'location', 'employment_type',
            'description', 'requirements_list', 'is_remote', 'posted_date'
        ]

    def get_language(self):
        """Get language from request headers or fallback to Django's current language"""
        request = self.context.get('request')
        if request:
            # Check for custom header first (for Next.js integration)
            lang = request.headers.get('NEXT_LOCALE')
            if lang:
                return lang
        # Fallback to Django's current language
        return translation.get_language() or 'uz'

    def get_translated_field(self, obj, field_name):
        """Get field value in the requested language"""
        lang = self.get_language()
        return getattr(obj, f"{field_name}_{lang}", getattr(obj, field_name, ''))

    def get_title(self, obj):
        return self.get_translated_field(obj, 'title')

    def get_department(self, obj):
        return self.get_translated_field(obj, 'department')

    def get_location(self, obj):
        return self.get_translated_field(obj, 'location')

    def get_description(self, obj):
        return self.get_translated_field(obj, 'description')


class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'name', 'email', 'phone', 'position',
            'experience', 'cover_letter', 'resume', 'applied_date'
        ]
        read_only_fields = ['applied_date']