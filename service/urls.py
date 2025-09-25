
from django.urls import path
from . import views

urlpatterns = [
    path('<str:category_slug>/<str:service_slug>/',
         views.service_detail, name='service_detail'),
    path('menu/', views.menu_services, name='menu_services'),
    path('site-config/', views.site_config, name='site_config'),
]