from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import AppUser, Item, Purchase, Listing, Sale
from .models import Brand, Category, VEcoFriendlyUser
from rest_framework import serializers


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
    # --- Input Fields ---
    brand_name_input = serializers.CharField(
        max_length=80,
        allow_null=True,
        required=False,
        write_only=True 
    )

    # 2. Output/Read Field (Displays the brand name string on GET requests)
    # This must match the Foreign Key field name on the Item model.
    brand = serializers.SlugRelatedField( 
        read_only=True,
        slug_field='name' # Tells DRF to output the 'name' field of the Brand model
    )
   
    # 2. Category Handling (Using your approach: accepts name string via SlugRelatedField)
    category = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Category.objects.all(),
        write_only=True # Only used for input
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
        fields = [
            'item_id', 'item_name', 'brand', 'brand_name_input', 'category', 'size_label',
            'color', 'condition', 'material', 'lifecycle',
            'item_image', 'purchase_info', # Item fields
            'list_for_sale', 'list_price_cents', 'season_hint' # Non-model fields for creation
        ]
        read_only_fields = ['user', 'item_id', 'lifecycle']


    # --- Custom Validation ---
    def validate(self, data):
        # Enforce that price is required if the sale toggle is checked
        if data.get('list_for_sale') and not data.get('list_price_cents'):
            raise serializers.ValidationError({
                "list_price_cents": "Price is required to list an item for sale."
            })
        return data

    def update(self, instance, validated_data):
        # 1. Pop non-model fields that aren't used for Item details (editing should not re-list or re-buy)
        validated_data.pop('list_for_sale', None)
        validated_data.pop('list_price_cents', None)
       
        # 2. Prevent accidental changes to the item's owner or lifecycle status during an edit
        validated_data.pop('user', None)
        validated_data.pop('purchase', None)
        validated_data.pop('purchase_info', None) # The purchase info should be updated in a separate view/flow
       
        # We allow lifecycle to be included in the validated_data but remove it here
        # to ensure it's not changed during a PATCH request on item details.
        validated_data.pop('lifecycle', None)
       
        # 3. Handle Brand update logic
        brand_name = validated_data.pop('brand_name_input', None)
        if brand_name:
            brand_obj, created = Brand.objects.get_or_create(
                name__iexact=brand_name,
                defaults={'name': brand_name}
            )
            instance.brand = brand_obj # Set the new brand object on the Item instance
           
        # 4. Apply all remaining validated data to the Item instance and save
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
           
        instance.save()
        return instance


    def create(self, validated_data):
        # --- 1. POP and Parse Custom Data ---
        
        # Custom parsing for flat purchase_info fields sent via FormData:
        purchase_data = {}
        for key in list(validated_data.keys()):
            if key.startswith('purchase_info.'):
                value = validated_data.pop(key)
                new_key = key.split('.')[1]
                purchase_data[new_key] = value


        # Pop non-Item-model fields:
        brand_name = validated_data.pop('brand_name_input', None)
        list_for_sale = validated_data.pop('list_for_sale', False)
        list_price_cents = validated_data.pop('list_price_cents', None)
        
        # Clean up rogue keys
        validated_data.pop('user', None) 
        validated_data.pop('purchase', None) 
        
        # 💥 CRITICAL FIX: Convert the authenticated User instance to the required AppUser instance
        authenticated_user = self.context['request'].user
        
        try:
            user_instance = authenticated_user 
            
            user_instance = AppUser.objects.get(email=authenticated_user.email) 
            
        except AppUser.DoesNotExist:
            raise serializers.ValidationError({"user": "Matching AppUser profile not found."})

        # Use the retrieved instance
        user = user_instance 
        # ----------------------------------------------------
        
        # 2. Handle Brand (No change)
        brand_obj = None
        if brand_name:
            brand_obj, created = Brand.objects.get_or_create(
                name__iexact=brand_name,
                defaults={'name': brand_name}
            )
        
        # 3. Handle Lifecycle (No change)
        listing_title = validated_data.get('item_name')
        validated_data['lifecycle'] = 'Listed' if list_for_sale else 'Active'
        
        # 4. Create the Item 
        # Pass the correctly retrieved AppUser instance to the user FK
        item = Item.objects.create(
            user=user, 
            brand=brand_obj, 
            **validated_data
        )
        
        # 5. Create the Purchase record
        if purchase_data:
            Purchase.objects.create(item=item, **purchase_data)
            
        # 6. Create the Listing record
        if list_for_sale and list_price_cents is not None:
            Listing.objects.create(
                item=item,
                seller_user=user, # Pass the AppUser instance here too
                list_price_cents=list_price_cents,
                title=listing_title,
                description=f"Listing for {item.item_name}."
            )
        
        return item

class MarketplaceListingSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source='seller_user.full_name', read_only=True)
    seller_email = serializers.EmailField(source='seller_user.email', read_only=True)
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
            'seller_name',
            'seller_email',
            # Add image_url if you expose it through the Listing model or a related Item field
        ]

class EcoFriendlyUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = VEcoFriendlyUser
        # Expose all fields from the view
        fields = ['user_id', 'full_name', 'eco_buys', 'donations']

# edit item classes
class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


# seller stuff
class SellerContactSerializer(serializers.Serializer):
    """
    Serializer used to fetch and format the necessary data
    for the Contact Seller summary page.
    """
    # === Item Details ===
    listing_id = serializers.CharField(source='listing.listing_id')
    title = serializers.CharField(source='listing.title')
    list_price_cents = serializers.IntegerField(source='listing.list_price_cents')
   
    # Assumes image_url is on the Item model
    image_url = serializers.URLField(source='listing.item.image_url', allow_null=True, required=False)
   
    # === Seller Details ===
    # Access the base User model (which has name/email) via AppUser ('seller')
    seller_name = serializers.CharField(source='seller.user.username')
    seller_email = serializers.EmailField(source='seller.user.email')
   
    # === Fee Constants ===
    shipping_fee_cents = serializers.SerializerMethodField()
    service_fee_cents = serializers.SerializerMethodField()
   
    # === Calculated Total ===
    order_total_cents = serializers.SerializerMethodField()


    def get_shipping_fee_cents(self, obj):
        return 500 # $5.00


    def get_service_fee_cents(self, obj):
        return 150 # $1.50


    def get_order_total_cents(self, obj):
        list_price = obj['listing'].list_price_cents
        return list_price + self.get_shipping_fee_cents(obj) + self.get_service_fee_cents(obj)


# ===================================================================
# == 2. NEW SELLERINFOSERIALIZER (FOR MARKETPLACE LIST) ==
#    (This is the new serializer to fix the "Seller Not Found" error)
# ===================================================================


class SellerInfoSerializer(serializers.ModelSerializer):
    """
    Serializes the seller's public-facing info (name and email)
    from the base User model, accessed via the AppUser profile.
    """
    name = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)


    class Meta:
        model = AppUser  # Based on your AppUser model
        fields = ['name', 'email']



