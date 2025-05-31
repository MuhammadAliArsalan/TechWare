import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrderManagement.css";
import Seller_dashboard from "./Seller_dashboard";
import Navbar from '../../Navbar/navbar1'

// Configure axios defaults for all requests
axios.defaults.baseURL = 'http://localhost:3000'; // Or your backend URL
axios.defaults.withCredentials = true;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    total_orders: 0,
    total_sales: 0,
    current_month_revenue: 0
  });
  const [orderStatusCounts, setOrderStatusCounts] = useState({
    NULL: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  });
  
  const ordersPerPage = 10;

  useEffect(() => {
    fetchDashboardStats();
    fetchOrderStatusBreakdown();
    fetchOrders();
  }, [currentPage, selectedStatus]);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get("/seller/dashboard-overview");
      setDashboardStats(response.data?.data || {
        total_orders: 0,
        total_sales: 0,
        current_month_revenue: 0
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setError("Failed to load dashboard statistics");
    }
  };

  const fetchOrderStatusBreakdown = async () => {
    try {
      const response = await axios.get("/seller/order-status");
      setOrderStatusCounts(response.data?.data?.order_status_breakdown || {
        NULL: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
      });
    } catch (error) {
      console.error("Error fetching order breakdown:", error);
      setError("Failed to load order status breakdown");
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      let params = {
        page: currentPage,
        limit: ordersPerPage
      };
      
      // Only add status parameter if a specific status is selected
      if (selectedStatus !== "all") {
        params.status = selectedStatus;
      }
      
      const response = await axios.get(`/seller/all-orders`, { params });

      if (response.data.success) {
        setOrders(response.data.data.orders);
        setTotalPages(response.data.data.pagination.total_pages);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.patch(
        `/seller/order/${orderId}/status`,
        { status: newStatus }
      );

      if (response.data.success) {
        setOrders(orders.map(order => 
          order.order_id === orderId ? { ...order, status: newStatus } : order
        ));
        fetchOrderStatusBreakdown();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status");
    }
  };

  const handleStatusFilterChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleViewDetails = async (orderId) => {
    try {
      const response = await axios.get(`/seller/order/${orderId}`);
      setSelectedOrderDetails(response.data.data); // Store the order details
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("Failed to load order details");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrderDetails(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusClass = (status) => {
    const statusMap = {
      "processing": "processing",
      "shipped": "shipped",
      "delivered": "delivered",
      "cancelled": "cancelled"
    };
    return statusMap[status];
  };

  const getStatusDisplay = (status) => {
    return status === "NULL" ? "Pending" : status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="order-management-body">
      <Navbar />
    <div className="order-management-container">
      <Seller_dashboard />
      <div className="order-content">
        <div className="page-header">
          <h1>Order Management</h1>
          <div className="order-summary">
            <div className="summary-card">
              <span className="summary-title">Total Orders: </span>
              <span className="summary-value">{dashboardStats.total_orders}</span>
            </div>
            <div className="summary-card">
              <span className="summary-title">Total Sales: </span>
              <span className="summary-value">Rs.{parseFloat(dashboardStats.total_sales || 0)}</span>
            </div>
            <div className="summary-card">
              <span className="summary-title">This Month: </span>
              <span className="summary-value">Rs.{parseFloat(dashboardStats.current_month_revenue || 0)}</span>
            </div>
          </div>
        </div>

        <div className="order-filters">
          <div className="status-tabs">
            <button className={selectedStatus === "all" ? "active" : ""} onClick={() => handleStatusFilterChange()}>
              All Orders
            </button>
            {["processing", "shipped", "delivered", "cancelled"].map((status) => (
              <button
                key={status}
                className={selectedStatus === status ? "active" : ""}
                onClick={() => handleStatusFilterChange(status)}
              >
                {getStatusDisplay(status)}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-spinner">Loading orders...</div>
        ) : (
          <>
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th className="actions-column">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.order_id}>
                        <td>{order.order_id}</td>
                        <td>{formatDate(order.created_at)}</td>
                        <td>{order.customer?.name || "N/A"}</td>
                        <td>Rs.{parseFloat(order.total_amount || 0).toFixed(2)}</td>
                        <td>
                          <span className={`status-badge ${getStatusClass(order.status)}`}>
                            {getStatusDisplay(order.status)}
                          </span>
                        </td>
                        <td className="action-buttons">
                          <div className="action-container">
                            <button className="view-button" onClick={() => handleViewDetails(order.order_id)}>
                              View Details
                            </button>
                            <select
                              value={order.status || "NULL"}
                              onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                              className="status-select"
                            >
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-orders">No orders found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="pagination-button">
                  Previous
                </button>
                <span className="page-info">Page {currentPage} of {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className="pagination-button">
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Order Details Modal */}
        {showModal && selectedOrderDetails && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-button" onClick={closeModal}>×</button>
              <h2>Order Details - #{selectedOrderDetails.order?.id}</h2>
              <p><strong>Date:</strong> {formatDate(selectedOrderDetails.order?.created_at)}</p>
              <p><strong>Customer:</strong> {selectedOrderDetails.order?.customer?.name}</p>
              <p><strong>Email:</strong> {selectedOrderDetails.order?.customer?.email}</p>
              <p><strong>Total:</strong> Rs.{selectedOrderDetails.order?.total_amount}</p>
              <p><strong>Status:</strong> {getStatusDisplay(selectedOrderDetails.order?.status)}</p>
              <hr />
              <h3>Items:</h3>
              <ul>
                {selectedOrderDetails.items?.map((item, idx) => (
                  <li key={idx}>
                    {item.product?.name} x {item.quantity} = Rs.{item.total_price}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default OrderManagement;