# Generated by Django 5.0 on 2024-01-05 12:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0008_comment_time_created_listing_time_created_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listing',
            name='category',
            field=models.CharField(blank=True, choices=[('Electronics', 'Electronics'), ('Fashion', 'Fashion'), ('Health', 'Health'), ('Hobby', 'Hobby'), ('Sports', 'Sports'), ('Pets', 'Pets')], max_length=11, null=True),
        ),
    ]