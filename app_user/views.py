from django.shortcuts import render
from rest_framework import generics
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer
from .serializers import AppUserSerializer
from .serializers import UserStatsSerializer, OrderSerializer, ListingSerializer, ItemSerializer
from .serializers import ItemSerializer, MarketplaceListingSerializer, PurchaseSerializer, EcoFriendlyUserSerializer
from .models import User, Purchase, AppUser, Brand
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework import generics, permissions
from rest_framework import status, viewsets
from .models import AppUser, Item, Purchase, Listing, Sale, VEcoFriendlyUser
from django.db.models import Avg, Count, Sum, F, Case, When, Value, CharField, IntegerField
from datetime import timedelta
from django.utils import timezone
from django.db.models.functions import TruncDay
from django.shortcuts import get_object_or_404
from django.db.models.functions import Coalesce, Cast
from django.db import connection
from datetime import date 

User = get_user_model()

def get_current_season():
    """Determines the current season based on the date (simplified for Northern Hemisphere)."""
    month = date.today().month
    if 3 <= month <= 5:
        return 'Spring'
    elif 6 <= month <= 8:
        return 'Summer'
    elif 9 <= month <= 11:
        return 'Fall'
    else: # 12, 1, 2
        return 'Winter'


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"message": "Logged out successfully"})
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        data = response.data
        access = data.get("access")
        refresh = data.get("refresh")

        # Set cookies for persistent login
        response.set_cookie(
            key='access_token',
            value=access,
            httponly=True,
            secure=False,  # set True if using HTTPS
            samesite='Lax'
        )
        response.set_cookie(
            key='refresh_token',
            value=refresh,
            httponly=True,
            secure=False,
            samesite='Lax'
        )

        return response

class UserProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AppUserSerializer

    def get_object(self):
        profile, created = AppUser.objects.get_or_create(user=self.request.user)
        return profile

class UserProfileStats(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_profile = AppUser.objects.get(user=request.user)

        # Total items
        total_items = Item.objects.filter(user=user_profile).count()

        # Items resold or donated
        items_resold = Item.objects.filter(user=user_profile, lifecycle__in=['Sold','Donated']).count()

        # Average cost per wear (from purchase)
        avg_cpw = Purchase.objects.filter(item__user=user_profile).aggregate(avg_price=Avg('price_cents'))['avg_price'] or 0
        avg_cpw = avg_cpw / 100  # cents → dollars

        stats = {
            "total_items": total_items,
            "items_resold": items_resold,
            "avg_cpw": avg_cpw
        }

        return Response(stats)


class UserOrders(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_profile = AppUser.objects.get(user=request.user)
        
        # Sale -> Listing -> Item, allowing access to item_name.
        orders = Sale.objects.filter(
            buyer_user=user_profile
        ).select_related(
            'listing__item' # Joins Sale to Listing, and Listing to Item
        ).order_by('-sold_on')[:10]
        
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

class UserListings(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_profile = AppUser.objects.get(user=request.user)
        
        listings = Listing.objects.filter(
            seller_user=user_profile
        ).select_related(
            'item' # Joins Listing to Item
        ).order_by('-listing_id')[:10]
        
        serializer = ListingSerializer(listings, many=True)
        return Response(serializer.data)

# check if user is admin or not
class CurrentUser(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "email": request.user.email,
            "username": request.user.username,
            "is_superuser": request.user.is_superuser
        })

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
            "date_joined": user.date_joined,
        })


# view 9
class TopSellingCategories(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):

        filter_value = request.GET.get('filter', '30days')
        days_map = {'7days': 7, '30days': 30, 'year': 365}
        days = days_map.get(filter_value, 30)

        since = timezone.now().date() - timedelta(days=days)

        data = (
            Sale.objects
            .filter(sold_on__gte=since)
            .values('listing__item__category__name')
            .annotate(total=Count('sale_id'))
            .order_by('-total')
        )

        results = [
            {
                "label": row['listing__item__category__name'],
                "value": row['total']
            }
            for row in data
        ]
        return Response(results)

