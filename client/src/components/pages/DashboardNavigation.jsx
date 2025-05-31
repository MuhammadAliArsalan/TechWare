import React, { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const DashboardNavigation = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [redirectPath, setRedirectPath] = useState(null);
  
  useEffect(() => {
    if (!loading && user) {
      // Determine redirect path based on role
      let path;
      switch (user.role?.toLowerCase()) {
        case 'admin':
          path = '/adminAnalytics';
          break;
        case 'seller':
          path = '/analytics';
          break;
        case 'buyer':
          path = '/orderHistory';
          break;
        default:
          path = '/sign';
      }
      
      // Set the path for immediate render
      setRedirectPath(path);
    } else if (!loading) {
      // Not logged in
      setRedirectPath('/sign');
    }
  }, [user, loading]);
  
  // Use immediate Navigate component instead of programmatic navigation
  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }
  
  // Show loading only while determining the redirect
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h2>Loading dashboard...</h2>
    </div>
  );
};

export default DashboardNavigation;