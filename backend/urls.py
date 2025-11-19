"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from app_user.views import RegisterView
from app_user.views import CustomTokenObtainPairView
from app_user.views import LogoutView
from app_user.views import UserProfileView
from app_user.views import UserProfileStats, UserOrders, UserListingsView
from app_user.views import TopSellingCategories, SalesHistory, TargetUserCohorts, InventoryReport, UsageFrequency
from app_user.views import CurrentUser
from app_user.views import MeView
from app_user.views import ItemListCreateView, ItemRetrieveUpdateDestroyView, SeasonalWardrobeSuggestionsView
from app_user.views import MarketplaceListingsView, PurchaseSourceSummaryView, BrandPurchaseSummaryView, EcoFriendlyUserAnalyticsViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(
    r'api/analytics/eco-friendly-users', 
    EcoFriendlyUserAnalyticsViewSet, 
    basename='eco-friendly-users-analytics'
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # auth
    path('api/register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("api/auth/user/", CurrentUser.as_view(), name="current-user"),

    path('api/auth/me/', MeView.as_view(), name='me'),

    #user
    path('api/user/', UserProfileView.as_view(), name='user'),
    path('api/profile/stats/', UserProfileStats.as_view(), name='profile-stats'),
    path('api/profile/orders/', UserOrders.as_view(), name='profile-orders'),
    path('api/profile/listings/', UserListingsView.as_view(), name='profile-listings'),
    path('api/purchases/summary/source/', PurchaseSourceSummaryView.as_view(), name='purchase-source-summary'),
    path('api/purchases/summary/brand/', BrandPurchaseSummaryView.as_view(), name='purchase-brand-summary'),
    path('api/wardrobe/seasonal-suggestions/', SeasonalWardrobeSuggestionsView.as_view(), name='seasonal-suggestions'),

    # ADMIN ANALYTICS ENDPOINTS
    path('api/marketplace/top-categories/', TopSellingCategories.as_view(), name='top-categories'),
    path('api/marketplace/sales-history/', SalesHistory.as_view(), name='sales-history'),
    path('api/reports/user-cohorts/', TargetUserCohorts.as_view(), name='user-cohorts'),
    path('api/reports/inventory/', InventoryReport.as_view(), name='inventory-report'),
    path('api/usage/frequency/', UsageFrequency.as_view(), name='usage-frequency'),

    # items fetch and add
    path('api/items/', ItemListCreateView.as_view(), name='item-list-create'), 
    
    # 2. Wardrobe.js Fetch (using the same view, but often cleaner to specify a dedicated path for clarity)
    path('api/items/wardrobe/', ItemListCreateView.as_view(), name='item-wardrobe'), 
    
    # 3. Item Edit/Delete
    path('api/items/<int:item_id>/', ItemRetrieveUpdateDestroyView.as_view(), name='item-detail'),
    
    # 4. Listing creation (for Sell button in Wardrobe.js)
    path('api/listings/', UserListingsView.as_view(), name='listing-create'), 

    # marketplace
    path('api/listings/all/', MarketplaceListingsView.as_view(), name='marketplace-list'),
    #path('api/marketplace/all/', MarketplaceListingsView.as_view(), name='marketplace-list'),

] + router.urls