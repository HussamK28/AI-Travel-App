from rest_framework import serializers
from .models import users, attractions, flights, hotels, travelPref

# Below uses the users model from models.py and converts it into a readable format
class userConverter(serializers.ModelSerializer):
    class Meta:
        model = users
        fields = ['firstName', 'surname', 'email', 'password']
# Below uses the attractions model from models.py and converts it into a readable format
class attractionConverter(serializers.ModelSerializer):
    userID = serializers.IntegerField(write_only=True)
    # user_id reads the id column in the users table which is used for the foreign key
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    class Meta:
        model = attractions
        fields = ['id', 'name', 'isWheelchairAccessible', 'city', 'userID', 'user_id']

    # The create function reads the data from the serialiser and adds the id field from the users table as userID
    def create(self, validated_data):
        user_id = validated_data.pop('userID')
        user_instance = users.objects.get(id=user_id)
        return attractions.objects.create(user=user_instance, **validated_data)


# Below uses the flights model from models.py and converts it into a readable format
class flightsConverter(serializers.ModelSerializer):
    userID = serializers.IntegerField(write_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    class Meta:
        model = flights
        fields = ['id','airline', 'flightNum', 'departureAirport', 'departureDate', 'departureTime', 'arrivalAirport', 'arrivalTime', 'duration', 'price', 'userID', 'user_id']

    def create(self, validated_data):
        user_id = validated_data.pop('userID')
        user_instance = users.objects.get(id=user_id)
        return flights.objects.create(user=user_instance, **validated_data)


# Below uses the hotels model from models.py and converts it into a readable format
class hotelConverter(serializers.ModelSerializer):
    userID = serializers.IntegerField(write_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    class Meta:
        model = hotels
        fields = ['id', 'name', 'roomDescription', 'price', 'checkInDate', 'checkOutDate', 'userID', 'user_id']

    def create(self, validated_data):
        user_id = validated_data.pop('userID')
        user_instance = users.objects.get(id=user_id)
        return hotels.objects.create(user=user_instance, **validated_data)

# Below uses the travelPref model from models.py and converts it into a readable format
class travelPrefConverter(serializers.ModelSerializer):
    userID = serializers.IntegerField(write_only=True)

    class Meta:
        model = travelPref
        fields = ['userID', 'reasonForTravel', 'budget', 'accomodation', 'destinationType',
                  'flightDuration', 'weather', 'travelCompanions', 'flightPriority', 'favouriteActivities']

    def create(self, validated_data):
        user_id = validated_data.pop('userID')
        user_instance = users.objects.get(id=user_id)
        return travelPref.objects.create(user=user_instance, **validated_data)