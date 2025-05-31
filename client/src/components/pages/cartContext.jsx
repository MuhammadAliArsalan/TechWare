// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const api = axios.create({
//   baseURL: 'http://localhost:3000/api',
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // Memoized fetch function to prevent unnecessary recreations
//   const fetchCartItems = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await api.get('/cart/getItems');
      
//       if (!response.data.success && !response.data.status) {
//         throw new Error(response.data.message || 'Failed to fetch cart items');
//       }
      
//       const transformedItems = response.data.data.map(item => ({
//         ...item,
//         title: item.name,
//         image: item.product_image || item.image,
//         price: item.price || item.unit_price
//       }));
      
//       setCartItems(transformedItems);
//       setError(null);
//     } catch (error) {
//       console.error('Cart fetch error:', error);
//       setError(error.response?.data?.message || error.message || 'Failed to fetch cart items');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Only fetch cart items once on initial load
//   useEffect(() => {
//     fetchCartItems();
//   }, [fetchCartItems]);

//   const addToCart = async (product) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const productId = product.product_id || product.id;
//       if (!productId) throw new Error('Product ID is missing');
      
//       // Optimistic update
//       const existingItem = cartItems.find(item => 
//         (item.product_id || item.id) === productId
//       );
      
//       if (existingItem) {
//         setCartItems(prev => 
//           prev.map(item => 
//             (item.product_id || item.id) === productId 
//               ? { ...item, quantity: item.quantity + 1 } 
//               : item
//           )
//         );
//       } else {
//         setCartItems(prev => [
//           ...prev,
//           {
//             ...product,
//             cart_id: `temp-${Date.now()}`,
//             quantity: 1,
//             total_price: product.price || product.unit_price
//           }
//         ]);
//       }
      
//       await api.post('/cart/add', {
//         product_id: productId,
//         quantity: 1
//       });
      
//       // Final sync with server
//       await fetchCartItems();
      
//       return true;
//     } catch (error) {
//       console.error('Error adding to cart:', error);
//       setError(error.response?.data?.message || error.message || 'Failed to add item to cart');
//       // Revert optimistic update on error
//       await fetchCartItems();
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeFromCart = async (cartId) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Optimistic update
//       setCartItems(prev => prev.filter(item => item.cart_id !== cartId));
      
//       await api.delete(`/cart/delete/${cartId}`);
      
