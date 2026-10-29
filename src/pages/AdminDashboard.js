import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import "../css/AdminDashboard.css";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  // Group it by first the semester and then the department
  const [groupedSyllabi, setGroupedSyllabi] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Need to make it so that the user picks the two first
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Need to get rid of this
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Makes sure that it looks good rather than all bunched together
  const formatSemester = (semester) => {
    return semester
        .replace(/(\d{4})/, " $1")
        .replace(/^./, (char) => char.toUpperCase());
};

// Just grabbing the syllabi from Firebase
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {

    try{
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
    }catch(err){
      console.log(err);
    }
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
      // Just double checking that we don't get anything null
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

            {/* This is what needs to get fixed for the file naming convention */}
            const fileName = `${item.courseName}-${item.courseNumber}-${item.department}-${item.instructor}-${item.section}-${item.semester}.pdf`
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
      </div>

      <div className="title-description">
        <p>
          Please first select the semester you would like to view. Then 
          select the department and then in the third column you will see
          all the syllabi for that department in that specific semester.
        </p>
      </div>

      <div className="syllabus-browser">

        {/* This is housing that first column so that we 
        can go semester first*/}
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

        {/* This is the middle column which shows all the 
        departments that were submitted from that specific semester */}
        <div className="browser-column">
          <h2>Departments</h2>

          {/* So to make sure that it's only the departments that are shown
          AFTER the semester is picked */}
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

        {/* This is the third column which will show all the syllabi
        that have been submitted for both that SEMESTER and that DEPARTMENT
        */}
        <div className="browser-column">

          {/* I wanted to make sure that the download all button was on the same level*/}
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

        {/* These will just show up when the department and syllabi 
        aren't picked yet */}

          {!selectedSemester && (
            <p>Select a semester to begin.</p>
          )}

          {selectedSemester && !selectedDepartment && (
            <p>Select a department to view its syllabi.</p>
          )}

          {/* So now we need to show the syllabi themselves. So we then
          get that specific syllabus to show up. Then we need to make it 
          downloadable so ta da. Then the delete button is added in there
          */}
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