from django.contrib import admin
from unfold.admin import ModelAdmin
from django import forms
from django.utils.html import format_html
from django.contrib.admin.widgets import AdminTextareaWidget
import re
from django.db import models
from django_ckeditor_5.widgets import CKEditor5Widget
from modeltranslation.admin import TabbedTranslationAdmin

from .models import TeamMember


class TeamMemberAdminForm(forms.ModelForm):
    socials_text = forms.CharField(
        label="Соцсети (ключ: ссылка)",
        required=False,
        widget=AdminTextareaWidget,
        help_text="Каждая пара с новой строки или через запятую. Примеры: "
                  "instagram: https://..., linkedin=https://..., web, https://...",
    )

    class Meta:
        model = TeamMember
        fields = ["name", "role", "photo", "bio", "socials_text"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        data = getattr(self.instance, "socials", None)
        if self.instance and self.instance.pk and isinstance(data, dict):
            lines = [f"{k}: {v}" for k, v in data.items() if v]
            self.fields["socials_text"].initial = "\n".join(lines)

    def clean_socials_text(self):
        raw = (self.cleaned_data.get("socials_text") or "").strip()
        if not raw:
            return {}
        pairs = re.split(r"[\n,]+", raw)
        out = {}
        for p in pairs:
            p = p.strip()
            if not p:
                continue
            if ":" in p:
                k, v = p.split(":", 1)
            elif "=" in p:
                k, v = p.split("=", 1)
            else:
                parts = [s.strip() for s in p.split(None, 1)]
                if len(parts) == 2:
                    k, v = parts
                else:
                    continue
            k = (k or "").strip().lower()
            v = (v or "").strip()
            if k and v:
                out[k] = v
        return out

    def save(self, commit=True):
        obj = super().save(commit=False)
        obj.socials = self.cleaned_data.get("socials_text", {})
        if commit:
            obj.save()
        return obj


@admin.register(TeamMember)
class TeamMemberAdmin(TabbedTranslationAdmin, ModelAdmin):
    form = TeamMemberAdminForm

    list_display = ("name", "role", "photo_thumb", "socials_keys")
    list_display_links = ("name",)
    list_filter = ("role",)
    search_fields = ("name", "role")
    ordering = ("name",)
    list_per_page = 25
    empty_value_display = "—"
    show_full_result_count = False

    formfield_overrides = {models.TextField: {"widget": CKEditor5Widget(config_name="default")}}

    fieldsets = (
        ("Основное", {"fields": ("name", "role", "photo", "photo_preview")}),
        ("Биография", {"fields": ("bio",)}),
        ("Соцсети", {"fields": ("socials_text",)}),
    )
    readonly_fields = ("photo_preview",)

    list_fullwidth = True
    compressed_fields = True
    warn_unsaved_form = True
    save_on_top = True

    @admin.display(description="Фото")
    def photo_thumb(self, obj):
        if obj.photo:
            return format_html('<img src="{}" style="height:48px;border-radius:6px;" />', obj.photo.url)
        return "—"

    @admin.display(description="Превью")
    def photo_preview(self, obj):
        if obj.photo:
            return format_html('<img src="{}" style="max-height:220px;border-radius:10px;" />', obj.photo.url)
        return "—"

    @admin.display(description="Соцсети")
    def socials_keys(self, obj):
        if isinstance(getattr(obj, "socials", None), dict) and obj.socials:
            keys = ", ".join(list(obj.socials.keys())[:3])
            more = "" if len(obj.socials) <= 3 else "…"
            return f"{keys}{more}"
        return "—"

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.only("id", "name", "role", "photo", "socials").defer("bio")
