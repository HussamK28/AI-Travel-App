// Imports the React, axios, useEffect, useState and CSS file.
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
const UserRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate

  // The useEffect function fetches the data from the getRecommendations view and the recommendations python file
  // in the django backend.
  useEffect(() => {
    const fetchRecommendations = async () => {
      const userID = localStorage.getItem("userID")
      try {
        const response = await axios.post("http://127.0.0.1:8000/getRecommendations/", {
          user_id: userID
        })
        setRecommendations(response.data.recommendations);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRecommendations();
  }, []);

  // This part displays the recommendations to the user.
  return (
    <div className="container">
      <h1>Your Recommendations</h1>
      <div className="container-card">
        {recommendations.map((recommendation, id) => (
          <div key={id} className="card">
            <h2>Destination: {recommendation.name}</h2>
            <p>Score: {recommendation.score}/100</p>
            <button onClick={() => navigate("/Flights")}>Search For Flights</button>
            <button onClick={() => navigate("/Hotels")}>Search For Hotels</button>
            <button onClick={() => navigate("/Activities")}>Search For Attractions</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserRecommendations;
