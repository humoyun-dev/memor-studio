
from django.urls import path
from . import views

urlpatterns = [
    path('', views.ContactMessageView.as_view(), name='contact-message'),
]