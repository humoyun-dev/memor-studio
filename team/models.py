from django.db import models

class TeamMember(models.Model):
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='team/', blank=True, null=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['order']
        verbose_name = "Jamoa a'zosi"
        verbose_name_plural = "Jamoa a'zolari"

class TeamPageInfo(models.Model):
    title = models.CharField(max_length=200, default="Bizning Jamoa")
    subtitle = models.TextField(blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Jamoa sahifasi ma'lumoti"
        verbose_name_plural = "Jamoa sahifasi ma'lumotlari"