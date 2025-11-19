from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.EmailField(unique=True)


    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username'] #username is required for admin use too


    def __str__(self):
        return self.email


class AppUser(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile",
        db_column='user_id',  
        primary_key=True       # mark as the primary key
    )
    full_name = models.CharField(max_length=100, blank=True)
    email = models.EmailField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True)


    class Meta:
        db_table = 'app_user'
   
    def __str__(self):
        return self.full_name or self.user.username


class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=60, unique=True)


    class Meta:
        db_table = "category"

    def __str__(self):
        return self.name


class Brand(models.Model):
    brand_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=80, unique=True)


    class Meta:
        db_table = "brand"


    def __str__(self):
        return self.name


class Item(models.Model):
    item_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE, db_column="user_id")
   
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        db_column='category_id',
        to_field='category_id'
    )
    brand = models.ForeignKey(
        Brand,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column='brand_id',
        to_field='brand_id'
    )
   
    item_name = models.CharField(max_length=120)
   
    # Lifecycle must be updated to track listing status
    LIFECYCLE_CHOICES = [
        ('Wardrobe','Wardrobe'), # Changed 'Active' to 'Wardrobe' for clarity
        ('Listed','Listed'),
        ('Sold','Sold'),
        ('Donated','Donated'),
        ('Discarded','Discarded')
    ]
    lifecycle = models.CharField(
        max_length=20,
        default="Wardrobe", # Default changed to 'Wardrobe'
        choices=LIFECYCLE_CHOICES
    )
   
    created_at = models.DateField(auto_now_add=True)
    size_label = models.CharField(max_length=20, blank=True)
    material = models.CharField(max_length=60, blank=True)
    color = models.CharField(max_length=40, blank=True)
   
    SEASON_CHOICES = [('Spring','Spring'),('Summer','Summer'),('Fall','Fall'),('Winter','Winter'),('All','All')]
    season_hint = models.CharField(max_length=20, blank=True, null=True, choices=SEASON_CHOICES)
   
    CONDITION_CHOICES = [('New','New'),('LikeNew','LikeNew'),('Good','Good'),('Fair','Fair'),('Worn','Worn')]
    condition = models.CharField(max_length=20, blank=True, null=True, choices=CONDITION_CHOICES)
   
    # Merged Teammate's ImageField (if you are using Django's file storage)
    # If you were using a simple text URL before, you might want to switch back to models.TextField
    # and rename the field to image_url for consistency with your old code,
    # but ImageField is better for uploading files.
    item_image = models.ImageField(upload_to='item_images/', null=True, blank=True)


    class Meta:
        db_table = "item"


    def __str__(self):
        return self.item_name

class Purchase(models.Model):
    purchase_id = models.AutoField(
        primary_key=True,
        db_column='id'  # <-- Tell Django the column in the DB is named 'id'
    )
    item = models.OneToOneField(
        Item,
        on_delete=models.CASCADE,
        # fixes ensure correct referencing of Item PK
        to_field='item_id',
        db_column='item_id'
    )
    seller_type = models.CharField(max_length=20, choices=[('Retail','Retail'),('LocalMarket','LocalMarket'),('SecondHand','SecondHand'),('Gift','Gift')])
    price_cents = models.IntegerField()
    purchase_date = models.DateField(auto_now_add=True)
    location = models.CharField(max_length=80, blank=True, null=True)


    class Meta:
        db_table = "purchase"


class Listing(models.Model):
    listing_id = models.AutoField(primary_key=True)  # match your table PK
    item = models.OneToOneField(
        Item,
        on_delete=models.CASCADE,
        db_column='item_id',
        to_field='item_id' # Reference the Item's item_id
    )
    seller_user = models.ForeignKey(
        AppUser, 
        on_delete=models.CASCADE,
        db_column='seller_user_id' # <--- This tells Django to use the existing SQL column name
    )
    title = models.CharField(max_length=120, blank=True)
    description = models.TextField(blank=True)
    listed_on = models.DateField(auto_now_add=True)
    list_price_cents = models.IntegerField()
    status = models.CharField(max_length=20, default='Active')
    buyer_user = models.ForeignKey(AppUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='purchases')
    view_count = models.IntegerField(default=0)
    class Meta:
        db_table = "listing"


class Sale(models.Model):
    sale_id = models.AutoField(primary_key=True)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    buyer_user = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    sold_on = models.DateField(auto_now_add=True)
    sale_price_cents = models.IntegerField()

    class Meta:
        db_table = "sale"


# view 7
class VEcoFriendlyUser(models.Model):
    """
    Unmanaged Model representing the v_eco_friendly_users SQL view.
    Analyzes users' contribution to the circular economy.
    """
    # The columns must exactly match the view definition: user_id, full_name, eco_buys, donations
    user_id = models.IntegerField(primary_key=True)
    full_name = models.CharField(max_length=100)
    eco_buys = models.BigIntegerField()  # SUM returns BigInteger in PostgreSQL
    donations = models.BigIntegerField() # SUM returns BigInteger in PostgreSQL

    class Meta:
        managed = False  # Tells Django this table/view is not created/managed by migrations
        db_table = 'v_eco_friendly_users'

