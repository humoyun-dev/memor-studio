from django.db import models
from django.utils.text import slugify
from django.utils.crypto import get_random_string

from core.i18n_slug import TranslatedSlugMixin


class TeamMember(TranslatedSlugMixin,models.Model):
    slug_source = "name"
    name = models.CharField("Имя и фамилия", max_length=200)
    slug = models.SlugField("Слаг", max_length=220, unique=True, blank=True, allow_unicode=True)
    role = models.CharField("Должность", max_length=150)
    photo = models.ImageField("Фото", upload_to="team/", blank=True, null=True)
    bio = models.TextField("Био", blank=True, null=True)
    socials = models.JSONField("Соцсети", default=dict, blank=True)

    class Meta:
        verbose_name = "Сотрудник"
        verbose_name_plural = "Команда"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name, allow_unicode=True) or "team"
            cand = base
            while type(self).objects.filter(slug=cand).exclude(pk=self.pk).exists():
                cand = f"{base}-{get_random_string(4, '0123456789')}"
            self.slug = cand
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
