from django.shortcuts import render, HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import users
from .serializers import userConverter

api_view(['POST'])
def addUserToDatabase(request):
    userSeraliser = userConverter(data=request.data)
    if userSeraliser.is_valid():
        userSeraliser.save()
        return Response({"message": "Employee added successfully!"}, status=status.HTTP_201_CREATED)
    return Response(userSeraliser.errors, status=status.HTTP_400_BAD_REQUEST)


