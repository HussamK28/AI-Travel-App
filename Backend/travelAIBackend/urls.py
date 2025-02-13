from django.urls import path
from .views import addUserToDatabase

urlpatterns = [
    path("addUserToDatabase/", addUserToDatabase, name="addUserToDatabase") 
]
