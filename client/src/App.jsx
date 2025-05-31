import React from 'react'
import { Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeStart from "./components/pages/imageSlider"
import "./components/pages/imageSlider.css"
import Slider from "./components/pages/slider"
import "./components/pages/slider.css"
import TopPicks from "./components/pages/topPicks"
import "./components/pages/topPicks.css"
import Cards from "./components/pages/feedback"
import "./components/pages/feedback.css"
import SignIn from "./components/pages/signUp"
import "./components/pages/signUp.css";
import Catalog from "./components/pages/catalog";
import SecondhandCatalog from "./components/pages/secondHandCatalog";
import RentalCatalog from "./components/pages/rentalCatalog";
import RentalSecondhandCatalog from "./components/pages/rentalSecondhandCatalog";
import CategoryCatalog from "./components/pages/CategoryCatalog";
// import SecondhandCategoryCatalog from "./components/pages/secondhandCategory";
import RentalCategoryCatalog from "./components/pages/rentalCategoryCatalog";
// import SecondhandRentalCategoryCatalog from "./components/pages/secondhandRentalCategory";

import { CartProvider } from './components/pages/cartContext';
import { AuthProvider } from './components/pages/AuthProvider';
import "./components/pages/catalog.css";
import ProductDetail from "./components/pages/productDescription";
import "./components/pages/productDescription.css"
import RentalProductDetail from "./components/pages/rentalProductDescription";
import "./components/pages/rentalProductDescription.css"
import Cart from "./components/pages/cart"
import "./components/pages/cart.css";
import Navbar from "./components/Navbar/navbar1";
import BuyerDashboard from './components/Dashboards/Buyer/BuyerDashboard';
import OrderHistory from './components/Dashboards/Buyer/OrderHistory';
import RentalAgreement from './components/Dashboards/Buyer/RentalAgreement';
import AdminDashboard from './components/Dashboards/Admin/AdminDashboard';
import AdminAnalytics from './components/Dashboards/Admin/AdminAnalytics';
import Buyers from './components/Dashboards/Admin/Buyers';
import Sellers from './components/Dashboards/Admin/Sellers';
import Seller_dashboard from './components/Dashboards/Seller/Seller_dashboard';
import AnalyticsDashboard from './components/Dashboards/Seller/AnalyticsDashboard';
import OrderManagement from './components/Dashboards/Seller/OrderManagement';
import InventoryManagement from './components/Dashboards/Seller/InventoryManagement';
import RentalManagement from './components/Dashboards/Seller/RentalManagement';
import ForgotPassword from './components/pages/forgotPassword';
import Checkout from './components/pages/Checkout';
import OrderConfirmation from './components/pages/OrderConfirmation';
import AdminOverview from './components/Dashboards/Admin/AdminOverview'
import PayFast from './components/pages/PayFast.jsx'
import Success from './components/pages/sucess.jsx'
import Failure from "./components/pages/cancel.jsx"
import { SocketProvider } from './components/Dashboards/Seller/SocketContext.jsx';
import ProtectedRoute from './components/pages/ProtectedRoute';
import DashboardNavigation from './components/pages/DashboardNavigation.jsx';


const HomePage = () => (
  <>
    <Box>
      <Navbar />
    </Box>
    <Box>
      <HomeStart />
    </Box>
    <Box>
      <Slider />
    </Box>
    <Box>
      <TopPicks />
    </Box>
    <Box>
      <Cards />
    </Box>
  </>
);

function App() {
  return (

    <Router>
      <AuthProvider>
        <CartProvider>
          <Box>
            <div className='content'>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/navbar" element={<Navbar />} />
                <Route path="/sign" element={<SignIn />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/secondhandCatalog" element={<SecondhandCatalog />} />
              <Route path="/rentalsecondhandCatalog" element={<RentalSecondhandCatalog />} />
              <Route path="/rentalCatalog" element={<RentalCatalog />} />
              <Route path="/category/:slug" element={<CategoryCatalog />} />
              <Route path="/rental-category/:slug" element={<RentalCategoryCatalog />} />
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/rental-product/:id" element={<RentalProductDetail />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/checkout' element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path='/order-confirmation' element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
                <Route path='/dashboard' element={<ProtectedRoute><DashboardNavigation /></ProtectedRoute>} />
                {/* Protected Seller Routes */}
                <Route path="/seller-dashboard" element={<ProtectedRoute role="seller"><Seller_dashboard /></ProtectedRoute>} />
                <Route path="/inventory" element={<ProtectedRoute role="seller"><InventoryManagement /></ProtectedRoute>} />
                <Route path="/order" element={<ProtectedRoute role="seller"><OrderManagement /></ProtectedRoute>} />
                <Route path="/rental" element={<ProtectedRoute role="seller"><RentalManagement /></ProtectedRoute>} />
                <Route path="/analytics" element={
                  <ProtectedRoute role="seller">
                    <SocketProvider>
                      <AnalyticsDashboard />
                    </SocketProvider>
                  </ProtectedRoute>
                } />
                
                {/* Protected Buyer Routes */}
                <Route path="/buyer-dashboard" element={<ProtectedRoute role="buyer"><BuyerDashboard /></ProtectedRoute>} />
                <Route path="/orderHistory" element={<ProtectedRoute role="buyer"><OrderHistory /></ProtectedRoute>} />
                <Route path="/rentalAgreements" element={<ProtectedRoute role="buyer"><RentalAgreement /></ProtectedRoute>} />

                {/* Protected Admin Routes */}
                <Route path="/admin-dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
                <Route path='/admin' element={<ProtectedRoute role="admin"><AdminOverview /></ProtectedRoute>} />
                <Route path="/regBuyers" element={<ProtectedRoute role="admin"><Buyers /></ProtectedRoute>} />
                <Route path="/regSellers" element={<ProtectedRoute role="admin"><Sellers /></ProtectedRoute>} />
                <Route path="/adminAnalytics" element={<ProtectedRoute role="admin"><AdminAnalytics /></ProtectedRoute>} />
                
                <Route path='/payment' element={<ProtectedRoute><PayFast /></ProtectedRoute>} />
                <Route path='payment/success' element={<Success />} />
                <Route path='payment/failure' element={<Failure />} />
              </Routes>
            </div>
          </Box>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

