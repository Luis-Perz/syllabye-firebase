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
    const professorsByDepartment = {
        CPSC: [
            { value: "boxu", label: "Bo Xu" },
            { value: "danadominiak", label: "Dana Dominiak" },
            { value: "davidnowak", label: "David Nowak" },
            { value: "cindyhoward", label: "Cindy Howard" },
            { value: "ericspangler", label: "Eric Spangler" },
            { value: "ericpogue", label: "Eric Pogue" },
            { value: "fadiwedyan", label: "Fadi Wedyan" },
            { value: "fuadabuzahra", label: "Fuad Abu Zahra" },
            { value: "ginamartinez", label: "Gina Martinez" },
            { value: "jakecho", label: "Jake Cho" },
            { value: "jasonperry", label: "Jason Perry" },
            { value: "jaymespeva", label: "Jayme Speva" },
            { value: "khaledalrfou", label: "Khaled Alrfou" },
            { value: "khaledalzoubi", label: "Khaled Alzoubi" },
            { value: "mahmoodal-khassaweneh", label: "Mahmood Al-Khassaweneh" },
            { value: "manojmbhat", label: "Manoj M. Bhat" },
            { value: "mattplass", label: "Matt Plass" },
            { value: "paulyoungjunekim", label: "Paul Young June Kim" },
            { value: "piotrszczurek", label: "Piotr Szczurek" },
            { value: "ramikhasawneh", label: "Rami Khasawneh" },
            { value: "rayklump", label: "Ray Klump" },
            { value: "safwanomari", label: "Safwan Omari" },
            { value: "samabuomar", label: "Sam Abuomar" },
            { value: "sunghkim", label: "Sung H. Kim" },
            { value: "vadimbiryukov", label: "Vadim Biryukov" },
            { value: "victoriaheekyungkim", label: "Victoria Heekyung Kim" },
            { value: "wanyuzang", label: "Wanyu Zang" },
            { value: "yazanalsmadi", label: "Yazan Alsmadi" },
            { value: "ziadal-sharif", label: "Ziad Al-Sharif" }
        ],

        MATH: [
            { value: "adamschultze", label: "Adam Schultze" },
            { value: "amandaharsy", label: "Amanda Harsy" },
            { value: "brittanystephenson", label: "Brittany Stephenson" },
            { value: "carasulyok", label: "Cara Sulyok" },
            { value: "jasonperry", label: "Jason Perry" },
            { value: "mariemeyer", label: "Marie Meyer" },
            { value: "michaelsmith", label: "Michael Smith" },
            { value: "thomasfscdupre", label: "Thomas FSC Dupre" }
        ],

        DATA: [
            { value: "boxu", label: "Bo Xu" },
            { value: "brittanystephenson", label: "Brittany Stephenson" },
            { value: "indikaudagedara", label: "Indika Udagedara" },
            { value: "manojmbhat", label: "Manoj M. Bhat" },
            { value: "piotrszczurek", label: "Piotr Szczurek" }
        ],

        PHYS: [
            { value: "jameshofmann", label: "James Hofmann" },
            { value: "josephkozminski", label: "Joseph Kozminski" },
            { value: "philipchumbley", label: "Philip Chumbley" },
            { value: "ryanjhooper", label: "Ryan J. Hooper" }
                    
        ],

        CHEM: [
            { value: "br.pierrest.raymondfsc", label: "Br. Pierre St. Raymond, FSC" },
            { value: "chriscondeiu", label: "Chris Condeiu" },
            { value: "danielkissel", label: "Daniel Kissel" },
            { value: "jasonkeleher", label: "Jason Keleher" },
            { value: "marycharles", label: "Mary Charles" },
            { value: "samarmakhlouf", label: "Samar Makhlouf" },
            { value: "teresabixby", label: "Teresa Bixby" }
        ],

        BIOL: [
            { value: "cynthiamisischia", label: "Cynthia Misischia" },
            { value: "erinzimmer", label: "Erin Zimmer" },
            { value: "hollysnyder", label: "Holly Snyder" },
            { value: "jamesrago", label: "James Rago" },
            { value: "jerrykavouras", label: "Jerry Kavouras" },
            { value: "jeannettepifer", label: "Jeannette Pifer" },
            { value: "lisakozak", label: "Lisa Kozak" },
            { value: "malloryhavens", label: "Mallory Havens" },
            { value: "marnebailey", label: "Marne Bailey" },
            { value: "sarahpowers", label: "Sarah Powers" },
            { value: "williamchura", label: "William Chura" }
        ]
    };

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
        async function fetchCourses() {
            const snapshot = await getDocs(collection(db, "Department"));

            const lookup = {};
            const deptList = [];

            snapshot.forEach(docItem => {
                const deptName = docItem.id;
                const fields = docItem.data();

                lookup[deptName] = fields;

                deptList.push({
                    id: deptName,
                    label: fields.name
                });
            });

            setCourseLookup(lookup);
            setDepartments(deptList);
        }

        fetchCourses();
    }, []);

    return (
        <>
            <div className="top-bar">
                <h1 className="logo">SyllaBye</h1>
                <Sidebar />
            </div>
            <div className="home-container">
                <div className="form-container">
                    <div className="background">
                        <img src={LUBack} alt=""/>
                    </div>
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
                                                <option value="007">006</option>
                                                <option value="008">006</option>
                                                <option value="009">006</option>
                                                <option value="010">006</option>
                                                <option value="011">006</option>
                                                <option value="012">006</option>
                                                <option value="LT1">LT1</option>
                                                <option value="LT2">LT2</option>
                                                <option value="LT3">LT3</option>
                                                <option value="LT4">LT3</option>
                                                <option value="LT5">LT3</option>
                                                <option value="TS1">TS1</option>
                                                <option value="TS2">TS2</option>
                                                <option value="LU1">TS2</option>
                                                <option value="LU2">TS2</option>
                                                <option value="LS1">TS2</option>
                                                <option value="LS2">TS2</option>
                                                <option value="LS3">TS2</option>
                                                <option value="LS4">TS2</option>
                                                <option value="LS5">TS2</option>
                                                <option value="LS6">TS2</option>
                                                <option value="LS7">TS2</option>
                                                <option value="LS8">TS2</option>
                                                <option value="LR1">TS2</option>
                                                <option value="LR2">TS2</option>
                                                <option value="L01">TS2</option>
                                                <option value="L02">TS2</option>
                                                <option value="L03">TS2</option>
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

                                                {professorsByDepartment[formData.department]?.map((professor) => (
                                                    <option
                                                        key={professor.value}
                                                        value={professor.value}
                                                    >
                                                        {professor.label}
                                                    </option>
                                                ))}

                                            </select>
                                        </div>
                                    </div>
                                    <button className="submit-btn" onClick={() => setView("upload-box")}>Next</button>
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
                                        <button className="submit-btn" onClick={() => setView("form")}>Back</button>
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
                                    <p>Syllabus succesfully uploaded</p>
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
