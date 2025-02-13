from rest_framework import serializers
from .models import users

# Below uses the users model from models.py and converts it into a readable format
class userConverter(serializers.ModelSerializer):
    class Meta:
        model = users
        fields = '__all__'
