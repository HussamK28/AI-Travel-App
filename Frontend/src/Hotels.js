import React, {useState} from "react";
import axios from "axios";
const Hotels = () => {
    const [location, setLocation] = useState("")
    const [checkInDate, setCheckInDate] = useState("")
    const [checkOutDate, setCheckOutDate] = useState("")
    const [numOfPeople, setNumOfPeople] = useState("")
    const [numOfRooms, setNumOfRooms] = useState("")

    const  newHotelLocation = (e) => {
        setLocation(e.target.value)
    }

    const newCheckInDate = (e) => {
        setCheckInDate(e.target.value)
    }

    const newCheckOutDate = (e) => {
        setCheckOutDate(e.target.value)
    }

    const newNumOfPeople = (e) => {
        setNumOfPeople(e.target.value)
    }

    const newNumOfRooms = (e) => {
        setNumOfRooms(e.target.value)
    }



    const fetchData = async() => {
        try {
            const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${depAirport}&destinationLocationCode=${arrAirport}&departureDate=${depDate}&returnDate=${arrDate}&adults=1&nonStop=false&max=250', {
                headers: {
                    'Authorization': `Bearer ${apiAccessToken}`
                }
            });
            console.log("The flights API Token is: ", apiAccessToken)
            console.log(response.data); 
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
            <h1>Search for Hotels</h1>
            <form onSubmit={submitForm}>
                <div className="hotel-location">
                    <label>Location:</label>
                    <input type="text" 
                    placeholder="Enter your destination" 
                    value={location}
                    onChange={newHotelLocation} 
                    required></input>
                </div>

                <div className="check-in-date">
                    <label>Check In Date:</label>
                    <input type="date"
                    value={checkInDate}
                    onChange={newCheckInDate}
                    required></input>
                </div>

                <div className="check-out-date">
                    <label>Check Out Date:</label>
                    <input type="date"
                    value={checkOutDate}
                    onChange={newCheckOutDate}
                    required></input>

                </div>

                <div className="number-people">
                    <label>Number of People:</label>
                    <input type="number"
                    min={1}
                    max={20}
                    value={numOfPeople}
                    onChange={newNumOfPeople}
                    required></input>

                </div>

                <div className="number-rooms">
                    <label>Number of Rooms:</label>
                    <input type="number"
                    min={1}
                    max={20}
                    value={numOfRooms}
                    onChange={newNumOfRooms}
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
            <h2>{flightData.data[0].price.total}</h2>
            </>
            ) : (
            <p>Loading flight data...</p>
            )}

        </div>

    )

}
export default Flights