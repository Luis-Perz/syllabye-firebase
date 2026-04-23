import { useState, useRef } from "react";
import { syllabus } from "../firebase/firestore";
import { uploadSyllabus } from "../firebase/storage";
// import Questions from "../components/Questions";

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

    return (
        <>
        <div className="Home">
            <h1>SyllaBye!</h1>

            <form
                onSubmit={async (e) => {
                    // Prevents page reload so we can handle submission manually
                    // Required for processing form data and uploading to Firebase
                    e.preventDefault();

                    setMessage("");
                    setLoading(true);

                    // Validates file selection before uploading
                    if (!formData.file) {
                        setMessage("No file selected");
                        setLoading(false);
                        return;
                    }

                    // Files accepted are PDF and DOCX
                    const allowedTypes = [
                        "application/pdf",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    ];

                    // Rejects unsupported file types
                    if (!allowedTypes.includes(formData.file.type)) {
                        setMessage("Invalid file type. Only PDF or DOCX allowed.");
                        setLoading(false);
                        return;
                    }


                    try {
                        const fileURL = await uploadSyllabus(formData.file);
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
                        console.error("Upload failed:", error);
                        setMessage("Upload failed. Try again.");
                    }

                    setLoading(false);
                }}
            >

                {/* Semester selection */}
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

                <br /><br />

                {/* Department selection */}
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
                </select>

                <br /><br />

                {/* Course Name input */}
                <label>Course Name:</label>
                <input
                    type="text"
                    value={formData.courseName}
                    onChange={(e) =>
                        setFormData({ ...formData, courseName: e.target.value })
                    }
                />

                <br /><br />

                {/* Course Number input */}
                <label>Course Number:</label>
                <input
                    type="text"
                    value={formData.courseNumber}
                    onChange={(e) =>
                        setFormData({ ...formData, courseNumber: e.target.value })
                    }
                />

                <br /><br />

                {/* Section input */}
                <label>Section:</label>
                <input
                    type="text"
                    value={formData.section}
                    onChange={(e) =>
                        setFormData({ ...formData, section: e.target.value })
                    }
                />

                <br /><br />

                {/* Instructor input */}
                <label>Instructor:</label>
                <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) =>
                        setFormData({ ...formData, instructor: e.target.value })
                    }
                />

                <br /><br />

                {/* File upload input */}
                <label>Upload Syllabus:</label>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) =>
                        setFormData({ ...formData, file: e.target.files[0] })
                    }
                />

                <br /><br />

                <button type="submit" disabled={loading}>
                    {loading ? "Uploading..." : "Submit"}
                </button>

                {/* Displays success or error messages */}
                <p>{message}</p>

            </form>
        </div>
        {/*<div>*/}
        {/*    <Questions />*/}
        {/*</div>*/}
    </>
    );
}

export default Home;