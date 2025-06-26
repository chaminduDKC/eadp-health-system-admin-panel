import React, { useState } from 'react';
import SlideBar from "./components/SlideBar.jsx";
import Header from "./components/Header.jsx";
import {Outlet} from "react-router-dom"


const Dashboard = ({onLogout}) => {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const toggleSidebar = () => setSidebarVisible(v => !v);
    return (
        <>
        <div>
            <Header sidebarVisible={sidebarVisible} toggleSidebar={toggleSidebar} />
            <SlideBar visible={sidebarVisible} onLogout={()=> onLogout()} />
            <div className="outlet">
            <Outlet context={sidebarVisible}/>
            </div>
        </div>
        </>
    );
};

export default Dashboard;
