import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import "../css/sidebar.css";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        const next = !isOpen;
        setIsOpen(next);
        document.documentElement.style.overflowY = next ? "hidden" : "";
    };

    const handleSignOut = async () => {
        await signOut(auth);
        navigate("/");
    };

    return (
        <>

            <nav >


                <div className="nav-inner">
                    <div className={`hidden-menu ${isOpen ? "active" : ""}`}
                         style={{ display: isOpen ? "flex" : "none" }}>
                        <ul>
                            <li className="nav-link" onClick={() => navigate("/admin/dashboard")}>
                                Admin
                            </li>
                            <li className="signout-button" onClick={handleSignOut}>Sign Out</li>
                        </ul>
                    </div>

                    <div className={`ham-menu ${isOpen ? "active" : ""}`}
                         onClick={toggleMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                </div>
            </nav>
        </>
    );
}