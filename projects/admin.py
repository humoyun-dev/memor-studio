from django.contrib import admin
from modeltranslation.admin import TranslationAdmin
from .models import Project, ProjectImage, ProjectVideo, Category


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1
    fields = ("image",)
    show_change_link = True


class ProjectVideoInline(admin.TabularInline):
    model = ProjectVideo
    extra = 1
    fields = ("title", "video_url")
    show_change_link = True


@admin.register(Project)
class ProjectAdmin(TranslationAdmin):  # ✅ i18n qo‘shildi
    list_display = ("title", "client", "location", "type", "status", "year", "created_at")
    list_filter = ("status", "year", "location", "type", "categories", "created_at")
    search_fields = ("title", "client", "location", "type")
    ordering = ("-year", "-created_at")
    date_hierarchy = "created_at"

    filter_horizontal = ("categories",)

    fieldsets = (
        ("Basic Info", {
            "fields": ("title", "hero_image", "body", "categories")
        }),
        ("Details", {
            "fields": ("client", "location", "type", "features", "status", "year")
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",)
        }),
    )
    readonly_fields = ("created_at", "updated_at")

    inlines = [ProjectImageInline, ProjectVideoInline]


@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ("project", "image")
    search_fields = ("project__title",)
    list_filter = ("project",)


@admin.register(ProjectVideo)
class ProjectVideoAdmin(TranslationAdmin):  # ✅ i18n qo‘shildi
    list_display = ("project", "title", "video_url")
    search_fields = ("project__title", "title", "video_url")
    list_filter = ("project",)


@admin.register(Category)
class CategoryAdmin(TranslationAdmin):  # ✅ i18n qo‘shildi
    list_display = ("id", "name")
    search_fields = ("name",)
    ordering = ("name",)
