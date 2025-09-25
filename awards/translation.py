
from modeltranslation.translator import translator, TranslationOptions
from .models import AwardsPageInfo, Award

class AwardsPageInfoTranslationOptions(TranslationOptions):
    fields = ('title', 'subtitle', 'description')

class AwardTranslationOptions(TranslationOptions):
    fields = ('project', 'award', 'organization')

translator.register(AwardsPageInfo, AwardsPageInfoTranslationOptions)
translator.register(Award, AwardTranslationOptions)