//       return true;
//     } catch (error) {
//       console.error('Failed to remove from cart:', error);
//       setError(error.response?.data?.message || error.message || 'Failed to remove item from cart');
//       // Revert optimistic update on error
//       await fetchCartItems();
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateQuantity = async (cartId, quantity) => {
//     if (quantity < 1) return false;
    
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Optimistic update
//       setCartItems(prev =>
//         prev.map(item =>
//           item.cart_id === cartId
//             ? {
//                 ...item,
//                 quantity,
//                 total_price: (item.unit_price || item.price) * quantity
//               }
//             : item
//         )
//       );
      
//       await api.put(`/cart/update/${cartId}`, { quantity });
      
//       return true;
//     } catch (error) {
//       console.error('Failed to update quantity:', error);
//       setError(error.response?.data?.message || error.message || 'Failed to update quantity');
//       // Revert optimistic update on error
//       await fetchCartItems();
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateSubtotal = useCallback(() => {
//     return cartItems.reduce((total, item) => {
//       return total + parseFloat(item.total_price || (item.unit_price * item.quantity) || (item.price * item.quantity));
//     }, 0);
//   }, [cartItems]);

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         loading,
//         error,
//         refreshCart: fetchCartItems,
//         calculateSubtotal
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };


import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  // Memoized fetch function to prevent unnecessary recreations
  const fetchCartItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart/getItems');
      
      if (!response.data.success && !response.data.status) {
        throw new Error(response.data.message || 'Failed to fetch cart items');
      }
      
      const transformedItems = response.data.data.map(item => ({
        ...item,
        title: item.name,
        image: item.product_image || item.image,
        price: item.price || item.unit_price
      }));
      
      setCartItems(transformedItems);
      setError(null);
    } catch (error) {
      console.error('Cart fetch error:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch cart items');
    } finally {
      setLoading(false);
    }
  }, []);

  // Only fetch cart items once on initial load
  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const addToCart = async (product) => {
    try {
      setLoading(true);
      setError(null);
      
      const productId = product.product_id || product.id;
      if (!productId) throw new Error('Product ID is missing');
      
      // Optimistic update
      const existingItem = cartItems.find(item => 
        (item.product_id || item.id) === productId
      );
      
      if (existingItem) {
        setCartItems(prev => 
          prev.map(item => 
            (item.product_id || item.id) === productId 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          )
        );
      } else {
        setCartItems(prev => [
          ...prev,
          {
            ...product,
            cart_id: `temp-${Date.now()}`,
            quantity: 1,
            total_price: product.price || product.unit_price
          }
        ]);
      }
      
      await api.post('/cart/add', {
        product_id: productId,
        quantity: 1
      });
      
      // Final sync with server
      await fetchCartItems();
      
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError(error.response?.data?.message || error.message || 'Failed to add item to cart');
      // Revert optimistic update on error
      await fetchCartItems();
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Optimistic update
      setCartItems(prev => prev.filter(item => item.cart_id !== cartId));
      
      await api.delete(`/cart/delete/${cartId}`);
      
      return true;
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      setError(error.response?.data?.message || error.message || 'Failed to remove item from cart');
      // Revert optimistic update on error
      await fetchCartItems();
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartId, quantity) => {
    if (quantity < 1) return false;
    
    try {
      setLoading(true);
      setError(null);
      
      // Optimistic update
      setCartItems(prev =>
        prev.map(item =>
          item.cart_id === cartId
            ? {
                ...item,
                quantity,
                total_price: (item.unit_price || item.price) * quantity
              }
            : item
        )
      );
      
    await api.put(`/cart/update/${cartId}`, { quantity });
      
      return true;
    } catch (error) {
      console.error('Failed to update quantity:', error);
      setError(error.response?.data?.message || error.message || 'Failed to update quantity');
      // Revert optimistic update on error
      await fetchCartItems();
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Optimistic update
      setCartItems([]);
      
      await api.delete('/cart/clear');
      
      return true;
    } catch (error) {
      console.error('Failed to clear cart:', error);
      setError(error.response?.data?.message || error.message || 'Failed to clear cart');
      // Revert optimistic update on error
      await fetchCartItems();
      return false;
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      return total + parseFloat(item.total_price || (item.unit_price * item.quantity) || (item.price * item.quantity));
    }, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loading,
        error,
        refreshCart: fetchCartItems,
        calculateSubtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// // Create a consistent axios instance
// const api = axios.create({
//   baseURL: 'http://localhost:3000/api',
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const fetchCartItems = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('http://localhost:3000/api/cart/getItems', {
//         withCredentials: true,
//         validateStatus: (status) => status < 500 // Don't throw for 4xx errors
//       });
      
//       if (!response.data.success) {
//         throw new Error(response.data.message || 'Cart request failed');
//       }
      
//       // Transform data to match frontend expectations
//       const transformedItems = response.data.data.map(item => ({
//         ...item,
//         title: item.product_name,      // Map to expected field
//         image: item.image_url,         // Map to expected field
//         price: item.unit_price         // Map to expected field
//       }));
      
//       setCartItems(transformedItems);
//       setError(null);
//     } catch (error) {
//       console.error('Cart fetch error:', {
//         error: error.response?.data || error.message,
//         status: error.response?.status
//       });
//       setError(error.message);
//       setCartItems([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCartItems();
//   }, []);

//   const addToCart = async (product) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Determine the correct ID property
//       const productId = product.product_id || product.id;
      
//       if (!productId) {
//         throw new Error('Product ID is missing');
//       }
      
//       console.log(`Adding product ${productId} to cart`);
//       const response = await api.post('/cart/add', {
//         product_id: productId,
//         quantity: 1
//       });
      
//       console.log('Add to cart success:', response.data);
      
//       // Don't try to refresh cart items immediately if we had issues before
//       // Instead, manually add the item to our local state
//       const newItem = response.data.data;
//       if (newItem) {
//         // Try to fetch all cart items
//         try {
//           await fetchCartItems();
//         } catch (fetchError) {
//           console.error('Failed to refresh cart, adding item locally:', fetchError);
//           // Manually add the new item to the cart
//           setCartItems(prev => {
//             // Check if the item is already in the cart
//             const existingItemIndex = prev.findIndex(item => 
//               item.product_id === productId
//             );
            
//             if (existingItemIndex >= 0) {
//               // Update quantity if item exists
//               const updatedItems = [...prev];
//               updatedItems[existingItemIndex].quantity += 1;
//               updatedItems[existingItemIndex].total_price = 
//                 updatedItems[existingItemIndex].unit_price * 
//                 updatedItems[existingItemIndex].quantity;
//               return updatedItems;
//             } else {
//               // Add new item if it doesn't exist
//               return [...prev, {
//                 ...newItem,
//                 product_name: product.title || product.name,
//                 unit_price: product.price,
//                 image: product.image
//               }];
//             }
//           });
//         }
//       }
      
//       return true;
//     } catch (error) {
//       console.error('Error adding to cart:', {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message
//       });
      
//       setError(error.response?.data?.message || error.message || 'Failed to add item to cart');
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeFromCart = async (cartId) => {
//     try {
//       setLoading(true);
//       setError(null);
//       await api.delete(`http://localhost:3000/api/cart/delete/${cartId}`);
//       setCartItems(prev => prev.filter(item => item.cart_id !== cartId));
//       return true;
//     } catch (error) {
//       console.error('Failed to remove from cart:', error);
//       setError(error.message || 'Failed to remove item from cart');
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateQuantity = async (cartId, quantity) => {
//     try {
//       setLoading(true);
//       setError(null);
//       await api.put(`/cart/update/${cartId}`, { quantity });
//       setCartItems(prev =>
//         prev.map(item =>
//           item.cart_id === cartId ? { ...item, quantity, total_price: item.unit_price * quantity } : item
//         )
//       );
//       return true;
//     } catch (error) {
//       console.error('Failed to update quantity:', error);
//       setError(error.message || 'Failed to update quantity');
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const mergeGuestCart = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       await api.post('/cart/merge');
//       await fetchCartItems();
//       return true;
//     } catch (error) {
//       console.error('Failed to merge carts:', error);
//       setError(error.message || 'Failed to merge guest cart');
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         mergeGuestCart,
//         loading,
//         error,
//         refreshCart: fetchCartItems
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// import React, { createContext, useContext, useState } from 'react';

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);

//   const addToCart = (product) => {
//     const existingItem = cartItems.find(item => item.title === product.title);
//     if (existingItem) {
//       return false;
//     }
//     setCartItems([...cartItems, { ...product, quantity: 1 }]);
//   };

//   const removeFromCart = (title) => {
//     const updatedCart = cartItems.filter(item => item.title !== title);
//     setCartItems(updatedCart);
//   };

//   const updateQuantity = (title, quantity) => {
//     const updatedCart = cartItems.map(item =>
//       item.title === title ? { ...item, quantity } : item
//     );
//     setCartItems(updatedCart);
//   };

//   return (
//     <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };


// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const CartContext = createContext();

// // Check if user is logged in by looking for a token or session
// const isUserLoggedIn = () => {
//   // Replace with your actual authentication check
//   const token = localStorage.getItem('token') || sessionStorage.getItem('token');
//   return !!token;
// };

// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isSlidingCartOpen, setSlidingCartOpen] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(isUserLoggedIn());

//   // Update API endpoint base URL - check if this matches your backend setup
//   const API_BASE_URL = 'http://localhost:3000';
  
//   // Verify this path matches your backend API
//   const CART_API = {
//     GET_ITEMS: `${API_BASE_URL}/api/cart/getUserCartItems`,
//     ADD_ITEM: `${API_BASE_URL}/api/cart/add`,
//     UPDATE_ITEM: `${API_BASE_URL}/api/cart/update`,
//     REMOVE_ITEM: `${API_BASE_URL}/api/cart/delete`
//   };

//   const fetchCartItems = async () => {
//     // Don't try to fetch if user is not logged in
//     if (!isAuthenticated) {
//       console.log('User not authenticated, skipping cart fetch');
//       return;
//     }
    
//     setLoading(true);
//     try {
//       console.log('Fetching cart items from:', CART_API.GET_ITEMS);
//       const response = await axios.get(CART_API.GET_ITEMS, {
//         withCredentials: true
//       });
      
//       console.log('Cart API response:', response.data);
      
//       // Ensure we're extracting cart items correctly based on API response structure
//       const items = response.data.cartItems || response.data || [];
      
//       // Format cart items to ensure consistency
//       const formattedItems = items.map(item => ({
//         ...item,
//         price: parseFloat(item.price),
//         quantity: item.quantity || 1
//       }));
      
//       setCartItems(formattedItems);
//       console.log('Cart items fetched successfully:', formattedItems);
//     } catch (error) {
//       console.error('Error fetching cart:', error);
      
//       // For 404 errors, your endpoint might be incorrect
//       if (error.response?.status === 404) {
//         console.error('Cart API endpoint not found. Please check your API URL:', CART_API.GET_ITEMS);
//       }
      
//       // For auth errors, clear cart and mark as unauthenticated
//       if (error.response?.status === 401) {
//         setIsAuthenticated(false);
//         setCartItems([]);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Temporary local cart for non-authenticated users
//   const addToLocalCart = (product) => {
//     const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
    
//     // Check if product already exists
//     const existingIndex = localCart.findIndex(item => 
//       item.id === product.id || item.product_id === product.id
//     );
    
//     if (existingIndex >= 0) {
//       // Update quantity
//       localCart[existingIndex].quantity += 1;
//     } else {
//       // Add new item with cart_id for local operations
//       localCart.push({
//         ...product,
//         cart_id: 'local_' + Date.now(), // Generate temporary ID
//         quantity: 1,
//         price: parseFloat(product.price)
//       });
//     }
    
//     localStorage.setItem('localCart', JSON.stringify(localCart));
//     return localCart;
//   };

//   const addToCart = async (product) => {
//     // If not authenticated, add to local cart and show sliding cart
//     if (!isAuthenticated) {
//       console.log('User not authenticated, adding to local cart');
//       const updatedLocalCart = addToLocalCart(product);
//       setCartItems(updatedLocalCart);
//       setSlidingCartOpen(true);
      
//       // Return false to indicate auth needed for real cart
//       return false;
//     }
    
//     try {
//       setLoading(true);
      
//       // Ensure we have the correct product ID format
//       const productId = product.id || product.product_id;
      
//       console.log('Adding product to cart:', { productId, product });
//       console.log('Using API endpoint:', CART_API.ADD_ITEM);
      
//       const response = await axios.post(
//         CART_API.ADD_ITEM,
//         {
//           product_id: productId,
//           quantity: 1
//         },
//         { 
//           withCredentials: true,
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         }
//       );
      
//       console.log('Add to cart response:', response.data);
      
//       // Make sure we're using the correct structure based on API response
//       const newCartItem = {
//         ...product,
//         cart_id: response.data.cart_id || response.data.id,
//         quantity: 1,
//         // Ensure price is available as a number for calculations
//         price: parseFloat(product.price)
//       };
      
//       // Update cart state with the new item
//       setCartItems(prev => {
//         // Check if item already exists in cart
//         const existingItemIndex = prev.findIndex(item => 
//           (item.id === productId || item.product_id === productId)
//         );
        
//         if (existingItemIndex >= 0) {
//           // Update quantity if item exists
//           const updatedItems = [...prev];
//           updatedItems[existingItemIndex].quantity += 1;
//           return updatedItems;
//         } else {
//           // Add new item if it doesn't exist
//           return [...prev, newCartItem];
//         }
//       });
      
//       // Open sliding cart after successful addition
//       setSlidingCartOpen(true);
      
//       setLoading(false);
//       return true;
//     } catch (error) {
//       setLoading(false);
//       console.error('Error adding to cart:', error);
      
//       // For 404 errors, your endpoint might be incorrect
//       if (error.response?.status === 404) {
//         console.error('Cart API endpoint not found. Please check your API URL:', CART_API.ADD_ITEM);
//       }
      
//       if (error.response?.status === 401) {
//         setIsAuthenticated(false);
//         return false;
//       }
//       return false;
//     }
//   };

//   const removeFromCart = async (cart_id) => {
//     // Handle local cart items
//     if (cart_id.toString().startsWith('local_')) {
//       const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
//       const updatedCart = localCart.filter(item => item.cart_id !== cart_id);
//       localStorage.setItem('localCart', JSON.stringify(updatedCart));
//       setCartItems(updatedCart);
//       return;
//     }
    
//     try {
//       setLoading(true);
//       console.log('Removing item from cart:', cart_id);
      
//       await axios.delete(`${CART_API.REMOVE_ITEM}/${cart_id}`, {
//         withCredentials: true
//       });
      
//       setCartItems(prev => prev.filter(item => item.cart_id !== cart_id));
//       console.log('Item removed successfully');
//     } catch (error) {
//       console.error('Error removing from cart:', error);
      
//       // For 404 errors, update UI anyway
//       if (error.response?.status === 404) {
//         setCartItems(prev => prev.filter(item => item.cart_id !== cart_id));
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateQuantity = async (cart_id, quantity) => {
//     if (quantity < 1) return;
    
//     // Handle local cart items
//     if (cart_id.toString().startsWith('local_')) {
//       const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
//       const updatedCart = localCart.map(item => 
//         item.cart_id === cart_id ? { ...item, quantity } : item
//       );
//       localStorage.setItem('localCart', JSON.stringify(updatedCart));
//       setCartItems(updatedCart);
//       return;
//     }
    
//     try {
//       setLoading(true);
//       console.log('Updating quantity:', { cart_id, quantity });
      
//       const response = await axios.put(
//         `${CART_API.UPDATE_ITEM}/${cart_id}`,
//         { quantity },
//         { withCredentials: true }
//       );
      
//       console.log('Update quantity response:', response.data);
      
//       setCartItems(prev => 
//         prev.map(item => 
//           item.cart_id === cart_id 
//             ? { 
//                 ...item, 
//                 quantity, 
//                 total_price: response.data.cartItem?.total_price || (parseFloat(item.price) * quantity)
//               } 
//             : item
//         )
//       );
//     } catch (error) {
//       console.error('Error updating quantity:', error);
      
//       // Update UI anyway for better UX
//       if (error.response?.status === 404 || error.response?.status === 401) {
//         setCartItems(prev => 
//           prev.map(item => 
//             item.cart_id === cart_id 
//               ? { ...item, quantity } 
//               : item
//           )
//         );
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Check auth status on mount and whenever token changes
//   useEffect(() => {
//     const checkAuth = () => {
//       setIsAuthenticated(isUserLoggedIn());
//     };
    
//     checkAuth();
    
//     // Listen for storage events (token changes)
//     window.addEventListener('storage', checkAuth);
    
//     return () => {
//       window.removeEventListener('storage', checkAuth);
//     };
//   }, []);

//   // Load cart items from local storage if not authenticated
//   useEffect(() => {
//     if (!isAuthenticated) {
//       const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
//       setCartItems(localCart);
//     } else {
//       fetchCartItems();
//     }
//   }, [isAuthenticated]);

//   return (
//     <CartContext.Provider value={{ 
//       cartItems, 
//       addToCart, 
//       removeFromCart, 
//       updateQuantity,
//       loading,
//       fetchCartItems,
//       isSlidingCartOpen,
//       openSlidingCart: () => setSlidingCartOpen(true),
//       closeSlidingCart: () => setSlidingCartOpen(false),
//       isAuthenticated
//     }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };