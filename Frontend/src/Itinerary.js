// Imports React, axios, useState, useEffect and CSS file
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Styles/Itinerary.css'
// The setter function set the results from each database call below
const Itinerary = () => {
    const [savedFlights, setSavedFlights] = useState([])
    const [savedHotels, setSavedHotels] = useState([])
    const [savedAttractions, setSavedAttractions] = useState([])
    const userID = localStorage.getItem("userID")
    const navigate = useNavigate()
    if (!userID) {
        alert("Users must be logged in to view itinerary")
        navigate("/userRecommendations")
    }

    // This calls the getFlightsFromDB URL in the backend, checks if the userID exists in the database
    // and saves the response in setSavedFlights
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/getFlightsFromDB/", {
            params: { user_id: userID }
        })
            .then(response => {
                console.log("Flights from backend:", response.data);
                setSavedFlights(response.data);
            })
            .catch(error => console.error("Error fetching flights:", error));
    }, []);

    // This calls the getHotelsFromDB URL in the backend, checks if the userID exists in the database
    // and saves the response in setSavedHotels
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/getHotelsFromDB/", {
            params: { user_id: userID }
        })
            .then(response => {
                console.log("hotels from backend:", response.data);
                setSavedHotels(response.data);
            })
            .catch(error => console.error("Error fetching hotels:", error));
    }, []);

    // This calls the getAttracvtionsFromDB URL in the backend, checks if the userID exists in the database
    // and saves the response in setSavedAttractions
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/getAttractionsFromDB/", {
            params: { user_id: userID }
        })
            .then(response => {
                console.log("attractions from backend:", response.data);
                setSavedAttractions(response.data);
            })
            .catch(error => console.error("Error fetching attractions:", error));
    }, []);

    const removeFlight = async (flightID) => {
        try {
            const response = await axios.delete('http://localhost:8000/removeFlight/', {
                params: { id: flightID }
            });
            console.log(response.data);
            alert("Flight Removed")
            window.location.reload();
        } catch (error) {
            console.error(error.response?.data || "Unknown error");
        }
    };
    
    const removeHotel = async (hotelID) => {
        try {
            // Ensure you're sending the 'id' as a query param
            const response = await axios.delete('http://localhost:8000/removeHotel/', {
                params: { id: hotelID }  // This adds ?id=hotelID to the URL
            });
            console.log(response.data);
            alert("Hotel Removed");
            window.location.reload();
        } catch (error) {
            console.error(error.response?.data || "Unknown error");
        }
    };
    



        // Here is where the user itinerary is displayed to the user.
        return (
            <div className="container">
                <h1>Here's your itinerary...</h1>
                <h2>Your Flight Details</h2>
                <ul>
                    {/* This uses tne savedFlights variable and maps through each element of the JSON response for flights */}
                    {savedFlights.map(flight => (
                        <li key={flight.id}>
                            <div className="flight-details">
                                <strong>Flight: {flight.airline} {flight.flightNum}</strong>
                            </div>

                            <div className="departure-details">
                                <strong>Departure Flight: {flight.departureAirport} on {flight.departureDate} at {flight.departureTime} </strong>
                            </div>

                            <div className="arrival-details">
                                <strong>Arrival Flight: {flight.arrivalAirport} on {flight.departureDate} at {flight.arrivalTime} </strong>
                            </div>

                            <div className="duration-price">
                                <strong>Duration: {flight.duration}</strong> <br />
                                <strong>Price: £{flight.price}</strong>
                            </div>

                            <div className="remove-button">
                                <button onClick={() => removeFlight(flight.id)}>Remove From Itinerary</button>
                            </div>
                        </li>
                    ))}
                </ul>
                <h2>Your Hotel details</h2>
                <ul>
                    {/* This uses tne savedHotels variable and maps through each element of the JSON response for hotels */}
                    {savedHotels.map(hotel => (
                        <li key={hotel.id}>
                            <div className="hotel-details">
                                <strong>{hotel.name}</strong> <br />
                                {hotel.roomDescription} <br />
                                <strong>Check in date: {hotel.checkInDate}</strong> <br />
                                <strong>Check out date: {hotel.checkOutDate}</strong> <br />
                                <strong>Price: £{hotel.price}</strong>
                            </div>
                            <div className="remove-button">
                            <button onClick={() => removeHotel(hotel.id)}>Remove From Itinerary</button>
                            </div>
                        </li>
                    ))}
                </ul>
                <h2>Your Attractions details</h2>
                <ul>
                    {/* This uses tne savedAttractions variable and maps through each element of the JSON response for attractions */}
                    {savedAttractions.map(attraction => (
                        <li key={attraction.id}>
                            <div className="attraction-details">
                                <strong>Place Name: {attraction.name}</strong> <br />
                                City: {attraction.city} <br />
                                Is this place wheelchair accessible: {attraction.isWheelchairAccessible}
                            </div>
                            <div className="remove-button">
                                <button>Remove From Itinerary</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
    export default Itinerary

