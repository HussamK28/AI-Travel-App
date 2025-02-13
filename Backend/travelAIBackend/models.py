from django.db import models

# Below creates a database model for my users tables to store login and registration details for my users.

class users(models.Model):
    firstName = models.CharField(max_length=200),
    surname = models.CharField(max_length=200),
    email = models.CharField(max_length=200),
    password = models.CharField(max_length=200)
