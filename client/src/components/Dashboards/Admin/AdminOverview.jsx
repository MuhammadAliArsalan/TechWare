import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Navbar/navbar1.jsx";
import "./AdminDashboard.css";
import AdminDashboard from "./AdminDashboard.jsx";

function AdminOverview() {
    const handleGoHome = () => {
        navigate("/"); 
    };

    return (
        <div className="admin-dashboard-root-container">
            <Navbar />
            <br></br>
            <br></br>
            <AdminDashboard />

            <h1>Welcome to Admin Dashboard!</h1>
            <button 
                onClick={handleGoHome} className="back-to-home-button" >Back to Home </button>
        </div>
    );
}

export default AdminOverview;