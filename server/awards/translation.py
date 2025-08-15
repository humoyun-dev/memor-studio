from modeltranslation.translator import register, TranslationOptions
from .models import Award

@register(Award)
class AwardTranslation(TranslationOptions):
    fields = ('title', 'organization', 'nomination', 'place', 'score', 'description')