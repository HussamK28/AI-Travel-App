import { async } from "@firebase/util";
import React, { useState } from "react";
import './Register.css'
import { userAuth } from './firebase-config';
import { createUserWithEmailAndPassword } from "firebase/auth";
const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const newFirstName = (e) => {
        setFirstName(e.target.value)
    }
    const newLastName = (e) => {
        setLastName(e.target.value)
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
        }
        else {
            await createUserWithEmailAndPassword(userAuth, email, password)
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
            value={lastName}
            onChange={newLastName}
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