import React, {useState} from "react";
import Map from "./Map";
const Activities = () => {
    const [location, setLocation] = useState("")

    const  newLocation = (e) => {
        setLocation(e.target.value)
    }

    const submitForm = (e) => {
        e.preventDefault()
        //fetchData()
    }

    return (
        <div className="container">
            <h1>Find Activities</h1>
            <form onSubmit={submitForm}>
                <div className="location">
                    <label>Location:</label>
                    <input type="text" 
                    placeholder="Enter your Location" 
                    value={location}
                    onChange={newLocation} 
                    required></input>
                    <button className="submit-button" type="submit">Search</button>
                    <div className="map-box">
                        <Map />
                    </div>
            </div>
        </form>
    </div>

    )
}
export default Activities;