import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity, euclidean_distances
from .models import travelPref
from surprise import Dataset, Reader, SVD

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
        scores = recommendationsContentFiltering(userPreferences, cities)
        for recommendation in scores:
            allScores.append({
                "userID": str(user.user_id),
                "itemID": recommendation["name"],
                "rating": round(recommendation["score"] / 10,2)
            })
            return pd.DataFrame(allScores)

def recommendationsContentFiltering(userPreferences, cities):
    cityNames = []
    cityInfo = []
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
    
    userInfo = ''.join([
            userPreferences.get("destinationType", ""),
            userPreferences.get("weather", ""),
            userPreferences.get("budget", ""),
            userPreferences.get("flightDuration", ""),
            ''.join(userPreferences.get("favouriteActivities", []))
    ])

    tfIDFVector = TfidfVectorizer(stop_words='english')
    dataMatrix = tfIDFVector.fit_transform(cityInfo + [userInfo])
    userMatrix = dataMatrix[-1]
    cityMatrix = dataMatrix[:-1]
    cosineSimilarityScore = cosine_similarity(userMatrix, cityMatrix).flatten()
    euclideanSimilarityScore = 1 / (1 + euclidean_distances(userMatrix, cityMatrix)).flatten()

    similarityScore = (0.7 * cosineSimilarityScore) + (0.3 * euclideanSimilarityScore)

    topRecommendations = similarityScore.argsort()[::-1][:10]

    recommendations = [
        {"name": cityNames[i], "score": round(float(similarityScore[i]) *  200,2)}
        for i in topRecommendations
    ]
    return recommendations

def trainingSVDModel(ratingsDataFrame):
    reader = Reader(rating_scale=(0,100))
    data = Dataset.load_from_df(ratingsDataFrame[["userID", "itemID", "rating"]], reader)
    trainingSet = data.build_full_trainset()
    model = SVD()
    model.fit(trainingSet)
    return model