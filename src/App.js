import './css/App.css';
import Home from './pages/home';
import Login from './pages/Login';
import About from './pages/About';
import UnauthorizedAccess from "./pages/UnauthorizedAccess";
import AdminDashboard from './pages/AdminDashboard';
import { CheckAccess } from './components/CheckAccess';
import {BrowserRouter, Routes, Route} from "react-router-dom";

function App() {
  return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin/dashboard" element={
                <CheckAccess allowedRoles={["admin"]}>
                    <AdminDashboard />
                </CheckAccess>
                }
            />
              <Route path="/unauthorizedaccess" element={<UnauthorizedAccess />} />
          </Routes>
        </BrowserRouter>
      </>
  );
}

export default App;
