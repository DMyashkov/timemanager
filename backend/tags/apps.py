from django.apps import AppConfig


class TagsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tags'

    def ready(self):
        import tags.signals  # Import signals to enable them
        self.ensure_root_activity()

    def ensure_root_activity(self):
        from tags.models import Tag
        if not Tag.objects.filter(parent=None, type=Tag.TagType.ACTIVITY).exists():
            Tag.objects.create(
                title="#ROOT#",
                description="",
                type=Tag.TagType.ACTIVITY,
                color_preset="green",
                productive=True,
                lap_name="Lap",
            )
