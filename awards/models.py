from django.db import models

class AwardsPageInfo(models.Model):
    title = models.CharField(max_length=100, default="AWARDS")
    subtitle = models.TextField(blank=True)
    description = models.TextField(blank=True)
    hero_image = models.ImageField(upload_to='awards/hero/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Mukofotlar sahifasi ma'lumoti"
        verbose_name_plural = "Mukofotlar sahifasi ma'lumotlari"

class Award(models.Model):
    year = models.IntegerField()
    project = models.CharField(max_length=200)
    award = models.CharField(max_length=200)
    organization = models.CharField(max_length=200)
    image = models.ImageField(upload_to='awards/', blank=True, null=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project} - {self.award}"

    class Meta:
        ordering = ['year', 'order']
        verbose_name = "Mukofot"
        verbose_name_plural = "Mukofotlar"