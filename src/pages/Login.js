import { useState } from 'react';
import {auth, provider } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import {signInWithPopup} from 'firebase/auth';
import "../css/login.css";
import LUTImage from "../images/LUT.png";

function Login(){
    const nav = useNavigate()
    const [error, setError] = useState(null);

    async function handleSignIn() {
        try {
            const result = await signInWithPopup(auth, provider)
            if (!result.user.email.endsWith('@lewisu.edu')) {
                console.log("Access denied. Please sign in with your Lewis email.");
                await auth.signOut();
                setError("Access denied. Please sign in with your Lewis email.");
                return;
            }
            console.log("success")
            nav("/home")
        } catch (error) {
            console.log("error")
            setError(error.message)
        }
    }
    // Connects the login.css 
    return (
        <div className="login-container">
            <div className="background-wrapper">
                <div className="background-tracker">
                    <img src={LUTImage}/>
                    <img src={LUTImage}/>
                    <img src={LUTImage}/>
                    <img src={LUTImage}/>
                    <img src={LUTImage}/>
                    <img src={LUTImage}/>
                    <img src={LUTImage}/>
                    <img src={LUTImage}/>
                </div>
            </div>

            <div className="login-card">
                <h1 className="form-title">Welcome to SyllaBye!</h1>
                <p className="form-sub">Sign in with your Lewis University email to upload your course syllabi.</p>
                <button className="submit-button" onClick={handleSignIn}>
                    Sign in with Lewis email
                </button>
                {error && <p style={{color: "red", marginTop:"10px"}}>{error}</p>}
            </div>
        </div>
    )
}

export default Login;