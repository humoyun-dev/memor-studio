from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PartnersViewSet

router = DefaultRouter()
router.register("", PartnersViewSet, basename="partners")

urlpatterns = [
    path("", include(router.urls)),
]
