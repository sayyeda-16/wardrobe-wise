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

# models.py (add below your AppUser class)
class Category(models.Model):
    name = models.CharField(max_length=60, unique=True)

    class Meta:
        db_table = "category"

    def __str__(self):
        return self.name


class Brand(models.Model):
    name = models.CharField(max_length=80, unique=True)

    class Meta:
        db_table = "brand"

    def __str__(self):
        return self.name


class Item(models.Model):
    item_id = models.AutoField(primary_key=True)  # match your DB PK
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE, db_column="user_id")
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True)
    item_name = models.CharField(max_length=120)
    lifecycle = models.CharField(
        max_length=20,
        default="Active",
        choices=[('Active','Active'), ('Listed','Listed'), ('Sold','Sold'), ('Donated','Donated'), ('Discarded','Discarded')]
    )
    created_at = models.DateField(auto_now_add=True)
    size_label = models.CharField(max_length=20, blank=True)
    material = models.CharField(max_length=60, blank=True)
    color = models.CharField(max_length=40, blank=True)
    season_hint = models.CharField(max_length=20, blank=True, choices=[('Spring','Spring'),('Summer','Summer'),('Fall','Fall'),('Winter','Winter'),('All','All')])
    condition = models.CharField(max_length=20, blank=True, choices=[('New','New'),('LikeNew','LikeNew'),('Good','Good'),('Fair','Fair'),('Worn','Worn')])
    image_url = models.TextField(blank=True)

    class Meta:
        db_table = "item"

    def __str__(self):
        return self.item_name



class Purchase(models.Model):
    item = models.OneToOneField(Item, on_delete=models.CASCADE)
    seller_type = models.CharField(max_length=20, choices=[('Retail','Retail'),('LocalMarket','LocalMarket'),('SecondHand','SecondHand'),('Gift','Gift')])
    price_cents = models.IntegerField()
    purchase_date = models.DateField(auto_now_add=True)
    location = models.CharField(max_length=80, blank=True, null=True)

    class Meta:
        db_table = "purchase"


class Listing(models.Model):
    listing_id = models.AutoField(primary_key=True)  # match your table PK
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    seller_user = models.ForeignKey(AppUser, on_delete=models.CASCADE)
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

