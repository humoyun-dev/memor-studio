from django.db import models
from PIL import Image
from io import BytesIO
import mimetypes

class MediaAsset(models.Model):
    file = models.FileField("Файл", upload_to="uploads/")
    url = models.URLField("Внешняя ссылка", blank=True)
    content_type = models.CharField("MIME-тип", max_length=100, blank=True)
    size = models.PositiveIntegerField("Размер (байт)", default=0)
    width = models.PositiveIntegerField("Ширина", null=True, blank=True)
    height = models.PositiveIntegerField("Высота", null=True, blank=True)
    variants = models.JSONField("Варианты", default=list, blank=True)
    created_at = models.DateTimeField("Создано", auto_now_add=True)

    class Meta:
        verbose_name = "Медиафайл"
        verbose_name_plural = "Медиафайлы"
        ordering = ["-id"]

    def save(self, *args, **kwargs):
        if self.file and hasattr(self.file, "file"):
            try:
                self.size = int(self.file.size or 0)
            except Exception:
                self.size = 0

            ct = getattr(self.file, "content_type", None) or ""
            if not ct:
                guessed, _ = mimetypes.guess_type(self.file.name or "")
                ct = guessed or ""
            self.content_type = ct

            try:
                self.file.seek(0)
                data = self.file.read()
                img = Image.open(BytesIO(data))
                self.width, self.height = img.size
            except Exception:
                self.width = None
                self.height = None
            finally:
                try:
                    self.file.seek(0)
                except Exception:
                    pass

        super().save(*args, **kwargs)

    def __str__(self):
        return self.file.name if self.file else (self.url or "media")
