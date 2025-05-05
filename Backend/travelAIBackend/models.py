from django.db import models
from decimal import Decimal

# Below creates a database model for my users tables to store login and registration details for my users.
class users(models.Model):
    firstName = models.CharField(max_length=200, default="John")
    surname = models.CharField(max_length=200, default="Doe")
    email = models.CharField(max_length=200, default="JohnDoe123@gmail.com")
    password = models.CharField(max_length=200, default="Calculator123!")

# This is my attractions table, which gets the userID from the users table as my foreign key
# and also the name of each activity the user wants to add to the itinerary.

class attractions(models.Model):
    user = models.ForeignKey(users, on_delete=models.CASCADE, default=1)
    name = models.CharField(max_length=200, default="The Museum")

# This is my flights table. This also uses the userID as a foreign key
# Column names in this table include the airline code, flight number, airports, dates, times, prices and duration
class flights(models.Model):
    user = models.ForeignKey(users, on_delete=models.CASCADE, default=1)
    airline = models.CharField(max_length=200, default="BA")
    flightNum = models.IntegerField(default=123)
    departureAirport = models.CharField(max_length=200, default="LHR")
    departureDate = models.DateField(default="2025-01-01")
    departureTime = models.TimeField(default="09:00")
    arrivalAirport = models.CharField(max_length=200, default="LHR")
    arrivalTime = models.TimeField(default="09:00")
    duration = models.CharField(max_length=200, default="6H30M")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

# This is my hotels table which also uses userID as foreign key
# The name, room description, prices and dates are also taken from the form and added to the database
class hotels(models.Model):
    user = models.ForeignKey(users, on_delete=models.CASCADE, default=1)
    name = models.CharField(max_length=200, default="The Museum")
    roomDescription = models.CharField(max_length=500, default="A hotel")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    checkInDate = models.DateField(default="2025-01-01")
    checkOutDate = models.DateField(default="2025-01-01")

# The answers to each question from the react file is sent here and stored in the database.
class travelPref(models.Model):
    user = models.ForeignKey(users, on_delete=models.CASCADE, default=1)
    reasonForTravel = models.CharField(max_length=200, default="Vacation")
    budget = models.CharField(max_length=200, default="Luxury")
    accomodation = models.CharField(max_length=200, default="Hotel")
    destinationType = models.CharField(max_length=200, default="The City")
    flightDuration = models.CharField(max_length=200, default="Short-Haul Flights")
    weather = models.CharField(max_length=200, default="Snowy")
    travelCompanions = models.CharField(max_length=200, default="Solo")
    flightPriority = models.CharField(max_length=200, default="Lowest Price")
    favouriteActivities = models.JSONField(default=list)