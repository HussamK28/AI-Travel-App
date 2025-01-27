import React, { useState } from "react";
import './Register.css'
const Register = () => {
    return (
    <div className="Container">
        <h1>Register Your Account</h1>
        <form>
            <div className="first-name">
            <input type='text' placeholder="Enter First Name" required></input>
            </div>
            <div className="last-name">
            <input type='text' placeholder="Enter Last Name" required></input>
            </div>
            <div className="email-address">
                <input type='email' placeholder="Enter Email Address" required></input>    
            </div>
            <div className="password-1">
                <input type='password' placeholder="Enter Password" required></input>    
            </div>
            <div className="password-2">
                <input type='password' placeholder="Re-enter Password" required></input>    
            </div>

        </form>
    </div>
    )
}
export default Register;