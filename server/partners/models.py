from django.db import models
from django.utils.text import slugify
from django.utils.crypto import get_random_string

from core.i18n_slug import TranslatedSlugMixin


class Partner(TranslatedSlugMixin, models.Model):
    slug_source = "name"

    name = models.CharField("Название", max_length=200)
    slug = models.SlugField("Слаг", max_length=220, unique=True, blank=True, allow_unicode=True)
    type = models.CharField("Тип", max_length=100, blank=True)
    logo = models.ImageField("Логотип", upload_to="partners/", blank=True, null=True)
    url = models.URLField("Сайт", blank=True)
    description = models.TextField("Описание", blank=True)

    class Meta:
        verbose_name = "Партнёр"
        verbose_name_plural = "Партнёры"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name, allow_unicode=True) or "partner"
            cand = base
            while type(self).objects.filter(slug=cand).exclude(pk=self.pk).exists():
                cand = f"{base}-{get_random_string(4, '0123456789')}"
            self.slug = cand
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
