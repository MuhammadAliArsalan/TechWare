import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./OrderDetails.css";

axios.defaults.baseURL = 'http://localhost:3000'; // Or your backend URL
axios.defaults.withCredentials = true;
const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [orderId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(`/api/seller/orders`, { // Changed endpoint
        params: {
          page: currentPage,
          limit: ordersPerPage,
          status: selectedStatus === "all" ? undefined : selectedStatus
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // Ensure auth
        }
      });
  
      console.log("Full API response:", response); // Debug log
  
      if (response.data?.success) {
        setOrders(response.data.data || response.data.orders || []);
        setTotalPages(response.data.pagination?.total_pages || 1);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Order fetch error:", {
        message: error.message,
        response: error.response?.data
      });
      setError(error.response?.data?.message || "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const response = await axios.put(
        `/api/seller/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        // Update local state
        setOrderDetails({
          ...orderDetails,
          order: {
            ...orderDetails.order,
            status: newStatus,
          },
        });
        alert("Order status updated successfully");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClassName = (status) => {
    const statusMap = {
      "processing": "status-processing",
      "shipped": "status-shipped",
      "delivered": "status-delivered",
      "cancelled": "status-cancelled",
      "pending": "status-pending"
    };
    
    return statusMap[status.toLowerCase()] || "status-default";
  };

  if (loading) {
    return <div className="loading-spinner">Loading order details...</div>;
  }

  if (!orderDetails) {
    return <div className="error-message">Order not found</div>;
  }

  const { order, items } = orderDetails;

  return (
    <div className="order-details-container">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate("/dashboard/orders")}>
          &larr; Back to Orders
        </button>
        <h1>Order Details</h1>
      </div>

      <div className="order-summary-card">
        <div className="order-header">
          <div>
            <h2>Order #{order.id.substring(0, 8)}</h2>
            <p className="order-date">Placed on {formatDate(order.created_at)}</p>
          </div>
          <div className="order-status-section">
            <div className="current-status">
              <span>Current Status:</span>
              <span className={`status-badge ${getStatusClassName(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="status-update">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="status-select"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button 
                className="update-status-button"
                onClick={handleStatusUpdate}
                disabled={newStatus === order.status}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>

        <div className="order-info-grid">
          <div className="customer-info">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> {order.customer.name}</p>
            <p><strong>Email:</strong> {order.customer.email}</p>
            <p><strong>Phone:</strong> {order.customer.phone}</p>
          </div>
          <div className="shipping-info">
            <h3>Shipping Address</h3>
            <p>{order.customer.address}</p>
          </div>
          <div className="payment-info">
            <h3>Payment Information</h3>
            <p><strong>Order Total:</strong> ${parseFloat(order.total_amount).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="order-items-section">
        <h2>Order Items</h2>
        <table className="order-items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Type</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.order_item_id}>
                <td className="product-cell">
                  <div className="product-info">
                    {item.product.image && (
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="product-thumbnail" 
                      />
                    )}
                    <div>
                      <p className="product-name">{item.product.name}</p>
                      <p className="product-id">ID: {item.product.id.substring(0, 8)}</p>
                    </div>
                  </div>
                </td>
                <td>${parseFloat(item.price).toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>
                  {item.is_rental ? (
                    <span className="rental-badge">
                      Rental ({item.rental_days} days)
                    </span>
                  ) : (
                    <span className="purchase-badge">Purchase</span>
                  )}
                </td>
                <td>${parseFloat(item.total_price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" className="total-label">Order Total</td>
              <td className="order-total">${parseFloat(order.total_amount).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default OrderDetails;