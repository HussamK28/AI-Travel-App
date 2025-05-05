// Imports the necessary modules I need such as React and axios
import React, { useState } from "react";
import axios from "axios";
// import the generate new token from Flights API to check if API token is expired
import { GenerateNewToken } from "./APIs/FlightsAPI";
const Hotels = () => {
    // Here are the getter and setter variables that are used in the form below. 
    // UseState sets the setter variables to a default value
    const [location, setLocation] = useState("")
    const [checkInDate, setCheckInDate] = useState("")
    const [checkOutDate, setCheckOutDate] = useState("")
    const [numOfRooms, setNumOfRooms] = useState(0)
    const [hotelIDInfo, setHotelIDInfo] = useState(null)
    const [hotelData, setHotelData] = useState(null)
    const [numAdults, setNumAdults] = useState(0);

    // These functions change the setter variable as the user types
    const newHotelLocation = (e) => {
        setLocation(e.target.value)
    }

    const newCheckInDate = (e) => {
        setCheckInDate(e.target.value)
    }

    const newCheckOutDate = (e) => {
        setCheckOutDate(e.target.value)
    }


    const newNumOfRooms = (e) => {
        setNumOfRooms(e.target.value)
    }

    const newNumAdults = (e) => {
        setNumAdults(e.target.value);
    }

    // This function gets the hotel ID from the API. The ID will be used in another API to find information about the hotel
    const fetchHotelID = async () => {
        try {
            const apiAccessToken = await GenerateNewToken();
            // The city the user enters is converted into uppercase
            let cityCode = location.trim().toUpperCase();

            // The API uses the 3 letter IATA city code so this convets the user input to match that format
            if (cityCode.length !== 3 || /[^A-Z]/.test(cityCode)) {
                const cityResponse = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations', {
                    headers: {
                        'Authorization': `Bearer ${apiAccessToken}`
                    },
                    params: {
                        keyword: location,
                        subType: 'CITY'
                    }
                });

                const cityData = cityResponse.data.data;
                // Validation which checks if there is a city entered or if there is a city code that matches what user entered
                if (!cityData || cityData.length === 0) {
                    return;
                }

                cityCode = cityData[0].iataCode;
            }

            // The 2nd API uses the city code to find information about the hotel
            const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city', {
                headers: {
                    'Authorization': `Bearer ${apiAccessToken}`
                },
                params: {
                    cityCode: cityCode
                }
            });
            // returns the API response
            const hotelIDData = response.data.data;
            if (!hotelIDData || hotelIDData.length === 0) {
                console.log("No hotels found for this city.");
                return;
            }
            // adds any hotels with offers on into this array
            const hotelOffers = [];

            for (const hotel of hotelIDData) {
                if (hotelOffers.length >= 5) break;

                const hotelId = hotel.hotelId;

                // searches for hotel based off user inputs
                try {
                    const offersResponse = await axios.get('https://test.api.amadeus.com/v3/shopping/hotel-offers', {
                        headers: {
                            'Authorization': `Bearer ${apiAccessToken}`
                        },
                        params: {
                            hotelIds: hotelId,
                            checkInDate,
                            checkOutDate,
                            adults: numAdults || 1,
                            roomQuantity: numOfRooms || 1,
                            currency: 'GBP'
                        }
                    });
                    // If there is any hotels avaliable with offers it adds it to the hotel offers array
                    const offers = offersResponse.data.data;

                    if (offers && offers.length > 0) {
                        hotelOffers.push({
                            hotelId,
                            offers: offersResponse.data
                        });
                    }
                } catch (offerError) {
                }
            }
            // sets hotel data variable with the API response
            if (hotelOffers.length > 0) {
                setHotelData(hotelOffers);
            } else {
                setHotelData(null);
            }

        } catch (error) {
            console.log('Error fetching hotels with offers:', error.response?.data || error.message);
        }
    };


    
    // This function adds the hotel to the hotels database using the data the user inputted
    const addHotel = async (hotel, offer, checkIn, checkOut) => {
        // gets userID from local storage
        const userID = localStorage.getItem("userID")
        console.log("User ID", userID)
        if(!userID) {
            alert("Please log in to add hotels")
        }
        // gets each column data from the map function below or the user input
        const hotelName = hotel.offers.data[0]?.hotel.name
        const roomType = offer.offers[0]?.room?.description?.text;
        const price = offer.offers[0]?.price?.total
        const checkInDate = checkIn
        const checkOutDate = checkOut

        // Sends the data to the backend using the addHotel url and the data collected above
        try {
            const response = await axios.post("http://127.0.0.1:8000/addHotels/", { name: hotelName, roomDescription: roomType, price: price, checkInDate: checkInDate, checkOutDate: checkOutDate, userID: userID  });
            alert(response.data.message || "Added to itinerary");
          } catch (error) {
            console.error(error);
            alert("We were unable to add your hotel");
          }
    }




    const submitForm = async (e) => {
        e.preventDefault();

        try {
            await fetchHotelID();
        } catch (error) {
            console.log("Error in submitForm:", error);
        }
    };
    // Below is the form element for this page. 
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


                <div className="number-rooms">
                    <label>Number of Rooms:</label>
                    <input type="number"
                        min={1}
                        max={10}
                        value={numOfRooms}
                        onChange={newNumOfRooms}
                        required></input>

                </div>

                <div className="people">
                    <label>Adults (13+):</label>
                    <input
                        type="number"
                        min={1}
                        max={9}
                        value={numAdults}
                        onChange={newNumAdults}
                        required
                    />
                </div>


                <div className="button">
                    <button className="submit-button"
                        type="submit">Find Hotels
                    </button>
                </div>
            </form>
            {/* Uses hotelData to map through the results of the above API calls */}
            {hotelData && hotelData.length > 0 && (
                <div>
                    <h2>Available Hotels</h2>
                    {/* Maps through the API call. The index is the key used */}
                    {hotelData.map((hotel, index) => (
                        <div key={hotel.hotelId || index} className="hotel-card">
                            {/* Maps through data subsection to find hotel name */}
                            <h3>{hotel.offers.data[0]?.hotel.name || "Hotel Name Unavailable"}</h3>

                            {/* Maps through offer subsection to get prices and room description */}
                            {hotel.offers.data.map((offer, i) => {
                                const room = offer.offers[0]?.room?.description?.text;
                                const price = offer.offers[0]?.price;
                                const checkIn = checkInDate;
                                const checkOut = checkOutDate;
                                {/* Displays the data to the user */}
                                return (
                                    <div key={i}>
                                        <p><strong>Room Type:</strong> {room || "No description available"}</p>
                                        <p><strong>Price (in local currency):</strong> {price?.total} {price?.currency}</p>
                                        <p><strong>Check-in:</strong> {checkIn}</p>
                                        <p><strong>Check-out:</strong> {checkOut}</p>
                                        <button onClick={() => addHotel(hotel, offer, checkIn, checkOut)}>Add Hotel to Itinerary</button>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}




        </div>

    )

}
export default Hotels