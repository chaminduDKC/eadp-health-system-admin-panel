import {useNavigate} from "react-router-dom";
import { NavLink } from "react-router"

import {Button} from "@mui/material";

import React from "react";
import '../../../styles/theme.css'
import './slidebar.css'

const  SlideBar= ({onLogout, visible})=>{
    const navigateTo = useNavigate();
    const handleLogout = ()=> {
        localStorage.removeItem("access_token");
        onLogout();
        navigateTo("/login")
    }
    const sidebarClass = visible ? 'slidenav active' : 'slidenav';
    return(
        <>
        <div className={sidebarClass}>
            <ul>
                <li><NavLink to='/dashboard/home'>Home</NavLink></li>
                <li><NavLink to='/dashboard/doctor'>Doctor</NavLink></li>
                <li><NavLink to='/dashboard/patient'>Patient</NavLink></li>
                <li><NavLink to='/dashboard/booking'>Bookings</NavLink></li>
                <li><NavLink to='/dashboard/booking'>History</NavLink></li>
                <li><NavLink to='/dashboard/booking'>Reviews</NavLink></li>
                <li><NavLink to='/dashboard/settings'>Settings</NavLink></li>
            </ul>
            <Button color="error" variant="contained" onClick={handleLogout}>LOGOUT</Button>
        </div>

        </>
    )

}
export default SlideBar;