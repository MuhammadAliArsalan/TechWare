// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from './cartContext'; // Adjust path as per your project structure
// import './cart.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

// const Cart = () => {
//   const { cartItems, removeFromCart, updateQuantity } = useCart();
//   const navigate = useNavigate();

//   const removeCartItem = (title) => {
//     removeFromCart(title);
//   };

//   const handleQuantityChange = (title, quantity) => {
//     updateQuantity(title, quantity);
//   };

//   const handleCheckout = () => {
//     // Navigate to checkout form page
//     navigate('/checkout');
//   };

//   const calculateTotal = () => {
//     return cartItems.reduce((total, item) => {
//       return total + parseFloat(item.price.replace('Rs.', '')) * item.quantity;
//     }, 0).toFixed(2);
//   };

//   const navigateToCatalog = () => {
//     navigate(`/catalog`);
//   };

//   return (
//     <div className="cart_page">
//       <h1 className='shopping_cart_heading'>Shopping Cart</h1>
//       <div className="cart_box">
//         <div className="cart_header">
//           <div className="header_product">Product</div>
//           <div className="header_quantity">Quantity</div>
//           <div className="header_subtotal">Subtotal</div>
//           <div className="header_action">Action</div>
//         </div>
//         <div className="cart_info">
//           {cartItems.map((item) => (
//             <div className="product_box" key={item.title}>
//               <div className="detail_box">
//                 <div className="cart_product_title">{item.title}</div>
//                 <div className="cart_product_price"><p>Rs.{item.price}</p></div>
//               </div>

//               <div className="cart_item_quantity">
//                 <button
//                   className="quantity-btn"
//                   onClick={() => handleQuantityChange(item.title, Math.max(1, item.quantity - 1))}
//                 >
//                   <FontAwesomeIcon icon={faMinus} />
//                 </button>
//                 <span className="quantity-value">{item.quantity}</span>
//                 <button
//                   className="quantity-btn"
//                   onClick={() => handleQuantityChange(item.title, item.quantity + 1)}
//                 >
//                   <FontAwesomeIcon icon={faPlus} />
//                 </button>
//               </div>
//               <div className="subtotal">
//                 <div className="sub_price">
//                   Rs.{(parseFloat(item.price.replace('Rs.', '')) * item.quantity).toFixed(2)}
//                 </div>
//               </div>
//               <div className="remove_item">
//                 <button
//                     className="cart_remove"
//                     onClick={() => removeCartItem(item.title)}
//                   >
//                     <FontAwesomeIcon icon={faTrash} />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
      
//       <div className="order_summary">
//         <div className="subtotal_section">
//             <div className="subtotal_label">Total:</div>
//             <div className="subtotal_price">Rs.{calculateTotal()}</div>
//           </div>
//           <div className="shipping_section">
//             <div className="shipping_label">Total:</div>
//             <div className="shipping_price">Rs.100</div>
//           </div>
//           <div className="total_section">
//             <div className="total_label">Total:</div>
//             <div className="total_price">Rs.{calculateTotal()}</div>
//           </div>

//           <div className="checkout_section">
//             <button className="checkout_button" onClick={handleCheckout}>
//               Checkout
//             </button>
//           </div>
//         </div>

//         <div className="update_cart_section">
//             <button className="update_cart_button" onClick={() => navigateToCatalog()}>
//               Update Cart
//             </button>
//           </div>
        
//     </div>
//   );
// };

// export default Cart;


// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from './cartContext';
// import './cart.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
// import Navbar from '../Navbar/navbar1';

// const Cart = () => {
//   const { cartItems, removeFromCart, updateQuantity } = useCart();
//   const navigate = useNavigate();

//   const removeCartItem = (title) => {
//     removeFromCart(title);
//   };

//   const handleQuantityChange = (title, quantity) => {
//     updateQuantity(title, quantity);
//   };

//   const handleCheckout = () => {
//     navigate('/checkout');
//   };

//   const calculateSubtotal = () => {
//     return cartItems.reduce((total, item) => {
//       return total + parseFloat(item.price.replace('Rs.', '')) * item.quantity;
//     }, 0);
//   };

//   // const discount = calculateSubtotal() * 0.1;
//   const deliveryFee = 50;
//   const total = calculateSubtotal() + deliveryFee;

