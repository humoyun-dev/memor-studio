from rest_framework import generics
from .models import Carousel, BannersVideo
from .serializers import CarouselSerializer, BannersVideoSerializer


class CarouselListView(generics.ListAPIView):
    queryset = Carousel.objects.all()
    serializer_class = CarouselSerializer



class BannersVideoListView(generics.ListAPIView):
    queryset = BannersVideo.objects.all()
    serializer_class = BannersVideoSerializer

