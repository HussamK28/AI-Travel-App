// Defines React, axios, useState and CSS file
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import React, { useState } from "react";
import './Styles/Login.css'

// Specialised font for login and register pages
<style>
@import url('https://fonts.googleapis.com/css2?family=Supermercado+One&display=swap');
</style>

// The getter and setter variables that are defined in the form.
const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const writeEmail = (e) => {
        setEmail(e.target.value)
    }
    const writePassword = (e) => {
        setPassword(e.target.value)
    }
    // Takes the user input and uses it to verify whether the information in the form matches that in the database
    const loginAccount = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:8000/accountExists/", {email, password})
            // Gets the unique userID in the users database and saves it in local storage.
            // This will be used as the foreign key in the flights, hotels and activities databases to display itinerary
            if (response.data.user.id){
                localStorage.setItem("userID", response.data.user.id)
                alert(response.data.message || "Login Successful!")
                navigate("/userRecommendations")
            }
            else {
                alert("User ID not avaliable")
            }
            
        } catch (error) {
            console.error(error)
            alert("Email or password incorrect, please try again!")
            
        }
    }
    // Below is the login form for this page so users can input their data.
    return (
        <div className="Container">
            <h1 style={{fontFamily: "Kite One"}}>Login</h1>
            <form onSubmit={loginAccount}>
            <div className="email-address">
            <label>Email Address</label>
                <input 
                type='email' 
                placeholder="Enter Email Address"
                value={email}
                onChange={writeEmail}
                required></input>    
            </div>
            <div className="password">
            <label>Password</label> 
                <input 
                type='password' 
                placeholder="Enter Password"
                value={password}
                onChange={writePassword}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" 
                title="Must contain at least one number and one uppercase and lowercase letter, and 
                at least 8 or more characters"
                required></input>    
            </div>

            <div className="button">
                <button className="Login-button"type="submit">Login </button> <br />
                <a href="/">Don't have an account yet? Register now! </a>
                
            </div>

            </form>
        </div>
    )

}
export default Login