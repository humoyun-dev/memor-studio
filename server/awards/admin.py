from django.contrib import admin
from unfold.admin import ModelAdmin
from django.db.models import Count
from .models import Award
from django.db import models
from django_ckeditor_5.widgets import CKEditor5Widget
from modeltranslation.admin import TabbedTranslationAdmin


@admin.register(Award)
class AwardAdmin(TabbedTranslationAdmin, ModelAdmin):
    list_display = ("title", "organization", "date", "projects_total")
    list_display_links = ("title",)
    list_filter = ("organization", "date")
    search_fields = ("title", "organization", "nomination")
    date_hierarchy = "date"
    ordering = ("-date", "title")
    list_per_page = 25
    empty_value_display = "—"
    show_full_result_count = False

    formfield_overrides = {models.TextField: {"widget": CKEditor5Widget(config_name="default")}}

    fieldsets = (
        ("Основное", {
            "fields": ("title", "organization", "nomination", "place", "score", "date"),
        }),
        ("Связи", {
            "fields": ("projects",),
            "description": "Свяжите награду с соответствующими проектами.",
        }),
        ("Описание", {
            "fields": ("description",),
        }),
    )

    autocomplete_fields = ("projects",)

    list_fullwidth = True
    compressed_fields = True
    warn_unsaved_form = True
    save_on_top = True

    @admin.display(description="Проектов")
    def projects_total(self, obj):
        return getattr(obj, "projects__count", None) or obj.projects.count()

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return (
            qs.only("id", "title", "organization", "nomination", "place", "score", "date")
              .annotate(Count("projects", distinct=True))
              .prefetch_related(None)
        )
