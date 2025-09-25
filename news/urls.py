from django.urls import path
from .views import NewsListAPIView, NewsDetailAPIView, CategoryListAPIView

urlpatterns = [
    path("list/", NewsListAPIView.as_view(), name="news-list"),
    path("detail/<int:pk>/", NewsDetailAPIView.as_view(), name="news-detail"),
    path("category/", CategoryListAPIView.as_view(), name="category-list"),
]
