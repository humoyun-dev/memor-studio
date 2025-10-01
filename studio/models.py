from django.db import models


class StudioPage(models.Model):
    banner = models.ImageField(upload_to="studio/banners/")
    content = models.TextField()

    def __str__(self):
        return f"Studio Page #{self.id}"


class Video(models.Model):
    title = models.CharField(max_length=255)
    youtube_video = models.CharField(max_length=255)
    page = models.ForeignKey(StudioPage, on_delete=models.CASCADE, related_name='videos')

    def __str__(self):
        return self.title


class Section(models.Model):
    title = models.CharField(max_length=255)
    body = models.TextField()
    image = models.ImageField(upload_to="studio/sections/")
    page = models.ForeignKey(StudioPage, on_delete=models.CASCADE, related_name='sections')

    def __str__(self):
        return self.title
