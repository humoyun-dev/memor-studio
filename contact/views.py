from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings

from .serializers import ContactMessageSerializer
import logging

logger = logging.getLogger(__name__)


class ContactMessageView(APIView):
    """
    Handle contact form submissions
    """

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)

        if serializer.is_valid():
            # Save to database
            contact_message = serializer.save()

            # Get client IP address
            ip_address = self.get_client_ip(request)
            contact_message.ip_address = ip_address
            contact_message.save()

            # # Send email notifications
            # try:
            #     self.send_notification_emails(contact_message)
            #     self.send_confirmation_email(contact_message)
            # except Exception as e:
            #     logger.error(f"Failed to send emails: {str(e)}")
            #     # Don't fail the request if email fails

            return Response(
                {'message': 'Message sent successfully'},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_client_ip(self, request):
        """Get client IP address from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def send_notification_emails(self, contact_message):
        """Send notification to admin/team"""
        admin_email = getattr(settings, 'CONTACT_NOTIFICATION_EMAIL', settings.DEFAULT_FROM_EMAIL)

        subject = f"New Contact Message: {contact_message.subject or 'No Subject'}"
        message = f"""
        New contact message received:

        Name: {contact_message.name}
        Email: {contact_message.email}
        Subject: {contact_message.subject or 'No Subject'}

        Message:
        {contact_message.message}

        Sent from IP: {contact_message.ip_address}
        Sent at: {contact_message.created_at.strftime('%Y-%m-%d %H:%M:%S')}
        """

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[admin_email],
            fail_silently=False,
        )

    def send_confirmation_email(self, contact_message):
        """Send confirmation to the sender"""
        subject = "Thank you for contacting us"
        message = f"""
        Dear {contact_message.name},

        Thank you for reaching out to us. We have received your message and 
        will get back to you as soon as possible.

        Your message details:
        Subject: {contact_message.subject or 'No Subject'}
        Message: {contact_message.message[:100]}{'...' if len(contact_message.message) > 100 else ''}

        Best regards,
        The Team
        """

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[contact_message.email],
            fail_silently=True,
        )


class ContactInfoView(APIView):
    """
    Provide contact information (optional endpoint)
    """

    def get(self, request):
        contact_info = {
            'company': 'Killa Design',
            'address': {
                'street': '3103 Burj Al Salam Office Tower, Trade Centre One',
                'city': 'Dubai',
                'country': 'UAE',
                'po_box': 'P.O. Box 26642'
            },
            'phone': '+971 4 355 4447',
            'emails': {
                'general': 'info@killadesign.com',
                'projects': 'bids@killadesign.com',
                'marketing': 'marketing@killadesign.com'
            }
        }
        return Response(contact_info)
