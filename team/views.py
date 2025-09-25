from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import TeamMember, TeamPageInfo
from .serializers import TeamPageDataSerializer


@api_view(['GET'])
def team_page_data(request):
    """
    Team page uchun barcha ma'lumotlarni qaytaradi
    """
    try:
        # Team page info
        team_info = TeamPageInfo.objects.first()
        if not team_info:
            team_info = TeamPageInfo.objects.create(
                title="Bizning Jamoa",
                subtitle="Har birimiz o'z sohasida ekspert bo'lgan professional mutaxassislardan iboratmiz"
            )

        # Faol jamoa a'zolarini olish
        team_members = TeamMember.objects.filter(is_active=True)

        # Ma'lumotlarni tayyorlash
        data = {
            'team_info': {
                'title': team_info.title,
                'subtitle': team_info.subtitle,
                'description': team_info.description
            },
            'team': [
                {
                    'id': member.id,
                    'name': member.name,
                    'title': member.title,
                    'image': request.build_absolute_uri(member.image.url) if member.image else None
                }
                for member in team_members
            ]
        }

        return Response(data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# Individual team member uchun view (agar kerak bo'lsa)
@api_view(['GET'])
def team_member_detail(request, member_id):
    """
    Individual team member detail
    """
    try:
        member = TeamMember.objects.get(id=member_id, is_active=True)
        data = {
            'id': member.id,
            'name': member.name,
            'title': member.title,
            'image': request.build_absolute_uri(member.image.url) if member.image else None
        }
        return Response(data, status=status.HTTP_200_OK)
    except TeamMember.DoesNotExist:
        return Response(
            {'error': 'Team member not found'},
            status=status.HTTP_404_NOT_FOUND
        )