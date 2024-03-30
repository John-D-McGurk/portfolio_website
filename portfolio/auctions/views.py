from django import forms
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.db.models import Q

from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from .models import User, Listing, Bid, Comment, Watchlist
from .util import get_listing_info

def index(request):
    listing_ids = Listing.objects.filter(active=True).values_list('id', flat=True)
    
    user = User.objects.filter(username=request.user)
    if user:
        user = user.get()
    listings = [get_listing_info(listing_id, user, False) for listing_id in listing_ids]
    
    return render(request, "auctions/index.html", {
        'header': 'Active Listings', 'listings': listings, 'page': 'auctions', 'args': False
    })


def bid(request, id):
    if request.method == 'POST':
        bid_amount = float(request.POST.get('bid'))
        
        bids = Bid.objects.filter(listing=id)
        if bids:
            current_price = bids.latest('id').bid
        else:
            current_price = Listing.objects.get(id=id).start_bid
        user = User.objects.get(username=request.user)
        if bid_amount > current_price:
            listing = Listing.objects.get(id=id)
           
            new_bid = Bid.objects.create(listing=listing, bidder=user, bid=bid_amount)
            Bid.save(new_bid)
            return HttpResponseRedirect(reverse('listings', args=(id,)))
        else:
            listing = get_listing_info(id, user, True)
            return render(request, 'auctions/listing.html', {
                'listing': listing, 'message': 'New bid must be higher than current bid.', 'page': 'listings', 'args': id
            })
    else:
        return HttpResponseRedirect(reverse('listings', args=(id,)))
        
def comment(request, id):
    if request.method == 'POST':
        comment = request.POST.get('comment')
        listing = Listing.objects.get(id=id)
        user = User.objects.get(username=request.user)
        new_comment = Comment.objects.create(listing=listing, user=user, comment=comment)
        new_comment.save()
        return HttpResponseRedirect(reverse('listings', args=(id,)))
    else:
        return HttpResponseRedirect(reverse('listings', args=(id,)))
                                    
def categories(request, category):
    if category == 'index':
        categories = Listing.category_choices
        return render(request, 'auctions/category_index.html', {
            'categories': categories
        })
    else:
        user = User.objects.get(username=request.user)
        listing_ids = Listing.objects.filter(category=category).values_list('id', flat=True)
        listings = [get_listing_info(listing_id, user, False) for listing_id in listing_ids]

        return render(request, "auctions/index.html", {
            'header': category, 'listings': listings, 'page': 'categories', 'args': category
        })
    
def close_listing(request, id):
    listing = Listing.objects.get(id=id)
    if listing.seller == request.user:
        listing.active = False
        Listing.save(listing)
    return HttpResponseRedirect(reverse('listings', args=(id,)))

class ListingCreationForm(forms.ModelForm):
    class Meta:
        model = Listing
        fields = [
            'title',
            'description',
            'start_bid',
            'image',
            'category'
        ]
        widgets = {
            'title': forms.TextInput(attrs={
                'class': "form-control",
                'style': 'max-width: 300px;',
                'placeholder': 'Title'
                }),
            'description': forms.Textarea(attrs={
                'class': "form-control",
                'size':3,
                'style': 'max-width: 300px;',
                'placeholder': 'Description'
                }),
            'start_bid': forms.NumberInput(attrs={
                'class': "form-control",
                'style': 'max-width: 300px;',
                'placeholder': 'Start bid'
                }),
            'image': forms.URLInput(attrs={
                'class': "form-control",
                'style': 'max-width: 300px;',
                'placeholder': 'Image URL'
                }),
            'category': forms.Select(attrs={
                'class': "form-control",
                'style': 'max-width: 300px;',
                })
        }

def create_listing(request):
    if request.method == 'POST':
        form = ListingCreationForm(request.POST)
        if form.is_valid():
            data = form.save(commit=False)
            data.seller = request.user
            if not data.image:
                data.image = 'https://epiphanychi.com/wp-content/uploads/2021/07/1200px-No_image_3x4.svg.png'
            data.save()            
            return HttpResponseRedirect(reverse('listings', args=(data.pk,)))
    else:
        form = ListingCreationForm
        return render(request, 'auctions/create_listing.html', {
            'form': form
        })

def listings(request, id):
   
    if Listing.objects.filter(id=id).exists(): 
        
        user = User.objects.filter(username=request.user)
        if user:
            user = user.get()
        listing = get_listing_info(id, user, True)
        return render(request, 'auctions/listing.html', {
                    'listing': listing, 'page': 'listings', 'args': id
                })

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("auctions"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("auctions"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("auctions"))
    else:
        return render(request, "auctions/register.html")

def search(request):
    search_request = request.GET.get('q', None)
    user = User.objects.get(username=request.user)
    listings = Listing.objects.all()
    if search_request:
        listing_ids = listings.filter(
            Q(title__icontains=search_request)|
            Q(description__icontains=search_request)
        ).values_list('id', flat=True)

        listings = [get_listing_info(listing_id, user, False) for listing_id in listing_ids]

    return render(request, "auctions/index.html", {
        'header': f'Search results: {search_request}', 'listings': listings, 'page': 'search', 'args': request.GET.urlencode()
    })

def add_to_watchlist(request, id, page, args):
    user = User.objects.get(username=request.user)
    listing = Listing.objects.get(id=id)
    current_watchlist_value = Watchlist.objects.filter(listing=listing, user=user)
    if current_watchlist_value:
        current_watchlist_value.delete()
    else:
        new_watchlist = Watchlist.objects.create(listing=listing, user=user)
        Watchlist.save(new_watchlist)
    redirect_args = (args,) if args != 'False' else ()
    if page == 'search':
        print('search route')
        return HttpResponseRedirect(reverse(page) + '?' + args)

    return HttpResponseRedirect(reverse(page, args=redirect_args))

def watchlist(request):
    user = User.objects.get(username=request.user)
    listing_ids = Watchlist.objects.filter(user=user).values_list('listing', flat=True)

    listings = [get_listing_info(listing_id, user, False) for listing_id in listing_ids]

    return render(request, "auctions/index.html", {
        'header': 'Watchlist', 'listings': listings, 'page': 'watchlist', 'args': False
    })
