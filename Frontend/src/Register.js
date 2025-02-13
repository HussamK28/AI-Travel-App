
import React, { useState } from "react";
import './Register.css'
import axios from "axios";
const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

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

    const submitForm = async (e) => {
        e.preventDefault();
        if (password!==passwordConfirm) {
            alert("Passwords do not match!")
            return
        }

        try {
            const response = await axios.post("http://127.0.0.1:8000/addUserToDatabase/", {firstName, surname, email, password});
            alert(response.data.message || "Registration Successful!");
        } catch (error) {
            console.error(error)
            alert("We were unable to register your account!")
            
        }
    }
    return (
    <div className="Container">
        <h1>Register Your Account</h1>
        <form onSubmit={submitForm}>
            <div className="first-name">
            <input 
            type='text' 
            placeholder="Enter First Name"
            value={firstName}
            onChange={newFirstName} 
            required>

            </input>
            </div>
            <div className="last-name">
            <input 
            type='text' 
            placeholder="Enter Last Name"
            value={surname}
            onChange={newSurname}
            required>

            </input>
            </div>
            <div className="email-address">
                <input 
                type='email' 
                placeholder="Enter Email Address"
                value={email}
                onChange={newEmail}
                required></input>    
            </div>
            <div className="password-box1">
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
                <input 
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
                <button className="register-button" 
                type="submit">Register
                </button>
            </div>

        </form>
    </div>
    )
}
export default Register;