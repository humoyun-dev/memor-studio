from django.contrib import admin
from unfold.admin import ModelAdmin
from django.utils.html import format_html
from django.db.models import Q
from .models import MediaAsset

# ── Filtr: kontent turi bo'yicha
class TypeFilter(admin.SimpleListFilter):
    title = "Тип"
    parameter_name = "type"

    def lookups(self, request, model_admin):
        return [
            ("image", "Изображения"),
            ("video", "Видео"),
            ("audio", "Аудио"),
            ("doc",   "Документы"),
            ("other", "Другое"),
        ]

    def queryset(self, request, qs):
        val = self.value()
        if val == "image":
            return qs.filter(content_type__startswith="image/")
        if val == "video":
            return qs.filter(content_type__startswith="video/")
        if val == "audio":
            return qs.filter(content_type__startswith="audio/")
        if val == "doc":
            return qs.filter(
                Q(content_type__icontains="pdf")
                | Q(content_type__icontains="msword")
                | Q(content_type__icontains="officedocument")
                | Q(content_type__startswith="text/")
            )
        if val == "other":
            return qs.exclude(
                Q(content_type__startswith="image/")
                | Q(content_type__startswith="video/")
                | Q(content_type__startswith="audio/")
                | Q(content_type__icontains="pdf")
                | Q(content_type__icontains="msword")
                | Q(content_type__icontains="officedocument")
                | Q(content_type__startswith="text/")
            )
        return qs


def _human_bytes(n: int) -> str:
    try:
        n = int(n or 0)
    except Exception:
        return "—"
    units = ["B", "KB", "MB", "GB", "TB"]
    i = 0
    while n >= 1024 and i < len(units) - 1:
        n /= 1024.0
        i += 1
    return f"{n:.1f} {units[i]}" if i else f"{n} {units[i]}"


@admin.register(MediaAsset)
class MediaAssetAdmin(ModelAdmin):
    # Changelist
    list_display = ("preview", "filename", "content_type", "size_readable", "dimensions", "created_at")
    list_display_links = ("filename",)
    list_filter = (TypeFilter, "created_at")
    search_fields = ("file", "url", "content_type")
    ordering = ("-id",)
    list_per_page = 25
    empty_value_display = "—"
    show_full_result_count = False

    # Forma
    readonly_fields = ("content_type", "size", "width", "height", "created_at", "preview_large")
    fieldsets = (
        ("Файл", {"fields": ("file", "url", "preview_large")}),
        ("Метаданные", {"fields": ("content_type", "size", "width", "height", "variants", "created_at")}),
    )

    # Unfold qulayliklari
    list_fullwidth = True
    compressed_fields = True
    warn_unsaved_form = True
    save_on_top = True

    # ——— Helpers (changelist columnlar)
    @admin.display(description="Превью")
    def preview(self, obj: MediaAsset):
        url = getattr(obj.file, "url", None)
        if not url:
            return "—"

        # image sifatida ko'rsatish shartlari:
        is_image = (obj.content_type or "").startswith("image/") or (obj.width and obj.height)
        if not is_image:
            # kengaytmadan aniqlash (fallback)
            name = getattr(obj.file, "name", "") or ""
            ext = (name.rsplit(".", 1)[-1] if "." in name else "").lower()
            if ext in {"jpg", "jpeg", "png", "gif", "webp", "bmp", "tif", "tiff"}:
                is_image = True

        if is_image:
            return format_html('<img src="{}" style="height:40px;border-radius:6px;" />', url)
        return "—"

    @admin.display(description="Превью (крупно)")
    def preview_large(self, obj: MediaAsset):
        url = getattr(obj.file, "url", None)
        if url and ((obj.content_type or "").startswith("image/") or (obj.width and obj.height)):
            return format_html('<img src="{}" style="max-height:220px;border-radius:10px;" />', url)
        return "—"

    @admin.display(description="Имя файла")
    def filename(self, obj: MediaAsset):
        if getattr(obj, "file", None):
            try:
                return format_html('<a href="{}" target="_blank" rel="noopener">{}</a>', obj.file.url, obj.file.name)
            except Exception:
                return obj.file.name
        return obj.url or "—"

    @admin.display(description="Размер")
    def size_readable(self, obj: MediaAsset):
        return _human_bytes(obj.size)

    @admin.display(description="Размеры")
    def dimensions(self, obj: MediaAsset):
        if obj.width and obj.height:
            return f"{obj.width}×{obj.height}"
        return "—"

    # Tezlik: faqat zarur ustunlarni tortamiz
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.only("id", "file", "url", "content_type", "size", "width", "height", "variants", "created_at")