# view 6
class SalesHistory(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        filter_value = request.GET.get('filter', '30days')
        days_map = {'7days': 7, '30days': 30, 'year': 365}
        days = days_map.get(filter_value, 30)

        since = timezone.now().date() - timedelta(days=days)

        # 1. Use TruncDay to group and annotate the results by date.
        # Although 'sold_on' is a DateField, using TruncDay ensures
        # the database performs the grouping correctly for the aggregation.
        data = (
            Sale.objects
            .filter(sold_on__gte=since)
            # Annotate with the truncated date, aliased as 'sale_date'
            .annotate(sale_date=TruncDay('sold_on')) 
            # Group by the new 'sale_date' alias
            .values('sale_date')
            # Sum the revenue
            .annotate(total_revenue_cents=Sum('sale_price_cents'))
            .order_by('sale_date')
        )

        # 2. Format the results for the frontend chart component
        results = [
            {
                # The 'sale_date' object will be a datetime object due to TruncDay, 
                # so we convert it to a date string.
                "date": row['sale_date'].strftime('%Y-%m-%d') if row['sale_date'] else None,
                "revenue": row['total_revenue_cents']
            }
            for row in data
        ]

        return Response(results)

# view 5
class TargetUserCohorts(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = AppUser.objects.all()
        results = []
        for u in users:
            # All items this user purchased from retail (Purchase table)
            retail_buys = Purchase.objects.filter(item__user=u).count()

            # All marketplace buys (Sale table)
            mp_buys = Sale.objects.filter(buyer_user=u).count()

            if retail_buys > 0 and mp_buys > 0:
                results.append({
                    "id": u.user_id,
                    "username": u.user.username,
                    "retailBuys": retail_buys,
                    "mpBuys": mp_buys,
                })

        return Response(results)

# view 2
class InventoryReport(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = AppUser.objects.all()  
        avg = Item.objects.filter(lifecycle='Active').count() / max(users.count(), 1)

        results = []

        for u in users:
            active_items = Item.objects.filter(user=u, lifecycle='Active').count()
            results.append({
                "id": u.user_id,
                "username": u.user.username,
                "activeItems": active_items,
                "avgComparison": active_items - avg
            })

        return Response(results)


class UsageFrequency(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        # Hypothetical "WearLog" table — replace if you have different model
        data = (
            WearLog.objects
            .values('item__category')
            .annotate(total=Count('id'))
        )

        results = [
            {"label": row['item__category'], "value": row['total']}
            for row in data
        ]

        return Response(results)

class ItemListCreate(generics.ListCreateAPIView):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    # For GET: returns all items for the user (Used by Wardrobe.js)
    def get_queryset(self):
        user_profile = AppUser.objects.get(user=self.request.user)
        # Use select_related to efficiently join Item and Purchase data
        return Item.objects.filter(user=user_profile).select_related('purchase', 'brand', 'category').order_by('-created_at')

    # For POST: associates the new item with the current user (Used by /add-item)
    def perform_create(self, serializer):
        # The serializer handles creating both Item and Purchase
        serializer.save(user=AppUser.objects.get(user=self.request.user))

class ItemRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'item_id'
    
    def get_queryset(self):
        user_profile = AppUser.objects.get(user=self.request.user)
        # Ensure user can only retrieve/update/delete their own items
        return Item.objects.filter(user=user_profile)

class MarketplaceListingsView(generics.ListAPIView):
    """
    Returns a list of all ACTIVE listings available on the marketplace.
    Allows unauthenticated access (AllowAny).
    """
    serializer_class = MarketplaceListingSerializer
    permission_classes = [AllowAny]
    
    # The queryset defines what data is returned
    def get_queryset(self):
        # 1. Filter: Only return listings that are 'Active'
        queryset = Listing.objects.filter(status='Active')
        
        # 2. Optimization: Pre-fetch related data (Item, Category, Brand) 
        #    to avoid N+1 query problem, making the endpoint much faster.
        queryset = queryset.select_related(
            'item', 
            'item__category', 
            'item__brand'
        )
        
        # 3. Ordering: Sort by newest listings first
        return queryset.order_by('-listed_on', '-listing_id')

# view 6
class PurchaseSourceSummaryView(APIView):
    """
    Calculates the total spent and count of items, grouped by seller_type, 
    for the authenticated user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # 1. Get the current user's profile
        try:
            user_profile = AppUser.objects.get(user=request.user)
        except AppUser.DoesNotExist:
            return Response({"error": "User profile not found."}, status=404)
        
        # 2. Filter Purchases by the user's items and perform aggregation
        # 'item__user' traverses the foreign key from Purchase (item_id) back to Item (user_id)
        summary_data = Purchase.objects.filter(item__user=user_profile) \
            .values('seller_type') \
            .annotate(
                # Calculate the total number of items acquired from this source
                total_items=Count('purchase_id'),
                # Calculate the total amount spent (in cents)
                total_spent_cents=Sum('price_cents')
            ) \
            .order_by('-total_spent_cents') # Sort by highest spending source

        # 3. Format the results for clarity (optional, but clean)
        # Convert cents to dollars and structure the response
        formatted_summary = []
        for item in summary_data:
            formatted_summary.append({
                "source": item['seller_type'],
                "item_count": item['total_items'],
                # Convert cents to dollars (float, rounded to 2 decimal places)
                "total_spent_dollars": round(item['total_spent_cents'] / 100.0, 2)
            })
            
        return Response(formatted_summary)

# view 4
class BrandPurchaseSummaryView(APIView):
    """
    Calculates the total spent and item count, grouped by brand, 
    handling NULL and empty string brand IDs by replacing them with a placeholder (0).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_profile = AppUser.objects.get(user=request.user)
        except AppUser.DoesNotExist:
            return Response({"error": "User profile not found."}, status=404)

        purchases_with_brand_id = Purchase.objects.filter(item__user=user_profile).annotate(
            # First, cast the potential brand_id (which might contain '') to CharField for safety check
            brand_id_as_char=Cast(F('item__brand_id'), output_field=CharField()),
        ).annotate(
            group_brand_id=Case(
                # If the string representation is empty or null, use 0
                When(brand_id_as_char__isnull=True, then=Value(0)),
                When(brand_id_as_char__exact='', then=Value(0)),
                # Otherwise, rely on the original IntegerField value
                default=F('item__brand_id'),
                output_field=IntegerField()
            )
        )


        # 2. Group by the assigned ID (either the real ID or 0 for unknown)
        summary_data = purchases_with_brand_id \
            .values('group_brand_id') \
            .annotate(
                total_items=Count('purchase_id'),
                total_spent_cents=Sum('price_cents')
            ) \
            .order_by('-total_spent_cents')

        # 3. Format the results, translating the ID back to the name
        formatted_summary = []
        for item in summary_data:
            brand_id = item['group_brand_id']
            
            # Determine the brand name based on the ID
            if brand_id == 0:
                brand_name = 'Unknown Brand'
            else:
                try:
                    # Look up the actual brand name using the ID from the Brand model
                    brand_name = Brand.objects.get(pk=brand_id).name
                except Brand.DoesNotExist:
                    brand_name = f'Brand ID {brand_id} Error'
            
            formatted_summary.append({
                "brand_name": brand_name,
                "item_count": item['total_items'],
                "total_spent_dollars": round(item['total_spent_cents'] / 100.0, 2)
            })
            
        return Response(formatted_summary)

# View 7
class EcoFriendlyUserAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for admin users to retrieve the global Eco-Friendly User analysis.
    Only accessible by staff/admin users.
    """
    queryset = VEcoFriendlyUser.objects.all().order_by('-eco_buys', '-donations')
    serializer_class = EcoFriendlyUserSerializer
    permission_classes = [IsAdminUser] 

# view 10
class SeasonalWardrobeSuggestionsView(generics.ListAPIView):
    """
    Provides a personalized list of items (Active lifecycle) matching the
    current season for the authenticated user's wardrobe page.
    """
    serializer_class = ItemSerializer # Assuming a serializer for the Item model exists
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # 1. Get the authenticated user (likely the Auth model instance)
        authenticated_user = self.request.user
        current_season = get_current_season()
        
        try:
            # 🎯 CRITICAL FIX: Look up the AppUser instance 
            # We assume your Item model's FK points to the AppUser model.
            # Look up AppUser using a unique identifier from the authenticated user object.
            # If your AppUser uses 'email' as the unique field:
            app_user_instance = AppUser.objects.get(email=authenticated_user.email)
            
            # OR, if AppUser's PK is the same as the authenticated user's PK:
            # app_user_instance = AppUser.objects.get(pk=authenticated_user.pk)
            
        except AppUser.DoesNotExist:
            # If the user is authenticated but the corresponding AppUser profile doesn't exist
            # This should ideally not happen, but it's a good safeguard.
            return Item.objects.none()

        # Define the Priority Logic using Case/When (remains the same)
        priority_order = Case(
            When(season_hint=current_season, then=Value(1)),
            When(season_hint='All', then=Value(2)),
            default=Value(3),
            output_field=IntegerField(),
        )

        # 2. Use the correct AppUser instance in the filter
        queryset = Item.objects.filter(
            # 🎯 Use the retrieved AppUser instance for the ForeignKey filter
            user=app_user_instance, 
            lifecycle='Active'
        ).annotate(
            priority=priority_order
        ).order_by(
            'priority', 
            '-item_id'
        )[:15] 

        return list(queryset)

class ItemConditionSummaryView(APIView):
    """
    Returns a breakdown of active items by condition for the authenticated user,
    using the v_item_condition_breakdown database view.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        user_id = request.user.id  # Assuming the PK is 'id' on the authenticated user model
        
        # 🎯 Adjust the SQL query to select columns and filter by user_id
        sql_query = """
            SELECT condition, cnt 
            FROM v_item_condition_breakdown
            WHERE user_id = %s
            ORDER BY cnt DESC;
        """
        
        results = []
        try:
            with connection.cursor() as cursor:
                # Execute the raw query, passing the user_id as a parameter
                cursor.execute(sql_query, [user_id])
                
                # Fetch results and manually map columns
                rows = cursor.fetchall()
                for row in rows:
                    results.append({
                        'condition': row[0], # condition
                        'count': row[1]      # cnt
                    })

        except Exception as e:
            # Handle potential database or view errors
            print(f"Database error fetching condition summary: {e}")
            return Response({'error': 'Could not fetch condition summary.'}, status=500)
            
        # The serializer is not strictly necessary here, return raw data
        return Response(results)
