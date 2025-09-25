from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField


class Category(models.Model):
    name = models.CharField(max_length=100, db_index=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class News(models.Model):
    title = models.CharField(max_length=255, db_index=True)
    content = RichTextUploadingField()
    categories = models.ManyToManyField(Category, blank=True)
    image = models.ImageField(
        upload_to="news/images/",
        blank=True,
        null=True,
        help_text="Optional thumbnail or header image",
    )
    is_published = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "News"
        verbose_name_plural = "News"

    def __str__(self):
        return self.title
