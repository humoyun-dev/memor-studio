from django.urls import path
from .views import CarouselListView, BannersVideoListView

urlpatterns = [
    path("carousel/", CarouselListView.as_view(), name="carousel-list"),
    path("video-banners/", BannersVideoListView.as_view(), name="bannersvideo-list"),

]
