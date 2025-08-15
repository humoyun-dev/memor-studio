from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


def health(_request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
                  path('admin/', admin.site.urls),
                  path("ckeditor5/", include("django_ckeditor_5.urls")),
                  path("health/", health),
                  path("api/", include("news.urls")),
                  path("api/", include("projects.urls")),
                  path("api/", include("partners.urls")),
                  path("api/", include("team.urls")),
                  path("api/", include("awards.urls")),
                  path("api/", include("vacancies.urls")),

                  path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
                  path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema")),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
