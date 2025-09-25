from modeltranslation.translator import register, TranslationOptions
from .models import CompanyInfo, Statistic, Leader

@register(CompanyInfo)
class CompanyInfoTranslationOptions(TranslationOptions):
    fields = ('title', 'subtitle', 'description',)


@register(Statistic)
class StatisticTranslationOptions(TranslationOptions):
    fields = ('title', 'description',)


@register(Leader)
class LeaderTranslationOptions(TranslationOptions):
    fields = ('name', 'title', 'bio',)