//   return (
//     <div className="main_cart_page">
//       <Navbar />
//       <br></br>
//       <br></br>
//     <div className="cart_page">
//       <br></br>
//       <h1 className="shopping_cart_heading">Shopping Cart</h1>
//       <div className="cart_container">
//         {/* Left Side: Cart Items */}
//         <div className="cart_items_section">
//           <div className="cart_header">
//             <div className="header_product">Product Code</div>
//             <div className="header_quantity column_header">Quantity</div>
//             <div className="header_total column_header">Total</div>
//             <div className="header_action column_header">Action</div>
//           </div>
//           <div className="cart_info">
//             {cartItems.map((item) => (
//               <div className="product_box" key={item.title}>
//                 {/* Product Details */}
//                 <div className="product_details">
//                   <img src={item.image} alt={item.title} className="cart_product_image" />
//                   <div className="cart_product_info">
//                     <div className="cart_product_title">{item.title}</div>
//                     <div className="cart_product_price">Rs. {item.price}</div>
//                   </div>
//                 </div>

//                 {/* Quantity Control */}
//                 <div className="cart_item_quantity">
//                   <button
//                     className="quantity-btn"
//                     onClick={() => handleQuantityChange(item.title, Math.max(1, item.quantity - 1))}
//                   >
//                     <FontAwesomeIcon icon={faMinus} />
//                   </button>
//                   <span className="quantity-value">{item.quantity}</span>
//                   <button
//                     className="quantity-btn"
//                     onClick={() => handleQuantityChange(item.title, item.quantity + 1)}
//                   >
//                     <FontAwesomeIcon icon={faPlus} />
//                   </button>
//                 </div>

//                 {/* Total Price */}
//                 <div className="total_price">
//                   ${parseFloat(item.price.replace('Rs.', '')) * item.quantity}
//                 </div>

//                 {/* Remove Button */}
//                 <div className="remove_item">
//                   <button className="cart_remove" onClick={() => removeCartItem(item.title)}>
//                     <FontAwesomeIcon icon={faTrash} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Update Cart Button */}
//           <div className="update_cart_section">
//             <button className="update_cart_button" onClick={() => navigate('/catalog')}>
//               Update Cart
//             </button>
//           </div>
//         </div>

//         {/* Right Side: Order Summary */}
//         <div className="order_summary">
//           <h2>Order Summary</h2>
//           {/* <input type="text" className="discount_input" placeholder="Discount voucher" />
//           <button className="apply_button">Apply</button> */}

//           <div className="summary_details">
//             <div className="summary_row">
//               <span>Sub Total:</span>
//               <span>${calculateSubtotal().toFixed(2)}</span>
//             </div>
//             {/* <div className="summary_row">
//               <span>Discount (10%):</span>
//               <span>-${discount.toFixed(2)}</span>
//             </div> */}
//             <div className="summary_row">
//               <span>Delivery Fee:</span>
//               <span>${deliveryFee.toFixed(2)}</span>
//             </div>
//             <hr />
//             <div className="summary_total">
//               <span>Total:</span>
//               <span>${total.toFixed(2)}</span>
//             </div>
//           </div>

//           <button className="checkout_button" onClick={handleCheckout}>
//             Checkout Now
//           </button>
//         </div>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default Cart;


// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from './cartContext';
// import './cart.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
// import Navbar from '../Navbar/navbar1';

// const Cart = () => {
//   const { cartItems, removeFromCart, updateQuantity, loading } = useCart();
//   const navigate = useNavigate();

//   const handleQuantityChange = async (cart_id, newQuantity) => {
//     if (newQuantity < 1) return;
//     await updateQuantity(cart_id, newQuantity);
//   };

//   const handleCheckout = () => {
//     navigate('/checkout');
//   };

//   const calculateSubtotal = () => {
//     return cartItems.reduce((total, item) => {
//       return total + (parseFloat(item.total_price) || 0);
//     }, 0);
//   };

//   const deliveryFee = 50;
//   const total = calculateSubtotal() + deliveryFee;

