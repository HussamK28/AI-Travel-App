from django.db import models

# Create your models here.

class users(models.Model):
    firstName = models.CharField(max_length=200),
    surname = models.CharField(max_length=200),
    email = models.CharField(max_length=200),
    password = models.CharField(max_length=200)
