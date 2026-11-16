import {useEffect, useState} from "react";
import {collection, getDocs, query, orderBy, where, Timestamp} from "firebase/firestore";
import { db } from "../firebase/firebase";
import "../css/RecentUploads.css"

export default function RecentUploads() {
    const [uploaded, setUploaded] = useState([]);
    const [open, setOpen] = useState(true);

    useEffect(() => {
        async function load() {
            const cutoff = Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000);
            const q = query(
                collection(db, "syllabi"),
                where("createdAt", ">=", cutoff),
                orderBy("createdAt", "desc")
            );
            const snap = await getDocs(q);
            setUploaded(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
        load();
    }, []);

    return (
        <div className="most-recent-container">
            <button type="button" className="most-recent-title" onClick={() => setOpen((o) => !o)}>
                <p>Recent Uploads</p>
                <div className="dots-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>

            {open && (
                <div className="most-recent-uploads">
                    <ul>
                        {uploaded.length === 0 && <li className="empty">No uploads in the last 24 hours.</li>}
                        {uploaded.map((u) => (
                            <li key={u.id}>
                                <a href={u.fileURL} target="_blank" rel="noopener noreferrer">{u.courseName} ({u.department}) - {u.instructor} </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
