from django.contrib import admin
from unfold.admin import ModelAdmin
from django.utils.html import format_html
from django.db import models
from django.contrib.admin.widgets import AdminTextareaWidget

from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(ModelAdmin):
    list_display = ("created_at", "name", "email_link", "subject", "file_link")
    list_display_links = ("subject",)
    list_filter = ("created_at",)
    search_fields = ("name", "email", "phone", "subject", "message")
    date_hierarchy = "created_at"
    ordering = ("-created_at",)
    list_per_page = 25
    empty_value_display = "—"
    show_full_result_count = False

    fieldsets = (
        ("Отправитель", {"fields": ("name", "email", "phone")}),
        ("Сообщение", {"fields": ("subject", "message")}),
        ("Служебное", {"fields": ("file_url", "created_at")}),
    )
    readonly_fields = ("created_at",)

    formfield_overrides = {
        models.TextField: {"widget": AdminTextareaWidget(attrs={"rows": 8})},
    }

    list_fullwidth = True
    compressed_fields = True
    warn_unsaved_form = True
    save_on_top = True

    @admin.display(description="Email")
    def email_link(self, obj: ContactMessage):
        if obj.email:
            return format_html('<a href="mailto:{0}">{0}</a>', obj.email)
        return "—"

    @admin.display(description="Файл")
    def file_link(self, obj: ContactMessage):
        if obj.file_url:
            return format_html('<a href="{0}" target="_blank" rel="noopener">Открыть</a>', obj.file_url)
        return "—"

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.only(
            "id", "name", "email", "phone", "subject", "message", "file_url", "created_at"
        )
