from django.contrib import admin
from modeltranslation.admin import TranslationAdmin
from .models import TeamMember, TeamPageInfo


@admin.register(TeamPageInfo)
class TeamPageInfoAdmin(TranslationAdmin):  # ✅ i18n qo‘shildi
    list_display = ['title', 'created_at', 'updated_at']
    fieldsets = (
        ('Asosiy Ma\'lumot', {
            'fields': ('title', 'subtitle', 'description')
        }),
        ('Vaqt', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ['created_at', 'updated_at']


@admin.register(TeamMember)
class TeamMemberAdmin(TranslationAdmin):  # ✅ i18n qo‘shildi
    list_display = ['name', 'title', 'order', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at', 'title']
    list_editable = ['order', 'is_active']
    search_fields = ['name', 'title']
    fieldsets = (
        ('Asosiy Ma\'lumot', {
            'fields': ('name', 'title', 'image')
        }),
        ('Sozlamalar', {
            'fields': ('order', 'is_active')
        }),
    )
