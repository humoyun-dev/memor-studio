from modeltranslation.translator import register, TranslationOptions
from .models import Vacancy

@register(Vacancy)
class VacancyTranslation(TranslationOptions):
    fields = ('title', 'department', 'location', 'description',"slug")