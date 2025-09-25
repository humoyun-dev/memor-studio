from django.db import models
from PIL import Image
import os
import cv2
from django.core.exceptions import ValidationError
import re


def validate_image_16_9(image):
    img = Image.open(image)
    width, height = img.size
    if round(width / height, 2) != round(16 / 9, 2):
        raise ValidationError("Image must have a 16:9 aspect ratio.")


def validate_video_16_9(video):
    temp_path = video.temporary_file_path() if hasattr(video, "temporary_file_path") else None
    if not temp_path:
        import tempfile
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            for chunk in video.chunks():
                tmp.write(chunk)
            temp_path = tmp.name

    cap = cv2.VideoCapture(temp_path)
    width = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
    height = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
    cap.release()

    if height == 0 or round(width / height, 2) != round(16 / 9, 2):
        raise ValidationError("Video must have a 16:9 aspect ratio.")

    if os.path.exists(temp_path):
        os.remove(temp_path)


class Carousel(models.Model):
    title = models.CharField(max_length=100, unique=True, db_index=True)
    body = models.TextField(blank=True, null=True)
    image = models.ImageField(
        upload_to="carousel/images/",
        blank=True,
        null=True,
        validators=[validate_image_16_9],
    )
    video = models.FileField(
        upload_to="carousel/videos/",
        blank=True,
        null=True,
        validators=[validate_video_16_9]
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Carousel Slide"
        verbose_name_plural = "Carousel Slides"

    def __str__(self):
        return self.title




def validate_youtube_url(value):
    youtube_regex = re.compile(
        r'^(https?://)?(www\.)?(youtube\.com|youtu\.be)/.+$'
    )
    if not youtube_regex.match(value):
        raise ValidationError("Video URL must be a valid YouTube link.")


class BannersVideo(models.Model):
    title = models.CharField(max_length=100, unique=True, db_index=True)
    video = models.CharField(
        max_length=255,
        unique=True,
        validators=[validate_youtube_url]
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Banner Video"
        verbose_name_plural = "Banner Videos"

    def __str__(self):
        return self.title