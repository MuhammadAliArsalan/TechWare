import { useNavigate } from "react-router-dom";
import "./Seller_dashboard.css";


function Seller_dashboard() {
    const navigate = useNavigate();

    return (
        <div className="seller-dashboard-body">
            
            <div className="sidebar">
                <ul>
                    <li onClick={() => navigate("/inventory")}>Inventory Management</li>
                    <li onClick={() => navigate("/order")}>Order Management</li>
                    <li onClick={() => navigate("/analytics")} className="active">Analytics & Insights</li>
                </ul>
            </div>
        </div>
    );
}

export default Seller_dashboard;

