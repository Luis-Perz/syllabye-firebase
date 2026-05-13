
import { useNavigate } from "react-router-dom";
import "../css/unauthorizedaccess.css"
import Stop from "../images/stop.png"

function UnauthorizedAccess(){
    const navigate = useNavigate();
    return (
       <>
           <div className="ua-container">
               <div className="ua-message">
                   <img className="ua-image" src={Stop} alt="stop-unauthorized-access"/>
                   <h1>Unauthorized Access</h1>
                   <p>You are not authorized to access this page. If this is an error,
                       please contact website administrators.</p>
                   <button className="nav-link" onClick={() => navigate("/home")}>
                       Back to Home
                   </button>
               </div>
           </div>

       </>
    )
}

export default UnauthorizedAccess;