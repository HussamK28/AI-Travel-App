import React, { useState } from "react";
const Flights = () => {
    const [depAirport, setDepAirport] = useState("")
    const [arrAirport, setArrAirport] = useState("")
    const [depDate, setDepDate] = useState("")
    const [arrDate, setArrDate] = useState("")

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
    return (
        <div className="container">
            <h1>Search for Flights</h1>
            <form>
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

        </div>

    )

}
export default Flights