//   if (loading) {
//     return (
//       <div className="main_cart_page">
//         <Navbar />
//         <div className="loading-spinner">Loading cart...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="main_cart_page">
//       <Navbar />
//       <br></br>
//       <br></br>
//       <div className="cart_page">
//         <br></br>
//         <h1 className="shopping_cart_heading">Shopping Cart</h1>
//         <div className="cart_container">
//           {/* Left Side: Cart Items */}
//           <div className="cart_items_section">
//             <div className="cart_header">
//               <div className="header_product">Product</div>
//               <div className="header_quantity column_header">Quantity</div>
//               <div className="header_total column_header">Total</div>
//               <div className="header_action column_header">Action</div>
//             </div>
//             <div className="cart_info">
//               {cartItems.length === 0 ? (
//                 <div className="empty-cart-message">Your cart is empty</div>
//               ) : (
//                 cartItems.map((item) => (
//                   <div className="product_box" key={item.cart_id}>
//                     {/* Product Details */}
//                     <div className="product_details">
//                       <img src={item.image} alt={item.name} className="cart_product_image" />
//                       <div className="cart_product_info">
//                         <div className="cart_product_title">{item.name}</div>
//                         <div className="cart_product_price">
//                           Rs. {item.is_rental ? item.rental_price : item.price}
//                           {item.is_rental && ` (for ${item.rental_days} days)`}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Quantity Control */}
//                     <div className="cart_item_quantity">
//                       <button
//                         className="quantity-btn"
//                         onClick={() => handleQuantityChange(item.cart_id, item.quantity - 1)}
//                       >
//                         <FontAwesomeIcon icon={faMinus} />
//                       </button>
//                       <span className="quantity-value">{item.quantity}</span>
//                       <button
//                         className="quantity-btn"
//                         onClick={() => handleQuantityChange(item.cart_id, item.quantity + 1)}
//                       >
//                         <FontAwesomeIcon icon={faPlus} />
//                       </button>
//                     </div>

//                     {/* Total Price */}
//                     <div className="total_price">
//                       Rs. {item.total_price}
//                     </div>

//                     {/* Remove Button */}
//                     <div className="remove_item">
//                       <button 
//                         className="cart_remove" 
//                         onClick={() => removeFromCart(item.cart_id)}
//                       >
//                         <FontAwesomeIcon icon={faTrash} />
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>

//             {/* Update Cart Button */}
//             <div className="update_cart_section">
//               <button className="update_cart_button" onClick={() => navigate('/catalog')}>
//                 Continue Shopping
//               </button>
//             </div>
//           </div>

//           {/* Right Side: Order Summary */}
//           <div className="order_summary">
//             <h2>Order Summary</h2>
//             <div className="summary_details">
//               <div className="summary_row">
//                 <span>Sub Total:</span>
//                 <span>Rs. {calculateSubtotal().toFixed(2)}</span>
//               </div>
//               <div className="summary_row">
//                 <span>Delivery Fee:</span>
//                 <span>Rs. {deliveryFee.toFixed(2)}</span>
//               </div>
//               <hr />
//               <div className="summary_total">
//                 <span>Total:</span>
//                 <span>Rs. {total.toFixed(2)}</span>
//               </div>
//             </div>

//             <button 
//               className="checkout_button" 
//               onClick={handleCheckout}
//               disabled={cartItems.length === 0}
//             >
//               Checkout Now
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;


// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from './cartContext';
// import './cart.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
// import Navbar from '../Navbar/navbar1';

// const Cart = () => {
//   const { cartItems, removeFromCart, updateQuantity, loading } = useCart();
//   const navigate = useNavigate();

//   const handleQuantityChange = (cart_id, newQuantity) => {
//     if (newQuantity < 1) return;
//     updateQuantity(cart_id, newQuantity);
//   };

//   const handleCheckout = () => {
//     navigate('/checkout');
//   };

//   const calculateSubtotal = () => {
//     return cartItems.reduce((total, item) => {
//       return total + (parseFloat(item.price) * item.quantity);
//     }, 0);
//   };

//   const deliveryFee = 50;
//   const total = calculateSubtotal() + deliveryFee;

//   if (loading) {
//     return (
//       <div className="main_cart_page">
//         <Navbar />
//         <div className="loading-spinner">Loading cart...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="main_cart_page">

//       <Navbar />
//       <br></br>
//       <br></br>
//       <div className="cart_page">
//         <br></br>
//         <h1 className="shopping_cart_heading">Shopping Cart</h1>
//         <div className="cart_container">
//           <div className="cart_items_section">
//             <div className="cart_header">
//               <div className="header_product">Product</div>
//               <div className="header_quantity column_header">Quantity</div>
//               <div className="header_total column_header">Total</div>
//               <div className="header_action column_header">Action</div>
//             </div>
            
