// Imports the React, axios, useState and CSS file.
import axios from "axios";
import React, { useState } from "react";
import './Styles/travelPref.css'
// Here are the variables that take in the user's input.
const TravelPreferences = () => {
    const [reasonForTravel, setReasonForTravel] = useState('')
    const [budget, setBudget] = useState('')
    const [accomodation, setAccomodation] = useState('')
    const [destinationType, setDestinationType] = useState('')
    const [flightDuration, setFlightDuration] = useState('')
    const [weather, setWeather] = useState('')
    const [favouriteActivities, setFavouriteActivities] = useState([])
    const [travelCompanions, setTravelCompanions] = useState('')
    const [flightPriority, setFlightPriority] = useState('')

    const newReasonForTravel = (e) => {
        setReasonForTravel(e.target.value);
    }
    const newBudget = (e) => {
        setBudget(e.target.value);
    }
    const newAccomodation = (e) => {
        setAccomodation(e.target.value);
    }
    const newDestinationType = (e) => {
        setDestinationType(e.target.value);
    }
    const newFlightDuration = (e) => {
        setFlightDuration(e.target.value);
    }
    const newWeather = (e) => {
        setWeather(e.target.value);
    }
    const newFavouriteActivities = (e) => {
        setFavouriteActivities(e.target.value);
    }
    const newTravelCompanions = (e) => {
        setTravelCompanions(e.target.value);
    }
    const newFlightPriority = (e) => {
        setFlightPriority(e.target.value);
    }

    // For the favourite activities question, the user can add multiple activities into the favouriteActivities array
    // The array updates when the user adds or deletes an activity
    const handleActivityToggle = (activity) => {
        setFavouriteActivities(previousActivities => {
            if (previousActivities.includes(activity)) {
                return previousActivities.filter(a => a !== activity);
            } else {
                return [...previousActivities, activity];
            }
        });
    };

    // This sends the answer to each question and the userID saved in local storage to the travel preferences database
    const submitForm = async (e) => {
        e.preventDefault()
        const userID = localStorage.getItem("userID")
        try {
            const response = await axios.post("http://127.0.0.1:8000/addTravelPref/", {userID, reasonForTravel, budget, accomodation, destinationType, flightDuration, weather, travelCompanions, flightPriority, favouriteActivities});
            alert(response.data.message || "Travel Preferences added Successfully!");
            
        } catch (error) {
            console.error(error)
            alert("We were unable to add your travel preferences your account!")
        }
    }
    // Here are the multiple choice questions the user is asked for the survey. Each array has multiple answers the user can choose from
    const questions = {
        reasonForTravel: ["Vacation", "Business", "Adventure", "Visiting friends or family", "Cultural exchange"],
        budget: ["Budget-friendly", "Mid-range", "Luxury", "Flexible"],
        accomodation: ["Budget hotel or hostel", "Mid-range hotel", "Luxury resort", "5-star hotel", "Airbnb"],
        destinationType: ["Beaches", "Nature", "City Break", "Historical sites", "Quiet Retreats"],
        flightDuration: ["Short Haul (3 hours or less)", "Medium Haul (3–6 hours)", "Long Haul (6–10 hours)", "Ultra Long Haul (10+ Hours)","Any distance"],
        weather: ["Warm and sunny", "Cool and breezy", "Cold and snowy", "Doesn’t matter"],
        travelCompanions: ["Solo", "Couple", "Friends", "Family"],
        flightPriority: ["Lowest price", "Shortest travel time", "Most comfortable", "Best departure/arrival times"],
        favouriteActivities: ['tourist_attraction', 'restaurant', 'museum', 'amusement_park', 'shopping_mall', 'park', 'beaches'],
    };
    // Here is the form for the travel preferences.
    return (
        <div className="container">
            <h1>Travel Preferences Form</h1>
            <form onSubmit={submitForm}>
                <div className="reason-for-travel">
                    <label>Select reason for travel</label> <br />
                    <select id="reason-for-travel" value={reasonForTravel} onChange={newReasonForTravel} required>
                        {/* This maps through each option in the question array for reason for travel and displays the possible suggestions to the user */}
                        <option value="">Select an option</option>
                        {questions.reasonForTravel.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                <div className="budget">
                    <label>Select your budget type</label> <br />
                    <select id="budget" value={budget} onChange={newBudget} required>
                        <option value="">Select an option</option>
                        {questions.budget.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                <div className="Accomodation">
                    <label>Select your accomodation type</label> <br />
                    <select id="accomodation" value={accomodation} onChange={newAccomodation} required>
                        <option value="">Select an option</option>
                        {questions.accomodation.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                <div className="destination-type">
                    <label>Select your type of destination</label> <br />
                    <select id="destination-type" value={destinationType} onChange={newDestinationType} required>
                        <option value="">Select an option</option>
                        {questions.destinationType.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                <div className="flight-duration">
                    <label>Select your ideal flight duration</label> <br />
                    <select id="flight-duration" value={flightDuration} onChange={newFlightDuration} required>
                        <option value="">Select an option</option>
                        {questions.flightDuration.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                <div className="weather">
                    <label>Select your ideal weather</label> <br />
                    <select id="weather" value={weather} onChange={newWeather} required>
                        <option value="">Select an option</option>
                        {questions.weather.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                <div className="travel-companions">
                    <label>Select your trip type</label> <br />
                    <select id="travel-companions" value={travelCompanions} onChange={newTravelCompanions} required>
                        <option value="">Select an option</option>
                        {questions.travelCompanions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                <div className="flight-priority">
                    <label>Select your flight priority</label> <br />
                    <select id="flight-priority" value={flightPriority} onChange={newFlightPriority} required>
                        <option value="">Select an option</option>
                        {questions.flightPriority.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                {/* This section uses checkboxes so the user can check as many activities as they like. */}
                <div className="favourite-activities">
                    <label>Select your favourite activities</label> <br />
                    <div className="checkbox-group">
                        {questions.favouriteActivities.map(activity => (
                            <div key={activity}>
                                <input type="checkbox" id={activity} value={activity} checked={favouriteActivities.includes(activity)} onChange={() => handleActivityToggle(activity)}
                                />
                                <label htmlFor={activity}>{activity.replace('_', ' ')}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );

}
export default TravelPreferences;