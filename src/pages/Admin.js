// So this is the login page for admins
// I need to make a separate page that when successfully logged in here
// takes them to that page. 

import {auth, provider} from "../firebase/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate} from "react-router-dom";
import { useState } from "react";
import "../css/admin.css";

// GET TO WORK NOW RAAAHHHHH
const ALLOWED_EMAILS = [
    "mollyepaez@lewisu.edu"
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
            <div className="login-card">
                <h1 className="form-title">Admin Login</h1>
                <p className="form-submission">
                    Only approved emails can access this dashboard.
                </p>

                <button className="submit-button" onClick={handleLogin}>
                    Continue with Google
                </button>

                {error && <p className="error-text">{error}</p>}
            </div>
        </div>
    );
}

export default Admin;