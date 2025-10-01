from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField

class Service(models.Model):
    title = models.CharField(max_length=100)
    banner = models.ImageField(upload_to="service/images/",
        blank=True,
        null=True,
        help_text="Optional thumbnail or header image",)
    slug = models.SlugField(unique=True)
    description = RichTextUploadingField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Xizmat kategoriyasi"
        verbose_name_plural = "Xizmat kategoriyalari"

    def __str__(self):
        return self.title
