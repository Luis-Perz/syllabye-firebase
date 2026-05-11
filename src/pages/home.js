import { useState, useRef } from "react";
import { syllabus } from "../firebase/firestore";
import { uploadSyllabus } from "../firebase/storage";
import "../css/home.css";
import { useNavigate } from "react-router-dom";
// import { signOut } from "firebase/auth";
// import { auth } from "../firebase/firebase";
import helpIcon from "../images/questions.png";
import Questions from "../components/Questions";
import Sidebar from "../components/Sidebar";
import LUBack from "../images/SmallLUT.png";



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


    //Grouping the professors by their department for later selection (Proffesors from ECAMS faculty roster)
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

    return (
        <div className="home-container">

            <div className="background">
                <img src={LUBack} alt=""/>
            </div>

            <div className="top-bar">
                <h1 className="logo">SyllaBye</h1>

                {/*<button*/}
                {/*    className="signout-btn"*/}
                {/*    onClick={async () => {*/}
                {/*        await signOut(auth);*/}
                {/*        navigate("/");*/}
                {/*    }}*/}
                {/*>*/}
                {/*    Sign Out*/}
                {/*</button>*/}
                <Sidebar />
            </div>

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
                                setFormData({ ...formData, department: e.target.value, instructor: "" })
                            }
                        >
                            
                            <option value="BIOL">Biology</option>
                            <option value="CHEM">Chemistry</option>
                            <option value="CPSC">Computer Science</option>
                            <option value="DATA">Data Science</option>
                            <option value="MATH">Mathematics</option>
                            <option value="PHYS">Physics</option>
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

                        </select>
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
                    File will be saved as: {""}
                    <strong>
                        {formData.department}-
                        {formData.courseNumber}-
                        {formData.section}-
                        {formData.instructor}-
                        {formData.semester}
                                            
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
            {/*Question mark image that takes you to the about page*/}
            <Questions className="help-icon"
                content={
                    <div>
                        <h2>Experiencing issues?</h2>
                        <p>
                            If you are experiencing issues with SyllaBye,
                            please visit our About page for more information.
                        </p>
                        <p style={{color: 'dodgerblue', textAlign: 'center'}}>Syllabye was proudly built by
                            the CookieMonster team</p>
                    </div>
                }
            >
                <img
                    src={helpIcon}
                    className="help-icon"
                    onClick={() => navigate("/about")}
                    alt="Help"
                />
            </Questions>
        </div>

    );
}

export default Home;