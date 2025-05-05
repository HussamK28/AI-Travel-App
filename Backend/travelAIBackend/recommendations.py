# Imports all the modules we need for the recommendation system
# Such as sklearn for the TF-IDF vector feature or to calculate similarity
import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity, euclidean_distances
from .models import travelPref
from surprise import Dataset, Reader, SVD

# This function gets every user's data in the travel preferences array who have filled out a travel pref form
# and extracts every avaliable row to put in user profile.
def getAllUserData(cities):
    allScores = []

    allUsers = travelPref.objects.all()
    for user in allUsers:
        userPreferences = {
            "destinationType": user.destinationType,
            "weather": user.weather,
            "budget": user.budget,
            "flightDuration": user.flightDuration,
            "favouriteActivities": user.favouriteActivities or []
        }
        # This calls the content based filtering method and takes the user preferences dictionary of database data
        # and cities CSV and rates it by diving the score by 10 and rounding to 2 dp
        scores = recommendationsContentFiltering(userPreferences, cities)
        for recommendation in scores:
            allScores.append({
                "userID": str(user.user_id),
                "itemID": recommendation["name"],
                "rating": round(recommendation["score"] / 10,2)
            })
            return pd.DataFrame(allScores)

# This is the content filter function. This takes in user preferences from database and cities CSV
def recommendationsContentFiltering(userPreferences, cities):
    cityNames = []
    cityInfo = []
    # This extract each element of cities CSV and joins them together for TF-IDF vectorisation. 
    # Some attributes like favourite activities are worth 3 times more to favour them in the similarity method
    for city in cities:
        cityData = ''.join([
            city.get("destinationType", "") * 2,
            city.get("weather", "") * 2,
            city.get("budget", ""),
            city.get("flightDuration", ""),
            ''.join(city.get("activities", [])) * 3
        ])
        cityNames.append(city["name"])
        cityInfo.append(cityData)
    # This gets all the user preferences information together to compare it with city information
    userInfo = ''.join([
            userPreferences.get("destinationType", ""),
            userPreferences.get("weather", ""),
            userPreferences.get("budget", ""),
            userPreferences.get("flightDuration", ""),
            ''.join(userPreferences.get("favouriteActivities", []))
    ])

    # TF-IDF searches for the most common key words in both the city and the user matrices to find matching array
    tfIDFVector = TfidfVectorizer(stop_words='english')
    dataMatrix = tfIDFVector.fit_transform(cityInfo + [userInfo])
    userMatrix = dataMatrix[-1]
    cityMatrix = dataMatrix[:-1]
    # This finds the cosine similarity between the 2 matrices and then flattens to a 1D array
    cosineSimilarityScore = cosine_similarity(userMatrix, cityMatrix).flatten()
    # This finds the euclidean distance of the 2 matrices before finding the inverse to get the similarity
    euclideanSimilarityScore = 1 / (1 + euclidean_distances(userMatrix, cityMatrix)).flatten()

    # The different weightings of the similarity methods
    similarityScore = (0.7 * cosineSimilarityScore) + (0.3 * euclideanSimilarityScore)

    # This returns the top 10 most highly rated scores
    topRecommendations = similarityScore.argsort()[::-1][:10]

    recommendations = [
        {"name": cityNames[i], "score": round(float(similarityScore[i]) *  200,2)}
        for i in topRecommendations
    ]
    return recommendations

# This is the SVD model that is used in collaborative based filtering
def trainingSVDModel(ratingsDataFrame):
    reader = Reader(rating_scale=(0,100))
    data = Dataset.load_from_df(ratingsDataFrame[["userID", "itemID", "rating"]], reader)
    trainingSet = data.build_full_trainset()
    model = SVD()
    model.fit(trainingSet)
    return model