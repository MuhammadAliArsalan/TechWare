import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io();
    
    socketInstance.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
      
      // Join room based on user role and ID
      const userId = localStorage.getItem('user_id');
      const userRole = localStorage.getItem('user_role');
      
      if (userId && userRole === 'seller') {
        socketInstance.emit('join', `seller-${userId}`);
      } else if (userId && userRole === 'customer') {
        socketInstance.emit('join', `customer-${userId}`);
      }
    });
    
    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });
    
    // Listen for order status updates
    socketInstance.on('order-status-update', (data) => {
      console.log('Order status update received:', data);
      
      // Add to notifications
      setNotifications(prev => [
        {
          id: Date.now(),
          type: 'order-update',
          message: `Order #${data.order_id.substring(0, 8)} status changed to ${data.status}`,
          data: data,
          read: false,
          timestamp: new Date()
        },
        ...prev
      ]);
    });
    
    // Listen for new orders (for sellers)
    socketInstance.on('new-order', (data) => {
      console.log('New order received:', data);
      
      // Add to notifications
      setNotifications(prev => [
        {
          id: Date.now(),
          type: 'new-order',
          message: `New order #${data.order_id.substring(0, 8)} received!`,
          data: data,
          read: false,
          timestamp: new Date()
        },
        ...prev
      ]);
    });
    
    setSocket(socketInstance);
    
    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);
  
  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Clear a notification
  const clearNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  return (
    <SocketContext.Provider value={{
      socket,
      connected,
      notifications,
      markAsRead,
      markAllAsRead,
      clearNotification,
      clearAllNotifications
    }}>
      {children}
    </SocketContext.Provider>
  );
};