from django.shortcuts import render
from rest_framework import generics
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer
from .serializers import AppUserSerializer
from .serializers import UserStatsSerializer, OrderSerializer, ListingSerializer
from .models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework import generics, permissions
from .models import AppUser, Item, Purchase, Listing, Sale
from django.db.models import Avg, Count, Sum
from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum, Count, F
from datetime import timedelta
from django.db.models.functions import TruncDay

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
        orders = Sale.objects.filter(buyer_user=user_profile).order_by('-sold_on')[:10]
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class UserListings(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_profile = AppUser.objects.get(user=request.user)
        listings = Listing.objects.filter(seller_user=user_profile).order_by('-listing_id')[:10]
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
