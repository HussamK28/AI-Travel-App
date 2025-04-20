from django.urls import path
from .views import addUserToDatabase, accountExists, viewFlightsAPIToken, addToItinerary

urlpatterns = [
    path("addUserToDatabase/", addUserToDatabase, name="addUserToDatabase"),
    path("accountExists/", accountExists, name="accountExists"),
    path("viewFlightsAPIToken/", viewFlightsAPIToken, name="viewFlightsAPIToken"),
    path("addToItinerary/", addToItinerary, name="addToItinerary")
]
