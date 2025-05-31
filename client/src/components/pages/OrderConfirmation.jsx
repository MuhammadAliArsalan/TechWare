// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./OrderConfirmation.css";
// import Navbar from "../Navbar/navbar1";

// function OrderConfirmation() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Safely destructure with defaults
//   const { 
//     formData = {},
//     paymentMethod = "N/A"
//   } = location.state || {};

//   // Generate a random order number
//   const orderNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

//   const handleBackToHome = () => {
//     navigate("/");
//   };

//   // Function to get full billing address with null checks
//   const getBillingAddress = () => {
//     if (formData.sameAsShipping) {
//       return `${formData.address1 || ''}${formData.address2 ? ', ' + formData.address2 : ''}, ${formData.city || ''}, ${formData.state || ''}, ${formData.zipCode || ''}`;
//     } else {
//       return `${formData.billingAddress1 || ''}${formData.billingAddress2 ? ', ' + formData.billingAddress2 : ''}, ${formData.billingCity || ''}, ${formData.billingState || ''}, ${formData.billingZipCode || ''}`;
//     }
//   };

//   // Function to get shipping address with null checks
//   const getShippingAddress = () => {
//     return `${formData.address1 || ''}${formData.address2 ? ', ' + formData.address2 : ''}, ${formData.city || ''}, ${formData.state || ''}, ${formData.zipCode || ''}`;
//   };

//   // Get state name from code with null check
//   const getStateName = (stateCode) => {
//     if (!stateCode) return '';
//     const states = {
//       pj: "Punjab",
//       sir: "Sindh",
//       kpk: "KPK",
//       Bal: "Balochistan",
//       GB: "Gilgit Baltistan"
//     };
//     return states[stateCode.toLowerCase()] || stateCode;
//   };

//   return (
//     <div className="order-confirmation-container">
//       <Navbar />
//       <br />
//       <div className="order-confirmation-card">
//         <div className="order-confirmation-header">
//           <div className="order-confirmation-checkmark">
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
//               <polyline points="22 4 12 14.01 9 11.01"></polyline>
//             </svg>
//           </div>
//           <h2>Order Confirmed!</h2>
//           <p className="order-confirmation-thanks">Thank you for your purchase. Below are your order details:</p>
//         </div>

//         <div className="order-confirmation-section">
//           <h3>Shipping Information</h3>
//           <div className="order-confirmation-details">
//             <div className="order-confirmation-detail-row">
//               <span className="order-confirmation-label">Name:</span>
//               <span className="order-confirmation-value">
//                 {formData.firstName || 'Not provided'} {formData.lastName || ''}
//               </span>
//             </div>
//             <div className="order-confirmation-detail-row">
//               <span className="order-confirmation-label">Address:</span>
//               <span className="order-confirmation-value">{getShippingAddress() || 'Not provided'}</span>
//             </div>
//             <div className="order-confirmation-detail-row">
//               <span className="order-confirmation-label">State:</span>
//               <span className="order-confirmation-value">{getStateName(formData.state) || 'Not provided'}</span>
//             </div>
//             <div className="order-confirmation-detail-row">
//               <span className="order-confirmation-label">Phone:</span>
//               <span className="order-confirmation-value">{formData.phone || 'Not provided'}</span>
//             </div>
//             <div className="order-confirmation-detail-row">
//               <span className="order-confirmation-label">Email:</span>
//               <span className="order-confirmation-value">{formData.email || 'Not provided'}</span>
//             </div>
//           </div>
//         </div>

//         <div className="order-confirmation-section">
//           <h3>Billing Information</h3>
//           <div className="order-confirmation-details">
//             <div className="order-confirmation-detail-row">
//               <span className="order-confirmation-label">Name:</span>
//               <span className="order-confirmation-value">
//                 {formData.sameAsShipping 
//                   ? `${formData.firstName || ''} ${formData.lastName || ''}`
//                   : `${formData.billingFirstName || ''} ${formData.billingLastName || ''}`}
//               </span>
//             </div>
//             <div className="order-confirmation-detail-row">
//               <span className="order-confirmation-label">Address:</span>
//               <span className="order-confirmation-value">{getBillingAddress() || 'Not provided'}</span>
//             </div>
//             <div className="order-confirmation-detail-row">
//               <span className="order-confirmation-label">State:</span>
//               <span className="order-confirmation-value">
//                 {formData.sameAsShipping 
//                   ? getStateName(formData.state) || 'Not provided'
//                   : getStateName(formData.billingState) || 'Not provided'}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="order-confirmation-section">
//           <h3>Payment Method</h3>
//           <div className="order-confirmation-payment-method">
//             {paymentMethod === "payFast" ? "PayFast" : "Cash on Delivery"}
//           </div>
//         </div>

