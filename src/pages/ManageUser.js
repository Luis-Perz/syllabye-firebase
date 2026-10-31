import { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase";
import { collection, getDocs, getDoc, doc, updateDoc } from "firebase/firestore";
import "../css/ManageUser.css";
import { useNavigate } from "react-router-dom";


function ManageUser() {
  const [users, setUsers] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const navigate = useNavigate();


  // Works the dropdown. Also filters only users so that the dropdown isn't cluttered with admins
  useEffect(() => {
    async function fetchUsers() {
      try {
        const snapshot = await getDocs(collection(db, "roles"));

        const list = snapshot.docs
          .filter((d) => d.data().role === "user")
          .map((d) => ({
            email: d.id,
            role: d.data().role
          }));
        setUsers(list);
      } catch (err) {
        console.error("Error loading users:", err);
      }
    }
    fetchUsers();
  }, []);

  // Promotes users to admins
  const promoteToAdmin = async () => {
    if (!selectedEmail) return;

    try {
      const ref = doc(db, "roles", selectedEmail.toLowerCase());

      await updateDoc(ref, {
        role: "admin"
      });

      // Remove from local state immediately
      setUsers(users.filter(user => user.email !== selectedEmail));

      setSelectedEmail("");

      alert(`${selectedEmail} is now an admin`);
    }
    catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // HTML for the Manage User page
  return (
    <div className="manage-user-container">
      <h1 className="manage-user-title">Manage Users</h1>

      <div className="manage-user-card">
        <label className="manage-user-label">Select a User:</label>

        <select
          className="manage-user-select"
          value={selectedEmail}
          onChange={(e) => setSelectedEmail(e.target.value)}
        >
        <option value="">Select a user</option>
          {users.map((u) => (
            <option key={u.email} value={u.email}>
              {u.email} ({u.role})
            </option>
        ))}
        </select>

        <button className="manage-user-button" onClick={promoteToAdmin}>
          Make Admin
        </button>
      </div>

      <div className="manage-user-back-container">
        <button className="manage-user-back" onClick={() => navigate("/admin/dashboard")}>
          Back to Dashboard
        </button>
      </div>

    </div>
  );
}

export default ManageUser;
