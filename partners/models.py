from django.db import models

def partner_logo_path(instance, filename):
    return f'partners/{instance.nom}_{filename}'

class Partners(models.Model):
    nom = models.CharField(max_length=255)
    logo = models.ImageField(upload_to=partner_logo_path, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Hamkor"
        verbose_name_plural = "Hamkorlar"
        ordering = ['nom']

    def __str__(self):
        return self.nom
