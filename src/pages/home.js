import { useState, useRef } from "react";
import { syllabus } from "../firebase/firestore";
import { uploadSyllabus } from "../firebase/storage";
import "../css/home.css";
import { useNavigate } from "react-router-dom";
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
        section: "001",
        instructor: "",
        file: null
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef();
    const navigate = useNavigate();


    //Grouping the professors by their department for later department selection (Proffesors from ECAMS faculty roster)
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
    const courseLookup = {
        CPSC: {
            "19605": "Wksp: Raspberry Pi",
            "20000": "Intro to Computer Science",
            "20200": "Fundamentals of AI",
            "21000": "Programming Fundamentals",
            "22000": "Introduction to Linux",
            "24500": "Object-Oriented Programming",
            "24700": "Web and Distributed Prog",
            "28100": "Introduction to Networks",
            "28200": "Switch, Routing, and Wireless",
            "30000": "Computer Organization",
            "32100": "Cybersecurity Essentials",
            "33000": "Database Systems",
            "34000": "Algorithms and Data Structures",
            "38200": "Network Security",
            "41700": "Mobile Application Development",
            "42500": "Encryption and Authentication",
            "42800": "Programming:Digital Forensics",
            "44000": "Software Engineering",
            "46500": "Theory Algorithms Computation",
            "47000": "Artificial Intelligence",
            "48000": "Client-Server Computing",
            "49200": "Software Systms Capstone Prjct",
            "49300": "Comp Infrstrctr Capstone Prjct",
            "50000": "Computer Organization",
            "50100": "Programming Fundamentals",
            "50300": "Algorithms and Data Structures",
            "50500": "Communications and Networking",
            "50600": "Cyber Security Essentials",
            "50700": "Advanced Cyber Security",
            "50900": "Database Systems",
            "51500": "Operating Systems",
            "52000": "Network Security Essentials",
            "52500": "Encryption and Authentication",
            "55500": "Distributed Computing Systems",
            "56000": "Securing Operating Systems",
            "57100": "Artificial Intelligence 1",
            "57200": "Artificial Intelligence 2",
            "57500": "Ethics in AI",
            "57600": "Responsible AI & Strategic App",
            "57700": "Machine Learning Operations",
            "57900": "Generative AI",
            "58100": "Vibe Coding",
            "58200": "Agentic AI",
            "59100": "Cybersecurity Project",
            "59700": "Research in Computer Science",
            "60000": "Object Oriented Development",
            "60500": "Software Engineering",
            "61200": "Software Architect and Design",
            "61400": "Software Production Process",
            "65000": "Robotics",
            "65100": "Reinforcement Learning",
            "65500": "Cloud Computing/Virtualization",
            "66500": "Application Security",
            "67300": "Digital Forensics",
            "68000": "Advanced Network Security",
            "68500": "Enterprise Network Security",
            "69100": "Comp Sci Master's Project"
        },

        MATH: {
            "10300": "Elementary Mathematics",
            "10400": "Intermediate Algebra",
            "10500": "Introductory Statistics",
            "10700": "Mathematics for Culinary Art",
            "11500": "Intro to Mathematical Thinking",
            "11600": "Win Lose or Draw",
            "11900": "College Algebra",
            "14100": "GeometryandMsrmnt Concpt Tchr",
            "17000": "Finite Mathematics",
            "19900": "Precalculus",
            "20400": "Calculus for the Life Sciences",
            "20900": "Calculus 1",
            "21000": "Discrete Mathematics",
            "22000": "Applied Probability and Stats",
            "23500": "Calculus 2",
            "25000": "Calculus 3",
            "27000": "History of Mathematics",
            "30500": "Linear Algebra",
            "30600": "Advanced Linear Algebra",
            "32500": "Foundations Adv Mathematics",
            "39604": "ST: Intro to Graph Theory",
            "47500": "Mathematics Research",
            "48000": "Senior Seminar"
        },

        PHYS: {
            "10000": "Elementary Laboratory Physics",
            "10500": "Introduction to Astronomy",
            "12000": "Integrated Science 1",
            "12100": "Integrated Science 1 Lab",
            "20500": "College Physics 2",
            "20600": "College Physics 2 Lab",
            "21000": "General Physics 1",
            "21100": "General Physics 1 Lab",
            "21500": "General Physics 2",
            "21600": "General Physics 2 Lab",
            "21800": "General Physics 3",
            "21900": "General Physics 3 Lab",
            "29600": "Research Methods Seminar",
            "30000": "Mechanics",
            "31100": "Analog and Digital Elec",
            "34100": "Modern Physics",
            "41100": "Computational Electrodynamics",
            "46500": "Capstone Project",
            "47000": "Undergraduate Research",
            "49801": "ST: Astrophysics",
            "51000": "Electromagnetic Theory and App",
            "68001": "ST: Astrophysics",
            "69500": "Graduate Capstone",
            "69600": "Graduate Seminar",
            "69800": "Master's Thesis"
        },

        CHEM: {
        "10100": "Basic Inorganic Chemistry",
        "10200": "Basic Inorganic Chemistry Lab",
        "10500": "Intro to OrganicBiochemistry",
        "10700": "Chemistry Hazardous Materials",
        "10900": "Chemistry and Society",
        "11000": "General Chemistry 1",
        "11100": "General Chemistry 1 Lab",
        "11200": "Chem of Mind Altering Drugs",
        "11500": "General Chemistry 2",
        "11600": "General Chemistry 2 Lab",
        "12200": "Intro Forensic Chemistry",
        "12300": "Intro Forensic Chemistry Lab",
        "22100": "Organic Chemistry 1 Lab",
        "22600": "Organic Chemistry 2 Lab",
        "23000": "Organic Chemistry 1",
        "23500": "Organic Chemistry 2",
        "23600": "Organic Chemistry 2 Lab",
        "24200": "Intro to Solid State Chemistry",
        "29600": "Research Methods Seminar",
        "30500": "Physical Chemistry 2",
        "30600": "Physical Chemistry 2 Lab",
        "32000": "Analytical Chemistry",
        "40700": "Biochemistry 2",
        "40800": "Biochemistry 2 Lab",
        "45000": "Research",
        "46500": "Capstone Project",
        "68012": "ST: Advanced Materials",
        "68013": "ST: Computational Chemistry",
        "69600": "Graduate Seminar",
        "69800": "Master's Thesis"
    },

        BIOL: {
            "10100": "Anatomy and Physiology 1",
            "10101": "Human A&P 1",
            "10200": "Anatomy and Physiology 1 Lab",
            "10201": "Human A&P Lab 1",
            "10300": "Anatomy and Physiology 2",
            "10400": "Anatomy and Physiology 2 Lab",
            "10600": "Intro to Environmental Science",
            "10700": "Human Heredity",
            "10800": "Introduction to Human Biology",
            "11000": "General Biology 1",
            "11100": "General Biology 1 Lab",
            "11500": "General Biology 2",
            "11600": "General Biology 2 Lab",
            "12200": "Integrated Science 2",
            "12300": "Integrated Science 2 Lab",
            "13800": "Medical Terminology",
            "22000": "Genetics",
            "22100": "Genetics Lab",
            "22200": "Earth Science",
            "22400": "General Microbiology",
            "22500": "Microbiology",
            "22501": "Intro to Microbio Resp Therapy",
            "22600": "General Microbiology Lab",
            "22700": "Microbiology Lab",
            "22701": "Intro to Microbio Lab",
            "24300": "Principles of Sustainability",
            "27000": "Pathophysiology",
            "31200": "Intro Geographical Info Sysym",
            "32000": "Biostatistics",
            "33500": "Advanced Clinical Physiology",
            "33600": "Case Stdy Human Physiology",
            "35700": "Nutritional Biochemistry Clncl",
            "36000": "Radiation Detctn/Instrmt",
            "36300": "Biomimicry Whole Syst Thinking",
            "36500": "Medical Law and Ethics",
            "37500": "Issues in Environmentl Science",
            "38500": "Biology Journal Club",
            "39000": "Professional Clinical Practicu",
            "39400": "Major Field Test",
            "39701": "ACCA: Marine/Island Ecology",
            "39708": "Forest Ecology in Chnging Wrld",
            "39900": "Human ID Crimnl Investigation",
            "40600": "Molecular Cell Biology",
            "41501": "Radiographic Procedures 5/Lab",
            "42600": "Immunology",
            "43500": "Ethics:Scientific PrinPrac",
            "44000": "Mgmt/Mthds Patient Care 2",
            "44200": "Cmptd Tomogrphy Crs-Sect Anat",
            "44600": "Diag Nuclear Imaging Pract 2a",
            "44800": "Clinical Nuclear Med Proc 2",
            "45000": "Radionuclide Chem/Radiopharm",
            "45200": "Radiation Biology",
            "45400": "Radiographic Pathology",
            "45800": "Radiographic Clinical 5",
            "45801": "Radiographic Clinical 6",
            "45802": "Radiographic Clinical 7",
            "45900": "ARRT Review",
            "49000": "Undergraduate Research",
            "49600": "Biology Senior Capstone",
            "51200": "Research in Biotechnology",
            "59000": "aData Science Project:Life Sci"
        },

        DATA: {
            "20000": "Introduction to Data Science",
            "23500": "Programming for Data Analysis",
            "40000": "Big Data Systems",
            "47200": "Introduction to Data Mining",
            "49000": "Data Science Capstone Project",
            "50000": "Mathematics: Data Scientists",
            "50100": "Prob and Stats Data Scientists",
            "51000": "Data Mining and Analytics",
            "51100": "Statistical Programming",
            "51200": "Multivariate Data Analysis",
            "53000": "Data Visualization",
            "54000": "LargeScale Data Storage System",
            "55000": "Supervised Machine Learning",
            "55100": "Unsupervised Machine Learning",
            "55200": "Semantic Web",
            "56000": "Neural Network & Deep Learning",
            "56600": "Digital Image Processing",
            "59000": "Data Science Master's Project"
        }
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
                            department: e.target.value,
                            courseName: "",
                            courseNumber: "",
                            section: "001",
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
                        <label>Course Number:</label>
                        <input
                            type="text"
                            value={formData.courseNumber}
                            onChange={(e) => {
                                const courseNumber = e.target.value.trim();
                                const department = formData.department;

                            
                                setFormData({ ...formData, courseNumber, courseName: courseLookup[department]?.[courseNumber] || "" });
                            }}
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