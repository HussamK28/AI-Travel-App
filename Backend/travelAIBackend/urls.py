from django.urls import path
from . import views
from .views import addUserToDatabase

urlpatterns = [
    path('api/add-user/', addUserToDatabase, name=addUserToDatabase)
]