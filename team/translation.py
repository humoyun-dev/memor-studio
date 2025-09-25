from modeltranslation.translator import register, TranslationOptions
from .models import TeamMember, TeamPageInfo


@register(TeamMember)
class TeamMemberTranslationOptions(TranslationOptions):
    fields = ("name", "title",)


@register(TeamPageInfo)
class TeamPageInfoTranslationOptions(TranslationOptions):
    fields = ("title", "subtitle", "description",)
