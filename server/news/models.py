from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.utils.crypto import get_random_string
from django.utils import timezone

from core.i18n_slug import TranslatedSlugMixin


def _has_field(instance, name: str) -> bool:
    return any(f.name == name for f in instance._meta.get_fields())


class News(TranslatedSlugMixin, models.Model):
    slug_source = "title"
    title = models.CharField("Заголовок", max_length=200)
    slug = models.SlugField("Слаг", max_length=220, unique=True, blank=True, allow_unicode=True)
    date = models.DateField(default=timezone.localdate, editable=False)
    cover = models.ImageField("Обложка", upload_to="news/", blank=True, null=True)
    body = models.TextField("Описание", blank=True)
    tags = models.JSONField("Теги", default=list, blank=True)

    class Meta:
        verbose_name = "Новость"
        verbose_name_plural = "Новости"
        ordering = ["-date", "-id"]

    def _ensure_lang_slug(self, lang_code: str):
        slug_field = f"slug_{lang_code}"
        if not _has_field(self, slug_field):
            return

        title_val = getattr(self, f"title_{lang_code}", None)
        if not title_val or getattr(self, slug_field, None):
            return

        base = slugify(title_val, allow_unicode=True) or "news"
        cand = base
        Model = type(self)
        while Model.objects.filter(**{slug_field: cand}).exclude(pk=self.pk).exists():
            cand = f"{base}-{get_random_string(4, '0123456789')}"
        setattr(self, slug_field, cand)

    def save(self, *args, **kwargs):
        for code, _ in getattr(settings, "LANGUAGES", ()):
            self._ensure_lang_slug(code)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
