from django.shortcuts import render, HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import users, flights, hotels, attractions, travelPref
from .serializers import userConverter, attractionConverter, flightsConverter, hotelConverter, travelPrefConverter
from .recommendations import recommendationsContentFiltering, getAllUserData, trainingSVDModel
import requests
import time
from django.http import JsonResponse
from django.conf import settings
import traceback
import pandas as pd

# This view adds a user to the users database from the register page
@api_view(['POST'])
def addUserToDatabase(request):
    # userConverter takes the data from the frontend and converts it into the user serialiser from serializers.py to see if it matches the defined fields
    userSerialiser = userConverter(data=request.data)
    # If valid and everything matches, the serialiser is saved in the database.
    if userSerialiser.is_valid():
        userSerialiser.save()
        return Response({"message": "Registration Successful!"}, status=status.HTTP_201_CREATED)
    else:
        return Response(userSerialiser.errors, status=status.HTTP_400_BAD_REQUEST)

# This checks if an account exists with the login credentials in the database from the login page
@api_view(['POST'])
def accountExists(request):
    # This saves only the email and password from the request send from the frontend
    email = request.data.get('email')
    password = request.data.get('password')
    try:
        # This checks if there is an email and password in the database that matches the user's input
        user = users.objects.get(email=email, password=password)
        return Response ({
            "message": "Login Successful!",
            "user": {
                "id": user.id,
                "email": user.email
            }
        }, status=status.HTTP_202_ACCEPTED)
    except users.DoesNotExist:
        return Response({"Message": "login failed"}, status=status.HTTP_400_BAD_REQUEST)


apiAccessToken = None
apiExpiry = 0

