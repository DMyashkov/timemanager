from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('tags', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, null=True)),
                ('date', models.BigIntegerField()),
                ('priority', models.IntegerField()),
                ('completed', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('activity', models.ForeignKey(blank=True, null=True, on_delete=models.deletion.SET_NULL, related_name='activity_tasks', to='tags.tag')),
                ('project', models.ForeignKey(blank=True, null=True, on_delete=models.deletion.SET_NULL, related_name='project_tasks', to='tags.tag')),
            ],
        ),
    ] 