from django.db import models

# Below creates a database model for my users tables to store login and registration details for my users.


class users(models.Model):
    firstName = models.CharField(max_length=200, default="John")
    surname = models.CharField(max_length=200, default="Doe")
    email = models.CharField(max_length=200, default="JohnDoe123@gmail.com")
    password = models.CharField(max_length=200, default="Calculator123!")

class attractions(models.Model):
    name = models.CharField(max_length=200, default="The Museum")