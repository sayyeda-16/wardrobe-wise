from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import AppUser, Item, Purchase, Listing, Sale

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    full_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    city = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2', 'full_name', 'city']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        # remove non-User fields
        full_name = validated_data.pop('full_name', '')
        city = validated_data.pop('city', '')
        validated_data.pop('password2')

        # create the User
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )

        # create the linked AppUser profile
        AppUser.objects.create(user=user, full_name=full_name, city=city, email=user.email)

        return user

class AppUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    date_joined = serializers.DateTimeField(source='user.date_joined', read_only=True)

    class Meta:
        model = AppUser
        fields = ['full_name', 'email', 'city', 'date_joined']

class UserStatsSerializer(serializers.Serializer):
    total_items = serializers.IntegerField()
    items_resold = serializers.IntegerField()
    avg_cpw = serializers.FloatField()

class OrderSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='listing.item.item_name', read_only=True)
    listing_id = serializers.IntegerField(source='listing.listing_id', read_only=True)

    class Meta:
        model = Sale
        fields = ['listing_id', 'item_name', 'sale_price_cents', 'sold_on']


class ListingSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.item_name', read_only=True)

    class Meta:
        model = Listing
        fields = ['listing_id', 'item_name', 'list_price_cents', 'status']
