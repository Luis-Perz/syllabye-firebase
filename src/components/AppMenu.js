import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { ThemeContext } from "./ThemeContext";
import "../css/appMenu.css";

export default function AppMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { toggleTheme } = useContext(ThemeContext);
    
    let menuName = auth.currentUser?.displayName || "User";
    if(menuName.length > 22){
        menuName = menuName.slice(0, 19)+"...";
    };

    const toggleMenu = () => {
        setIsOpen((previous) => !previous);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    // Signs users out whenever that option is pressed
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            closeMenu();
            navigate("/");
        } catch (error) {
            console.error("Failed to sign out:", error);
        }
    };

    // Structure of the dropdown menu
    return (
        <nav className="app-menu" aria-label="Main menu">
            <div className="app-menu__container">
                <button
                    type="button"
                    className={`app-menu__toggle ${isOpen ? "app-menu__toggle--open" : ""}`}
                    onClick={toggleMenu}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div
                    id="app-menu-dropdown"
                    className={`app-menu__dropdown ${isOpen ? "app-menu__dropdown--open" : ""}`}
                    hidden={!isOpen}
                >
                  <li className="app-menu__item">
                        <div
                            className="app-menu__static"
                        >
                            {menuName}
                        </div>
                    </li>

                    <hr className="app-menu__divider" />


                    
                    <ul className="app-menu__list">
                        <li className="app-menu__item">
                            <Link
                                to="/home"
                                className="app-menu__link"
                                onClick={closeMenu}
                            >
                                Home
                            </Link>
                        </li>

                        <li className="app-menu__item">
                            <Link
                                to="/about"
                                className="app-menu__link"
                                onClick={closeMenu}
                            >
                                About
                            </Link>
                        </li>

                        <li className="app-menu__item">
                            <Link
                                to="/admin/dashboard"
                                className="app-menu__link"
                                onClick={closeMenu}
                            >
                                Admin Dashboard
                            </Link>
                        </li>

                        <hr className="app-menu__divider" />

                        <li className="app-menu__item">
                            <button
                                type="button"
                                className="app-menu__action"
                                onClick={toggleTheme}
                            >
                                Switch Theme
                            </button>
                        </li>

                        <hr className="app-menu__divider" />

                        <li className="app-menu__item">
                            <button
                                type="button"
                                className="app-menu__action app-menu__action--signout"
                                onClick={handleSignOut}
                            >
                                Sign Out
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}