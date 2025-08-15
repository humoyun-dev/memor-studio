from django.conf import settings
from django.db import models
from django.utils.text import slugify
from django.utils.crypto import get_random_string

class TranslatedSlugMixin(models.Model):
    slug_source = "title"
    slug_field = "slug"
    slug_random_digits = "0123456789"

    class Meta:
        abstract = True

    def _has_field(self, name: str) -> bool:
        return any(f.name == name for f in self._meta.get_fields())

    def _ensure_lang_slug(self, lang_code: str):
        slug_field = f"{self.slug_field}_{lang_code}"
        if not self._has_field(slug_field):
            return
        if getattr(self, slug_field, None):
            return
        source_val = getattr(self, f"{self.slug_source}_{lang_code}", None)
        if not source_val:
            return
        base = slugify(source_val, allow_unicode=True) or self.__class__.__name__.lower()
        cand = base
        Model = type(self)
        while Model.objects.filter(**{slug_field: cand}).exclude(pk=self.pk).exists():
            cand = f"{base}-{get_random_string(4, self.slug_random_digits)}"
        setattr(self, slug_field, cand)

    def save(self, *args, **kwargs):
        langs = [code for code, _ in getattr(settings, "LANGUAGES", ())]
        for code in langs:
            self._ensure_lang_slug(code)

        if self._has_field(self.slug_field) and not getattr(self, self.slug_field, None):
            dlang = getattr(settings, "MODELTRANSLATION_DEFAULT_LANGUAGE", langs[0] if langs else "uz")
            lang_slug_field = f"{self.slug_field}_{dlang}"
            if self._has_field(lang_slug_field) and getattr(self, lang_slug_field, None):
                setattr(self, self.slug_field, getattr(self, lang_slug_field))

        return super().save(*args, **kwargs)