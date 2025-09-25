from django.contrib import admin
from modeltranslation.admin import TranslationAdmin
from .models import CompanyInfo, Statistic, Leader


@admin.register(CompanyInfo)
class CompanyInfoAdmin(TranslationAdmin):
    list_display = ['title', 'created_at', 'updated_at']
    list_filter = ['created_at', 'updated_at']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Statistic)
class StatisticAdmin(TranslationAdmin):
    list_display = ['title', 'value', 'description', 'order']
    list_editable = ['order']


@admin.register(Leader)
class LeaderAdmin(TranslationAdmin):
    list_display = ['name', 'title', 'order', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    list_editable = ['order', 'is_active']
    search_fields = ['name', 'title']