//         <div className="order-confirmation-message">
//           <p>Your order is being processed and will be shipped soon.</p>
//           <p className="order-confirmation-order-number">Order #: {orderNumber}</p>
//         </div>

//         <button className="order-confirmation-home-button" onClick={handleBackToHome}>
//           Back to Home Page
//         </button>
//       </div>
//     </div>
//   );
// }

// export default OrderConfirmation;

import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/navbar1';
import './OrderConfirmation.css';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

function OrderConfirmation() {
  const location = useLocation();
  const { paymentMethod, orderId } = location.state || {};
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const payment_method = "Cash on Delivery";
  const payment_status = "pending";
  const payment_date = new Date().toISOString();
  const transaction_id = uuidv4(); // Generate a unique transaction ID
  const navigate = useNavigate();

  useEffect(() => {
    // Check if PWA installation is available
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    });

    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('Order ID not found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/orders/details/${orderId}`, {
          withCredentials: true
        });
        setOrderDetails(response.data.orderItems);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const calculateTotal = () => {
    if (!orderDetails) return 0;
    return orderDetails.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
  };

  useEffect(() => {

    const savePaymentToDB = async () => {
      try {
        const amount = calculateTotal();
        const payload = {
          order_id: orderId,
          amount,
          transaction_id,
          payment_method,
          payment_status,
          payment_date,
        };

        const res = await axios.post(
          "http://localhost:3000/api/payfast/savePayment",
          payload,
          { withCredentials: true }
        );
        console.log("Payment saved:", res.data.message);

      } catch (err) {
        console.error("Failed to save payment:", err.response?.data || err.message);
      }
    };

    savePaymentToDB();

    const timer = setTimeout(() => {
      navigate("/");
    }, 12000);

    return () => clearTimeout(timer);
  }, [orderDetails, navigate, orderId, transaction_id, payment_method, payment_status, payment_date]);

  const handleAddToHome = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
      }
    }
  };


  if (loading) {
    return (
      <div className="order_confirmation_page_container">
        <Navbar />
        <div className="order_confirmation_content">
          <h2>Loading order details...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order_confirmation_page_container">
        <Navbar />
        <div className="order_confirmation_content">
          <h2>Error</h2>
          <p className="order_confirmation_error_message">{error}</p>
          <Link to="/" className="order_confirmation_home_button">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order_confirmation_page_container">
      <Navbar />
      <div className="order_confirmation_content">
        <div className="order_confirmation_header">
          <h1>Order Confirmation</h1>
          <div className="order_confirmation_icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="#4CAF50">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
        </div>

        <div className="order_confirmation_message">
          <h2>Thank you for your order!</h2>
          <p>Your order has been received and is now being processed.</p>
          <p>Order ID: <strong>{orderId}</strong></p>
          <p>Payment Method: <strong>{paymentMethod === 'cod' ? 'Cash on Delivery' : 'PayFast'}</strong></p>
        </div>

        {orderDetails && (
          <div className="order_confirmation_summary">
            <h3>Order Summary</h3>
            <div className="order_confirmation_items">
              {orderDetails.map((item, index) => (
                <div key={index} className="order_confirmation_item">
                  <div className="order_confirmation_item_name">
                    <p>{item.product_name}</p>
                    <p className="order_confirmation_item_quantity">x{item.quantity}</p>
                  </div>
                  <div className="order_confirmation_item_price">
                    <p>Rs. {parseFloat(item.total_price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order_confirmation_total">
              <p>Total</p>
              <p>Rs. {calculateTotal().toFixed(2)}</p>
            </div>
          </div>
        )}


        <div className="order_confirmation_shipping_info">
          <h3>Shipping Information</h3>
          <p>Your order will be shipped within 2-3 business days.</p>
          <p>You will receive an email with tracking information once your order ships.</p>
        </div>

        <div className="order_confirmation_actions">
          {showInstallPrompt && (
            <button
              onClick={handleAddToHome}
              className="order_confirmation_add_to_home_button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
              </svg>
              Add to Home Screen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;