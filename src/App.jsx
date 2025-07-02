import {Navigate, Route, Routes} from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Login from "./pages/login/Login.jsx";
import {useEffect, useState} from "react";
import Home from './pages/dashboard/screens/Home.jsx'
import Doctor from "./pages/dashboard/screens/Doctor.jsx";
import Patient from "./pages/dashboard/screens/Patient.jsx";


function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    useEffect(() => {
        setIsAuthenticated(!!localStorage.getItem("token"))
    }, [isAuthenticated]);

    return (

            <Routes>
                <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
                <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={() => setIsAuthenticated(true)} />} />
                <Route path="/dashboard" element={isAuthenticated ? <Dashboard onLogout={()=> setIsAuthenticated(false)}/> : <Navigate to="/login" />} >

                    <Route path='/dashboard' element={<Navigate to='/dashboard/home' /> } />
                    <Route path='/dashboard/home' element={<Home />} />
                    <Route path='/dashboard/doctor' element={<Doctor />} />
                    <Route path='/dashboard/patient' element={<Patient />} />
                </Route>
            </Routes>

    );

}

export default App
