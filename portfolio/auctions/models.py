from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Listing(models.Model):
    active = models.BooleanField(default=True)
    title = models.CharField(max_length=64)
    description = models.TextField()
    start_bid = models.DecimalField(max_digits=8, decimal_places=2)
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings')
    image = models.URLField(null=True, blank=True)
    category_choices = [
        ('Electronics', 'Electronics'),
        ('Fashion', 'Fashion'),
        ('Health', 'Health'),
        ('Hobby', 'Hobby'),
        ('Sports', 'Sports'),
        ('Pets', 'Pets')
    ]
    category = models.CharField(max_length=11, choices=category_choices, null=True, blank=True)
    time_created = models.DateTimeField(auto_now = True)

    def __str__(self):
        return f"{self.id}, {self.title}, listed by {self.seller}"

class Bid(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='bids')
    bidder = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bids')
    bid = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return f"${self.bid} by {self.bidder} on item {self.listing}"

class Comment(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    comment = models.TextField()
    time_created = models.DateTimeField(auto_now = True)

    def __str__(self):
        return f"comment by {self.user} on item {self.listing}"

class Watchlist(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='watchlist')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watchlist')

    def __str__(self):
        return f"{self.user} watches {self.listing}"