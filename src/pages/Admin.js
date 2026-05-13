// So this is the login page for admins
// I need to make a separate page that when successfully logged in here
// takes them to that page. 

import {auth, provider} from "../firebase/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate} from "react-router-dom";
import { useState } from "react";
import "../css/admin.css";
import LewisBack from "../images/SmallLUT.png"

// GET TO WORK NOW RAAAHHHHH
const ALLOWED_EMAILS = [
    "mollyepaez@lewisu.edu",
    "mharless@lewisu.edu",
    "legner@lewisu.edu",
    "MorrowCh@lewisu.edu",
    "karencvillasenor@lewisu.edu",
    "sadrimozgul@lewisu.edu",
    "luisaperez1@lewisu.edu"
];

function Admin() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const email = user.email;

            if (ALLOWED_EMAILS.includes(email)) {
                navigate("/admin/dashboard");
            } else {
                setError("You do not have access to this page.");
            }
        } catch(err) {
            setError("Login failed please try again.");
        }    };

    return (
        <div className="admin-login-container">
            <div className="background">
                <img src={LewisBack} alt =""/>
            </div>
            <div className="login-card">
                <h1 className="form-title">Admin Login</h1>
                <p className="form-submission">
                    Access to all syllabus that has been submitted. 
                </p>

                <button className="submit-button" onClick={handleLogin}>
                    Login
                </button>

                {error && <p className="error-text">{error}</p>}
            </div>
        </div>
    );
}

export default Admin;