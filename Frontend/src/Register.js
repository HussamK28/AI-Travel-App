// Imports React, axios, useState and the linked CSS page
import React, { useState } from "react";
import './Styles/Register.css'
import axios from "axios";

// Specialised font for login and register pages
<style>
@import url('https://fonts.googleapis.com/css2?family=Supermercado+One&display=swap');
</style>
// The getter and setter variables that are defined in the form.
const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    // These functions update as the user types
    const newFirstName = (e) => {
        setFirstName(e.target.value)
    }
    const newSurname = (e) => {
        setSurname(e.target.value)
    }
    const newEmail = (e) => {
        setEmail(e.target.value)
    }
    const newPassword = (e) => {
        setPassword(e.target.value)
    }
    const newPasswordConfirm = (e) => {
        setPasswordConfirm(e.target.value)
    }

    // Once the submit button is pressed, this function is called.
    // It checks whether the user inputs the same password in the first and second password boxes
    const submitForm = async (e) => {
        e.preventDefault();
        if (password!==passwordConfirm) {
            alert("Passwords do not match!")
            return
        }


        // This sends the user input to the users database in the backend component
        try {
            
            const response = await axios.post("http://127.0.0.1:8000/addUserToDatabase/", {firstName, surname, email, password});
            alert(response.data.message || "Registration Successful!");
        } catch (error) {
            console.error(error)
            alert("We were unable to register your account!")
            
        }
    }
    // Here is the form element of my page
    return (
    <div className="Container">
        <h1 style={{fontFamily:"Kite One"}}>Register Your Account</h1>
        <form onSubmit={submitForm}>
            <div className="first-name">
            <label>First Name</label>
            <input 
            type='text' 
            placeholder="Enter First Name"
            value={firstName}
            onChange={newFirstName} 
            required>

            </input>
            </div>
            <div className="last-name">
            <label>Last Name</label>
            <input 
            type='text' 
            placeholder="Enter Last Name"
            value={surname}
            onChange={newSurname}
            required>

            </input>
            </div>
            <div className="email-address">
            <label>Email Address</label>
                <input 
                type='email' 
                placeholder="Enter Email Address"
                value={email}
                onChange={newEmail}
                required></input>    
            </div>
            <div className="password-box1">
            <label>Password</label>
                <input 
                type='password' 
                placeholder="Enter Password"
                value={password}
                onChange={newPassword}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" 
                title="Must contain at least one number and one uppercase and lowercase letter, and 
                at least 8 or more characters"
                required></input>    
            </div>
            <div className="password-box2">
            <label>Confirm Password</label>
                <input
                className="confirm-password" 
                type='password' 
                placeholder="Re-enter Password"
                value={passwordConfirm}
                onChange={newPasswordConfirm}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" 
                title="Must contain at least one number and one uppercase and lowercase letter, and 
                at least 8 or more characters"
                required></input>    
            </div>
            <div className="button">
                <button className="register-button" type="submit">Register </button> <br />
                <a href="/Login">Already have an account with us? Login here!</a>
            </div>

        </form>
    </div>
    )
}
export default Register;