from django.urls import path
from .views import addUserToDatabase, accountExists

urlpatterns = [
    path("addUserToDatabase/", addUserToDatabase, name="addUserToDatabase"),
    path("accountExists/", accountExists, name="accountExists") 
]
