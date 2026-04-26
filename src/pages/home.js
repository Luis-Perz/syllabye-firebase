import { useState, useRef } from "react";
import { syllabus } from "../firebase/firestore";
import { uploadSyllabus } from "../firebase/storage";
import "../css/home.css";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import helpIcon from "../images/questions.png";



function Home() {

    // This helps with storing values, tracking changes, and preparing data for Firebase upload
    const [formData, setFormData] = useState({
        semester: "fall2026",
        department: "CPSC",
        courseName: "",
        courseNumber: "",
        section: "",
        instructor: "",
        file: null
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef();
    const navigate = useNavigate();

    return (
        <div className="home-container">

            <div className="top-bar">
                <h1 className="logo">SyllaBye</h1>

                <button
                    className="signout-btn"
                    onClick={async () => {
                        await signOut(auth);
                        navigate("/");
                    }}
                >
                    Sign Out
                </button>
            </div>

            {/*Question mark image that takes you to the about page*/}
            <img
                src={helpIcon}
                className="help-icon"
                onClick={() => navigate("/about")}
                alt="Help"
            />

            <div className="form-card">
                
                <p className="subtitle">
                    Upload your course syllabus information below
                </p>


            <form onSubmit={async (e) => {
                    // Prevents page reload so we can handle submission manually
                    // Required for processing form data and uploading to Firebase
                    e.preventDefault();

                    setMessage("");
                    setLoading(true);

                    const file = formData.file;

                    // Check if file exists
                    if (!file) {
                        setMessage("No file selected");
                        setLoading(false);
                        return;
                    }
                    // Making sure all inputs are filled
                    if(
                        !formData.courseName || 
                        !formData.courseNumber ||
                        !formData.instructor ||
                        !formData.section 
                    ) {
                        setMessage("Please fill in all fields.");
                        setLoading(false);
                        return;
                    }

                    // validation extension
                    const extension = file.name.split(".").pop().toLowerCase();


                    // 3. Allowed types
                    const allowedTypes = [
                        "application/pdf",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    ];

                    const validExtensions = ["pdf", "docx"];

                    // 4. Validate BOTH type + extension
                    if (
                        !allowedTypes.includes(file.type) &&
                        !validExtensions.includes(extension)
                    ) {
                        setMessage("Only PDF or DOCX files are allowed.");
                        setLoading(false);
                        return;
                    }       

                    try {
                        const fileURL = await uploadSyllabus(file);
                        await syllabus({ ...formData, fileURL });


                        console.log("Upload successful!");
                        setMessage("Upload successful!");

                        // Reset form data after successful upload
                        setFormData({
                            semester: "fall2026",
                            department: "CPSC",
                            courseName: "",
                            courseNumber: "",
                            section: "",
                            instructor: "",
                            file: null
                        });

                        // Clears file input visually
                        if (fileInputRef.current) {
                            fileInputRef.current.value = null;
                        }

                    } catch (error) {
                        console.error(error);
                        setMessage("Upload failed. Try again.");
                    }

                    setLoading(false);
                }}
            >

                {/* GRID */}
                <div className="form-grid">

                    <div className="form-group">
                        <label>Semester:</label>
                        <select
                            value={formData.semester}
                            onChange={(e) =>
                                setFormData({ ...formData, semester: e.target.value })
                            }
                        >
                            <option value="fall2026">Fall 2026</option>
                            <option value="spring2027">Spring 2027</option>
                            <option value="summer2027">Summer 2027</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Course Name:</label>
                        <input
                            type="text"
                            value={formData.courseName}
                            onChange={(e) =>
                                setFormData({ ...formData, courseName: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Department:</label>
                        <select
                            value={formData.department}
                            onChange={(e) =>
                                setFormData({ ...formData, department: e.target.value })
                            }
                        >
                            <option value="CPSC">Computer Science</option>
                            <option value="MATH">Mathematics</option>
                            <option value="PHYS">Physics</option>
                            <option value="DATA">Data Science</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Course Number:</label>
                        <input
                            type="text"
                            value={formData.courseNumber}
                            onChange={(e) =>
                                setFormData({ ...formData, courseNumber: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Section:</label>
                        <input
                            type="text"
                            value={formData.section}
                            onChange={(e) =>
                                setFormData({ ...formData, section: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>Instructor:</label>
                        <input
                            type="text"
                            value={formData.instructor}
                            onChange={(e) =>
                                setFormData({ ...formData, instructor: e.target.value })
                            }
                        />
                    </div>

                </div>

                {/* UPLOAD BOX */}
                <div className="upload-box">

                    <p>Drop your syllabus PDF or DOCX here</p>

                    <input
                        type="file"
                        accept=".pdf,.docx"
                        ref={fileInputRef}
                        onChange={(e) =>
                            setFormData({ ...formData, file: e.target.files[0] })
                        }
                    />

                </div>
                
                <p>
                    File will be saved as:{" "}
                    <strong>
                        {formData.semester}-
                        {formData.department}-
                        {formData.courseNumber}-
                        {formData.section}
                        {formData.instructor}
                        
                    </strong>
                </p>
                
                <button className="submit-btn" type="submit" disabled={loading}>
                    {loading ? "Uploading..." : "Submit"}
                </button>

                <p className={message.includes("Upload successful") ? "success" : "error"}>
                    {message}
                </p>

            </form>
            </div>
        </div>
        
    );
}

export default Home;