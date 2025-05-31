import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider'; // Adjust path as needed

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#f5f5f5'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ marginTop: '15px', color: '#333', fontFamily: 'Inter' }}>Verifying access...</p>
        
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // If not authenticated, redirect to login with redirect parameter
  if (!user) {
    return <Navigate to={`/sign?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // If role is specified and user's role doesn't match, redirect
  if (role && user.role?.toLowerCase() !== role.toLowerCase()) {
    // Determine where to redirect based on user's actual role
    let redirectPath;
    switch (user.role?.toLowerCase()) {
      case 'admin':
        redirectPath = "/adminAnalytics";
        break;
      case 'seller':
        redirectPath = "/analytics";
        break;
      case 'buyer':
        redirectPath = "/orderhistory";
        break;
      default:
        redirectPath = "/";
    }
    
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated and has the correct role
  return children;
};

export default ProtectedRoute;