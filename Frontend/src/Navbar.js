import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to='/Flights'>Search for Flights</Link>
                    </li>
                    <li>
                        <Link to='/Hotels'>Search for Hotels</Link>
                    </li>
                    <li>
                        <Link to='/Register'>Register Account</Link>
                    </li>
                    <li>
                        <Link to='/Login'>Login</Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Navbar;