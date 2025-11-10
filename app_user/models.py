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
    email = models.EmailField(unique=True)
    city = models.CharField(max_length=100, blank=True)

    class Meta:
        db_table = 'app_user'
    
    def __str__(self):
        return self.full_name or self.user.username
