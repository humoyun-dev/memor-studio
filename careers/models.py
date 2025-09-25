from django.db import models
from django.core.validators import FileExtensionValidator


class Job(models.Model):
    EMPLOYMENT_TYPE_CHOICES = [
        ('full_time', 'Full-time'),
        ('part_time', 'Part-time'),
        ('contract', 'Contract'),
        ('internship', 'Internship'),
        ('freelance', 'Freelance'),
    ]

    title = models.CharField(max_length=200)
    department = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE_CHOICES)
    description = models.TextField()
    requirements = models.TextField(help_text="Requirements separated by newlines")
    is_remote = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    posted_date = models.DateTimeField(auto_now_add=True)
    closing_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-posted_date']

    def __str__(self):
        return self.title

    @property
    def requirements_list(self):
        return [req.strip() for req in self.requirements.split('\n') if req.strip()]


class JobApplication(models.Model):
    job = models.ForeignKey(Job, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    position = models.CharField(max_length=200)
    experience = models.CharField(max_length=20)
    cover_letter = models.TextField(blank=True)
    resume = models.FileField(
        upload_to='careers/resumes/',
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx'])]
    )
    applied_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('reviewed', 'Reviewed'),
            ('interview', 'Interview Scheduled'),
            ('rejected', 'Rejected'),
            ('hired', 'Hired'),
        ],
        default='pending'
    )

    class Meta:
        ordering = ['-applied_date']

    def __str__(self):
        return f"{self.name} - {self.position}"