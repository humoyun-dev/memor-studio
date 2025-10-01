from modeltranslation.translator import register, TranslationOptions
from .models import StudioPage, Section, Video


@register(StudioPage)
class StudioPageTranslationOptions(TranslationOptions):
    fields = ('content',)


@register(Section)
class SectionTranslationOptions(TranslationOptions):
    fields = ('title', 'body')


@register(Video)
class VideoTranslationOptions(TranslationOptions):
    fields = ('title',)
