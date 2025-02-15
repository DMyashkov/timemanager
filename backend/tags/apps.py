from django.apps import AppConfig
from django.core.exceptions import ObjectDoesNotExist
from django.core.management import call_command
from django.db.models.signals import post_migrate
from django.db.utils import OperationalError, ProgrammingError


class TagsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tags'
