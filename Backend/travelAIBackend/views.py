from django.shortcuts import render, HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import users
from .serializers import userConverter
import requests
import time
from django.http import JsonResponse
from django.conf import settings

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
    if apiAccessToken and apiExpiry > time.time(): # Checks if there is still time remaining on token
        return apiAccessToken
    else:
        url = "https://test.api.amadeus.com/v1/security/oauth2/token" # URL to receive token
        APIdata = { # API Key and secret
            "grant_type":"client_credentials",
            "client_id": settings.flightsAPIKey,
            "client_secret": settings.flightsAPISecret
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        response = requests.post(url, data=APIdata, headers=headers) # sends the above information to the server to see if we can receive it.
        if response.status_code == 200: # This means response is ok and valid
            data = response.json() # Turns server response into a JSON file
            apiAccessToken = data["access_token"] # Updates new access token
            apiExpiry = time.time + data["expires_in"] # Updates expiry time
            return data["access_token"]
        else:
            return None

def viewFlightsAPIToken():
    token = getFlightsAPIToken()
    if token:
        return JsonResponse({"access_token": token}, status=200)
    else:
        return JsonResponse({"error": "Failed to get token"}, status=500)
