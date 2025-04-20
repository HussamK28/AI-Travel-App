from rest_framework import serializers
from .models import users, attractions

# Below uses the users model from models.py and converts it into a readable format
class userConverter(serializers.ModelSerializer):
    class Meta:
        model = users
        fields = ['firstName', 'surname', 'email', 'password']
# Below uses the attractions model from models.py and converts it into a readable format
class attractionConverter(serializers.ModelSerializer):
    class Meta:
        model = attractions
        fields = ['name']
