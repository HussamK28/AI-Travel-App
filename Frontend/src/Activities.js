import React from "react";
const Activities = () => {
    const [location, setLocation] = useState("")

    const  newLocation = (e) => {
        setLocation(e.target.value)
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
            </div>
        </form>
    </div>

    )
}
export default Activities;