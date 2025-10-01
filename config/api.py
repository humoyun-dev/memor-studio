from django.urls import path, include

urlpatterns = [
    path("banners/", include("banners.urls")),
    path("projects/", include("projects.urls")),
    path("news/", include("news.urls")),
    path("careers/", include("careers.urls")),
    path("contact/", include("contact.urls")),
    path("info/", include("info.urls")),
    path("team/", include("team.urls")),
    path("awards/", include("awards.urls")),
    path("service/", include("service.urls")),
    path("studio/", include("studio.urls")),
    path("partners/", include("partners.urls")),
]
