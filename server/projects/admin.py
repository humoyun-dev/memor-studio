from django.contrib import admin
from unfold.admin import ModelAdmin
from django import forms
from django.utils.html import format_html
from django.contrib.admin.widgets import AdminTextInputWidget
from django.db import models
from django_ckeditor_5.widgets import CKEditor5Widget
from modeltranslation.admin import TabbedTranslationAdmin
from .models import Project


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

    def queryset(self, request, queryset):
        val = self.value()
        if val:
            return queryset.filter(tags__contains=[val])
        return queryset


class ProjectAdminForm(forms.ModelForm):
    tags_text = forms.CharField(
        label="Теги (через запятую)",
        required=False,
        help_text="например: жилой, офис, интерьер",
        widget=AdminTextInputWidget,
    )

    class Meta:
        model = Project
        fields = [
            "title", "category", "location", "year", "area",
            "cover", "description", "tags_text", "gallery", "partners",
        ]

    def __init__(self, *args, **kwargs):
        from django.utils import timezone
        super().__init__(*args, **kwargs)
        tags = getattr(self.instance, "tags", None)
        if self.instance and self.instance.pk and isinstance(tags, list):
            self.fields["tags_text"].initial = ", ".join(tags)
        if "year" in self.fields:
            y = timezone.now().year + 1
            self.fields["year"].widget.attrs.update({"min": 1900, "max": y, "step": 1})

    def save(self, commit=True):
        obj = super().save(commit=False)
        raw = self.cleaned_data.get("tags_text", "")
        obj.tags = [t.strip() for t in raw.split(",") if t.strip()]
        if commit:
            obj.save()
            self.save_m2m()
        return obj


@admin.register(Project)
class ProjectAdmin(TabbedTranslationAdmin, ModelAdmin):
    form = ProjectAdminForm

    list_display = ("title", "year", "category", "location", "cover_thumb", "tags_list")
    list_display_links = ("title",)
    list_filter = ("year", "category", TagFilter)
    search_fields = ("title", "location", "category")
    ordering = ("-year", "title")
    list_per_page = 25
    empty_value_display = "—"
    show_full_result_count = False

    exclude = ("slug",)
    filter_horizontal = ("gallery", "partners")

    formfield_overrides = { models.TextField: {"widget": CKEditor5Widget(config_name="default")} }

    list_fullwidth = True
    compressed_fields = True
    warn_unsaved_form = True
    save_on_top = True

    @admin.display(description="Теги")
    def tags_list(self, obj):
        return ", ".join(obj.tags or [])

    @admin.display(description="Обложка")
    def cover_thumb(self, obj):
        if obj.cover:
            return format_html('<img src="{}" style="height:48px;border-radius:6px;" />', obj.cover.url)
        return "—"

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return (
            qs.only("id", "title", "year", "category", "location", "area", "tags", "cover")
              .defer("description")
              .prefetch_related("partners")
        )