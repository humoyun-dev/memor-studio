from django.urls import path
from .views import ProjectListAPIView, ProjectDetailAPIView, CategoryListAPIView

urlpatterns = [
    path("list/", ProjectListAPIView.as_view(), name="project-list"),
    path("category/", CategoryListAPIView.as_view(), name="category-list"),
    path("detail/<int:pk>/", ProjectDetailAPIView.as_view(), name="project-detail"),
]
