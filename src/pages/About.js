import { useNavigate } from "react-router-dom";
import "../css/About.css";


function About() {
    const navigate = useNavigate();
    return(
        <div>
            <div className="about-header">
                <h1 className="about-title">About</h1>
                <button
                    className="signout-btn"
                    onClick={async () => {
                        navigate("/home");
                    }}
                >
                    Back to Home
                </button>
            </div>
            <div className="how-to-section">
                <h2 className = "how-to-use">How to use SyllaBye:</h2>
                <ol>
                    <li>To use this please fill all input fields (<strong>
                        Semester, Course Name, Department,
                        Course Number, Section, Instructor
                        </strong>)
                    </li>
                    <li>Upload your course syllabus (<strong>PDF or DOCX </strong>).</li>
                </ol>
                <p><em style={{color:'firebrick'}}>Note: </em>Please ensure all fields are accurate.</p>
            </div>
            <div className="help-section">
                <h2 className ="help">Help</h2>
                <p> If you encounter any issues or have questions, please contact any member of the development team: </p>
                <ol>
                    <li> Luis Perez: <a href={"mailto:luisaperez1@lewisu.edu"}> luisaperez1@lewisu.edu</a></li>
                    <li> Molly Paez:  <a href={"mailto:mollyepaez@lewisu.edu"}>mollyepaez@lewisu.edu</a></li>
                </ol>
            </div>

            <p>SyllaBye was built by the <a href={"https://luis-perz.github.io/cookie-monster-group-site/"}>Cookie Monster</a> team</p>


        </div>

    );
}

export default About;