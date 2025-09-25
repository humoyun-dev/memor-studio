from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Award, AwardsPageInfo
from .serializers import AwardsPageDataSerializer


@api_view(['GET'])
def awards_page_data(request):
    """
    Awards page uchun barcha ma'lumotlarni qaytaradi
    """
    try:
        # Page info
        page_info = AwardsPageInfo.objects.first()
        if not page_info:
            page_info = AwardsPageInfo.objects.create(
                title="AWARDS",
                subtitle="Our global achievements and recognitions"
            )

        # Faol mukofotlarni olish
        awards = Award.objects.filter(is_active=True).order_by('-year', 'order')

        # Ma'lumotlarni tayyorlash
        data = {
            'title': page_info.title,
            'subtitle': page_info.subtitle,
            'hero_image': request.build_absolute_uri(page_info.hero_image.url) if page_info.hero_image else None,
            'awards': [
                {
                    'id': award.id,
                    'year': award.year,
                    'project': award.project,
                    'award': award.award,
                    'organization': award.organization,
                    'image': request.build_absolute_uri(award.image.url) if award.image else None
                }
                for award in awards
            ]
        }

        return Response(data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )