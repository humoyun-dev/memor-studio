from django.db import models
from django.utils.text import slugify
from django.utils.crypto import get_random_string
from django_ckeditor_5.fields import CKEditor5Field
from django.core.exceptions import ValidationError
from django.utils import timezone

from core.i18n_slug import TranslatedSlugMixin


def validate_year(value):
    y = timezone.now().year
    if value < 1900 or value > y + 1:
        raise ValidationError(f"Год должен быть в диапазоне 1900–{y+1}.")

class Project(TranslatedSlugMixin, models.Model):
    slug_source = "title"
    title = models.CharField("Название", max_length=200)
    slug = models.SlugField("Слаг", max_length=220, unique=True, blank=True, allow_unicode=True)
    category = models.CharField("Категория", max_length=100, blank=True)
    location = models.CharField("Локация", max_length=150, blank=True)
    year = models.PositiveSmallIntegerField(
        "Год", null=True, blank=True, validators=[validate_year]
    )
    area = models.CharField("Площадь", max_length=50, blank=True)
    cover = models.ImageField("Обложка", upload_to="projects/covers/", blank=True, null=True)
    description = models.TextField("Описание", blank=True)
    tags = models.JSONField("Теги", default=list, blank=True)

    gallery = models.ManyToManyField("mediafiles.MediaAsset", verbose_name="Галерея", blank=True)
    partners = models.ManyToManyField("partners.Partner", verbose_name="Партнёры", blank=True)

    class Meta:
        verbose_name = "Проект"
        verbose_name_plural = "Проекты"
        ordering = ["-year", "title"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title, allow_unicode=True) or "project"
            cand = base
            while type(self).objects.filter(slug=cand).exclude(pk=self.pk).exists():
                cand = f"{base}-{get_random_string(4, '0123456789')}"
            self.slug = cand
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

