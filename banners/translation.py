from modeltranslation.translator import translator, TranslationOptions
from .models import Carousel, BannersVideo

class CarouselTranslationOptions(TranslationOptions):
    fields = ('title', 'body')

class BannersVideoTranslationOptions(TranslationOptions):
    fields = ('title',)

translator.register(Carousel, CarouselTranslationOptions)
translator.register(BannersVideo, BannersVideoTranslationOptions)