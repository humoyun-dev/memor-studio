# views.py
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters
from .models import News, Category
from .serializers import NewsListSerializer, NewsDetailSerializer, CategorySerializer


class NewsFilter(filters.FilterSet):
    category = filters.CharFilter(field_name='categories__name', lookup_expr='icontains')

    class Meta:
        model = News
        fields = ['category']


class NewsListAPIView(generics.ListAPIView):
    """List all published news with optional category filtering"""
    queryset = News.objects.filter(is_published=True).order_by("-created_at")
    serializer_class = NewsListSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = NewsFilter


class NewsDetailAPIView(generics.RetrieveAPIView):
    """Retrieve a single news article by ID"""
    queryset = News.objects.filter(is_published=True)
    serializer_class = NewsDetailSerializer


class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer