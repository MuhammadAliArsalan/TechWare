import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "./AdminDashboard.css";

function AdminDashboard({ onSidebarToggle }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Track window resize and update state
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            const newSidebarState = window.innerWidth > 768;
            setIsSidebarOpen(newSidebarState);
            
            // Notify parent component about sidebar state
            if (onSidebarToggle) {
                onSidebarToggle(newSidebarState);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Initialize on mount
        
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [onSidebarToggle]);

    const isActive = (path) => {
        return location.pathname === path;
    };

    const toggleSidebar = () => {
        const newState = !isSidebarOpen;
        setIsSidebarOpen(newState);
        
        // Notify parent component about sidebar state change
        if (onSidebarToggle) {
            onSidebarToggle(newState);
        }
    };

    return (
        <>
            {/* Mobile Toggle Button - Fixed position outside the sidebar */}
            <button 
                className="admin-sidebar-toggle-btn"
                onClick={toggleSidebar}
                aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="admin-logo">
                    <br></br>
                    {/* <h3>TechWare</h3> */}
                </div>
                <ul className="admin-menu">
                    <li 
                        className={isActive("/adminAnalytics") ? "active" : ""} 
                        onClick={() => {
                            navigate("/adminAnalytics");
                            if (windowWidth <= 768) toggleSidebar();
                        }}
                    >
                        Analytics and Insights
                    </li>
                    <li 
                        className={isActive("/regBuyers") ? "active" : ""} 
                        onClick={() => {
                            navigate("/regBuyers");
                            if (windowWidth <= 768) toggleSidebar();
                        }}
                    >
                        Registered Buyers
                    </li>
                    <li 
                        className={isActive("/regSellers") ? "active" : ""} 
                        onClick={() => {
                            navigate("/regSellers");
                            if (windowWidth <= 768) toggleSidebar();
                        }}
                    >
                        Registered Sellers
                    </li>
                </ul>
                
                {windowWidth <= 768 && isSidebarOpen && (
                    <div className="admin-sidebar-overlay" onClick={toggleSidebar} />
                )}
            </div>
        </>
    );
}

export default AdminDashboard;