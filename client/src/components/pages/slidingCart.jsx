import React from 'react';
import { useCart } from './cartContext';
import './slidingCart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

const SlidingCart = ({ isOpen, onClose, onViewFullCart }) => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    loading, 
    calculateSubtotal 
  } = useCart();

  const subtotal = calculateSubtotal();

  const handleRemove = async (cart_id) => {
    await removeFromCart(cart_id);
  };

  const handleQuantityChange = async (cart_id, newQuantity) => {
    if (newQuantity < 1) return;
    await updateQuantity(cart_id, newQuantity);
  };

  return (
    <div className={`sliding_cart ${isOpen ? 'open' : ''}`}>
      <div className="sliding_cart_header">
        <h2>Cart ({cartItems.length})</h2>
        <button className="close_sliding_cart" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      
      {loading && cartItems.length === 0 ? (
        <div className="sliding_cart_loading">Loading cart...</div>
      ) : (
        <>
          <div className="sliding_cart_items">
            {cartItems.length === 0 ? (
              <div className="empty_sliding_cart">
                <p>Your cart is empty</p>
              </div>
            ) : (
              cartItems.map((item) => {
                const price = parseFloat(item.unit_price || item.price);
                const itemTotal = parseFloat(item.total_price || (price * item.quantity));
                
                return (
                  <div className="sliding_cart_item" key={item.cart_id}>
                    <div className="sliding_cart_item_image">
                      <img 
                        src={item.image || item.image_url} 
                        alt={item.product_name || item.name || item.title} 
                        onError={(e) => {
                          e.target.src = '/default-product.jpg';
                        }}
                      />
                    </div>
                    <div className="sliding_cart_item_description">
                      <div className="sliding_cart_item_title_and_remove">
                        <div className="sliding_cart_item_title">
                          {item.product_name || item.name || item.title}
                        </div>
                        <button 
                          className="sliding_cart_remove" 
                          onClick={() => handleRemove(item.cart_id)}
                          disabled={loading}
                          aria-label="Remove item"
                        >
                          {loading ? '...' : <FontAwesomeIcon icon={faTrash} />}
                        </button>
                      </div>
                      {item.is_rental && (
                        <div className="sliding_cart_rental_info">
                          Rental: {item.rental_days} days
                        </div>
                      )}
                      <div className="sliding_cart_item_price_and_quantity">
                        <div className="sliding_cart_item_price">
                          Rs.{price.toFixed(2)}
                        </div>
                        <div className="sliding_cart_item_quantity">
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item.cart_id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || loading}
                            aria-label="Decrease quantity"
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </button>
                          <span className="quantity-value">{item.quantity}</span>
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item.cart_id, item.quantity + 1)}
                            disabled={loading}
                            aria-label="Increase quantity"
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </div>
                      </div>
                      <div className="sliding_cart_item_total">
                        Total: Rs.{itemTotal.toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          <div className="sliding_cart_footer">
            {cartItems.length > 0 && (
              <div className="sliding_cart_subtotal">
                <span>Subtotal:</span>
                <span>Rs.{subtotal.toFixed(2)}</span>
              </div>
            )}
            <button 
              className="view_full_cart_button" 
              onClick={onViewFullCart}
              disabled={cartItems.length === 0 || loading}
            >
              View Full Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SlidingCart;


// // 

// import React from 'react';
// import { useCart } from './cartContext';
// import './slidingCart.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTimes, faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

// const SlidingCart = ({ isOpen, onClose, onViewFullCart }) => {
//   const { cartItems, removeFromCart, updateQuantity } = useCart();

//   const handleRemove = async (cart_id) => {
//     try {
//       await removeFromCart(cart_id);
//     } catch (err) {
//       console.error("Failed to remove item:", err);
//     }
//   };

//   const handleQuantityChange = async (cart_id, quantity) => {
//     if (quantity < 1) return;
//     try {
//       await updateQuantity(cart_id, quantity);
//     } catch (err) {
//       console.error("Failed to update quantity:", err);
//     }
//   };

//   return (
//     <div className={`sliding_cart ${isOpen ? 'open' : ''}`}>
//       <div className="sliding_cart_header">
//         <h2>Cart ({cartItems.length})</h2>
//         <button className="close_sliding_cart" onClick={onClose}>
//           <FontAwesomeIcon icon={faTimes} />
//         </button>
//       </div>
//       <div className="sliding_cart_items">
//         {cartItems.map((item) => {
//           const price = parseFloat(item.unit_price || item.price);
//           const itemTotal = price * item.quantity;
          
//           return (
//             <div className="sliding_cart_item" key={item.cart_id}>
//               <div className="sliding_cart_item_image">
//                 <img src={item.image} alt={item.product_name || item.title} />
//               </div>
//               <div className="sliding_cart_item_description">
//                 <div className="sliding_cart_item_title_and_remove">
//                   <div className="sliding_cart_item_title">
//                     {item.product_name || item.title}
//                   </div>
//                   <button 
//                     className="sliding_cart_remove" 
//                     onClick={() => handleRemove(item.cart_id)}
//                   >
//                     <FontAwesomeIcon icon={faTrash} />
//                   </button>
//                 </div>
//                 <div className="sliding_cart_item_price_and_quantity">
//                   <div className="sliding_cart_item_price">
//                     Rs.{price.toFixed(2)}
//                   </div>
//                   <div className="sliding_cart_item_quantity">
//                     <button
//                       className="quantity-btn"
//                       onClick={() => handleQuantityChange(item.cart_id, item.quantity - 1)}
//                       disabled={item.quantity <= 1}
//                     >
//                       <FontAwesomeIcon icon={faMinus} />
//                     </button>
//                     <span className="quantity-value">{item.quantity}</span>
//                     <button
//                       className="quantity-btn"
//                       onClick={() => handleQuantityChange(item.cart_id, item.quantity + 1)}
//                     >
//                       <FontAwesomeIcon icon={faPlus} />
//                     </button>
//                   </div>
//                 </div>
//                 <div className="sliding_cart_item_total">
//                   Total: Rs.{itemTotal.toFixed(2)}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//       <div className="sliding_cart_footer">
//         <button 
//           className="view_full_cart_button" 
//           onClick={onViewFullCart}
//           disabled={cartItems.length === 0}
//         >
//           View Full Cart
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SlidingCart;

// import React from 'react';
// import { useCart } from './cartContext';
// import './slidingCart.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTimes, faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

// const SlidingCart = ({ isOpen, onClose, onViewFullCart }) => {
//   const { cartItems, removeFromCart, updateQuantity } = useCart();

//   const calculateTotal = () => {
//     return cartItems.reduce((total, item) => {
//       return total + (parseFloat(item.price) * item.quantity);
//     }, 0);
//   };

//   return (
//     <div className={`sliding_cart ${isOpen ? 'open' : ''}`}>
//       <div className="sliding_cart_header">
//         <h2>Cart ({cartItems.length})</h2>
//         <button className="close_sliding_cart" onClick={onClose}>
//           <FontAwesomeIcon icon={faTimes} />
//         </button>
//       </div>
      
//       <div className="sliding_cart_items">
//         {cartItems.length === 0 ? (
//           <div className="empty-cart-message">Your cart is empty</div>
//         ) : (
//           cartItems.map((item) => (
//             <div className="sliding_cart_item" key={item.cart_id}>
//               <div className="sliding_cart_item_image">
//                 <img src={item.image} alt={item.title} />
//               </div>
//               <div className="sliding_cart_item_description">
//                 <div className="sliding_cart_item_title_and_remove">
//                   <div className="sliding_cart_item_title">{item.title}</div>
//                   <button 
//                     className="sliding_cart_remove" 
//                     onClick={() => removeFromCart(item.cart_id)}
//                   >
//                     <FontAwesomeIcon icon={faTrash} />
//                   </button>
//                 </div>
//                 <div className="sliding_cart_item_price_and_quantity">
//                   <div className="sliding_cart_item_price">Rs.{item.price}</div>
//                   <div className="sliding_cart_item_quantity">
//                     <button
//                       className="quantity-btn"
//                       onClick={() => updateQuantity(item.cart_id, Math.max(1, item.quantity - 1))}
//                     >
//                       <FontAwesomeIcon icon={faMinus} />
//                     </button>
//                     <span className="quantity-value">{item.quantity}</span>
//                     <button
//                       className="quantity-btn"
//                       onClick={() => updateQuantity(item.cart_id, item.quantity + 1)}
//                     >
//                       <FontAwesomeIcon icon={faPlus} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {cartItems.length > 0 && (
//         <div className="sliding_cart_summary">
//           <div className="sliding_cart_total">
//             <span>Total:</span>
//             <span>Rs.{calculateTotal().toFixed(2)}</span>
//           </div>
//         </div>
//       )}

//       <div className="sliding_cart_footer">
//         <button className="view_full_cart_button" onClick={onViewFullCart}>
//           View Full Cart
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SlidingCart;

// import React from 'react';
// import { useCart } from './cartContext';
// import './slidingCart.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTimes, faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

// const SlidingCart = ({ onViewFullCart }) => {
//   const { 
//     cartItems, 
//     removeFromCart, 
//     updateQuantity, 
//     isSlidingCartOpen, 
//     closeSlidingCart 
//   } = useCart();

//   const calculateTotal = () => {
//     return cartItems.reduce((total, item) => {
//       return total + (parseFloat(item.price) * item.quantity);
//     }, 0);
//   };

//   return (
//     <div className={`sliding_cart ${isSlidingCartOpen ? 'open' : ''}`}>
//       <div className="sliding_cart_header">
//         <h2>Cart ({cartItems.length})</h2>
//         <button className="close_sliding_cart" onClick={closeSlidingCart}>
//           <FontAwesomeIcon icon={faTimes} />
//         </button>
//       </div>
      
//       <div className="sliding_cart_items">
//         {cartItems.length === 0 ? (
//           <div className="empty-cart-message">Your cart is empty</div>
//         ) : (
//           cartItems.map((item) => (
//             <div className="sliding_cart_item" key={item.cart_id}>
//               <div className="sliding_cart_item_image">
//                 <img src={item.image} alt={item.title} />
//               </div>
//               <div className="sliding_cart_item_description">
//                 <div className="sliding_cart_item_title_and_remove">
//                   <div className="sliding_cart_item_title">{item.title}</div>
//                   <button 
//                     className="sliding_cart_remove" 
//                     onClick={() => removeFromCart(item.cart_id)}
//                   >
//                     <FontAwesomeIcon icon={faTrash} />
//                   </button>
//                 </div>
//                 <div className="sliding_cart_item_price_and_quantity">
//                   <div className="sliding_cart_item_price">Rs.{item.price}</div>
//                   <div className="sliding_cart_item_quantity">
//                     <button
//                       className="quantity-btn"
//                       onClick={() => updateQuantity(item.cart_id, Math.max(1, item.quantity - 1))}
//                     >
//                       <FontAwesomeIcon icon={faMinus} />
//                     </button>
//                     <span className="quantity-value">{item.quantity}</span>
//                     <button
//                       className="quantity-btn"
//                       onClick={() => updateQuantity(item.cart_id, item.quantity + 1)}
//                     >
//                       <FontAwesomeIcon icon={faPlus} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {cartItems.length > 0 && (
//         <div className="sliding_cart_summary">
//           <div className="sliding_cart_total">
//             <span>Total:</span>
//             <span>Rs.{calculateTotal().toFixed(2)}</span>
//           </div>
//         </div>
//       )}

//       <div className="sliding_cart_footer">
//         <button 
//           className="view_full_cart_button" 
//           onClick={onViewFullCart}
//           disabled={cartItems.length === 0}
//         >
//           View Full Cart
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SlidingCart;