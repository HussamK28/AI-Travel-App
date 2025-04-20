import React, { useState } from "react";
import axios from "axios";
import { GenerateNewToken } from "./APIs/FlightsAPI";
const Flights = () => {
    const [depAirport, setDepAirport] = useState("")
    const [arrAirport, setArrAirport] = useState("")
    const [depDate, setDepDate] = useState("")
    const [arrDate, setArrDate] = useState("")
    const [flightData, setFlightData] = useState(null)
    const apiAccessToken = GenerateNewToken()

    const newDepAirport = (e) => {
        setDepAirport(e.target.value)
    }

    const newArrAirport = (e) => {
        setArrAirport(e.target.value)
    }

    const newDepDate = (e) => {
        setDepDate(e.target.value)
    }

    const newArrDate = (e) => {
        setArrDate(e.target.value)
    }


    const fetchData = async () => {
        try {
            const apiAccessToken = await GenerateNewToken();
            const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
                headers: {
                    'Authorization': `Bearer ${apiAccessToken}`
                },
                params: {
                    originLocationCode: depAirport,
                    destinationLocationCode: arrAirport,
                    departureDate: depDate,
                    returnDate: arrDate,
                    adults: 1,
                    nonStop: true,
                    max: 20
                }
            });
            console.log("The flights API Token is: ", apiAccessToken);
            console.log(response.data);
            setFlightData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const submitForm = (e) => {
        e.preventDefault()
        fetchData()
    }
    return (
        <div className="container">
            <h1>Search for Flights</h1>
            <form onSubmit={submitForm}>
                <div className="departure-airport">
                    <label>From:</label>
                    <input type="text"
                        placeholder="Enter 3 Letters"
                        value={depAirport}
                        onChange={newDepAirport}
                        required></input>

                </div>
                <div className="arrival-airport">
                    <label>To:</label>
                    <input type="text"
                        placeholder="Enter 3 Letters"
                        value={arrAirport}
                        onChange={newArrAirport}
                        required></input>
                </div>

                <div className="departure-date">
                    <label>Departure Date:</label>
                    <input type="date"
                        value={depDate}
                        onChange={newDepDate}
                        required></input>
                </div>

                <div className="arrival-date">
                    <label>Return Date:</label>
                    <input type="date"
                        value={arrDate}
                        onChange={newArrDate}
                        required></input>

                </div>

                <div className="button">
                    <button className="submit-button"
                        type="submit">Find Flights
                    </button>
                </div>
            </form>

            {flightData && flightData.data && flightData.data.length > 0 && (
                <div>
                    <h1>Airline: {flightData.data[0].itineraries[0]?.segments[0]?.carrierCode}</h1>
                    <h2>Departure Airport: {flightData.data[0].itineraries[0]?.segments[0]?.departure?.iataCode}</h2>
                    <p>Terminal: {flightData.data[0].itineraries[0]?.segments[0]?.departure?.terminal}</p>
                    <h3>Departure Time: {flightData.data[0].itineraries[0]?.segments[0]?.departure?.at.split("T")[1].slice(0, 5)}</h3>
                    <h2>Arrival Airport: {flightData.data[0].itineraries[0]?.segments[0]?.arrival?.iataCode}</h2>
                    <p>Terminal: {flightData.data[0].itineraries[0]?.segments[0]?.arrival?.terminal}</p>
                    <h3>Arrival Time: {flightData.data[0].itineraries[0]?.segments[0]?.arrival?.at.split("T")[1].slice(0, 5)}</h3>
                    <p>Total Price: €{flightData.data[0].price.total}</p>
                </div>
            )}

        </div>

    )

}
export default Flights