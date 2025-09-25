# from django.contrib import admin
# from .models import ServiceCategory, Service
#
# @admin.register(ServiceCategory)
# class ServiceCategoryAdmin(admin.ModelAdmin):
#     list_display = ['name', 'slug', 'order', 'is_active', 'created_at']
#     list_filter = ['is_active', 'created_at']
#     list_editable = ['order', 'is_active']
#     prepopulated_fields = {'slug': ('name',)}  # Slug avtomatik to'ldirish
#     search_fields = ['name']
#     ordering = ['order']
#
# @admin.register(Service)
# class ServiceAdmin(admin.ModelAdmin):
#     list_display = ['name', 'category', 'order', 'is_active', 'created_at']
#     list_filter = ['category', 'is_active', 'created_at']
#     list_editable = ['order', 'is_active']
#     prepopulated_fields = {'slug': ('name',)}  # Slug avtomatik to'ldirish
#     search_fields = ['name', 'category__name']
#     ordering = ['category__order', 'order']