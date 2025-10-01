from django.contrib import admin
from .models import Partners


@admin.register(Partners)
class PartnersAdmin(admin.ModelAdmin):
    list_display = ("nom", "website", "phone", "email", "created_at")
    list_filter = ("created_at",)
    search_fields = ("nom", "email", "phone")
    ordering = ("nom",)
    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        ("Basic Info", {
            "fields": ("nom", "logo", "website")
        }),
        ("Contact", {
            "fields": ("phone", "email")
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
        }),
    )
