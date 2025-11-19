from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import AppUser, Item, Purchase, Listing, Sale
from .models import Brand, Category, VEcoFriendlyUser
from .models import Item, Brand, Category, Purchase 

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
        fields = ['full_name', 'email', 'city', 'username', 'date_joined']

class UserDetailSerializer(serializers.ModelSerializer):
    # 🟢 CRITICAL: Nest the AppUser data using the related_name 'profile'
    profile = AppUserSerializer(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'date_joined', 'is_staff', 'profile')
        read_only_fields = fields
        
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

# Assuming Purchase is a OneToOneField related to Item
class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = ['seller_type', 'location', 'purchase_date', 'price_cents']

    
class ItemSerializer(serializers.ModelSerializer):
    brand = serializers.SlugRelatedField(
            slug_field='name', # Use the 'name' field from the Brand model
            queryset=Brand.objects.all(), 
            allow_null=True,
            required=False
        )
        
    category = serializers.SlugRelatedField(
        slug_field='name', # Use the 'name' field from the Category model
        queryset=Category.objects.all()
    )
   
    # 3. Purchase Info (Using your approach: nested input/output)
    purchase_info = PurchaseSerializer(source='purchase', required=False, allow_null=True)
   
    # 4. NEW: Marketplace Toggle (Non-model field)
    list_for_sale = serializers.BooleanField(write_only=True, required=False, default=False)
   
    # 5. NEW: Listing Price (Non-model field, required if list_for_sale=True)
    list_price_cents = serializers.IntegerField(write_only=True, required=False)
   
    # 6. Image Upload
    item_image = serializers.ImageField(use_url=True, required=False, allow_null=True)

    class Meta:
        model = Item
        # Include all fields the frontend uses, plus the nested purchase data
        fields = [
            'item_id', 'item_name', 'brand', 'brand_name_input', 'category', 'size_label',
            'color', 'condition', 'material', 'lifecycle',
            'item_image', 'purchase_info', # Item fields
            'list_for_sale', 'list_price_cents', 'season_hint' # Non-model fields for creation
        ]
        read_only_fields = ['user']

    # Custom create logic to handle both Item and Purchase models
    def create(self, validated_data):
        purchase_data = validated_data.pop('purchase', {})
        user_profile = self.context['request'].user.profile # Assuming AppUser is linked
        
        # 1. Create the Item
        item = Item.objects.create(user=user_profile, **validated_data)
        
        # 2. Create the Purchase record
        if purchase_data:
            Purchase.objects.create(item=item, **purchase_data)
        
        return item

class MarketplaceListingSerializer(serializers.ModelSerializer):
    # Field to represent the name of the category
    category_name = serializers.CharField(source='item.category.name', read_only=True)
    
    # Field to represent the name of the brand (can be null)
    brand_name = serializers.CharField(source='item.brand.name', read_only=True, allow_null=True)
    
    # Item details from the Item table
    item_name = serializers.CharField(source='item.item_name', read_only=True)
    color = serializers.CharField(source='item.color', read_only=True)
    condition = serializers.CharField(source='item.condition', read_only=True)
    size_label = serializers.CharField(source='item.size_label', read_only=True)
    
    # We don't expose the seller_user_id, but the item details are included.

    class Meta:
        model = Listing
        # Fields exposed to the frontend for the marketplace card
        fields = [
            'listing_id', 
            'title', 
            'description', 
            'list_price_cents', 
            'listed_on',
            'view_count', 
            'category_name', 
            'brand_name',
            'item_name', 
            'color', 
            'condition',
            'size_label',
            # Add image_url if you expose it through the Listing model or a related Item field
        ]

class EcoFriendlyUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = VEcoFriendlyUser
        # Expose all fields from the view
        fields = ['user_id', 'full_name', 'eco_buys', 'donations']
