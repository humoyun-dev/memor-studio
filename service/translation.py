from modeltranslation.translator import register, TranslationOptions
from .models import Service


@register(Service)
class NewsTranslationOptions(TranslationOptions):
    fields = ("title", "description")
