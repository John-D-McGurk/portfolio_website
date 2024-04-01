# Generated by Django 5.0 on 2024-01-27 13:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_alter_project_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='link',
        ),
        migrations.AddField(
            model_name='project',
            name='github_link',
            field=models.URLField(default='https://github.com/John-D-McGurk', max_length=64),
        ),
        migrations.AddField(
            model_name='project',
            name='live_link',
            field=models.CharField(blank=True, max_length=64),
        ),
        migrations.AlterField(
            model_name='project',
            name='image',
            field=models.ImageField(upload_to='project_img'),
        ),
    ]