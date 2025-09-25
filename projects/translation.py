from modeltranslation.translator import register, TranslationOptions
from .models import Project, Category, ProjectVideo

@register(Category)
class CategoryTranslationOptions(TranslationOptions):
    fields = ('name',)


@register(Project)
class ProjectTranslationOptions(TranslationOptions):
    fields = ('title', 'body', 'features', 'client', 'location', 'type', 'status')


@register(ProjectVideo)
class ProjectVideoTranslationOptions(TranslationOptions):
    fields = ('title',)