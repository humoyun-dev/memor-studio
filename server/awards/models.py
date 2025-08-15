from django.db import models

class Award(models.Model):
    title = models.CharField("Награда", max_length=200)
    organization = models.CharField("Организация", max_length=200, blank=True)
    nomination = models.CharField("Номинация", max_length=200, blank=True)
    place = models.CharField("Место", max_length=50, blank=True)
    score = models.CharField("Баллы", max_length=50, blank=True)
    date = models.DateField("Дата", null=True, blank=True)
    projects = models.ManyToManyField("projects.Project", verbose_name="Связанные проекты", blank=True)
    description = models.TextField("Описание", blank=True, null=True)

    class Meta:
        verbose_name = "Награда"
        verbose_name_plural = "Награды"
        ordering = ["-date", "title"]

    def __str__(self):
        return self.title
