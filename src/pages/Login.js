import { useState } from 'react';
import {auth, provider } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import {signInWithPopup} from 'firebase/auth';
import CreateUserForm from "../components/CreateUserForm";
import LoginForm from "../components/LogInForm";
import ResetUser from '../components/ResetPassword';
import "../css/login.css";
import LUTImage from "../images/LUT.png";

function Login(){
    const nav = useNavigate()
    const [error, setError] = useState(null);
    const [view, setView] = useState("google");

    async function googleSignIn() {
        try {
            const result = await signInWithPopup(auth, provider)
            if (!result.user.email.endsWith('@lewisu.edu') && !result.user.email.endsWith('@gmail.com')) {
                console.log("Access denied. Please sign in with your Google email.");
                await auth.signOut();
                setError("Access denied. Please sign in with your Google email.");
                return;
            }
            console.log("success")
            nav("/home")
        } catch (error) {
            console.log("error")
            setError(error.message)
        }
    }
function navigateToHome() {
    nav("/home");
}
        return (
        <>
            <div className="login-container">
                <div className="background-wrapper">
                    <div className="background-tracker">
                        <img src={LUTImage} alt="Lewis University student life background"/>
                    </div>
                </div>

                <div className="login-card">
                    <h1 className="form-title">Welcome to SyllaBye!</h1>
                    {view === "google" && (
                        <>
                            <div className="google-auth">
                                <p className="form-sub">Sign in with your Google email to upload your course syllabi.</p>
                                <button className="google-sign-in-button" onClick={googleSignIn}>
                                    Log in with Google email<br />(recommended)
                                </button>
                                {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
                            </div>
                            <div className="email-auth">
                                <p className="email-sign-in" onClick={() => setView("login")}>Log in with Email</p>
                                <span className="divider"></span>
                                <p className="create-account" onClick={() => setView("create")}>Create New Account</p>
                            </div>
                        </>
                    )}
                    {view === "login" && (
                        <>
                            <LoginForm onSuccess={navigateToHome} />
                            <p className="back-link" onClick={() => setView("google")}> &lt; Back </p>
                            <p className="reset-link" onClick={() => setView("reset")}>Reset Password</p>
                        </>
                    )}

                    {view === "create" && (
                        <>
                            <CreateUserForm onSuccess={navigateToHome} />
                            <p className="back-link" onClick={() => setView("google")}>&lt; Back</p>
                        </>
                    )}
                    {view === "reset" && (
                        <>
                            <ResetUser/>
                            <p className="back-link" onClick={() => setView("google")}>&lt; Back</p>
                        </>
                    )}

                </div>
            </div>
        </>
    )
}

export default Login;
