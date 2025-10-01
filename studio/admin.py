from django.contrib import admin
from .models import StudioPage, Video, Section


class VideoInline(admin.TabularInline):
    model = Video
    extra = 1
    fields = ('title', 'youtube_video')
    show_change_link = True


class SectionInline(admin.StackedInline):
    model = Section
    extra = 1
    fields = ('title', 'body', 'image')
    show_change_link = True


@admin.register(StudioPage)
class StudioPageAdmin(admin.ModelAdmin):
    list_display = ('id', 'banner', 'short_content')
    search_fields = ('banner', 'content')
    inlines = [VideoInline, SectionInline]

    def short_content(self, obj):
        return (obj.content[:75] + '...') if len(obj.content) > 75 else obj.content
    short_content.short_description = 'Content Preview'


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'youtube_video', 'page')
    list_filter = ('page',)
    search_fields = ('title', 'youtube_video')


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'page')
    list_filter = ('page',)
    search_fields = ('title', 'body')
