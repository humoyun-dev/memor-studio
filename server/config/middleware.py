from django.conf import settings
from django.utils import translation

class QueryLocaleMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        lang = request.GET.get("lang")
        if lang and lang in dict(getattr(settings, "LANGUAGES", ())):
            translation.activate(lang)
            request.LANGUAGE_CODE = lang
        response = self.get_response(request)
        translation.deactivate()
        return response