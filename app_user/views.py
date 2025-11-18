from django.shortcuts import render
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer
from .serializers import AppUserSerializer
from .serializers import UserStatsSerializer, OrderSerializer, ListingSerializer, ItemSerializer
from .serializers import ItemSerializer, MarketplaceListingSerializer, PurchaseSerializer
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
from rest_framework import status
from .models import AppUser, Item, Purchase, Listing, Sale
from django.db.models import Avg, Count, Sum, F, Case, When, Value, CharField, IntegerField
from datetime import timedelta
from django.utils import timezone
from django.db.models.functions import TruncDay
from django.shortcuts import get_object_or_404
from django.db.models.functions import Coalesce, Cast


User = get_user_model()


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


class UserListingsView(APIView):
    """
    Handles GET: Returns a list of the current user's active listings.
    Handles POST: Creates a new Listing for an existing Item.
    """
    permission_classes = [IsAuthenticated]

    # --- 1. GET (Existing functionality - for retrieving user's listings) ---
    def get(self, request):
        user_profile = AppUser.objects.get(user=request.user)
        
        listings = Listing.objects.filter(
            seller_user=user_profile
        ).select_related(
            'item'
        ).order_by('-listing_id')
        
        serializer = ListingSerializer(listings, many=True) 
        return Response(serializer.data)

    # --- 2. POST (New functionality - for creating a Listing) ---
    def post(self, request):
        # 1. Prepare data for serializer
        data = request.data.copy()
        
        # 2. Get the authenticated user's profile and the item
        try:
            user_profile = AppUser.objects.get(user=request.user)
            item_id = data.get('item_id')
            item_instance = get_object_or_404(Item, item_id=item_id)
        except AppUser.DoesNotExist:
            return Response({"detail": "User profile not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Handle potential Item.DoesNotExist if get_object_or_404 fails
             return Response({"detail": f"Error finding item: {e}"}, status=status.HTTP_400_BAD_REQUEST)
        
        # 3. Add necessary context fields for the serializer
        data['seller_user'] = user_profile.pk
        data['item'] = item_instance.item_id # Ensure the item field is populated
        
        # 4. Validate and save the listing
        serializer = ListingSerializer(data=data)
        if serializer.is_valid():
            # Save the listing, and automatically update the associated item's lifecycle to 'Listed'
            listing = serializer.save(seller_user=user_profile, item=item_instance)
            
            # 🟢 Important: Update the Item's lifecycle status after listing is created 🟢
            item_instance.lifecycle = 'Listed'
            item_instance.save()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an item to edit or delete it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request (GET)
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions (PUT/PATCH/DELETE) are only allowed to the owner
        # Since Item model uses 'user' field, we check against that.
        return obj.user.user == request.user

class ItemListCreateView(generics.ListCreateAPIView):
    """
    Handles: 
    - POST (Add Item): Creates an Item (and optional Listing) linked to the user.
    - GET (Wardrobe): Returns all items (Wardrobe + Listed) for the logged-in user.
    """
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    # For GET: returns all items for the user (Used by Wardrobe.js)
    def get_queryset(self):
        # We assume AppUser is what your Item model uses as the FK type
        user_profile = AppUser.objects.get(user=self.request.user) 
        
        # Use select_related for efficiency when retrieving Item data
        return Item.objects.filter(user=user_profile).select_related('purchase', 'brand', 'category').order_by('-created_at')

    # For POST: associates the new item with the current user
    def perform_create(self, serializer):
        user_profile = AppUser.objects.get(user=self.request.user)
        # The 'user' field is passed to the serializer, which handles the conditional Listing creation
        serializer.save(user=user_profile)

# --- 1B. Item Detail/Update/Delete (PUT, PATCH, DELETE) ---
class ItemRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    Handles: DELETE, PUT, and GET detail view for a single item.
    """
    serializer_class = ItemSerializer
    # Apply IsOwnerOrReadOnly to prevent users from editing others' items
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly] 
    lookup_field = 'item_id'
    
    def get_queryset(self):
        user_profile = AppUser.objects.get(user=self.request.user)
        # Ensure user can only retrieve/update/delete their own items
        return Item.objects.filter(user=user_profile)

class MarketplaceListingsView(generics.ListAPIView):
    """
    Returns a list of all ACTIVE listings available on the marketplace.
    """
    serializer_class = MarketplaceListingSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        # 1. Filter: Only return listings that are 'Active'
        queryset = Listing.objects.filter(status='Active')
        
        # 2. Optimization: Pre-fetch related data (Item, Category, Brand) 
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