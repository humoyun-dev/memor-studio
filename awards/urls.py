from django.urls import path
from . import views

urlpatterns = [
    path('', views.awards_page_data, name='awards_page_data'),
]