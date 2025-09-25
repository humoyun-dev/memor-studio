from django.contrib import admin
from django.utils.html import format_html
from modeltranslation.admin import TranslationAdmin
from .models import Carousel, BannersVideo

@admin.register(Carousel)
class CarouselAdmin(TranslationAdmin):
    list_display = (
        "id",
        "title",
        "short_body",
        "image_preview",
        "video_link",
        "created_at",
        "updated_at",
    )
    list_display_links = ("id", "title")
    list_filter = ("created_at", "updated_at")
    search_fields = ("title", "body")
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at", "image_preview", "video_link")

    fieldsets = (
        ("Content", {
            "fields": ("title", "body", "image", "image_preview", "video", "video_link")
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at")
        }),
    )

    def short_body(self, obj):
        return (obj.body[:50] + "...") if obj.body else "-"
    short_body.short_description = "Body"

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 120px; height: auto; border-radius: 6px;" />', obj.image.url)
        return "No Image"
    image_preview.short_description = "Preview"

    def video_link(self, obj):
        if obj.video:
            return format_html('<a href="{}" target="_blank">View Video</a>', obj.video.url)
        return "No Video"
    video_link.short_description = "Video"


@admin.register(BannersVideo)
class BannersVideoAdmin(TranslationAdmin):
    list_display = ("id", "title", "video", "created_at")
    list_display_links = ("id", "title")
    search_fields = ("title", "video")
    list_filter = ("created_at",)
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "youtube_embed")

    fieldsets = (
        ("Video Info", {
            "fields": ("title", "video", "youtube_embed")
        }),
        ("Timestamps", {
            "fields": ("created_at",)
        }),
    )

    def youtube_embed(self, obj):
        if obj.video:
            import re
            match = re.search(r"(?:v=|youtu\.be/)([a-zA-Z0-9_-]{11})", obj.video)
            if match:
                video_id = match.group(1)
                return format_html(
                    '<iframe width="320" height="180" src="https://www.youtube.com/embed/{}" '
                    'frameborder="0" allowfullscreen></iframe>', video_id
                )
        return "No Preview"
    youtube_embed.short_description = "Preview"
