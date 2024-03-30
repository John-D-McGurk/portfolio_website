from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="auctions"),
    path('<int:id>/bid', views.bid, name='bid'),
    path('categories/<str:category>', views.categories, name='categories'),
    path('close_listing/<int:id>', views.close_listing, name='close_listing'),
    path('comment/<int:id>', views.comment, name='comment'),
    path('create_listing', views.create_listing, name='create_listing'),
    path('listings/<int:id>', views.listings, name='listings'),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path('search', views.search, name='search'),
    path('add_to_watchlist/<int:id>/<str:page>/<str:args>', views.add_to_watchlist, name='add_to_watchlist'),
    path('watchlist', views.watchlist, name='watchlist')
    
]
