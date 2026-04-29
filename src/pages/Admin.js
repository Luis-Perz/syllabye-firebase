
import "../css/login.css";

function Admin() {


    return (
        <div className="admin-login-container">
            <div className="login-card">
                <h1 className="form-title">Admin Login</h1>
                <p className="form-sub">This is the admin login page for SyllaBye. Only authorized users with Lewis University email accounts can access this page.</p>
                <button className="submit-button" onClick={() => {}}>
                    Continue
                </button>
                {{} && <p style={{color: "red", marginTop:"10px"}}>{() => {}}</p>}
            </div>
        </div>
    )
}

export default Admin;