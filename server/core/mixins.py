from typing import Iterable
from django.conf import settings
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import translation
from django.utils.cache import patch_vary_headers

def lang_codes() -> list[str]:
    return [code for code, _ in getattr(settings, "LANGUAGES", ())]

class I18NMixin:
    lang_query_param = "lang"

    def initial(self, request, *args, **kwargs):
        lang = request.query_params.get(self.lang_query_param)
        if lang in dict(getattr(settings, "LANGUAGES", ())):
            translation.activate(lang)
            request.LANGUAGE_CODE = lang
        return super().initial(request, *args, **kwargs)

    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        patch_vary_headers(response, ["Accept-Language"])
        response["Content-Language"] = translation.get_language() or settings.LANGUAGE_CODE
        translation.deactivate()
        return response


class TranslatedSlugLookupMixin:
    translated_slug_field = "slug"

    def get_object(self):
        value = self.kwargs.get(getattr(self, "lookup_field", "slug"))
        qs = self.get_queryset()
        q = Q(**{self.translated_slug_field: value})
        for code in lang_codes():
            q |= Q(**{f"{self.translated_slug_field}_{code}": value})
        return get_object_or_404(qs, q)


class DeferTranslatedBodiesMixin:
    body_field_name = "body"

    def get_queryset(self):
        qs = super().get_queryset()
        if getattr(self, "action", None) == "list":
            qs = qs.defer(*[f"{self.body_field_name}_{c}" for c in lang_codes()])
        return qs