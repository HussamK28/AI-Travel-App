from django.db import models

# Create your models here.

class users(models.Model):
    firstName = models.CharField(max_length=200)
