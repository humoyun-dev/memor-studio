
from modeltranslation.translator import register, TranslationOptions
from .models import TeamMember

@register(TeamMember)
class TeamMemberTranslation(TranslationOptions):
    fields = ('name', 'role', 'bio', "slug")