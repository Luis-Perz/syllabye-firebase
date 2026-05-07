import './css/App.css';
import Home from './pages/home';
import Login from './pages/Login';
import About from './pages/About';
import Admin from './pages/Admin';
import AdminDashboard from './pages/AdminDashboard';
import {BrowserRouter, Routes, Route} from "react-router-dom";

function App() {
  return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </BrowserRouter>
      </>
  );
}

export default App;
