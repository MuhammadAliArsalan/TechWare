import React, { useState } from "react";
import axios from "axios";
import "./OrdersTable.css";

const OrdersTable = ({ orders, onStatusUpdate }) => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const toggleOrderExpand = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      setUpdatingOrder(orderId);
      await axios.put(`/api/seller/orders/${orderId}/status`, { status });
      setSelectedStatus("");
      // The actual update will come through socket.io, but we'll refresh anyway
      onStatusUpdate();
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'shipped':
        return 'status-shipped';
      case 'processing':
        return 'status-processing';
      case 'cancelled':
        return 'status-cancelled';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="orders-table">
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <React.Fragment key={order.order_id}>
              <tr className={expandedOrder === order.order_id ? 'expanded' : ''}>
                <td>{order.order_id.substring(0, 8)}...</td>
                <td>{formatDate(order.created_at)}</td>
                <td>{order.customer.name}</td>
                <td>{order.product.name}</td>
                <td>${parseFloat(order.total_price).toFixed(2)}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="details-btn"
                    onClick={() => toggleOrderExpand(order.order_id)}
                  >
                    {expandedOrder === order.order_id ? 'Hide' : 'Details'}
                  </button>
                </td>
              </tr>
              {expandedOrder === order.order_id && (
                <tr className="order-details">
                  <td colSpan="7">
                    <div className="order-details-content">
                      <div className="details-section">
                        <h4>Order Information</h4>
                        <p><strong>Order ID:</strong> {order.order_id}</p>
                        <p><strong>Date:</strong> {formatDate(order.created_at)}</p>
                        <p><strong>Status:</strong> {order.status}</p>
                        <p><strong>Total:</strong> ${parseFloat(order.total_price).toFixed(2)}</p>
                        <p><strong>Type:</strong> {order.is_rental ? 'Rental' : 'Purchase'}</p>
                        {order.is_rental && <p><strong>Rental Days:</strong> {order.rental_days}</p>}
                      </div>
                      
                      <div className="details-section">
                        <h4>Customer Information</h4>
                        <p><strong>Name:</strong> {order.customer.name}</p>
                        <p><strong>ID:</strong> {order.customer.id}</p>
                      </div>
                      
                      <div className="details-section">
                        <h4>Product Information</h4>
                        <p><strong>Name:</strong> {order.product.name}</p>
                        <p><strong>ID:</strong> {order.product.id}</p>
                        <p><strong>Quantity:</strong> {order.quantity}</p>
                      </div>
                      
                      <div className="status-update-section">
                        <h4>Update Status</h4>
                        <div className="status-update-controls">
                          <select 
                            value={selectedStatus} 
                            onChange={(e) => setSelectedStatus(e.target.value)}
                          >
                            <option value="">Select Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <button 
                            className="update-status-btn"
                            disabled={!selectedStatus || updatingOrder === order.order_id}
                            onClick={() => handleStatusChange(order.order_id, selectedStatus)}
                          >
                            {updatingOrder === order.order_id ? 'Updating...' : 'Update Status'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;