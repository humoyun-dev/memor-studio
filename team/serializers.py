from rest_framework import serializers
from django.utils import translation
from .models import TeamMember, TeamPageInfo


class TeamMemberSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()

    class Meta:
        model = TeamMember
        fields = ['id', 'name', 'title', 'image']

    def get_name(self, obj):
        lang = self.context.get('request').headers.get('accept-language', 'uz')
        return getattr(obj, f'name_{lang}', obj.name)

    def get_title(self, obj):
        lang = self.context.get('request').headers.get('accept-language', 'uz')
        return getattr(obj, f'title_{lang}', obj.title)


class TeamPageInfoSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    subtitle = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = TeamPageInfo
        fields = ['title', 'subtitle', 'description']

    def get_title(self, obj):
        lang = self.context.get('request').headers.get('accept-language', 'uz')
        return getattr(obj, f'title_{lang}', obj.title)

    def get_subtitle(self, obj):
        lang = self.context.get('request').headers.get('accept-language', 'uz')
        return getattr(obj, f'subtitle_{lang}', obj.subtitle)

    def get_description(self, obj):
        lang = self.context.get('request').headers.get('accept-language', 'uz')
        return getattr(obj, f'description_{lang}', obj.description)


class TeamPageDataSerializer(serializers.Serializer):
    team_info = TeamPageInfoSerializer()
    team = TeamMemberSerializer(many=True)
