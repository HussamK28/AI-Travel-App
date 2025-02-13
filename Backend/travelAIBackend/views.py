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
    print(userSerialiser.errors)
    return Response(userSerialiser.errors, status=status.HTTP_400_BAD_REQUEST)


