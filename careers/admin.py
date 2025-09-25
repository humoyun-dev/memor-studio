from django.contrib import admin
from modeltranslation.admin import TranslationAdmin
from .models import Job, JobApplication

@admin.register(Job)
class JobAdmin(TranslationAdmin):
    list_display = [
        'title', 'department', 'location', 'employment_type',
        'is_remote', 'is_published', 'posted_date', 'closing_date'
    ]
    list_filter = [
        'employment_type', 'is_remote', 'is_published',
        'department', 'location', 'posted_date'
    ]
    search_fields = ['title', 'department', 'location', 'description', 'requirements']
    readonly_fields = ['posted_date']
    ordering = ['-posted_date']


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'email', 'phone', 'position', 'job', 'status', 'applied_date'
    ]
    list_filter = ['status', 'job', 'applied_date']
    search_fields = ['name', 'email', 'phone', 'position', 'cover_letter']
    readonly_fields = ['applied_date']
    ordering = ['-applied_date']
