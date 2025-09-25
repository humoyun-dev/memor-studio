from modeltranslation.translator import translator, TranslationOptions
from .models import Job

class JobTranslationOptions(TranslationOptions):
    fields = ('title', 'department', 'location', 'description', 'requirements')

translator.register(Job, JobTranslationOptions)