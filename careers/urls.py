from django.urls import path
from . import views

urlpatterns = [
    path('jobs/', views.JobListView.as_view(), name='job-list'),
    path('apply/', views.JobApplicationCreateView.as_view(), name='job-application'),
    path('inquiry/', views.GeneralInquiryView.as_view(), name='general-inquiry'),
]