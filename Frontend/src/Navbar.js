import React from "react";
import { Link } from "react-router-dom";
import './Styles/Navbar.css'

// This is the navbar function used at the top of each page.
// This links to each page as defined in the main app
const Navbar = () => {
    return (
        <>
            <nav>
                <ul>
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
                        <Link to='/'>Register Account</Link>
                    </li>
                    <li>
                        <Link to='/Login'>Login</Link>
                    </li>
                    <li>
                        <Link to='/Itinerary'>Itinerary</Link>
                    </li>
                    <li>
                        <Link to='/travelPreferences'>Travel Preferences</Link>
                    </li>
                    <li>
                        <Link to='/userRecommendations'>User Recommendations</Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Navbar;