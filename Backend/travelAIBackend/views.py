from django.shortcuts import render, HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import users
from .serializers import userConverter, attractionConverter
import requests
import time
from django.http import JsonResponse
from django.conf import settings
import traceback

@api_view(['POST'])
def addUserToDatabase(request):
    print(request.data)
    userSerialiser = userConverter(data=request.data)
    if userSerialiser.is_valid():
        userSerialiser.save()
        return Response({"message": "Registration Successful!"}, status=status.HTTP_201_CREATED)
    else:
        return Response(userSerialiser.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def accountExists(request):
    print(request.data)
    doesExist = users.objects.filter(email=request.data.get('email'), password=request.data.get('password')).exists()
    if doesExist == True:
        return Response({"message": "Login Successful!"}, status=status.HTTP_202_ACCEPTED)
    else:
        return Response({"message": "Email or password incorrect, please try again!"}, status=status.HTTP_400_BAD_REQUEST)


apiAccessToken = None
apiExpiry = 0


def getFlightsAPIToken():
    global apiAccessToken, apiExpiry
    if apiAccessToken is not None and apiExpiry > time.time(): 
        return apiAccessToken
    else:
        url = "https://test.api.amadeus.com/v1/security/oauth2/token"
        APIdata = { # API Key and secret
            "grant_type":"client_credentials",
            "client_id": settings.FLIGHTS_API_KEY,
            "client_secret": settings.FLIGHTS_API_SECRET
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        response = requests.post(url, data=APIdata, headers=headers)
        if response.status_code == 200:
            data = response.json()
            apiAccessToken = data["access_token"]
            apiExpiry = time.time() + data["expires_in"]
            return data["access_token"]


def viewFlightsAPIToken(request):
    print("FLIGHTS_API_KEY in view:", settings.FLIGHTS_API_KEY)
    print("FLIGHTS_API_SECRET in view:", settings.FLIGHTS_API_SECRET)

    if not settings.FLIGHTS_API_KEY or not settings.FLIGHTS_API_SECRET:
        return JsonResponse({"error": "FLIGHTS_API_KEY or FLIGHTS_API_SECRET is missing"}, status=500)

    token = getFlightsAPIToken()
    
    if token is not None:
        return JsonResponse({"access_token": token}, status=200)
    else:
        return JsonResponse({"error": "Failed to get token"}, status=500)

@api_view(['POST'])
def addToItinerary(request):
    try:
        print("Incoming data:", request.data)

        attractionSeraliser = attractionConverter(data=request.data)
        
        if attractionSeraliser.is_valid():
            attractionSeraliser.save()
            print("Successfully saved attraction!")
            return Response({"message": "Added to itinerary"}, status=status.HTTP_201_CREATED)
        else:
            print("Serializer errors:", attractionSeraliser.errors)
            return Response(attractionSeraliser.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        import traceback
        print("EXCEPTION:")
        traceback.print_exc()
        return Response({"error": "Something went wrong on the server."}, status=500)
