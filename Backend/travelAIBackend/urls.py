from django.urls import path
from .views import addUserToDatabase, removeFlight, removeHotel, removeAttraction, accountExists, addToItinerary,addHotels, addFlights, getFlightsFromDB, getHotelsFromDB, getAttractionsFromDB, addTravelPref, getRecommendations

# These URLs are used in the frontend to send the data from each form to the correct view in views.py
urlpatterns = [
    path("addUserToDatabase/", addUserToDatabase, name="addUserToDatabase"),
    path("removeFlight/", removeFlight, name="removeFlight"),
    path("removeHotel/", removeHotel, name="removeHotel"),
    path("removeAttraction/", removeAttraction, name="removeAttraction"),
    path("accountExists/", accountExists, name="accountExists"),
    path("addToItinerary/", addToItinerary, name="addToItinerary"),
    path("addFlights/", addFlights, name="addFlights"),
    path("addHotels/", addHotels, name="addHotels"),
    path("getFlightsFromDB/", getFlightsFromDB, name="getFlightsFromDB"),
    path("getHotelsFromDB/", getHotelsFromDB, name="getHotelsFromDB"),
    path("getAttractionsFromDB/", getAttractionsFromDB, name="getAttractionsFromDB"),
    path("addTravelPref/", addTravelPref, name="addTravelPref"),
    path("getRecommendations/", getRecommendations, name="getRecommendations")

]
