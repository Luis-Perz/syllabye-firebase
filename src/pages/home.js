import React from "react";
import { FileUploader } from "react-drag-drop-files";
import { useState, useEffect } from "react";
import { syllabus } from "../firebase/firestore";
import { uploadSyllabus } from "../firebase/storage";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import {signOut} from "firebase/auth";
import {auth} from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import "../css/home.css";
import Sidebar from "../components/Sidebar";
import uploadIcon from "../images/upload.png"
import uploadSuccess from "../images/successful-upload.png";
import helpIcon from "../images/questions.png";
import LUBack from "../images/SmallLUT.png";


function Home() {
    
    // This helps with storing values, tracking changes, and preparing data for Firebase upload
    const [formData, setFormData] = useState({
        semester: "fall2026",
        department: "CPSC",
        courseName: "",
        courseNumber: "",
        section: "001",
        instructor: "",
        file: null
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const handleSignOut = async () => {
        await signOut(auth);
        navigate("/");
    };

    const fileTypes = ["PDF", "DOCX"];
    const [file, setFile] = useState(null);
    const [view, setView] = useState("form");

    async function loadCourseLookup() {
        const snapshot = await getDocs(collection(db, "Department"));
        const lookup = {};
        const deptList = [];

        snapshot.forEach(docItem => {
            const deptName = docItem.id;       
            const fields = docItem.data();     

            lookup[deptName] = fields;
            deptList.push(deptName);

            deptList.push({
                id: deptName,
                label: fields.name
            });
        });
        return lookup;
    }
    //Grouping the professors by their department for later department selection (Professors from ECAMS faculty roster)
    const [instructorsByDepartment, setInstructorsByDepartment] = useState({});

    //Course lookup table grouped by department, course name autofills when course number is put in (can add more later)
    //Eventually will need to semester too because classes change based on that too
    const [courseLookup, setCourseLookup] = useState({});
    useEffect(() => {
        async function fetchCourses() {
            const data = await loadCourseLookup();
            setCourseLookup(data);
        }
        fetchCourses();
    }, []);

    const [departments, setDepartments] = useState([]);
    useEffect(() => {
        async function fetchData() {
            try {
                // 1. Load departments
                const deptSnapshot = await getDocs(collection(db, "Department"));
                const lookup = {};
                const deptList = [];
                const instructorMap = {};

                for (const docItem of deptSnapshot.docs) {
                    const deptName = docItem.id;
                    const fields = docItem.data();

                    lookup[deptName] = fields;

                    deptList.push({
                        id: deptName,
                        label: fields.name
                    });

                    // 2. Load instructors for this department
                    const instructorSnapshot = await getDocs(
                        collection(db, `Department/${deptName}/Instructor`)
                    );

                    const instructors = instructorSnapshot.docs.map((instDoc) => {
                        const instData = instDoc.data();
                        return {
                            value: instData.name,
                            label: instData.name
                        };
                    });

                    instructorMap[deptName] = instructors;
                }

                setCourseLookup(lookup);
                setDepartments(deptList);
                setInstructorsByDepartment(instructorMap);
            } catch (err) {
                console.error(err);
            }
        }

        fetchData();
    }, []);

const inputFieldCheck = () =>{
        if (!formData.courseName || !formData.courseNumber ||!formData.instructor ||!formData.section) {
            setMessage("Please fill in all fields.");
            setLoading(false);
            return false;
        }
        setMessage("")
        setView("upload-box")
        return true;
    };

    return (
        <>
            <div className="home-container">
                <div className="background">
                    <img src={LUBack} alt=""/>
                </div>
                <div className="top-bar">
                    <h1 className="logo">SyllaBye</h1>
                    <Sidebar />
                </div>
                <div className="form-container">
                    <div className="form-card">
                        <form onSubmit={async (e) => {
                            // Prevents page reload so we can handle submission manually
                            // Required for processing form data and uploading to Firebase
                            e.preventDefault();

                            setMessage("");
                            setLoading(true);

                            // Check if file exists
                            if (!file) {
                                setMessage("No file selected");
                                setLoading(false);
                                return;
                            }
                            // Making sure all inputs are filled
                            if (!formData.courseName || !formData.courseNumber ||!formData.instructor ||!formData.section) {
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
                                const fileURL = await uploadSyllabus(file, formData);
                                await syllabus({ ...formData, fileURL });


                                console.log("Upload successful!");
                                setView("success")

                                // Reset form data after successful upload
                                setFormData({
                                    semester: "fall2026",
                                    department: "Biology",
                                    courseName: "",
                                    courseNumber: "",
                                    section: "001",
                                    instructor: "",
                                    file: null
                                });
                                setFile(null);

                            } catch (error) {
                                console.error(error);
                                setMessage("Upload failed. Try again.");
                            }

                            setLoading(false);
                        }}
                        >
                            {/* GRID */}

                            {view === "form" && (
                                <>
                                    <p className="subtitle">
                                        Enter course information below
                                    </p>
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
                                            <label>Department:</label>
                                            <select
                                                value={formData.department}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        department: e.target.value,
                                                        instructor: ""
                                                    })
                                                }
                                            >
                                                {departments.map((dept) => (
                                                    <option key={dept.id} value={dept.id}>
                                                        {dept.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Course Number:</label>
                                            <input
                                                type="number"
                                                value={formData.courseNumber}
                                                onChange={(e) => {
                                                    const courseNumber = e.target.value.trim();
                                                    const department = formData.department;


                                                    setFormData({ ...formData, courseNumber, courseName: courseLookup[department]?.[courseNumber] || "" });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Section:</label>
                                            <select
                                                value={formData.section}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, section: e.target.value })
                                                }
                                            >
                                                <option value="001">001</option>
                                                <option value="002">002</option>
                                                <option value="003">003</option>
                                                <option value="004">004</option>
                                                <option value="005">005</option>
                                                <option value="006">006</option>
                                                <option value="007">007</option>
                                                <option value="008">008</option>
                                                <option value="009">009</option>
                                                <option value="010">010</option>
                                                <option value="011">011</option>
                                                <option value="012">012</option>
                                                <option value="LT1">LT1</option>
                                                <option value="LT2">LT2</option>
                                                <option value="LT3">LT3</option>
                                                <option value="LT4">LT4</option>
                                                <option value="LT5">LT5</option>
                                                <option value="TS1">TS1</option>
                                                <option value="TS2">TS2</option>
                                                <option value="LU1">LU1</option>
                                                <option value="LU2">LU2</option>
                                                <option value="LS1">LS1</option>
                                                <option value="LS2">LS2</option>
                                                <option value="LS3">LS3</option>
                                                <option value="LS4">LS4</option>
                                                <option value="LS5">LS5</option>
                                                <option value="LS6">LS6</option>
                                                <option value="LS7">LS7</option>
                                                <option value="LS8">LS8</option>
                                                <option value="LR1">LR2</option>
                                                <option value="LR2">LR2</option>
                                                <option value="L01">L01</option>
                                                <option value="L02">L02</option>
                                                <option value="L03">L03</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Course Name:</label>
                                            <input
                                                type="text"
                                                value={formData.courseName}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, courseName: e.target.value
                                                            .toLowerCase()
                                                            .replace(/\s+/g, "")
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Instructor:</label>
                                            <select
                                                value={formData.instructor}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, instructor: e.target.value })
                                                }
                                            >
                                                <option value="">Select Professor</option>

                                                {instructorsByDepartment[formData.department]?.map((professor) => (
                                                    <option key={professor.value} value={professor.value}>
                                                        {professor.label}
                                                    </option>
                                                ))}
                                                
                                            </select>
                                        </div>
                                    </div>
                                    <button type="button" className="submit-btn" onClick={inputFieldCheck}>Next</button>
                                    {message && <p className="error">{message}</p>}
                                </>
                            )}
                            {view === "upload-box" && (
                                <>
                                    <div className="file">
                                        <p>Drop your syllabus PDF or DOCX here</p>

                                        <FileUploader
                                            handleChange={(uploadedFile) => setFile(uploadedFile)}
                                            name="file"
                                            types={fileTypes}
                                            classes="upload-box"
                                        >
                                            <div className="upload-file">
                                                <img src={uploadIcon} alt="" className="upload-icon" />
                                                <p>Drop here or <u>browse</u></p>
                                                <small>PDF or DOCX</small>
                                            </div>
                                        </FileUploader>
                                        {file && <p>Selected: {file.name}</p>}
                                    </div>
                                    <div className="upload-box-btns">
                                        <button type="button" className="submit-btn" onClick={() => setView("form")}>Back</button>
                                        <button className="submit-btn" type="submit" disabled={loading}>
                                            {loading ? "Uploading..." : "Upload Syllabus"}
                                        </button>
                                    </div>
                                    <p className={message.includes("Upload successful") ? "success" : "error"}>
                                        {message}
                                    </p>
                                </>
                            )}
                            {view === "success" && (
                                <div className="successful-upload-container">
                                    <img src={uploadSuccess} alt="syllabus successfully uploaded" />
                                    <p>Syllabus successfully uploaded</p>
                                    <div className="upload-box-btns">
                                        <button className="upload-box-signout" onClick={handleSignOut}>Logout</button>
                                        <button className="submit-btn" onClick={() => setView("form")}>Upload Another</button>
                                    </div>

                                </div>
                            )}
                            <div className="help-icon">
                                <img
                                    src={helpIcon}
                                    className="help-icon-image"
                                    onClick={() => navigate("/about")}
                                    alt="Help"
                                />
                            </div>
                        </form>

                    </div>
                </div>
            </div>

        </>

    );
}

export default Home;
