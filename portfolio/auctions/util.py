from django.forms.models import model_to_dict
import math
from .models import User, Listing, Bid, Comment, Watchlist

def get_listing_info(listing_id, user, get_comments=True):
        listing_object = Listing.objects.get(pk=listing_id)
        listing = model_to_dict(listing_object)
        if user:
            watchlist = Watchlist.objects.filter(listing=listing_object.id, user=user.id)
            listing['watchlist'] = True if watchlist else False
        
        bids = listing_object.bids.all()

        if get_comments:
            comments = listing_object.comments.all().values('user_id', 'comment')
            for comment in comments:
                 comment['username'] = User.objects.get(pk=comment['user_id']).username
            listing['comments'] = comments
        
        if bids:
            bid_info = bids.latest('id')
            bid_amount = bid_info.bid
            listing['bidder'] = bid_info.bidder
        else:
            bid_amount = listing['start_bid']

        listing['bid'] = bid_amount
        listing['bid_dollars'] = int(math.floor(bid_amount))
        listing['bid_cents'] = int(bid_amount % 1 * 100)

        listing['price'] = bid_amount 
        listing['num_bids']= len(bids)
        listing['seller'] = User.objects.get(id=listing['seller']).username
   
        
        return listing