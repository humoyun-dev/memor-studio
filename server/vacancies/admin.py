from django.contrib import admin
from unfold.admin import ModelAdmin
from django import forms
from django.contrib.admin.widgets import AdminTextInputWidget
from .models import Vacancy
from django.db import models
from django_ckeditor_5.widgets import CKEditor5Widget
from modeltranslation.admin import TabbedTranslationAdmin


class TagFilter(admin.SimpleListFilter):
    title = "Тег"
    parameter_name = "tag"

    def lookups(self, request, model_admin):
        vals = (
            model_admin.model.objects.only("id", "tags")
            .values_list("tags", flat=True)
            .iterator(chunk_size=1000)
        )
        tags = set()
        for arr in vals:
            if isinstance(arr, list):
                for t in arr or []:
                    if t:
                        tags.add(t)
        return [(t, t) for t in sorted(tags, key=str.lower)[:20]]

    def queryset(self, request, qs):
        return qs.filter(tags__contains=[self.value()]) if self.value() else qs


class VacancyAdminForm(forms.ModelForm):
    tags_text = forms.CharField(
        label="Теги (через запятую)", required=False,
        help_text="например: архитектор, стажировка, удаленно",
        widget=AdminTextInputWidget,
    )

    class Meta:
        model = Vacancy
        fields = [
            "title", "department", "location", "employment_type", "seniority",
            "salary_min", "salary_max", "currency",
            "description", "tags_text",
            "apply_url", "apply_email", "expire_at", "is_active",
        ]

    def __init__(self, *args, **kwargs):
        from django.utils import timezone
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk and isinstance(self.instance.tags, list):
            self.fields["tags_text"].initial = ", ".join(self.instance.tags)
        for f in ("salary_min", "salary_max"):
            if f in self.fields:
                self.fields[f].widget.attrs.update({"min": 0, "step": 1})
        if "expire_at" in self.fields:
            self.fields["expire_at"].widget.attrs.update({"min": str(timezone.localdate())})

    def save(self, commit=True):
        obj = super().save(commit=False)
        raw = self.cleaned_data.get("tags_text", "")
        obj.tags = [t.strip() for t in raw.split(",") if t.strip()]
        if commit:
            obj.save()
        return obj


@admin.register(Vacancy)
class VacancyAdmin(TabbedTranslationAdmin, ModelAdmin):
    form = VacancyAdminForm

    list_display = ("title", "department", "location", "employment_type",
                    "seniority", "salary_range", "is_active", "published_at")
    list_display_links = ("title",)
    list_editable = ("is_active",)
    list_filter = ("is_active", "department", "location", "employment_type", "seniority", "published_at", TagFilter)
    search_fields = ("title", "department", "location", "description")
    date_hierarchy = "published_at"
    ordering = ("-published_at", "title")
    list_per_page = 25
    empty_value_display = "—"
    show_full_result_count = False

    formfield_overrides = {models.TextField: {"widget": CKEditor5Widget(config_name="default")}}

    exclude = ("slug",)
    fieldsets = (
        ("Основное", {"fields": ("title", "department", "location", "employment_type", "seniority", "is_active")}),
        ("Компенсация", {"fields": ("salary_min", "salary_max", "currency")}),
        ("Описание", {"fields": ("description", "tags_text")}),
        ("Отклик", {"fields": ("apply_url", "apply_email")}),
        ("Сроки", {"fields": ("published_at", "expire_at")}),
    )
    readonly_fields = ("published_at",)

    list_fullwidth = True
    compressed_fields = True
    warn_unsaved_form = True
    save_on_top = True

    @admin.display(description="Зарплата")
    def salary_range(self, obj: Vacancy):
        if obj.salary_min and obj.salary_max:
            return f"{obj.salary_min:,}–{obj.salary_max:,} {obj.currency}".replace(",", " ")
        if obj.salary_min:
            return f"от {obj.salary_min:,} {obj.currency}".replace(",", " ")
        if obj.salary_max:
            return f"до {obj.salary_max:,} {obj.currency}".replace(",", " ")
        return "—"

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.only(
            "id", "title", "department", "location", "employment_type", "seniority",
            "salary_min", "salary_max", "currency", "is_active", "published_at", "tags"
        ).defer("description")
