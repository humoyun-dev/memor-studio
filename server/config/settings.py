from pathlib import Path
import environ
import os
from corsheaders.defaults import default_headers, default_methods

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    DEBUG=(bool, False),
)
environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("SECRET_KEY")
DEBUG = env("DEBUG")
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[])

INSTALLED_APPS = [
    'modeltranslation',
    'corsheaders',
    "unfold",
    "unfold.contrib.filters",
    "unfold.contrib.forms",
    "unfold.contrib.inlines",
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # library
    'rest_framework',
    "django_ckeditor_5",
    "drf_spectacular",
    # apps
    'news',
    'projects',
    'partners',
    'mediafiles',
    'team',
    'awards',
    'contact',
    'vacancies'
]

REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "PAGE_SIZE": 10,
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'config.middleware.QueryLocaleMiddleware',
]

ROOT_URLCONF = 'config.urls'

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB'),
        'USER': os.getenv('POSTGRES_USER'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD'),
        'HOST': os.getenv('POSTGRES_HOST', 'postgres'),
        'PORT': os.getenv('POSTGRES_PORT', '5432'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = env("LANGUAGE_CODE", default="ru")
TIME_ZONE = env("TIME_ZONE", default="Asia/Tashkent")
USE_I18N = True
USE_TZ = True

MODELTRANSLATION_DEFAULT_LANGUAGE = env("MODELTRANSLATION_DEFAULT_LANGUAGE", default="uz")

CORS_URLS_REGEX = r"^/api/.*$"
CORS_ALLOW_ALL_ORIGINS = env.bool("CORS_ALLOW_ALL_ORIGINS", default=False)
CORS_ALLOWED_ORIGINS   = env.list("CORS_ALLOWED_ORIGINS", default=[])
CORS_ALLOW_CREDENTIALS = env.bool("CORS_ALLOW_CREDENTIALS", default=False)

CORS_ALLOW_HEADERS = list(default_headers) + ["accept-language"]
CORS_ALLOW_METHODS = list(default_methods)


LANGUAGES = (
    ('uz', 'Uzbek'),
    ('ru', 'Russian'),
    ('en', 'English'),
)
MODELTRANSLATION_LANGUAGES = ('uz', 'ru', 'en')

CKEDITOR_5_CONFIGS = {
    "default": {
        "language": "ru",
        "toolbar": ["bold", "italic", "link", "bulletedList", "numberedList", "blockQuote"]
    }
}

UNFOLD = {
    "THEME": "light",
}

MEDIA_URL = "media/"
MEDIA_ROOT = env("MEDIA_ROOT", default=str(BASE_DIR / "media"))

STATIC_URL = "static/"
STATIC_ROOT = env("STATIC_ROOT", default=str(BASE_DIR / "staticfiles"))


CKEDITOR_UPLOAD_PATH = "uploads/"

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
