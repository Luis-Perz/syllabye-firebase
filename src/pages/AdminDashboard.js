// Now this is where I actually need to move everything that's in the
// firebase syllabi folder to here. 

import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import "../css/AdminDashboard.css";
import LUBack from "../images/SmallLUT.png"

function AdminDashboard() {
  const [syllabi, setSyllabi] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "syllabi"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      data.sort((a, b) => b.id.localeCompare(a.id));

      setSyllabi(data);
    };

    fetchData();
  }, []);

  return (
    <div className="admin-dashboard-container">
      <div className="columns">
      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="syllabus-list">
        {syllabi.length === 0 ? (
          <p>No syllabi uploaded yet.</p>
        ) : (
          syllabi.map((item) => (
            <div key={item.id} className="syllabus-card">
              <h3>
                {item.courseName} ({item.courseNumber})
              </h3>

              <p className="syllabus-meta">
                <b>Instructor:</b> {item.instructor}
              </p>

              <p className="syllabus-meta">
                <b>Department:</b> {item.department}
              </p>

              <p className="syllabus-meta2">
                <b>Semester:</b> {item.semester}
              </p>

              <p className="syllabus-meta">
                <b>Section:</b> {item.section}
              </p>

              {item.fileURL && (
                <a
                  className="file-link"
                  href={item.fileURL}
                  target="_blank"
                  rel="noreferrer"
                >
                  View File
                </a>
              )}
            </div>
          ))
        )}
      </div>
      </div>
    </div>
  );
}

export default AdminDashboard;