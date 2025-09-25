from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import CompanyInfo, Statistic, Leader
from .serializers import AboutPageSerializer, CompanyInfoSerializer, LeaderSerializer


@api_view(['GET'])
def about_page_data(request):
    """
    About page uchun barcha ma'lumotlarni qaytaradi
    """
    try:
        # Eng yangi company info ni olish
        company_info = CompanyInfo.objects.first()
        if company_info:
            # Statistikalar
            statistics = Statistic.objects.all()[:3]  # 3 ta statistika
            company_info.statistics = statistics

        # Faol rahbarlarni olish
        leaders = Leader.objects.filter(is_active=True)

        # Ma'lumotlarni tayyorlash
        data = {
            'company_info': {
                'title': company_info.title if company_info else "",
                'subtitle': company_info.subtitle if company_info else "",
                'description': company_info.description if company_info else "",
                'statistics': [
                    {
                        'title': stat.title,
                        'value': stat.value,
                        'description': stat.description
                    }
                    for stat in statistics
                ] if statistics else []
            },
            'leaders': [
                {
                    'id': leader.id,
                    'name': leader.name,
                    'title': leader.title,
                    'bio': leader.bio,
                    'image': request.build_absolute_uri(leader.image.url) if leader.image else None
                }
                for leader in leaders
            ]
        }

        return Response(data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )