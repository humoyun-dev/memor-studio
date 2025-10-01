from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters
from django.core.mail import send_mail
from django.conf import settings
from .models import Job, JobApplication
from .serializers import JobSerializer, JobApplicationSerializer


class JobFilter(filters.FilterSet):
    department = filters.CharFilter(field_name='department', lookup_expr='icontains')
    location = filters.CharFilter(field_name='location', lookup_expr='icontains')
    employment_type = filters.ChoiceFilter(choices=Job.EMPLOYMENT_TYPE_CHOICES)
    is_remote = filters.BooleanFilter()

    class Meta:
        model = Job
        fields = ['department', 'location', 'employment_type', 'is_remote']


class JobListView(generics.ListAPIView):
    """List all published jobs with filtering options"""
    queryset = Job.objects.filter(is_published=True)
    serializer_class = JobSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = JobFilter


class JobApplicationCreateView(generics.CreateAPIView):
    """Submit a job application"""
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    parser_classes = (MultiPartParser, FormParser)


class GeneralInquiryView(generics.CreateAPIView):
    """Submit a general career inquiry"""

    def create(self, request, *args, **kwargs):
        name = request.data.get('name')
        email = request.data.get('email')
        phone = request.data.get('phone', '')
        message = request.data.get('message', '')

        if not name or not email:
            return Response(
                {'error': 'Name and email are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Send email to HR
        try:
            admin_email = getattr(settings, 'HR_NOTIFICATION_EMAIL', settings.DEFAULT_FROM_EMAIL)
            send_mail(
                subject=f'General Career Inquiry from {name}',
                message=f'''
                A general career inquiry has been received:

                Name: {name}
                Email: {email}
                Phone: {phone}

                Message:
                {message}
                ''',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[admin_email],
                fail_silently=False,
            )

            # Send confirmation to inquirer
            send_mail(
                subject='Thank you for your inquiry',
                message=f'''
                Dear {name},

                Thank you for your interest in our company. We have received your inquiry
                and will get back to you as soon as possible.

                Best regards,
                HR Team
                ''',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=True,
            )

            return Response(
                {'message': 'Inquiry submitted successfully'},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {'error': 'Failed to process inquiry'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )