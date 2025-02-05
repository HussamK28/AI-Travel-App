import React, { useState } from "react";
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const writeEmail = (e) => {
        setEmail(e.target.value)
    }
    const writePassword = (e) => {
        setPassword(e.target.value)
    }

    const loginAccount = () => {
        alert("Login successful!")
    }
    return (
        <div className="Container">
            <h1>Login</h1>
            <form onSubmit={loginAccount}>
            <div className="email-address">
                <input 
                type='email' 
                placeholder="Enter Email Address"
                value={email}
                onChange={writeEmail}
                required></input>    
            </div>
            <div className="password">
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
                <button className="Login-button"type="submit">Login </button>
                
                <button className="clear-button" type="button">Clear</button>
            </div>

            </form>
        </div>
    )

}
export default Login