# This function gets a new API token from the Amadeus API if the old one has expired after 30 minutes
def getFlightsAPIToken():
    global apiAccessToken, apiExpiry
    # This checks if there already exists an API token that hasn't expired. If so, we return to the frontend
    if apiAccessToken is not None and apiExpiry > time.time(): 
        return apiAccessToken
    else:
        # if token has expired we get a new one from the Amadeus api website using the API key and the secret API from settings.py
        url = "https://test.api.amadeus.com/v1/security/oauth2/token"
        APIdata = {
            "grant_type":"client_credentials",
            "client_id": settings.FLIGHTS_API_KEY,
            "client_secret": settings.FLIGHTS_API_SECRET
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        # This posts the API request to the URL and returns a JSON file if successful
        response = requests.post(url, data=APIdata, headers=headers)
        if response.status_code == 200:
            data = response.json()
            # Reads the JSON file and saves the data from the access_token key and the expires in key
            apiAccessToken = data["access_token"]
            apiExpiry = time.time() + data["expires_in"]
            return data["access_token"]

# This function adds an activity from the Activities page into the database
@api_view(['POST'])
def addToItinerary(request):
    try:
        # attractionConverter checks if all the fields from the attraction serialiser match.
        # If valid, it saves it to the attractions database

        attractionSeraliser = attractionConverter(data=request.data)
        
        if attractionSeraliser.is_valid():
            attractionSeraliser.save()
            print("Successfully saved attraction!")
            return Response({"message": "Added to itinerary"}, status=status.HTTP_201_CREATED)
        else:
            # If not an error is printed to the console
            print("Serializer errors:", attractionSeraliser.errors)
            return Response(attractionSeraliser.errors, status=status.HTTP_400_BAD_REQUEST)

    # If an exception is thrown it prints in the console what the exception is.
    except Exception as e:
        import traceback
        print("EXCEPTION:")
        traceback.print_exc()
        return Response({"error": "Something went wrong on the server."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# This function adds the data from the flights page to the flights database.
@api_view(['POST'])
def addFlights(request):
    try:
        # flightsConverter checks if all the fields from the flights serialiser match.
        # If valid, it saves it to the flights database
        flightSerialiser = flightsConverter(data=request.data)
        
        if flightSerialiser.is_valid():
            flightSerialiser.save()
            return Response({"message": "Added to itinerary"}, status=status.HTTP_201_CREATED)
        else:
            print("Serializer errors:", flightSerialiser.errors)
            return Response(flightSerialiser.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        import traceback
        print("EXCEPTION:")
        traceback.print_exc()
        return Response({"error": "Something went wrong on the server."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def removeFlight(request):
    flightID = request.query_params.get("id")

    if not flightID:
        return Response({"error": "Flight ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        flight = flights.objects.get(id=flightID)
        flight.delete()
        return Response({"message": "Flight deleted!"}, status=status.HTTP_200_OK)
    except flights.DoesNotExist:
        return Response({"error": "Flight not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
def removeHotel(request):
    hotelID = request.query_params.get("id")
    print(f"Received Hotel ID: {hotelID}")  # Debugging: Check the received hotelID
    
    if not hotelID:
        return Response({"error": "Hotel ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        hotel = hotels.objects.get(id=hotelID)
        hotel.delete()
        return Response({"message": "Hotel deleted!"}, status=status.HTTP_200_OK)
    except hotels.DoesNotExist:
        return Response({"error": "Hotel not found"}, status=status.HTTP_404_NOT_FOUND)


# This function takes the data from the hotel page and adds it to hotel database
@api_view(['POST'])
def addHotels(request):
    try:
        # hotelConverter checks if all the fields from the hotel serialiser match.
        # If valid, it saves it to the hotel database
        hotelSerialiser = hotelConverter(data=request.data)
        
        if hotelSerialiser.is_valid():
            hotelSerialiser.save()
            return Response({"message": "Added to itinerary"}, status=status.HTTP_201_CREATED)
        else:
            print("Serializer errors:", hotelSerialiser.errors)
            return Response(hotelSerialiser.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        import traceback
        print("EXCEPTION:")
        traceback.print_exc()
        return Response({"error": "Something went wrong on the server."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# This function gets the flights stored in  the database and displays it to the user for the itinerary page
@api_view(['GET'])
def getFlightsFromDB(request):
    # gets the userID from the request the frontend sent to filter through the flights table to see if there are any flights matching to that userID
    userID = request.query_params.get("user_id")
    if not userID:
        return Response({"message": "User ID not found"}, status=status.HTTP_400_BAD_REQUEST)
    showFlights = flights.objects.filter(user_id=userID)
    serialiser = flightsConverter(showFlights, many=True)

    return Response(serialiser.data)



# This function gets the hotels stored in  the database and displays it to the user for the itinerary page
@api_view(['GET'])
def getHotelsFromDB(request):
    # gets the userID from the request the frontend sent to filter through the hotels table to see if there are any flights matching to that userID
    userID = request.query_params.get("user_id")
    if not userID:
        return Response({"message": "User ID not found"}, status=status.HTTP_400_BAD_REQUEST)
    showHotels = hotels.objects.filter(user_id=userID)
    serialiser = hotelConverter(showHotels, many=True)

    return Response(serialiser.data)

# This function gets the activities stored in the activities database and displays it to the user for the itinerary page
@api_view(['GET'])
def getAttractionsFromDB(request):
    userID = request.query_params.get("user_id")
    if not userID:
        return Response({"message": "User ID not found"}, status=status.HTTP_400_BAD_REQUEST)
    showAttractions = attractions.objects.filter(user_id=userID)
    serialiser = attractionConverter(showAttractions, many=True)
    print("Your User ID: ", userID)
    print("Your flights: ", showAttractions)

    return Response(serialiser.data)
# This function adds the answers from the travel preferences page to the database.
@api_view(['POST'])
def addTravelPref(request):
     # travelPrefConverter checks if all the fields from the travel preferences serialiser match.
        # If valid, it saves it to the travel preferences database
    travelPrefSerialiser = travelPrefConverter(data=request.data)
    if travelPrefSerialiser.is_valid():
        travelPrefSerialiser.save()
        return Response({"message": "Travel Preferences saved!"}, status=status.HTTP_201_CREATED)
    else:
        return Response(travelPrefSerialiser.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def getRecommendations(request):
    user_id = request.data.get("user_id")
    try:
        pref = travelPref.objects.get(user_id=user_id)
        userPreferences = {
            "reasonForTravel": pref.reasonForTravel,
            "budget": pref.budget,
            "accomodation": pref.accomodation,
            "destinationType": pref.destinationType,
            "flightDuration": pref.flightDuration,
            "weather": pref.weather,
            "travelCompanions": pref.travelCompanions,
            "flightPriority": pref.flightPriority,
            "favouriteActivities": pref.favouriteActivities or []
        }

        dataFrame = pd.read_csv('/Users/hussamkhan/Desktop/AI-Travel-App/Backend/travelAIBackend/cities.csv')
        cities = []
        for _, row in dataFrame.iterrows():
            cityDict = {
                "name": row["name"],
                "destinationType": row["destinationType"],
                "weather": row["weather"],
                "budget": row["budget"],
                "activities": row["activities"].split(";") if pd.notna(row["activities"]) else [],
                "flightDuration": row["flightDuration"]
            }
            cities.append(cityDict)

        recommendations = recommendationsContentFiltering(userPreferences, cities)
        recommendationsDictionary = {recommendation["name"]: recommendation["score"] for recommendation in recommendations}
        ratingsDataFrame = getAllUserData(cities)
        svdModel = trainingSVDModel(ratingsDataFrame)

        similarityScores = []
        for city in cities:
            cityName = city["name"]
            contentFilteringScore = recommendationsDictionary.get(cityName, 0) / 100
            prediction = svdModel.predict(str(user_id), cityName).est / 5
            simScore = (0.8 * contentFilteringScore) + (0.2 * prediction)
            
            similarityScores.append((cityName, round(simScore * 100, 2)))
        results = sorted(similarityScores, key=lambda x: x[1], reverse=True)[:10]
        recommendations = [{"name": name, "score": score} for name, score in results]
        return JsonResponse({"recommendations": recommendations})

    except Exception as e:
        traceback.print_exc()
        return JsonResponse({"error": "Failed to get recommendations."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