//             {cartItems.length === 0 ? (
//               <div className="empty_cart_message">
//                 {/* <ShoppingCart size={64} className="text-l text-gray-300 mb-4" /> */}
//                 <p className="text-xl text-gray-600 mb-9">You haven't added any products yet</p>
//                 <button 
//                   onClick={() => navigate('/catalog')} 
//                   className="start_shopping_button"
//                 >
//                   Start Shopping
//                 </button>
//               </div>
//             ) : (
//               <div className="cart_info">
//                 {cartItems.map((item) => (
//                   <div className="product_box" key={item.title}>
//                     {/* Product Details */}
//                     <div className="product_details">
//                       <img src={item.image} alt={item.cart_id} className="cart_product_image" />
//                       <div className="cart_product_info">
//                         <div className="cart_product_title">{item.title}</div>

//                         <div className="cart_product_price">Rs.{parseFloat(item.price).toFixed(2)}</div>
//                       </div>
//                     </div>

//                     <div className="cart_item_quantity">
//                       <button
//                         className="quantity-btn"
//                         onClick={() => handleQuantityChange(item.cart_id, item.quantity - 1)}
//                         disabled={item.quantity <= 1}
//                       >
//                         <FontAwesomeIcon icon={faMinus} />
//                       </button>
//                       <span className="quantity-value">{item.quantity}</span>
//                       <button
//                         className="quantity-btn"

//                         onClick={() => handleQuantityChange(item.cart_id, item.quantity + 1)}
//                       >
//                         <FontAwesomeIcon icon={faPlus} />
//                       </button>
//                     </div>


//                     <div className="total_price">
//                       Rs.{(parseFloat(item.price) * item.quantity).toFixed(2)}
//                     </div>

//                     <div className="remove_item">
//                       <button 
//                         className="cart_remove" 
//                         onClick={() => removeFromCart(item.cart_id)}
//                       >
//                         <FontAwesomeIcon icon={faTrash} />
//                       </button>
//                     </div>
//                   </div>

//                 ))}
//             </div>

//               )}

//             <div className="update_cart_section">
//               <button className="update_cart_button" onClick={() => navigate('/catalog')}>
//                 Continue Shopping
//               </button>
//             </div>
//           </div>

//           <div className="order_summary">
//             <h2>Order Summary</h2>
//             <div className="summary_details">
//               <div className="summary_row">
//                 <span>Sub Total:</span>
//                 <span>Rs.{calculateSubtotal().toFixed(2)}</span>
//               </div>
//               <div className="summary_row">
//                 <span>Delivery Fee:</span>
//                 <span>Rs.{deliveryFee.toFixed(2)}</span>
//               </div>
//               <hr />
//               <div className="summary_total">
//                 <span>Total:</span>
//                 <span>Rs.{total.toFixed(2)}</span>
//               </div>
//             </div>

//             <button 
//               className="checkout_button" 
//               onClick={handleCheckout}
//               disabled={cartItems.length === 0}
//             >
//               Checkout Now
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;



// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from './cartContext';
// import './cart.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
// import Navbar from '../Navbar/navbar1';

// const Cart = () => {
//   const { cartItems, removeFromCart, updateQuantity, loading, error, refreshCart, calculateSubtotal } = useCart();
//   const navigate = useNavigate();

//   // Refresh cart items when component mounts
//   useEffect(() => {
//     refreshCart();
//   }, [refreshCart]);

//   const handleQuantityChange = async (cart_id, newQuantity) => {
//     if (newQuantity < 1) return;
//     try {
//       await updateQuantity(cart_id, newQuantity);
//     } catch (err) {
//       console.error("Failed to update quantity:", err);
//     }
//   };

//   const handleRemoveItem = async (cart_id) => {
//     try {
//       await removeFromCart(cart_id);
//     } catch (err) {
//       console.error("Failed to remove item:", err);
//     }
//   };

//   const handleCheckout = () => {
//     if (cartItems.length > 0) {
//       navigate('/checkout');
//     }
//   };

//   const subtotal = calculateSubtotal();
//   const deliveryFee = 50;
//   const total = subtotal + deliveryFee;

