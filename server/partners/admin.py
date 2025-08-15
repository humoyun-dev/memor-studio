from django.contrib import admin
from unfold.admin import ModelAdmin
from django.utils.html import format_html
from .models import Partner
from django.db import models
from django_ckeditor_5.widgets import CKEditor5Widget
from modeltranslation.admin import TabbedTranslationAdmin


@admin.register(Partner)
class PartnerAdmin(TabbedTranslationAdmin, ModelAdmin):
    list_display = ("name", "type", "site_link", "logo_thumb")
    list_display_links = ("name",)
    list_filter = ("type",)
    search_fields = ("name", "type", "url")
    ordering = ("name",)
    list_per_page = 25
    empty_value_display = "—"
    show_full_result_count = False

    exclude = ("slug",)
    fields = ("name", "type", "url", "logo", "description")
    formfield_overrides = {models.TextField: {"widget": CKEditor5Widget(config_name="default")}}

    list_fullwidth = True
    compressed_fields = True
    warn_unsaved_form = True
    save_on_top = True

    @admin.display(description="Сайт")
    def site_link(self, obj):
        if obj.url:
            return format_html('<a href="{}" target="_blank" rel="noopener">Перейти</a>', obj.url)
        return "—"

    @admin.display(description="Логотип")
    def logo_thumb(self, obj):
        if obj.logo:
            return format_html('<img src="{}" style="height:32px;border-radius:6px;" />', obj.logo.url)
        return "—"

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.only("id", "name", "type", "url", "logo").defer("description")
