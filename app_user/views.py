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
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework import generics, permissions
from .models import AppUser, Item, Purchase, Listing, Sale
from django.db.models import Avg, Count, Sum


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