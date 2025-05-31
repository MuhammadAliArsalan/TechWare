import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import axios from "axios";
import { io } from "socket.io-client";
import Seller_dashboard from "./Seller_dashboard";
import "./AnalyticsDashboard.css";
import StatCard from "./StatCard";
import LoadingSpinner from "./LoadingSpinner";

axios.defaults.withCredentials = true;

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
);
import Navbar from '../../Navbar/navbar1'

const AnalyticsDashboard = () => {
  // Dashboard overview data
  const [dashboardData, setDashboardData] = useState(null);
  // Revenue report data
  const [revenueData, setRevenueData] = useState([]);
  // Top products data
  const [topProducts, setTopProducts] = useState({
    top_selling_products: [],
    top_rented_products: []
  });
  // Ratings data
  const [ratingsData, setRatingsData] = useState(null);
  // Order status breakdown
  const [orderStatusData, setOrderStatusData] = useState({
    order_status_breakdown: {},
    recent_orders: []
  });
  // Loading states
  const [loading, setLoading] = useState({
    dashboard: true,
    revenue: true,
    products: true,
    ratings: true,
    orders: true
  });
  // Time period for revenue report
  const [period, setPeriod] = useState("month");
  
  // Connect to socket.io
  useEffect(() => {
    const socket = io();
    
    // Join seller's room when user is authenticated
    socket.on("connect", () => {
      const sellerId = localStorage.getItem("user_id"); // Assume user_id is stored in localStorage
      if (sellerId) {
        socket.emit("join", `seller-${sellerId}`);
      }
    });
    
    // Listen for order status updates
    socket.on("order-status-update", (data) => {
      // When an order status updates, refresh the orders data
      fetchOrderBreakdown();
    });
    
    return () => {
      socket.disconnect();
    };
  }, []);

  // Fetch all initial data
  useEffect(() => {
    fetchDashboardData();
    fetchRevenueReport();
    fetchTopProducts();
    fetchRatingSummary();
    fetchOrderBreakdown();
  }, []);

  // Fetch dashboard overview data
  const fetchDashboardData = async () => {
    try {
      setLoading(prev => ({ ...prev, dashboard: true }));
      const response = await axios.get("http://localhost:3000/seller/dashboard-overview");
      setDashboardData(response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(prev => ({ ...prev, dashboard: false }));
    }
  };

  // Fetch revenue report data
  const fetchRevenueReport = async (startDate, endDate) => {
    try {
      setLoading(prev => ({ ...prev, revenue: true }));
      
      let url = "http://localhost:3000/seller/revenue-report";
      
      if (startDate && endDate) {
        url += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
      } else {
        // Default to last 30 days
        const end = new Date();
        const start = new Date();
        
        if (period === "week") {
          start.setDate(end.getDate() - 7);
        } else if (period === "month") {
          start.setDate(end.getDate() - 30);
        } else if (period === "year") {
          start.setFullYear(end.getFullYear() - 1);
        }
        
        url += `?startDate=${start.toISOString()}&endDate=${end.toISOString()}`;
      }
      
      const response = await axios.get(url);
      setRevenueData(response.data.data.revenue_report);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      setLoading(prev => ({ ...prev, revenue: false }));
    }
  };

  // Fetch top products data
  const fetchTopProducts = async () => {
    try {
      setLoading(prev => ({ ...prev, products: true }));
      const response = await axios.get("http://localhost:3000/seller/top-products");
      setTopProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching top products:", error);
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  // Fetch ratings summary
  const fetchRatingSummary = async () => {
    try {
      setLoading(prev => ({ ...prev, ratings: true }));
      const response = await axios.get("http://localhost:3000/seller/rating-summary");
      setRatingsData(response.data.data);
    } catch (error) {
      console.error("Error fetching ratings summary:", error);
    } finally {
      setLoading(prev => ({ ...prev, ratings: false }));
    }
  };

  // Fetch order breakdown
  const fetchOrderBreakdown = async () => {
    try {
      setLoading(prev => ({ ...prev, orders: true }));
      const response = await axios.get("http://localhost:3000/seller/order-status");
      setOrderStatusData(response.data.data);
    } catch (error) {
      console.error("Error fetching order breakdown:", error);
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };

  // Handle period change
  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    
    const end = new Date();
    const start = new Date();
    
    if (newPeriod === "week") {
      start.setDate(end.getDate() - 7);
    } else if (newPeriod === "month") {
      start.setDate(end.getDate() - 30);
    } else if (newPeriod === "year") {
      start.setFullYear(end.getFullYear() - 1);
    }
    
    fetchRevenueReport(start, end);
  };

  // Prepare revenue chart data
  const revenueChartData = {
    labels: revenueData.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: "Sales Revenue",
        data: revenueData.map(item => item.sales_revenue),
        borderColor: "#1C2E4A",
        backgroundColor: "rgba(24, 68, 140, 0.2)",
        fill: true,
        tension: 0.3,
        
      },
      {
        label: "Rental Revenue",
        data: revenueData.map(item => item.rental_revenue),
        borderColor: "#52B788",
        backgroundColor: "rgba(82, 183, 136, 0.2)",
        fill: true,
        tension: 0.3
      },
      {
        label: "Total Revenue",
        data: revenueData.map(item => item.total_revenue),
        borderColor: "#6C63FF",
        backgroundColor: "rgba(136, 28, 146, 0.1)",
        fill: true,
        tension: 0.3,
        borderDash: [5, 5]
      }
    ]
  };

  // Prepare sales breakdown pie chart data
  const salesBreakdownData = {
    labels: ["New Products", "Second-Hand", "Rental"],
    datasets: [
      {
        label: "Revenue Source",
        data: dashboardData ? [
          dashboardData.total_sales - (dashboardData.rental_metrics?.total_rental_revenue || 0),
          0, // We don't have second-hand data in the API
          dashboardData.rental_metrics?.total_rental_revenue || 0
        ] : [0, 0, 0],
        backgroundColor: ["#e6b8b0", "#94A3B8", "#64748B"],
        borderWidth: 1
      }
    ]
  };

  // Prepare top selling products chart data
  const topSellingData = {
    labels: topProducts.top_selling_products.slice(0, 5).map(p => p.name),
    datasets: [
      {
        label: "Total Revenue",
        data: topProducts.top_selling_products.slice(0, 5).map(p => p.total_revenue),
        backgroundColor: "#e6b8b0",
        
      }
    ]
  };

  // Prepare top rented products chart data
  const topRentedData = {
    labels: topProducts.top_rented_products.slice(0, 5).map(p => p.name),
    datasets: [
      {
        label: "Rental Revenue",
        data: topProducts.top_rented_products.slice(0, 5).map(p => p.rental_revenue),
        backgroundColor: "#e6b8b0"
      }
    ]
  };

  // Prepare order status chart data
  const orderStatusChartData = {
    labels: orderStatusData.order_status_breakdown ? Object.keys(orderStatusData.order_status_breakdown) : [],
    datasets: [
      {
        label: "Order Count",
        data: orderStatusData.order_status_breakdown ? Object.values(orderStatusData.order_status_breakdown) : [],
        backgroundColor: ["lightblue", "#e6b8b0", "#3B82F6", "#F97316", "#EF4444"]
      }
    ]
  };

  // Prepare rating distribution chart data
  const ratingDistribution = ratingsData?.overall_rating?.rating_breakdown;
  const ratingChartData = {
    labels: ["5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"],
    datasets: [
      {
        label: "Rating Distribution",
        data: ratingDistribution ? [
          ratingDistribution.five_star.count,
          ratingDistribution.four_star.count,
          ratingDistribution.three_star.count,
          ratingDistribution.two_star.count,
          ratingDistribution.one_star.count
        ] : [0, 0, 0, 0, 0],
        backgroundColor: ["#22C55E", "#86EFAC", "#FDE68A", "#FBBF24", "#F87171"]
      }
    ]
  };

  if (loading.dashboard || loading.revenue || loading.products || loading.ratings || loading.orders) {
    // Calculate which items are still loading
    const loadingItems = [];
    if (loading.dashboard) loadingItems.push("dashboard overview");
    if (loading.revenue) loadingItems.push("revenue data");
    if (loading.products) loadingItems.push("product statistics");
    if (loading.ratings) loadingItems.push("ratings information");
    if (loading.orders) loadingItems.push("order details");
    
    // Create a contextual loading message
    let message = "Loading seller analytics...";
    if (loadingItems.length === 1) {
      message = `Loading ${loadingItems[0]}...`;
    } else if (loadingItems.length > 1) {
      const lastItem = loadingItems.pop();
      message = `Loading ${loadingItems.join(", ")} and ${lastItem}...`;
    }
    
    return <LoadingSpinner message={message} />;
  }

  return (
    <div className="sellerAnalytics-body">
      <Navbar />
    <div className="analytics-body">
      <Seller_dashboard />
      <div className="analytics-container">
        <h2 className="dashboard-title">Seller Analytics Dashboard</h2>

        {/* Stats Overview Section */}
        <div className="stats-section">
          <StatCard 
            title="Total Orders" 
            value={dashboardData.total_orders} 
            icon="📦" 
          />
          <StatCard 
            title="Total Sales" 
            value={`Rs${dashboardData.total_sales.toFixed(2)}`} 
            icon="💰" 
          />
          <StatCard 
            title="Products Sold" 
            value={dashboardData.total_products_sold} 
            icon="🛒" 
          />
          <StatCard 
            title="Total Rentals" 
            value={dashboardData.rental_metrics.total_rentals} 
            icon="🔄" 
          />
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          <div className="chart-card full-width">
            <div className="chart-header">
              <h3>Revenue Overview</h3>
              <div className="period-selector">
                <button 
                  className={period === "week" ? "active" : ""} 
                  onClick={() => handlePeriodChange("week")}
                >
                  Week
                </button>
                <button 
                  className={period === "month" ? "active" : ""} 
                  onClick={() => handlePeriodChange("month")}
                >
                  Month
                </button>
                <button 
                  className={period === "year" ? "active" : ""} 
                  onClick={() => handlePeriodChange("year")}
                >
                  Year
                </button>
              </div>
            </div>
            <div className="chart-container">
              <Line 
                data={revenueChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                      align: 'center'
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          let label = context.dataset.label || '';
                          if (label) {
                            label += ': ';
                          }
                          if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', { 
                              style: 'currency', 
                              currency: 'USD' 
                            }).format(context.parsed.y);
                          }
                          return label;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return 'Rs' + value;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          
          <div className="chart-card">
            <h3>Revenue Sources</h3>
            <div className="chart-container">
              <Pie 
                data={salesBreakdownData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  layout: {
                    padding: {
                      left: 0,
                      right: 0,
                      top: 10,
                      bottom: 10
                    }},
                  plugins: {
                    legend: {
                      position: 'bottom',
                      align: 'center',
                      
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          let label = context.label || '';
                          label += ': ';
                          if (context.parsed !== null) {
                            label += new Intl.NumberFormat('en-US', { 
                              style: 'currency', 
                              currency: 'USD' 
                            }).format(context.parsed);
                          }
                          return label;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          
          <div className="chart-card">
            <h3>Top Selling Products</h3>
            <div className="chart-container">
              <Bar 
                data={topSellingData}
                options={{
                  indexAxis: 'y',
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          let label = context.dataset.label || '';
                          label += ': ';
                          if (context.parsed.x !== null) {
                            label += new Intl.NumberFormat('en-US', { 
                              style: 'currency', 
                              currency: 'USD' 
                            }).format(context.parsed.x);
                          }
                          return label;
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return 'Rs' + value;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
          
          <div className="chart-card">
            <h3>Top Rental Products</h3>
            <div className="chart-container">
              <Bar 
                data={topRentedData}
                options={{
                  indexAxis: 'y',
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          let label = context.dataset.label || '';
                          label += ': ';
                          if (context.parsed.x !== null) {
                            label += new Intl.NumberFormat('en-US', { 
                              style: 'currency', 
                              currency: 'USD' 
                            }).format(context.parsed.x);
                          }
                          return label;
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return 'Rs' + value;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Charts Grid - Second Row */}
        <div className="charts-grid">
          <div className="chart-card">
            <h3>Order Status</h3>
            <div className="chart-container">
              <Pie 
                data={orderStatusChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    }
                  }
                }}
              />
            </div>
          </div>
          
          <div className="chart-card">
            <h3>Rating Distribution</h3>
            <div className="chart-container">
              <Bar 
                data={ratingChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          </div>
          
          <div className="chart-card rating-summary">
            <h3>Rating Summary</h3>
            <div className="rating-content">
              <div className="rating-score">
                <span className="rating-number">{ratingsData?.overall_rating?.average?.toFixed(1) || "0.0"}</span>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} className={`star ${star <= Math.round(ratingsData?.overall_rating?.average) ? "filled" : ""}`}>★</span>
                  ))}
                </div>
                <div className="review-count">Based on {ratingsData?.overall_rating?.total_reviews || 0} reviews</div>
              </div>
              <div className="rating-bars">
                {ratingDistribution && [5, 4, 3, 2, 1].map(star => (
                  <div key={star} className="rating-bar-item">
                    <span>{star} Stars</span>
                    <div className="rating-bar-container">
                      <div 
                        className="rating-bar" 
                        style={{ width: `${ratingDistribution[`${star === 5 ? 'five' : star === 4 ? 'four' : star === 3 ? 'three' : star === 2 ? 'two' : 'one'}_star`].percentage}%` }}
                      ></div>
                    </div>
                    <span>{ratingDistribution[`${star === 5 ? 'five' : star === 4 ? 'four' : star === 3 ? 'three' : star === 2 ? 'two' : 'one'}_star`].percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AnalyticsDashboard;