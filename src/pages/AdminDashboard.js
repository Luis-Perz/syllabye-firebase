import { useEffect, useState } from "react";
import { db,auth } from "../firebase/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import "../css/AdminDashboard.css";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import JSZip from "jszip";
import { saveAs } from "file-saver";

function AdminDashboard() {
  const [groupedSyllabi, setGroupedSyllabi] = useState({});
  const [openDepartments, setOpenDepartments] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const formatSemester = (semester) => {
    return semester
        .replace(/(\d{4})/, " $1")
        .replace(/^./, (char) => char.toUpperCase());
};
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const snapshot = await getDocs(collection(db, "syllabi"));

    const data = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data()
    }));

    const grouped = {};
    data.forEach((item) => {
      let dept = item.department;
      if(typeof dept !=="string") {
        dept = Object.keys(dept || {})[0] || "Other";
      }
      const semester = item.semester || "Unknown Semester";
      if(!grouped[semester]) {
        grouped[semester] = {};
      }

      if (!grouped[semester][dept]) {
        grouped[semester][dept] = [];
      }

      grouped[semester][dept].push(item);
    });
    setGroupedSyllabi(grouped);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleDelete = async (id) => {
    try{
      await deleteDoc(doc(db, "syllabi", id));
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };


  const filteredGrouped = {};
  const search = searchTerm.toLowerCase();

  Object.keys(groupedSyllabi).forEach((semester) => {
    filteredGrouped[semester] = {};

    Object.keys(groupedSyllabi[semester]).forEach((dept) => {
      const matches = groupedSyllabi[semester][dept].filter((item) =>
          item.courseName?.toLowerCase().includes(search) ||
          item.courseNumber?.toLowerCase().includes(search) ||
          item.section?.toLowerCase().includes(search) ||
          item.instructor?.toLowerCase().includes(search) ||
          item.semester?.toLowerCase().includes(search)
      );
      if (matches.length > 0) {
        filteredGrouped[semester][dept] = matches;
      }
    });
  });

  const downloadAllDepartment = async (semester, dept) => {
    const docs = groupedSyllabi[semester]?.[dept];
    if (!docs || docs.length === 0) return;

    const zip = new JSZip();
    await Promise.all(
        docs.map(async (item) => {
          if (!item.fileURL) return;

          try{
            const response = await fetch(item.fileURL);
            const blob = await response.blob();

            const fileName = `item.courseName-{item.courseNumber}-item.department-{item.instructor}-item.section-{item.semester}.pdf`
                .replace(/[/\\?%*:|"<>]/g, "-");
            zip.file(fileName, blob);
          }catch(err) {
            console.log(err);
          }
        })
    )
    const zipBlob = await zip.generateAsync({type: "blob"});
    saveAs(zipBlob, `${dept}-syallabi.zip`);
  }

    return (
    <div className="admin-dashboard-container">
      <div className="dashboard-header">

        <div className="header-left">
          <input
            type="text"
            className="search-bar"
            placeholder="Search Syllabi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <h1 className="admin-title">Syllabus Storage</h1>
        <div className="header-right">
          <button
            className="menu-button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle Navigation Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {menuOpen && (
            <div className="dropdown-menu">
              <button onClick={() => navigate("/home")}>Home</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>

      <div className="title-description">
        <p>
          Please first select the semester you would like to view. Then 
          select the department and then in the third column you will see
          all the syllabi for that department in that specific semester.
        </p>
      </div>

      <div className="syllabus-browser">

        <div className="browser-column">
          <h2>Semesters</h2>

          {Object.keys(filteredGrouped).map((semester) => (
            <button
              key={semester}
              className={`browser-button ${
                selectedSemester === semester ? "active" : ""
              }`}
              onClick={() => {
                setSelectedSemester(semester);
                setSelectedDepartment(null);
              }}
            >
              {formatSemester(semester)}
            </button>
          ))}
        </div>

        <div className="browser-column">
          <h2>Departments</h2>

          {selectedSemester &&
            Object.keys(filteredGrouped[selectedSemester] || {}).map((dept) => (
              <button
                key={dept}
                className={`browser-button ${
                  selectedDepartment === dept ? "active" : ""
                }`}
                onClick={() => setSelectedDepartment(dept)}
              >
                {dept}
              </button>
            ))}
        </div>

        <div className="browser-column">
          <div className="syllabi-header">
            <h2>Syllabi</h2>

            {selectedSemester && selectedDepartment && (
              <button
                className="download-all-button"
                onClick={() =>
                  downloadAllDepartment(selectedSemester, selectedDepartment)
                }
              >
                Download All
              </button>
          )}
        </div>

          {!selectedSemester && (
            <p>Select a semester to begin.</p>
          )}

          {selectedSemester && !selectedDepartment && (
            <p>Select a department to view its syllabi.</p>
          )}

          {selectedSemester &&
            selectedDepartment &&
            (filteredGrouped[selectedSemester]?.[selectedDepartment] || []).map(
              (item) => (
                <div key={item.id} className="syllabus-item">
                  {item.fileURL && (
                    <>
                      <a
                        className="file-link"
                        href={item.fileURL}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.courseName} (
                        {item.courseNumber}-{item.section}-
                        {item.instructor}-{item.semester})
                      </a>

                      <button
                        className="delete-button"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              )
            )}
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;