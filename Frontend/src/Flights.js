// Imports all necessary modules needed for this page
import React, { useState } from "react";
import axios from "axios";
import { GenerateNewToken } from "./APIs/FlightsAPI";
import './Styles/Flights.css'

// Defines the Flights function for this page
const Flights = () => {
    // Here are the getter and setter variables that are used in the form below. 
    // UseState sets the setter variables to a default value
    const [depAirport, setDepAirport] = useState("");
    const [arrAirport, setArrAirport] = useState("");
    const [depDate, setDepDate] = useState("");
    const [retDate, setRetDate] = useState("");
    const [flightData, setFlightData] = useState(null);
    const [numAdults, setNumAdults] = useState(0);
    const [numChildren, setNumChildren] = useState(0);
    const [numInfants, setNumInfants] = useState(0);
    // These functions set the setter variables to its new values when changed on the form
    const newDepAirport = (e) => {
        setDepAirport(e.target.value);
    }
    const newArrAirport = (e) => {
        setArrAirport(e.target.value);
    }
    const newDepDate = (e) => {
        setDepDate(e.target.value);
    }
    const newRetDate = (e) => {
        setRetDate(e.target.value);
    }
    const newNumAdults = (e) => {
        setNumAdults(e.target.value);
    }
    const newNumChildren = (e) => {
        setNumChildren(e.target.value);
    }
    const newNumInfants = (e) => {
        setNumInfants(e.target.value);
    }

    // This function adds the flights the user selects from the data below into the database
    const addFlights = async (flightOffer, itinerary, segment, depDate, retDate, iIndex) => {
        // Gets the userID which has been stored in local storage
        const userID = localStorage.getItem("userID")
        if(!userID) {
            alert("Please log in to add flights")
        }
        const airline = segment.carrierCode
        const flightNum = segment.number
        const departureAirport = segment.departure.iataCode
        let departureDate = "";
        // checks if flight is either outbound or inbound and assigns the correct date according to user inputs
        if(iIndex % 2 === 1) {
            departureDate = depDate
        }
        else {
            departureDate = retDate
        }

        // Departure and arrival time are only using the hours and minutes elements from the UTC
        const departureTime = segment.departure.at.split("T")[1].slice(0, 5)
        const arrivalAirport = segment.arrival.iataCode
        const arrivalTime = segment.arrival.at.split("T")[1].slice(0, 5)
        const duration = itinerary.duration.replace("PT", "")
        const price = flightOffer.price.total
        // sends to addFlights view in views.py on the backend to send the user input to the database using the following
        // parameters
        try {
            const response = await axios.post("http://127.0.0.1:8000/addFlights/", {
                airline: airline,
                flightNum: flightNum,
                departureAirport: departureAirport,
                departureDate: departureDate,
                departureTime: departureTime,
                arrivalAirport: arrivalAirport,
                arrivalTime: arrivalTime,
                duration: duration,
                price: price,
                userID: userID

            });
            // User is sent a pop-up message saying either it was correctly added to database or not if there is errors
            alert(response.data.message || "Added to itinerary");
        } catch (error) {
            console.error(error);
            alert("We were unable to add flight");
        }
    };

    // This function fetches the data
    const fetchData = async () => {
        try {
            // Generates a new token if previous access token has expired
            const apiAccessToken = await GenerateNewToken();
            // Calls the Amadeus API using the URL and the below parameters
            const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
                headers: {
                    'Authorization': `Bearer ${apiAccessToken}`
                },
                params: {
                    originLocationCode: depAirport,
                    destinationLocationCode: arrAirport,
                    departureDate: depDate,
                    returnDate: retDate,
                    adults: numAdults,
                    children: numChildren,
                    infants: numInfants,
                    nonStop: true,
                    currencyCode: 'GBP',
                    max: 20
                }
            });
            // sets flightData varible using the response from the API and converts it to a JSON
            setFlightData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    // This function runs when search button is clicked, this checks for any errors and then performs the API call function
    const submitForm = (e) => {
        e.preventDefault();
        fetchData();
    };

    // Below is the form element where users can enter the details needed to search for a flight.
    return (
        <div className="container">
            <h1>Search for Flights</h1>
            <form onSubmit={submitForm}>
                <div className="departure-airport">
                    <label>From:</label>
                    <input
                        type="text"
                        placeholder="Enter 3 Letters"
                        value={depAirport}
                        onChange={newDepAirport}
                        required
                    />
                </div>

                <div className="arrival-airport">
                    <label>To:</label>
                    <input
                        type="text"
                        placeholder="Enter 3 Letters"
                        value={arrAirport}
                        onChange={newArrAirport}
                        required
                    />
                </div>

                <div className="departure-date">
                    <label>Departure Date:</label>
                    <input
                        type="date"
                        value={depDate}
                        onChange={newDepDate}
                        required
                    />
                </div>

                <div className="return-date">
                    <label>Return Date:</label>
                    <input
                        type="date"
                        value={retDate}
                        onChange={newRetDate}
                        required
                    />
                </div>

                <div className="people">
                    <label>Adults (13+):</label>
                    <input
                        type="number"
                        value={numAdults}
                        onChange={newNumAdults}
                        required
                    />

                    <label>Children (2-12):</label>
                    <input
                        type="number"
                        value={numChildren}
                        onChange={newNumChildren}
                        required
                    />

                    <label>Infants (0-2):</label>
                    <input
                        type="number"
                        value={numInfants}
                        onChange={newNumInfants}
                        required
                    />
                </div>

                <div className="flights-button">
                    <button className="submit-button" type="submit">Find Flights</button>
                </div>
            </form>

            {/* Here is the flight data response to the API*/}
            {flightData?.data?.length > 0 && (
                <div>
                    {/* The .map() function iterates through the response data up to the specifed max parameter */}
                    {/* Here it iterates through the main part of the API and displays the option number for each flight and the price*/}
                    {flightData.data.map((flightOffer, index) => (
                        <div key={index} className="flight-offer">
                            <h2>Option {index + 1}</h2>
                            <p>Total Price: £{flightOffer.price.total}</p>

                            {/* This section of code iterates within the main flightOffer section into the itineary subsection to find flight duration times*/}

                            {flightOffer.itineraries.map((itinerary, iIndex) => (
                                <div key={iIndex} className="itinerary">
                                    <h3>Itinerary {iIndex + 1} (Duration: {itinerary.duration.replace("PT", "")})</h3>

                                    {/*  This section iterates through the itineary section and goes into the segment subsection of the API response*/}
                                    {/* Here we will find the airline code, Flight number, Departure and Arrival times and Airports */}
                                    {itinerary.segments.map((segment, sIndex) => (
                                        <div key={sIndex} className="segment">
                                            <h4>Segment {sIndex + 1}</h4>
                                            <p><strong>Airline:</strong> {segment.carrierCode}</p>
                                            <p><strong>Flight Number:</strong> {segment.number}</p>
                                            <p><strong>Departure Airport:</strong> {segment.departure.iataCode} (Terminal {segment.departure.terminal || "N/A"})</p>
                                            <p><strong>Departure Time:</strong> {segment.departure.at.split("T")[1].slice(0, 5)}</p>
                                            <p><strong>Arrival Airport:</strong> {segment.arrival.iataCode} (Terminal {segment.arrival.terminal || "N/A"})</p>
                                            <p><strong>Arrival Time:</strong> {segment.arrival.at.split("T")[1].slice(0, 5)}</p>
                                            <p><strong>Segment Duration:</strong> {segment.duration.replace("PT", "")}</p>
                                            <button onClick={() => addFlights(flightOffer, itinerary, segment, depDate, retDate, iIndex )}>Add Flight to Itinerary</button>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Flights;
