from rest_framework import serializers
from .models import StudioPage, Video, Section


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'title', 'youtube_video']


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ['id', 'title', 'body', 'image']


class StudioPageSerializer(serializers.ModelSerializer):
    videos = VideoSerializer(many=True, read_only=True)
    sections = SectionSerializer(many=True, read_only=True)

    class Meta:
        model = StudioPage
        fields = ['id', 'banner', 'content', 'videos', 'sections']
