import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Styles/Navbar.css'

// This is the navbar function used at the top of each page.
// This links to each page as defined in the main app
const Navbar = () => {
    // Checked to see if a user has logged in
    const [loginStatus, setLoginStatus] = useState(false)
    const navigate = useNavigate()

    // Gets userID from localStorage
    useEffect(() => {
        const userID = localStorage.getItem("userID");
        setLoginStatus(!!userID);
    }, []);

    // Logs user out and removes User ID. It then sends the user back to the login page.
    const logOut = () => {
        localStorage.removeItem("userID")
        setLoginStatus(false)
        navigate("/Login")
    }

    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to='/travelPreferences'>Travel Preferences</Link>
                    </li>
                    <li>
                        <Link to='/Flights'>Flights</Link>
                    </li>
                    <li>
                        <Link to='/Hotels'>Hotels</Link>
                    </li>

                    <li>
                        <Link to='/Activities'>Activities</Link>
                    </li>
                    <li>
                        <Link to='/Itinerary'>Itinerary</Link>
                    </li>
                    <li>
                        <Link to='/userRecommendations'>User Recommendations</Link>
                    </li>
                    <li>
                        <Link to='/'>Register Account</Link>
                    </li>
                    {!loginStatus ? (
                        <li><Link to='/Login'>Login</Link></li>
                    ): (
                        <li><button className="log-out" onClick={() => logOut()}>Logout</button></li>
                    ) }
                </ul>
            </nav>
        </>
    )
}

export default Navbar;