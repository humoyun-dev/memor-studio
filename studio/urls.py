from django.urls import path
from .views import StudioPageListView, StudioPageDetailView, StudioPageLatestView

urlpatterns = [
    path('', StudioPageListView.as_view(), name='studio-page-list'),
    path('<int:pk>/', StudioPageDetailView.as_view(), name='studio-page-detail'),
    path('detail/', StudioPageLatestView.as_view(), name='studio-page-latest'),
]
