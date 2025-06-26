import React, {useEffect} from 'react';
import { useOutletContext } from 'react-router-dom';
import '../../../styles/theme.css'

import './home.css'



const Home = () => {
    useEffect(() => {
        console.log("Rendered")
    }, []);

    const sidebarVisible = useOutletContext();
    return(
        <div className={sidebarVisible ? "collapsed home" : "expanded home"}>

            <div className="inner-home">
                <div className="dashboard-card">
                    <div className="card-title">Doctors</div>
                    <div className="card-value">120</div>
                </div>
                <div className="dashboard-card">
                    <div className="card-title">Patients</div>
                    <div className="card-value">350</div>
                </div>
                <div className="dashboard-card">
                    <div className="card-title">Today Bookings</div>
                    <div className="card-value">45</div>
                </div>
                <div className="dashboard-card">
                    <div className="card-title">Pending Doctors</div>
                    <div className="card-value">8</div>
                </div>
                <div className="dashboard-card">
                    <div className="card-title">Pending Patients</div>
                    <div className="card-value">15</div>
                </div>

            </div>
        </div>
    )
};

export default Home;