//   if (loading) {
//     return (
//       <div className="main_cart_page">
//         <Navbar />
//         <div className="loading-spinner">Loading cart...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="main_cart_page">
//         <Navbar />
//         <div className="error-message">Error loading cart: {error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="main_cart_page">
//       <Navbar />
//       <div className="cart_page">
//         <h1 className="shopping_cart_heading">Shopping Cart</h1>
//         <div className="cart_container">
//           <div className="cart_items_section">
//             <div className="cart_header">
//               <div className="header_product">Product</div>
//               <div className="header_quantity column_header">Quantity</div>
//               <div className="header_total column_header">Total</div>
//               <div className="header_action column_header">Action</div>
//             </div>
            
//             {cartItems.length === 0 ? (
//               <div className="empty_cart_message">
//                 <p className="text-xl text-gray-600 mb-9">You haven't added any products yet</p>
//                 <button 
//                   onClick={() => navigate('/catalog')} 
//                   className="start_shopping_button"
//                 >
//                   Start Shopping
//                 </button>
//               </div>
//             ) : (
//               <div className="cart_info">
//                 {cartItems.map((item) => {
//                   const price = parseFloat(item.unit_price || item.price);
//                   const itemTotal = parseFloat(item.total_price || (price * item.quantity));
                  
//                   return (
//                     <div className="product_box" key={item.cart_id}>
//                       <div className="product_details">
//                         <img 
//                           src={item.image || item.image_url} 
//                           alt={item.product_name || item.name || item.title} 
//                           className="cart_product_image" 
//                         />
//                         <div className="cart_product_info">
//                           <div className="cart_product_title">
//                             {item.product_name || item.name || item.title}
//                           </div>
//                           <div className="cart_product_price">
//                             Rs.{price.toFixed(2)}
//                           </div>
//                           {item.is_rental && (
//                             <div className="cart_rental_info">
//                               Rental: {item.rental_days} days
//                             </div>
//                           )}
//                           {item.condition && (
//                             <div className="cart_condition">
//                               Condition: {item.condition}
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       <div className="cart_item_quantity">
//                         <button
//                           className="quantity-btn"
//                           onClick={() => handleQuantityChange(item.cart_id, item.quantity - 1)}
//                           disabled={item.quantity <= 1}
//                         >
//                           <FontAwesomeIcon icon={faMinus} />
//                         </button>
//                         <span className="quantity-value">{item.quantity}</span>
//                         <button
//                           className="quantity-btn"
//                           onClick={() => handleQuantityChange(item.cart_id, item.quantity + 1)}
//                         >
//                           <FontAwesomeIcon icon={faPlus} />
//                         </button>
//                       </div>

//                       <div className="total_price">
//                         Rs.{itemTotal.toFixed(2)}
//                       </div>

//                       <div className="remove_item">
//                         <button 
//                           className="cart_remove" 
//                           onClick={() => handleRemoveItem(item.cart_id)}
//                         >
//                           <FontAwesomeIcon icon={faTrash} />
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}

//             <div className="update_cart_section">
//               <button 
//                 className="update_cart_button" 
//                 onClick={() => navigate('/catalog')}
//               >
//                 Continue Shopping
//               </button>
//             </div>
//           </div>

//           <div className="order_summary">
//             <h2>Order Summary</h2>
//             <div className="summary_details">
//               <div className="summary_row">
//                 <span>Sub Total:</span>
//                 <span>Rs.{subtotal.toFixed(2)}</span>
//               </div>
//               <div className="summary_row">
//                 <span>Delivery Fee:</span>
//                 <span>Rs.{deliveryFee.toFixed(2)}</span>
//               </div>
//               <hr />
//               <div className="summary_total">
//                 <span>Total:</span>
//                 <span>Rs.{total.toFixed(2)}</span>
//               </div>
//             </div>

