from django.contrib import admin
from .models import Award, AwardsPageInfo


@admin.register(AwardsPageInfo)
class AwardsPageInfoAdmin(admin.ModelAdmin):
    list_display = ['title', 'created_at', 'updated_at']
    fieldsets = (
        ('Asosiy Ma\'lumot', {
            'fields': ('title', 'subtitle', 'description', 'hero_image')
        }),
        ('Vaqt', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Award)
class AwardAdmin(admin.ModelAdmin):
    list_display = ['year', 'project', 'award', 'organization', 'is_active', 'order', 'created_at']
    list_filter = ['year', 'organization', 'is_active', 'created_at']
    list_editable = ['order', 'is_active']
    search_fields = ['project', 'award', 'organization']
    ordering = ['-year', 'order']

    fieldsets = (
        ('Asosiy Ma\'lumot', {
            'fields': ('year', 'project', 'award', 'organization')
        }),
        ('Media', {
            'fields': ('image',)
        }),
        ('Sozlamalar', {
            'fields': ('order', 'is_active')
        }),
    )