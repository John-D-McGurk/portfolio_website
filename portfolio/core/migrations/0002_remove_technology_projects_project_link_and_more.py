# Generated by Django 5.0 on 2024-01-27 10:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='technology',
            name='projects',
        ),
        migrations.AddField(
            model_name='project',
            name='link',
            field=models.CharField(default='oops', max_length=64),
        ),
        migrations.AlterField(
            model_name='project',
            name='technologies',
            field=models.ManyToManyField(related_name='projects', to='core.technology'),
        ),
    ]
