from django.db import models
from django.core.exceptions import ValidationError
from PIL import Image
import re


def validate_image_16_9(image):
    """Ensure uploaded image has a 16:9 aspect ratio."""
    img = Image.open(image)
    width, height = img.size
    if height == 0 or round(width / height, 2) != round(16 / 9, 2):
        raise ValidationError("Image must have a 16:9 aspect ratio.")


def validate_youtube_url(value):
    """Ensure URL is a valid YouTube link."""
    youtube_regex = re.compile(
        r'^(https?://)?(www\.)?(youtube\.com|youtu\.be)/.+$'
    )
    if not youtube_regex.match(value):
        raise ValidationError("Video URL must be a valid YouTube link.")


class Category(models.Model):
    name = models.CharField(max_length=100, db_index=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Project(models.Model):
    title = models.CharField(max_length=200, db_index=True)
    body = models.TextField()
    hero_image = models.ImageField(
        upload_to="projects/hero/",
        validators=[validate_image_16_9],
        help_text="Hero image must be 16:9"
    )

    categories = models.ManyToManyField(
        Category,
        related_name="projects",
        blank=True
    )

    client = models.CharField(max_length=200, blank=True, null=True)
    location = models.CharField(max_length=200, blank=True, null=True)
    type = models.CharField(max_length=100, blank=True, null=True)
    features = models.TextField(blank=True, null=True, help_text="One feature per line")
    status = models.CharField(max_length=100, blank=True, null=True)
    year = models.PositiveIntegerField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-year", "-created_at"]
        verbose_name = "Project"
        verbose_name_plural = "Projects"

    def __str__(self):
        return self.title


class ProjectImage(models.Model):
    """Additional project images (gallery)."""
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="images"
    )
    image = models.ImageField(
        upload_to="projects/gallery/",
        help_text="Image must be 16:9"
    )

    def __str__(self):
        return f"{self.project.title} - Gallery Image"


class ProjectVideo(models.Model):
    """YouTube video links for projects."""
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="videos"
    )
    title = models.CharField(max_length=200, db_index=True, blank=True, null=True)
    video_url = models.URLField(
        max_length=255,
        unique=True,
        validators=[validate_youtube_url],
        help_text="Only YouTube links allowed"
    )

    def __str__(self):
        return f"{self.project.title} - {self.title or 'YouTube Video'}"
