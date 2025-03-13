import React, { useState} from "react";
import axios from "axios";
const Flights = () => {
    const [depAirport, setDepAirport] = useState("")
    const [arrAirport, setArrAirport] = useState("")
    const [depDate, setDepDate] = useState("")
    const [arrDate, setArrDate] = useState("")
    const [flightData, setFlightData] = useState(null)

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

    const apiAccessToken = 'n29HGMSs783G5tNNXXUlzpX8GZuD'

    const fetchData = async() => {
        try {
            const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=LHR&destinationLocationCode=JFK&departureDate=2025-05-02&returnDate=2025-05-10&adults=1&nonStop=false&max=250', {
                headers: {
                    'Authorization': `Bearer ${apiAccessToken}`
                }
            });
            console.log(response.data); // Handle the response data
            setFlightData(response.data)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }


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
                    <label>Arrival Date:</label>
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

            {flightData ? (
            <>
            <h2>{flightData.name}</h2>
            </>
            ) : (
            <p>Loading flight data...</p>
            )}

        </div>

    )

}
export default Flights