from django.shortcuts import render, HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import users
from .serializers import userConverter

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
