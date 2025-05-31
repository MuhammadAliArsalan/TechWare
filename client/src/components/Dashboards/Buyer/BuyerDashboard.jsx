// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./BuyerDashboard.css"
// import Navbar from "../../Navbar/navbar1.jsx";


// function BuyerDashboard() {
//     const [isOpen, setIsOpen] = useState(false);
//     const navigate = useNavigate();

//     const toggleSidebar = () => {
//         setIsOpen(!isOpen);
//     };

//     return (
        
//         <div className="buyer-dashboard-body">

//             <Navbar />

//             <button className="hamburger" onClick={toggleSidebar}>
//                 &#9776;
//             </button>
//             <div className={`sideBar ${isOpen ? "open" : ""}`}>
//                 <ul>
//                     <li onClick={() => navigate("/orderHistory")}>Order History</li>
//                     <li onClick={() => navigate("/rentalAgreements")}>Rental Agreements</li>
//                 </ul>
//             </div>
//         </div>

//     );
// }

// export default BuyerDashboard;

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import "./BuyerDashboard.css";

function BuyerDashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(window.innerWidth > 768);

    // Helper function to check if a path is active
    const isActive = (path) => {
        return location.pathname === path;
    };

    // Close sidebar on navigation for mobile
    const handleNavigation = (path) => {
        navigate(path);
        if (window.innerWidth <= 768) {
            setIsOpen(false);
        }
    };

    // Handle clicks outside sidebar on mobile
    useEffect(() => {
        const handleResize = () => {
            setIsOpen(window.innerWidth > 768);
        };

        const handleClickOutside = (e) => {
            if (window.innerWidth <= 768 && 
                !e.target.closest('.sidebar-section') && 
                !e.target.closest('.mobile-menu-toggle')) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            {/* Mobile menu toggle button */}
            <button 
                className="mobile-menu-toggle" 
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
            >
                <FaBars />
            </button>
            
            {/* Overlay for mobile - closes sidebar when clicking outside */}
            <div className={`sidebar-overlay ${isOpen && window.innerWidth <= 768 ? 'active' : ''}`} 
                 onClick={() => setIsOpen(false)}></div>
            
            {/* Sidebar */}
            <div className={`sidebar-section ${isOpen ? 'open' : ''}`}>
                <h2 className="sidebar-title">Dashboard</h2>
                <ul className="sidebar-menu">
                    <li 
                        className={`sidebar-item ${isActive("/orderHistory") ? "active" : ""}`}
                        onClick={() => handleNavigation("/orderHistory")}
                    >
                        Order History
                    </li>
                    <li 
                        className={`sidebar-item ${isActive("/rentalAgreements") ? "active" : ""}`}
                        onClick={() => handleNavigation("/rentalAgreements")}
                    >
                        Rental Agreements
                    </li>
                    {/* Add more sidebar items as needed */}
                </ul>
            </div>
        </>
    );
}

export default BuyerDashboard;