import './css/App.css';
import Home from './pages/home';
import Login from './pages/Login';
import About from './pages/About';
import UnauthorizedAccess from "./pages/UnauthorizedAccess";
import AdminDashboard from './pages/AdminDashboard';
import {AuthProvider} from './context/AuthContext';
import { CheckAccess } from './components/CheckAccess';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import { ThemeProvider } from "./components/ThemeContext";
import AppMenu from './components/AppMenu';

function App() {
  return (
      <>
          <AuthProvider>
              <ThemeProvider>
                  <BrowserRouter>
                      <Routes>
                          <Route path="/" element={<Login />} />
                          <Route path="/unauthorizedaccess" element={<UnauthorizedAccess />} />

                          <Route path="/home" element={
                              <CheckAccess allowedRoles={["admin", "user"]}>
                                  <AppMenu />
                                  <Home />
                              </CheckAccess>
                          }/>
                          
                          <Route path="/about" element={
                              <div>
                                  <AppMenu />
                                  <About />
                              </div>
                          }/>

                          <Route path="/admin/dashboard" element={
                              <CheckAccess allowedRoles={["admin"]}>
                                  <AppMenu />
                                  <AdminDashboard />
                              </CheckAccess>
                          }/>
                      </Routes>
                  </BrowserRouter>
              </ThemeProvider>
          </AuthProvider>
      </>
  );
}

export default App;
