from rest_framework.routers import DefaultRouter
from .views import AwardViewSet

router = DefaultRouter()
router.register(r"awards", AwardViewSet, basename="award")
urlpatterns = router.urls