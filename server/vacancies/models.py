from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django.utils.crypto import get_random_string

EMPLOYMENT_TYPES = [
    ("full_time", "Полная занятость"),
    ("part_time", "Частичная занятость"),
    ("contract",  "Контракт"),
    ("intern",    "Стажировка"),
]
SENIORITY = [
    ("junior", "Junior"),
    ("middle", "Middle"),
    ("senior", "Senior"),
    ("lead",   "Lead"),
]
CURRENCIES = [("UZS", "UZS"), ("USD", "USD"), ("EUR", "EUR")]

class Vacancy(models.Model):
    title = models.CharField("Вакансия", max_length=200)
    slug  = models.SlugField("Слаг", max_length=220, unique=True, blank=True, allow_unicode=True)

    department = models.CharField("Отдел", max_length=100, blank=True)
    location   = models.CharField("Локация", max_length=150, blank=True)
    employment_type = models.CharField("Тип занятости", max_length=20, choices=EMPLOYMENT_TYPES, blank=True)
    seniority       = models.CharField("Уровень", max_length=20, choices=SENIORITY, blank=True)

    salary_min = models.PositiveIntegerField("Зарплата от", null=True, blank=True)
    salary_max = models.PositiveIntegerField("Зарплата до", null=True, blank=True)
    currency   = models.CharField("Валюта", max_length=3, choices=CURRENCIES, default="UZS", blank=True)

    description = models.TextField("Описание", null=True, blank=True)
    tags = models.JSONField("Теги", default=list, blank=True)

    apply_url   = models.URLField("Ссылка для отклика", blank=True)
    apply_email = models.EmailField("Email для отклика", blank=True)

    published_at = models.DateField("Опубликовано", default=timezone.localdate, editable=False)
    expire_at    = models.DateField("Действительно до", null=True, blank=True)
    is_active    = models.BooleanField("Активно", default=True)

    class Meta:
        verbose_name = "Вакансия"
        verbose_name_plural = "Вакансии"
        ordering = ["-published_at", "-id"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title, allow_unicode=True) or "vacancy"
            slug = base
            while type(self).objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{get_random_string(4, '0123456789')}"
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
