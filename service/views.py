from django.db import models
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import ServiceCategory, Service
from .serializers import ServiceSerializer


@api_view(['GET'])
def service_detail(request, category_slug, service_slug):
    """
    Xizmat boshqaruv sahifasi
    """
    try:
        # Kategoriya va xizmatni olish
        category = ServiceCategory.objects.get(slug=category_slug, is_active=True)
        service = Service.objects.get(
            slug=service_slug,
            category=category,
            is_active=True
        )

        serializer = ServiceSerializer(service)

        return Response(serializer.data, status=status.HTTP_200_OK)

    except ServiceCategory.DoesNotExist:
        return Response(
            {'error': 'Kategoriya topilmadi'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Service.DoesNotExist:
        return Response(
            {'error': 'Xizmat topilmadi'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# views.py

@api_view(['GET'])
def menu_services(request):
    """
    Menyu uchun barcha faol xizmat kategoriyalari va ularning xizmatlarini qaytaradi.
    """
    try:
        # Faol kategoriyalarni olish, ularning faol xizmatlari bilan
        categories = ServiceCategory.objects.filter(is_active=True).prefetch_related(
            models.Prefetch(
                'services',
                queryset=Service.objects.filter(is_active=True).order_by('order')
            )
        ).order_by('order')

        # Ma'lumotlarni formatlash
        menu_data = []
        for category in categories:
            services = [
                {
                    'label': service.name,
                    'href': f"/services/{category.slug}/{service.slug}",
                }
                for service in category.services.all()
            ]

            if services:
                menu_data.append({
                    'label': category.name,
                    'href': f"/services/#{category.slug}",
                    'children': services
                })

        return Response(menu_data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def site_config(request):
    services = ServiceCategory.objects.filter(is_active=True).prefetch_related('services')

    service_menu = []
    for category in services:
        children = [
            {
                "label": service.name,
                "href": f"/services/{category.slug}/{service.slug}"
            }
            for service in category.services.filter(is_active=True)
        ]
        if children:
            service_menu.append({
                "label": category.name,
                "href": f"/services/#{category.slug}",
                "children": children
            })

    menu = [
        {
            "label": "STUDIO",
            "href": "/studio",
            "children": [
                { "label": "ABOUT", "href": "/about" },
                { "label": "OUR TEAM", "href": "/team" },
                {
                    "label": "SERVICES",
                    "href": "/services",
                    "children": service_menu  # Bu yerda dinamik servicelar
                },
                { "label": "AWARDS", "href": "/awards" },
            ],
        },
        { "label": "PROJECTS", "href": "/projects" },
        { "label": "NEWS", "href": "/news" },
        { "label": "CAREERS", "href": "/careers" },
        { "label": "CONTACT", "href": "/contact" },
    ]

    return Response({
        "menu": menu,
        "footer": {
            # Footer ma'lumotlari ham dinamik bo'lsa, shu yerda qo'shiladi
            # Hozircha statik qoldiryapmiz
        }
    })