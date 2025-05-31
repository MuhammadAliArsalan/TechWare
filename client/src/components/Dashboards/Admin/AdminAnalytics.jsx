import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import "./AdminAnalytics.css";
import AdminDashboard from "./AdminDashboard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Sparkles, TrendingUp, Users, Package, Award, DollarSign, Calendar } from "lucide-react";
 import Navbar from '../../Navbar/navbar1'

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip, 
  Legend
);

const AdminAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    userStats: null,
    orderStats: null,
    revenueStats: null,
    transactionStats: null,
    topProducts: null,
    topSellers: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState("both");
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('accessToken');
        const config = {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        
        // Fetch data with proper error handling
        const [
          usersResponse, 
          ordersResponse,
          revenueResponse,
          transactionsResponse
        ] = await Promise.all([
          axios.get("http://localhost:3000/api/admin/total-users", config),
          axios.get("http://localhost:3000/api/admin/total-orders", config),
          axios.get("http://localhost:3000/api/admin/total-revenue", config),
          axios.get("http://localhost:3000/api/admin/total-transactions", config).catch(err => {
            console.warn("Transactions data fetch failed, continuing with other data:", err);
            return { data: null };
          })
        ]);

        setAnalyticsData({
          userStats: usersResponse.data,
          orderStats: ordersResponse.data,
          revenueStats: revenueResponse.data,
          transactionStats: transactionsResponse.data
        });
        
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);

      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError(err.response?.data?.message || err.message || "Failed to load analytics data");

        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [navigate]);


  const pieChartData = {
    labels: ["Buyers", "Sellers", "Admins"],
    datasets: [
      {
        label: "Total Users",
        data: [
          analyticsData.userStats?.find(u => u.role === 'buyer')?.count || 0,
          analyticsData.userStats?.find(u => u.role === 'seller')?.count || 0,
          analyticsData.userStats?.find(u => u.role === 'admin')?.count || 0
        ],
        backgroundColor: ["#FF9AA2", "#FFB347", "#FFDF64"],
        borderColor: ["#FF8A92", "#FFA337", "#FFCF54"],
        borderWidth: 1,
        hoverOffset: 20,
      },
    ],
  };

  const barChartData = {
    labels: ["Processing", "Shipped", "Delivered", "Cancelled"],
    datasets: [
      {
        label: "Order Status",
        data: [
          analyticsData.orderStats?.find(o => o.status === 'processing')?.count || 0,
          analyticsData.orderStats?.find(o => o.status === 'shipped')?.count || 0,
          analyticsData.orderStats?.find(o => o.status === 'delivered')?.count || 0,
          analyticsData.orderStats?.find(o => o.status === 'cancelled')?.count || 0
        ],
        backgroundColor: ["#A0D2EB", "#FFE156", "#8EECF5", "#C3AED6"],
        borderRadius: 8,
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 2000,
    }
  };

  const barOptions = {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw || 0;
            return `Count: ${value}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    },
    animation: {
      delay: (context) => context.dataIndex * 100,
      duration: 1000,
    }
  };

  const totalUsers = analyticsData.userStats?.reduce((sum, user) => sum + parseInt(user.count), 0) || 0;
  const dailyRevenue = analyticsData.revenueStats?.daily || 0;
  const weeklyRevenue = analyticsData.revenueStats?.weekly || 0;
  const monthlyRevenue = analyticsData.revenueStats?.monthly || 0;
  const totalOrders = analyticsData.orderStats?.reduce((sum, order) => sum + parseInt(order.count), 0) || 0;
  
  // Calculate rental percentage if transaction data is available
  const rentalCount = analyticsData.transactionStats?.rentals || 0;
  const totalTransactions = rentalCount + 
    (analyticsData.transactionStats?.secondhandSales || 0) + 
    (analyticsData.transactionStats?.totalProductSales || 0);
  const rentalPercentage = totalTransactions > 0 
    ? ((rentalCount / totalTransactions) * 100).toFixed(1) 
    : 0;

  if (loading) {
    return (
      <div className="admin-analytics-container">
        <AdminDashboard />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Preparing your analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-analytics-container">
        <AdminDashboard />
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          <p>Oops! {error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Let's try again!
          </button>
        </div>
      </div>
    );
  }

  const renderConfetti = () => {
    if (!showConfetti) return null;
    
    const confettiElements = [];
    for (let i = 0; i < 50; i++) {
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 2;
      confettiElements.push(
        <div 
          key={i}
          className="confetti"
          style={{left: `${left}%`, animationDelay: `${animationDelay}s`}}
        />
      );
    }
    
    return confettiElements;
  };

  return (
    <div className="admin-analytics-body">
      <Navbar />
    <div className="admin-analytics-container">
      
      {renderConfetti()}
      <AdminDashboard />
 
      <div className="analytics-header">
        <Sparkles className="header-icon" size={32} />
        <h2>Analytics Dashboard</h2>
      </div>

      <div className="stats-summary">
        <div className="stat-card animated">
          <Users size={24} />
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-value">{totalUsers}</p>
          </div>
        </div>
        
        <div className="stat-card animated">
          <Package size={24} />
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-value">{totalOrders}</p>
          </div>
        </div>
        
        <div className="stat-card animated">
          <DollarSign size={24} />
          <div className="stat-content">
            <h3>Monthly Revenue</h3>
            <p className="stat-value">Rs. {monthlyRevenue}</p>
          </div>
        </div>
        
        <div className="stat-card animated">
          <Calendar size={24} />
          <div className="stat-content">
            <h3>Daily Revenue</h3>
            <p className="stat-value">Rs. {dailyRevenue}</p>
          </div>
        </div>
      </div>

      <div className="chart-controls">
        <button 
          className={`chart-toggle-btn ${activeChart === 'users' || activeChart === 'both' ? 'active' : ''}`} 
          onClick={() => setActiveChart(activeChart === 'orders' ? 'both' : 'users')}
        >
          <Users size={16} /> User Stats
        </button>
        <button 
          className={`chart-toggle-btn ${activeChart === 'orders' || activeChart === 'both' ? 'active' : ''}`} 
          onClick={() => setActiveChart(activeChart === 'users' ? 'both' : 'orders')}
        >
          <Package size={16} /> Order Stats
        </button>
      </div>

      <div className="chart-container">
        {(activeChart === 'users' || activeChart === 'both') && (
          <div className="chart-card animated">
            <h3>User Distribution</h3>
            <div className="chart-wrapper">
              <Pie data={pieChartData} options={pieOptions} />
            </div>
          </div>
        )}

        {(activeChart === 'orders' || activeChart === 'both') && (
          <div className="chart-card animated">
            <h3>Order Status</h3>
            <div className="chart-wrapper">
              <Bar data={barChartData} options={barOptions} />
            </div>
          </div>
        )}
      </div>

      <div className="revenue-summary">
        <div className="revenue-card">
          <h3>Revenue Overview</h3>
          <div className="revenue-stats">
            <div className="revenue-stat">
              <span className="stat-label">Daily</span>
              <span className="stat-amount">Rs. {dailyRevenue}</span>
            </div>
            <div className="revenue-stat">
              <span className="stat-label">Weekly</span>
              <span className="stat-amount">Rs. {weeklyRevenue}</span>
            </div>
            <div className="revenue-stat">
              <span className="stat-label">Monthly</span>
              <span className="stat-amount">Rs. {monthlyRevenue}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fun-fact-box">
        <Award size={20} />
        <p>
          <span className="fun-fact-header">Fun Fact:</span> 
          {analyticsData.transactionStats ? 
            `${rentalPercentage}% of your transactions are rentals!` : 
            `The average e-commerce platform sees a 25% increase in user engagement with visual analytics!`}
        </p>
      </div>
    </div>
    </div>
  );
};

export default AdminAnalytics;