//             <button 
//               className="checkout_button" 
//               onClick={handleCheckout}
//               disabled={cartItems.length === 0}
//             >
//               Checkout Now
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './cartContext';
import './cart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../Navbar/navbar1';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    loading, 
    error, 
    calculateSubtotal 
  } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = async (cart_id, newQuantity) => {
    if (newQuantity < 1) return;
    await updateQuantity(cart_id, newQuantity);
  };

  const handleRemoveItem = async (cart_id) => {
    await removeFromCart(cart_id);
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/checkout');
    }
  };

  const subtotal = calculateSubtotal();
  const deliveryFee = 50;
  const total = subtotal + deliveryFee;

  if (loading && cartItems.length === 0) {
    return (
      <div className="shopping_cart_page_container">
        <Navbar />
        <div className="cart_loading_spinner">Loading cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shopping_cart_page_container">
        <Navbar />
        <div className="cart_error_message">Error loading cart: {error}</div>
      </div>
    );
  }

  return (
    <div className="shopping_cart_page_container">
      <Navbar />
      <div className="shopping_cart_content_wrapper">
        <h1 className="shopping_cart_main_heading">Shopping Cart</h1>
        <div className="shopping_cart_layout_container">
          <div className="shopping_cart_items_container">
            <div className="shopping_cart_items_header">
              <div className="shopping_cart_header_product">Product</div>
              <div className="shopping_cart_header_quantity column_header">Quantity</div>
              <div className="shopping_cart_header_total column_header">Total</div>
              <div className="shopping_cart_header_action column_header">Action</div>
            </div>
            
            {cartItems.length === 0 ? (
              <div className="shopping_cart_empty_message">
                <p className="text-xl text-gray-600 mb-9">You haven't added any products yet</p>
                <button 
                  onClick={() => navigate('/catalog')} 
                  className="shopping_cart_start_shopping_button"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="shopping_cart_items_list">
                {cartItems.map((item) => {
                  const price = parseFloat(item.unit_price || item.price);
                  const itemTotal = parseFloat(item.total_price || (price * item.quantity));
                  
                  return (
                    <div className="shopping_cart_product_item" key={item.cart_id}>
                      <div className="shopping_cart_product_details">
                        <img 
                          src={item.image || item.image_url} 
                          alt={item.product_name || item.name || item.title} 
                          className="shopping_cart_product_image" 
                          onError={(e) => {
                            e.target.src = '/default-product.jpg';
                          }}
                        />
                        <div className="shopping_cart_product_info">
                          <div className="shopping_cart_product_title">
                            {item.product_name || item.name || item.title}
                          </div>
                          <div className="shopping_cart_product_price">
                            Rs.{price.toFixed(2)}
                          </div>
                          {item.is_rental && (
                            <div className="shopping_cart_rental_info">
                              Rental: {item.rental_days} days
                            </div>
                          )}
                          {item.condition && (
                            <div className="shopping_cart_condition">
                              Condition: {item.condition}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="shopping_cart_item_quantity">
                        <button
                          className="shopping_cart_quantity_button"
                          onClick={() => handleQuantityChange(item.cart_id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || loading}
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <span className="shopping_cart_quantity_value">{item.quantity}</span>
                        <button
                          className="shopping_cart_quantity_button"
                          onClick={() => handleQuantityChange(item.cart_id, item.quantity + 1)}
                          disabled={loading}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>

                      <div className="shopping_cart_total_price">
                        Rs.{itemTotal.toFixed(2)}
                      </div>

                      <div className="shopping_cart_remove_item">
                        <button 
                          className="shopping_cart_remove_button" 
                          onClick={() => handleRemoveItem(item.cart_id)}
                          disabled={loading}
                        >
                          {loading ? '...' : <FontAwesomeIcon icon={faTrash} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="shopping_cart_continue_shopping_section">
              <button 
                className="shopping_cart_continue_shopping_button" 
                onClick={() => navigate('/catalog')}
                disabled={loading}
              >
                Continue Shopping
              </button>
            </div>
          </div>

          <div className="shopping_cart_order_summary">
            <h2>Order Summary</h2>
            <div className="shopping_cart_summary_details">
              <div className="shopping_cart_summary_row">
                <span>Sub Total:</span>
                <span>Rs.{subtotal.toFixed(2)}</span>
              </div>
              <div className="shopping_cart_summary_row">
                <span>Delivery Fee:</span>
                <span>Rs.{deliveryFee.toFixed(2)}</span>
              </div>
              <hr />
              <div className="shopping_cart_summary_total">
                <span>Total:</span>
                <span>Rs.{total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              className="shopping_cart_checkout_button" 
              onClick={handleCheckout}
              disabled={cartItems.length === 0 || loading}
            >
              {loading ? 'Processing...' : 'Checkout Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from './cartContext';
// import './cart.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
// import Navbar from '../Navbar/navbar1';

// const Cart = () => {
//   const { cartItems, removeFromCart, updateQuantity, loading, error } = useCart();
//   const navigate = useNavigate();

//   const handleQuantityChange = async (cart_id, newQuantity) => {
//     if (newQuantity < 1) return;
//     try {
//       await updateQuantity(cart_id, newQuantity);
//     } catch (err) {
//       console.error("Failed to update quantity:", err);
//     }
//   };

//   const handleCheckout = () => {
//     if (cartItems.length > 0) {
//       navigate('/checkout');
//     }
//   };

//   const calculateSubtotal = () => {
//     return cartItems.reduce((total, item) => {
//       return total + (parseFloat(item.unit_price || item.price) * item.quantity);
//     }, 0);
//   };

//   const deliveryFee = 50;
//   const total = calculateSubtotal() + deliveryFee;

//   if (loading) {
//     return (
//       <div className="main_cart_page">
//         <Navbar />
//         <div className="loading-spinner">Loading cart...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="main_cart_page">
//         <Navbar />
//         <div className="error-message">Error loading cart: {error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="main_cart_page">
//       <Navbar />
//       <div className="cart_page">
//         <h1 className="shopping_cart_heading">Shopping Cart</h1>
//         <div className="cart_container">
//           <div className="cart_items_section">
//             <div className="cart_header">
//               <div className="header_product">Product</div>
//               <div className="header_quantity column_header">Quantity</div>
//               <div className="header_total column_header">Total</div>
//               <div className="header_action column_header">Action</div>
//             </div>
            
//             {cartItems.length === 0 ? (
//               <div className="empty_cart_message">
//                 <p className="text-xl text-gray-600 mb-9">You haven't added any products yet</p>
//                 <button 
//                   onClick={() => navigate('/catalog')} 
//                   className="start_shopping_button"
//                 >
//                   Start Shopping
//                 </button>
//               </div>
//             ) : (
//               <div className="cart_info">
//                 {cartItems.map((item) => {
//                   const price = parseFloat(item.unit_price || item.price);
//                   const itemTotal = price * item.quantity;
                  
//                   return (
//                     <div className="product_box" key={item.cart_id}>
//                       <div className="product_details">
//                         <img 
//                           src={item.image} 
//                           alt={item.product_name || item.title} 
//                           className="cart_product_image" 
//                         />
//                         <div className="cart_product_info">
//                           <div className="cart_product_title">
//                             {item.product_name || item.title}
//                           </div>
//                           <div className="cart_product_price">
//                             Rs.{price.toFixed(2)}
//                           </div>
//                         </div>
//                       </div>

//                       <div className="cart_item_quantity">
//                         <button
//                           className="quantity-btn"
//                           onClick={() => handleQuantityChange(item.cart_id, item.quantity - 1)}
//                           disabled={item.quantity <= 1}
//                         >
//                           <FontAwesomeIcon icon={faMinus} />
//                         </button>
//                         <span className="quantity-value">{item.quantity}</span>
//                         <button
//                           className="quantity-btn"
//                           onClick={() => handleQuantityChange(item.cart_id, item.quantity + 1)}
//                         >
//                           <FontAwesomeIcon icon={faPlus} />
//                         </button>
//                       </div>

//                       <div className="total_price">
//                         Rs.{itemTotal.toFixed(2)}
//                       </div>

//                       <div className="remove_item">
//                         <button 
//                           className="cart_remove" 
//                           onClick={() => removeFromCart(item.cart_id)}
//                         >
//                           <FontAwesomeIcon icon={faTrash} />
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}

//             <div className="update_cart_section">
//               <button 
//                 className="update_cart_button" 
//                 onClick={() => navigate('/catalog')}
//               >
//                 Continue Shopping
//               </button>
//             </div>
//           </div>

//           <div className="order_summary">
//             <h2>Order Summary</h2>
//             <div className="summary_details">
//               <div className="summary_row">
//                 <span>Sub Total:</span>
//                 <span>Rs.{calculateSubtotal().toFixed(2)}</span>
//               </div>
//               <div className="summary_row">
//                 <span>Delivery Fee:</span>
//                 <span>Rs.{deliveryFee.toFixed(2)}</span>
//               </div>
//               <hr />
//               <div className="summary_total">
//                 <span>Total:</span>
//                 <span>Rs.{total.toFixed(2)}</span>
//               </div>
//             </div>

//             <button 
//               className="checkout_button" 
//               onClick={handleCheckout}
//               disabled={cartItems.length === 0}
//             >
//               Checkout Now
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;