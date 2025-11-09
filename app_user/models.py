from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username'] #username is required for admin use too

    def __str__(self):
        return self.email

class AppUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    full_name = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    items = models.IntegerField(default=0)
    sales = models.IntegerField(default=0)
    listing_views = models.IntegerField(default=0)

    def __str__(self):
        return self.full_name or self.user.username
