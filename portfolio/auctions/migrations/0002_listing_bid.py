# Generated by Django 5.0 on 2023-12-31 12:00

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Listing',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=64)),
                ('description', models.CharField(max_length=8000)),
                ('start_bid', models.DecimalField(decimal_places=2, max_digits=8)),
                ('image', models.URLField(blank=True, null=True)),
                ('category', models.CharField(blank=True, choices=[('Electronics', 'Electronics'), ('Fashion', 'Fashion'), ('Health', 'Health'), ('Hobby', 'Hobby'), ('Sports', 'Sports'), ('Pets', 'Pets')], max_length=11, null=True)),
                ('seller', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='listings', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Bid',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bid', models.DecimalField(decimal_places=2, max_digits=8)),
                ('bidder', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='highest_bids', to=settings.AUTH_USER_MODEL)),
                ('listing', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='current_bid', to='auctions.listing')),
            ],
        ),
    ]
