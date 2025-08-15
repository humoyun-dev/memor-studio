from django.db import models
from django.utils import timezone

class ContactMessage(models.Model):
    name = models.CharField("Имя", max_length=120)
    email = models.EmailField("Email")
    phone = models.CharField("Телефон", max_length=50, blank=True)
    subject = models.CharField("Тема", max_length=200)
    message = models.TextField("Сообщение")
    file_url = models.URLField("Файл (URL)", blank=True)
    created_at = models.DateTimeField("Создано", default=timezone.now, editable=False)

    class Meta:
        verbose_name = "Сообщение (контакты)"
        verbose_name_plural = "Сообщения (контакты)"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.subject}"
