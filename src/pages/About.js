import { useNavigate } from "react-router-dom";
import {useState} from "react";
import "../css/About.css";
import SentFileImg from "../images/about-page-images/sent-file.png"
import CreateAccount from "../images/about-page-images/login-walkthrough/create-account.png"
import GoogleLogin from "../images/about-page-images/login-walkthrough/login-screen.png"
import LoginScreen from "../images/about-page-images/login-walkthrough/email-login.png"
import SyllabusForm from "../images/about-page-images/uploading-walkthrough/syllabus-form.png"
import DragDrop from "../images/about-page-images/uploading-walkthrough/drag-drop.png"
import Success from "../images/about-page-images/uploading-walkthrough/upload-confirmation.png"


function About() {
    const navigate = useNavigate();
    const [view, setView] = useState("account");
    const [overview, setOverview] = useState("account");
    return(
        <>
            <div className="about">
                <div className="about-header">
                    <h1 className="about-title">About</h1>
                    <button
                        className="about-return-btn"
                        onClick={async () => {
                            navigate("/home");
                        }}
                    >
                        &lt; Return Home
                    </button>
                </div>
                <div className="about-section">
                    <h2>What is Syllabye?</h2>
                    <div className="about-section-inner">
                        <img src={SentFileImg} alt="File being sent over the internet."/>
                        <p>
                            Syllabye provides a single place for faculty to upload their course syllabi. It simplifies the
                            upload process while automatically ensuring each file follows the required naming convention.
                        </p>
                    </div>

                </div>
                <div className="how-to-section">
                    <h2 className = "how-to-use">How to use SyllaBye:</h2>
                    <div className="how-to-use-inner">
                        <div>
                            <div className="how-to-selector-container">
                                <button className={`how-to-selector ${overview === "account" ? "active" : ""}`} onClick={() => {
                                    setOverview("account")
                                    setView("account")}}
                                    >
                                    User Account
                                </button>
                                <button className={`how-to-selector ${overview === "upload" ? "active" : ""}`} onClick={() => {
                                    setOverview("upload")
                                    setView("upload")}}>
                                    Uploading Syllabus
                                </button>
                            </div>

                        </div>
                        <div className="account-and-upload">
                            {view === "account" && (
                                <>
                                    <div className="walkthrough-card">
                                        <b>Step 1a: Create account</b>
                                        <img src={CreateAccount} alt="Create account screen"/>
                                        <p><em>We recommend using Google Authentication to log in. (Step 1b)</em><br />
                                            You can also create an account using your Lewis email address.</p>
                                    </div>
                                    <div className="walkthrough-card">
                                        <b>Step 1b: Google email Login</b>
                                        <img src={GoogleLogin} alt=" Google login screen"/>
                                        <p>Press the Google email login button and follow the steps on the pop-up screen
                                        to login using your gmail</p>
                                    </div>
                                    <div className="walkthrough-card">
                                        <b>Step 2: Google email Login</b>
                                        <img src={LoginScreen} alt="Email login screen"/>
                                        <p>Please enter your account information to login.<br />
                                            <em>Note: You can also reset password from this screen.</em>
                                        </p>
                                    </div>
                                </>
                            )}
                            {view === "upload" && (
                                <>
                                    <div className="walkthrough-card">
                                        <b>Step 1: Enter Syllabus information</b>
                                        <img src={SyllabusForm} alt="Syllabye form"/>
                                        <p>All Fields are <b>required</b><br/>
                                            <em>Note:</em> Entering Course Number will autofill Course Name </p>
                                    </div>
                                    <div className="walkthrough-card">
                                        <b>Step 2: Select Syllabus</b>
                                        <img src={DragDrop} alt="Selecting syllabus to upload"/>
                                        <p>Open File directory and select or drop file into the marked box.</p>
                                    </div>
                                    <div className="walkthrough-card">
                                        <b>Step 3: Confirmation</b>
                                        <img src={Success} alt="Syllabus upload confirmation"/>
                                        <p>If all required fields have been entered alongside your syllabus, you will get a success message
                                            asking to submit another one or log out. If there are are any issues, you will receive an error message.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </div>
                <div className="help-section">
                    <h2 className ="help">Help</h2>
                    <p> If you encounter any issues or have questions, please contact any member of the development team: </p>
                    <ol>
                        <li> Luis P: <a href={"mailto:luisaperez1@lewisu.edu"}> luisaperez1@lewisu.edu</a></li>
                        <li> Molly P:  <a href={"mailto:mollyepaez@lewisu.edu"}>mollyepaez@lewisu.edu</a></li>
                        <li> Robert D: <a href={"mailto:robertmdidomenico@lewisu.edu"}>robertmdidomenico@lewisu.edu</a> </li>
                    </ol>
                </div>
                <footer>
                    <p>SyllaBye was built by the <a href={"https://luis-perz.github.io/cookie-monster-group-site/"}>Cookie Monster</a> team</p>
                </footer>
            </div>
        </>
);
}

export default About;