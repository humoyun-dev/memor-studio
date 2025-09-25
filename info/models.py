from django.db import models

class CompanyInfo(models.Model):
    title = models.CharField(max_length=200)
    subtitle = models.TextField()
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Kompaniya haqida"
        verbose_name_plural = "Kompaniya haqida"

class Statistic(models.Model):
    title = models.CharField(max_length=100)
    value = models.CharField(max_length=50)
    description = models.CharField(max_length=100)
    order = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.title}: {self.value}"

    class Meta:
        ordering = ['order']
        verbose_name = "Statistika"
        verbose_name_plural = "Statistikalar"

class Leader(models.Model):
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    bio = models.TextField()
    image = models.ImageField(upload_to='leaders/', blank=True, null=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['order']
        verbose_name = "Rahbar"
        verbose_name_plural = "Rahbarlar"