from django.contrib import admin
from modeltranslation.admin import TranslationAdmin

from .models import Service


@admin.register(Service)
class ServiceAdmin(TranslationAdmin):
    list_display = ("title", "is_active", "created_at", "updated_at")
    list_editable = ("is_active",)
    search_fields = ("title", "description")
    list_filter = ("is_active", "created_at")
    readonly_fields = ("created_at", "updated_at")
    prepopulated_fields = {"slug": ("title",)}
    fieldsets = (
        (None, {
            "fields": (
                "title",
                "slug",
                "banner",
                "description",
                "is_active",
            ),
        }),
        ("Tizim ma'lumotlari", {
            "fields": ("created_at", "updated_at"),
        }),
    )
