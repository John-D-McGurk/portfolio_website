# Generated by Django 5.0 on 2024-01-01 16:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0007_alter_listing_category_alter_listing_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='time_created',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='listing',
            name='time_created',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='comment',
            name='comment',
            field=models.TextField(),
        ),
    ]
