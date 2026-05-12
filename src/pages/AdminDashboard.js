// Now this is where I actually need to move everything that's in the
// firebase syllabi folder to here. 

// WHHHYY WORK JUST WORK PLEASE LAAWWDD
// I tried to make it so that each would follow a specific title card
// I could not figure it out there's a few things in here that I thought
// would fix it. 

import { useEffect, useState } from "react";
import { db,auth } from "../firebase/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import "../css/AdminDashboard.css";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// import LUBack from "../images/SmallLUT.png"

function AdminDashboard() {
  const [groupedSyllabi, setGroupedSyllabi] = useState({});
  const [openDepartments, setOpenDepartments] = useState({});
  const navigate = useNavigate();

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

        if (!grouped[dept]) {
          grouped[dept] = [];
        }
        grouped[dept].push(item);
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

    const toggleDepartment = (dept) => {
      setOpenDepartments((prev) => ({
        ...prev,
        [dept]: !prev[dept]
      }));
    };

  return(
    <div className="admin-dashboard-container">
      <div className="dashboard-header">
        <h1 className="admin-title">Syllabus Storage</h1>
        <button
        className="logout-button"
        onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div className="title-description">
        <p>
          Each drop down menu contains all of the submitted syllabi for each specific
          department. Inside those drop downs you will find each file and when it is clicked
          it will download. You may also delete the files.
        </p>
      </div>

      <div className="department-grid">
        {Object.keys(groupedSyllabi).map((dept) => (
          <div key={dept} className="department-card">

            <button 
            className="department-button"
            onClick={() => toggleDepartment(dept)}
            >
              {dept}
            </button>
            {openDepartments[dept] && (
              <ul className="syllabus-list">
                {groupedSyllabi[dept].map((item) => (
                  <li key={item.id} className="syllabus-item">                    
                      {item.fileURL && (
                        <>
                          <a
                          className="file-link"
                          href={item.fileURL}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {item.courseName} ({item.courseNumber})
                        </a>

                      <button 
                      className="delete-button"
                      onClick={() => handleDelete(item.id)}>
                        Delete
                      </button>
                    </>
              )}
             </li>
            ))}
            </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
export default AdminDashboard;