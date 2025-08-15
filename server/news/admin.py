from django.contrib import admin
from django import forms
from django.contrib.admin.widgets import AdminTextInputWidget
from django.utils.html import format_html
from django.db import models

from modeltranslation.admin import TabbedTranslationAdmin
from unfold.admin import ModelAdmin
from django_ckeditor_5.widgets import CKEditor5Widget

from .models import News


class NewsAdminForm(forms.ModelForm):
    tags_text = forms.CharField(
        label="Теги (через запятую)",
        required=False,
        help_text="например: офис, награда, интерьер",
        widget=AdminTextInputWidget,
    )

    class Meta:
        model = News
        fields = ("title", "cover", "body", "tags_text")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        tags = getattr(self.instance, "tags", None)
        if self.instance and self.instance.pk and isinstance(tags, list):
            self.fields["tags_text"].initial = ", ".join(tags)

    def save(self, commit=True):
        obj = super().save(commit=False)
        raw = self.cleaned_data.get("tags_text", "")
        obj.tags = [t.strip() for t in raw.split(",") if t.strip()]
        if commit:
            obj.save()
        return obj


@admin.register(News)
class NewsAdmin(TabbedTranslationAdmin, ModelAdmin):
    form = NewsAdminForm

    list_display = ("title", "date", "cover_thumb", "tags_list")
    list_display_links = ("title",)
    list_filter = ("date",)
    search_fields = ("title",)
    date_hierarchy = "date"
    ordering = ("-date", "-id")
    list_per_page = 25
    empty_value_display = "—"

    # prepopulated_fields = {"slug": ("title",)}

    exclude = ("slug",)
    fieldsets = (
        ("Основное", {"fields": ("title", "date", "cover", "cover_preview")}),
        ("Контент",  {"fields": ("body",)}),
        ("Теги",     {"fields": ("tags_text",)}),
    )
    readonly_fields = ("date", "cover_preview")

    list_fullwidth = True
    compressed_fields = True
    warn_unsaved_form = True
    save_on_top = True

    formfield_overrides = {
        models.TextField: {"widget": CKEditor5Widget(config_name="default")},
    }

    @admin.display(description="Теги")
    def tags_list(self, obj):
        return ", ".join(obj.tags or [])

    @admin.display(description="Обложка")
    def cover_thumb(self, obj):
        if obj.cover:
            return format_html('<img src="{}" style="height:40px;border-radius:6px;" />', obj.cover.url)
        return "—"

    @admin.display(description="Превью")
    def cover_preview(self, obj):
        if obj.cover:
            return format_html('<img src="{}" style="max-height:220px;border-radius:10px;" />', obj.cover.url)
        return "—"

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.only("id", "title", "date", "tags", "cover").defer("body")

    class Media:
        css = {"all": ("modeltranslation/css/tabbed_translation_fields.css",)}
        js = (
            "modeltranslation/js/force_jquery.js",
            "modeltranslation/js/tabbed_translation_fields.js",
        )
