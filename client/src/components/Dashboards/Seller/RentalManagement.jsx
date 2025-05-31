import { useState } from "react";
//import "./RentalManagement.css";
import Seller_dashboard from "./Seller_dashboard";

function RentalManagement() {
    const [rentalAgreements, setRentalAgreements] = useState([
        { id: 1, productName: "Camera", customerName: "Sana", startDate: "2024-03-01", endDate: "2024-03-10", price: 100, status: "Active" },
        { id: 2, productName: "Laptop", customerName: "Sara", startDate: "2024-03-05", endDate: "2024-03-12", price: 200, status: "Completed" }
    ]);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [newAgreement, setNewAgreement] = useState(null);
    
    const handleNewAgreementChange = (e) => {
        const { name, value } = e.target;
        setNewAgreement({ ...newAgreement, [name]: value });
    };

    const addNewAgreement = () => {
        if (!newAgreement || !newAgreement.productName || !newAgreement.customerName || !newAgreement.startDate || !newAgreement.endDate || !newAgreement.price) {
            alert("Please fill all required fields.");
            return;
        }
        setRentalAgreements([...rentalAgreements, { id: Date.now(), ...newAgreement, status: "Active" }]);
        setNewAgreement(null);
    };
    
    return (
        <div className="rental-body">
            <br></br>
            <br></br>
            <br></br>
        <div className="rental-container">

            <Seller_dashboard />
            <br></br>
            <br></br>
            <h2>Rental Management</h2>
            
            <input
                type="text"
                className="search-bar"
                placeholder="Search rental agreements..."
                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
            
            {/* <button className="add-agreement-btn" onClick={() => 
                setNewAgreement({ 
                    productName: "", customerName: "",startDate: "", 
                    endDate: "", price: "" 
                })
            }>Add New Rental Agreement</button> */}
            
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Customer Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Price</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {rentalAgreements
                        .filter(agreement => agreement.productName.toLowerCase().includes(searchTerm) || agreement.customerName.toLowerCase().includes(searchTerm))
                        .map((agreement) => (
                            <tr key={agreement.id}>
                                <td>{agreement.productName}</td>
                                <td>{agreement.customerName}</td>
                                <td>{agreement.startDate}</td>
                                <td>{agreement.endDate}</td>
                                <td>${agreement.price}</td>
                                <td>{agreement.status}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
            
            {newAgreement && (
                <div className="edit-form">
                    <h3>Add New Rental Agreement</h3>
                    <input type="text" name="productName" placeholder="Product Name" value={newAgreement.productName} onChange={handleNewAgreementChange} />
                    <input type="text" name="customerName" placeholder="Customer Name" value={newAgreement.customerName} onChange={handleNewAgreementChange} />
                    <input type="date" name="startDate" placeholder="Start Date" value={newAgreement.startDate} onChange={handleNewAgreementChange} />
                    <input type="date" name="endDate" placeholder="End Date" value={newAgreement.endDate} onChange={handleNewAgreementChange} />
                    <input type="number" name="price" placeholder="Rental Price" value={newAgreement.price} onChange={handleNewAgreementChange} />
                    <button onClick={addNewAgreement}>Add</button>
                    <button onClick={() => setNewAgreement(null)}>Cancel</button>
                </div>
            )}
        </div>
        </div>
    );
}

export default RentalManagement;
