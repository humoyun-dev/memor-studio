from django.contrib import admin
from modeltranslation.admin import TranslationAdmin
from .models import News, Category


@admin.register(News)
class NewsAdmin(TranslationAdmin):
    list_display = ("title_uz", "title_ru", "is_published", "created_at", "updated_at")
    list_filter = ("is_published", "categories", "created_at", "updated_at")
    search_fields = ("title_uz", "title_ru", "content_uz", "content_ru")
    date_hierarchy = "created_at"
    ordering = ("-created_at",)

    fieldsets = (
        ("Basic Info", {
            "fields": ("title_uz", "title_ru", "image", "is_published", "categories")
        }),
        ("Content", {
            "fields": ("content_uz", "content_ru")
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",)
        }),
    )

    readonly_fields = ("created_at", "updated_at")


@admin.register(Category)
class CategoryAdmin(TranslationAdmin):
    list_display = ("id", "name_uz", "name_ru")
    search_fields = ("name_uz", "name_ru")
    ordering = ("name_uz",)
