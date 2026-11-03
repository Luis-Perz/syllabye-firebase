import './css/App.css';
import Home from './pages/home';
import Login from './pages/Login';
import About from './pages/About';
import UnauthorizedAccess from "./pages/UnauthorizedAccess";
import AdminDashboard from './pages/AdminDashboard';
import ManageUser from './pages/ManageUser';
import {AuthProvider} from './context/AuthContext';
import { CheckAccess } from './components/CheckAccess';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import { ThemeProvider } from "./components/ThemeContext";
import AppMenu from './components/AppMenu';

import { Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';

import StorageSyllabus from './pages/StorageSyllabus';
import ProfessorManagement from './pages/ProfessorManagement';
import CourseManagement from './pages/CourseManagement';
import EmailCenter from './pages/EmailCenter';

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

                        <Route path="/admin/manage-user" element={
                            <CheckAccess allowedRoles={["admin"]}>
                                <AppMenu />
                                <ManageUser />
                            </CheckAccess>
                        }/>

                        <Route path="/app" element={
                                <CheckAccess allowedRoles={["admin", "user"]}>
                                <AppLayout />
                            </CheckAccess>
                        }>
                            <Route index element={<Navigate to="storage-syllabus" replace />} />
                            <Route path="storage-syllabus" element={<StorageSyllabus />} />
                            <Route path="professor-management" element={<ProfessorManagement />} />
                            <Route path="course-management" element={<CourseManagement />} />
                            <Route path="email-center" element={<EmailCenter />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    </>
  );
}

export default App;
