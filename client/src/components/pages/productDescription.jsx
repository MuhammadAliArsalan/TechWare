// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { IonIcon } from '@ionic/react';
// import { heartOutline, heart, cartOutline, arrowBackOutline } from 'ionicons/icons';
// import axios from 'axios';
// import "./productDescription.css";
// import Rating from "./Rating";
// import ProductAuthentication from "./ProductAuthentication";
// import { useCart } from "./cartContext";

// const ProductDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { addToCart } = useCart();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const [averageRating, setAverageRating] = useState(0);
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [isInCart, setIsInCart] = useState(false);



//   useEffect(() => {
//     const fetchProductData = async () => {
//       try {
//         setLoading(true);
        
//         // Try to get from getAllProducts first
//         const allProductsRes = await axios.get('http://localhost:3000/api/products/getAllProducts');
//         const foundProduct = allProductsRes.data.data.find(p => 
//           p.id === parseInt(id) || p.id === id || p.product_id === parseInt(id)
//         );
        
//         if (foundProduct) {
//           setProduct(formatProductData(foundProduct));
//         } else {
//           // Fallback to getProduct if available
//           try {
//             const token = localStorage.getItem('token');
//             const headers = token ? { Authorization: `Bearer ${token}` } : {};
//             const response = await axios.get(`http://localhost:3000/api/products/getProduct/${id}`);
//               { headers }
//             );
//             setProduct(formatProductData(productRes.data.data));
//           } catch (apiErr) {
//             // Final fallback to localStorage cache
//             const cachedProducts = JSON.parse(localStorage.getItem('cachedProducts') || '[]');
//             const cachedProduct = cachedProducts.find(p => 
//               p.id === parseInt(id) || p.id === id || p.product_id === parseInt(id)
//             );
            
//             if (cachedProduct) {
//               setProduct(formatProductData(cachedProduct));
//             } else {
//               throw new Error("Product not found in any available source");
//             }
//           }
//         }
        
//         // Load reviews from localStorage
//         const storedReviews = JSON.parse(localStorage.getItem(`reviews_${id}`)) || [];
//         setReviews(storedReviews);
        
//       } catch (err) {
//         setError(err.message || "Unable to load product details. Please try again later.");
//         setError(err.message || "Unable to load product details. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProductData();
//   }, [id]);

//   const formatProductData = (product) => {
//     return {
//       id: product.id || product.product_id || product._id,
//       name: product.name || product.title || product.productName,
//       description: product.description || product.desc || product.productDescription || "No description available",
//       price: product.price || product.productPrice || 0,
//       originalPrice: product.originalPrice || product.original_price || product.oldPrice || null,
//       stock_quantity: product.stock_quantity || product.stock || product.quantity || product.inventory || 0,
//       product_image: product.product_image || product.image || product.imgUrl || product.thumbnail || '/images/product-placeholder.jpg',
//       product_features: Array.isArray(product.product_features) 
//         ? product.product_features 
//         : (product.features ? JSON.parse(product.features) : [])
//     };
//   };

//   useEffect(() => {
//     if (reviews.length > 0) {
//       const avg = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
//       setAverageRating(avg);
//     }
//   }, [reviews]);

//   const handleWishlist = () => {
//     if (!localStorage.getItem('token')) {
//       alert("Please log in to add items to your wishlist");
//       navigate('/login');
//       return;
//     }
//     setIsWishlisted(!isWishlisted);
//   };

//   const handleAddToCart = () => {
//     if (!product) return;
    
//     if (!localStorage.getItem('token')) {
//       alert("Please log in to add items to your cart");
//       navigate('/login');
//       return;
//     }

//     const cartItem = {
//       title: product.name,
//       price: product.price,
//       image: product.product_image || '/images/product-placeholder.jpg',
//       quantity: 1
//     };

//     const added = addToCart(cartItem);
//     setIsInCart(added !== false);
    
//     if (added === false) {
//       alert("This item is already in your cart!");
//     } else {
//       alert(`${product.name} added to cart!`);
//     }
//   };

//   const addReview = (newReview) => {
//     if (!localStorage.getItem('token')) {
//       alert("Please log in to leave a review");
//       return;
//     }
//     const updatedReviews = [...reviews, newReview];
//     setReviews(updatedReviews);
//     localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));
//   };

//   const renderStars = (rating) => {
//     const numericRating = Math.round(parseFloat(rating));
//     return [...Array(5)].map((_, i) => (
//       <span key={i} className={`star ${i < numericRating ? 'filled' : ''}`}>★</span>
//     ));
//   };

//   if (loading) return (
//     <div className="loading-state">
//       <div className="spinner"></div>
//       <p>Loading product details...</p>
//     </div>
//   );

//   if (error) return (
//     <div className="error-state">
//       <div className="error-icon">!</div>
//       <p>{error}</p>
//       <button onClick={() => navigate(-1)} className="btn-primary">
//         <IonIcon icon={arrowBackOutline} />
//         Back to Products
//       </button>
//     </div>
//   );

//   if (!product) return (
//     <div className="not-found">
//       <h2>Product Not Found</h2>
//       <p>We couldn't find the product you're looking for.</p>
//       <button onClick={() => navigate('/')} className="btn-primary">
//         Browse Products
//       </button>
//     </div>
//   );

//   return (
//     <div className="product-detail-container">
//       <div className="product-header">
//         <button onClick={() => navigate(-1)} className="btn-back">
//           <IonIcon icon={arrowBackOutline} />
//           Back
//         </button>
//         <h1 className="product-title">{product.name}</h1>
//       </div>

//       <div className="product-content">
//         <div className="product-gallery">
//           <div className="main-image">
//             <img 
//               src={product.product_image || '/images/product-placeholder.jpg'} 
//               alt={product.name}
//               onError={(e) => e.target.src = '/images/product-placeholder.jpg'}
//             />
//           </div>
//         </div>

//         <div className="product-info">
//           <div className="price-section">
//             <span className="current-price">Rs. {product.price?.toLocaleString()}</span>
//             {product.originalPrice && (
//               <span className="original-price">Rs. {product.originalPrice.toLocaleString()}</span>
//             )}
//           </div>

//           <div className="rating-section">
//             {renderStars(averageRating)}
//             <span className="rating-count">({reviews.length} reviews)</span>
//             <a href="#reviews" className="review-link">See all reviews</a>
//           </div>

//           <div className="stock-status">
//             {product.stock_quantity > 0 ? (
//               <span className="in-stock">In Stock ({product.stock_quantity} available)</span>
//             ) : (
//               <span className="out-of-stock">Out of Stock</span>
//             )}
//           </div>

//           <div className="product-description">
//             <h3>Description</h3>
//             <p>{product.description || "No description available"}</p>
//           </div>

//           {product.product_features?.length > 0 && (
//             <div className="product-features">
//               <h3>Features</h3>
//               <ul>
//                 {product.product_features.map((feature, index) => (
//                   <li key={index}>{feature}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           <div className="action-buttons">
//             <button 
//               className={`btn-cart ${isInCart ? 'in-cart' : ''}`}
//               onClick={handleAddToCart}
//               disabled={product.stock_quantity <= 0}
//             >
//               <IonIcon icon={cartOutline} />
//               {product.stock_quantity <= 0 ? 'Out of Stock' : isInCart ? 'Added to Cart' : 'Add to Cart'}
//             </button>
//             <button 
//               className={`btn-wishlist ${isWishlisted ? 'active' : ''}`}
//               onClick={handleWishlist}
//             >
//               <IonIcon icon={isWishlisted ? heart : heartOutline} />
//               {isWishlisted ? 'Saved' : 'Save for Later'}
//             </button>
//           </div>

//           <ProductAuthentication productId={id} />
//         </div>
//       </div>

//       <section id="reviews" className="reviews-section">
//         <div className="section-header">
//           <h2>Customer Reviews</h2>
//           <div className="overall-rating">
//             {renderStars(averageRating)}
//             <span>{averageRating.toFixed(1)} out of 5</span>
//           </div>
//         </div>

//         <Rating addReview={addReview} />

//         {reviews.length > 0 ? (
//           <div className="reviews-list">
//             {reviews.map((review, index) => (
//               <div key={index} className="review-card">
//                 <div className="reviewer-info">
//                   <div className="avatar">{review.username.charAt(0).toUpperCase()}</div>
//                   <div>
//                     <h4>{review.username}</h4>
//                     <time>{new Date(review.date).toLocaleDateString()}</time>
//                   </div>
//                 </div>
//                 <div className="review-rating">{renderStars(review.rating)}</div>
//                 {review.content && <p className="review-content">"{review.content}"</p>}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="no-reviews">
//             <p>No reviews yet. Be the first to review this product!</p>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// };

// export default ProductDetail;


import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IonIcon } from '@ionic/react';
import { useCart } from './cartContext';
import axios from 'axios';
import { heartOutline, 
  heart, 
  cartOutline, 
  arrowBackOutline,
  checkmarkCircle,
  closeCircle } from 'ionicons/icons';
import ProductAuthentication from "./productAuthentication";  // Import the product authentication component
import "./productDescription.css"; // Add styling if needed
import { ShieldCheck, Star, ShoppingBag } from 'lucide-react';


// Rating Component Integrated Directly
const Rating = ({ addReview, closePopup }) => {
    const [rating, setRating] = useState(0);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [opinion, setOpinion] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const newReview = { username, email, rating, content: opinion };
        addReview(newReview); // Pass review to parent state
        // Handle form submission logic
        console.log({ username, email, rating, opinion });
        alert("Thank you for your feedback!");
        // Reset fields after submission
        setUsername("");
        setEmail("");
        setRating(0);
        setOpinion("");
        closePopup(); // Close the popup after submission
    };

    return (
        <div className="rating_popup_overlay">
            <div className="rating_popup_content">
                <div className="wrapper">
                    <button className="close_button" onClick={closePopup}>×</button>
                    <h3>RATE US</h3>
                    <form onSubmit={handleSubmit}>
                        {/* Username and Email Fields */}
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter your name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        {/* Star Rating */}
                        <div className="rating">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <div key={num} className="star" onClick={() => setRating(num)}>
                                    <svg
                                      width="30"
                                      height="30"
                                      viewBox="0 0 24 24"
                                      fill={num <= rating ? "#FFD700" : "none"}
                                      stroke="#FFD700"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <polygon points="12 2 15 9 22 9 17 14 18 21 12 17 6 21 7 14 2 9 9 9" />
                                    </svg>
                                </div>
                            ))}
                        </div>

                        {/* Opinion Text Area */}
                        <textarea
                            name="opinion"
                            cols={30}
                            rows={5}
                            placeholder="Your opinion..."
                            value={opinion}
                            onChange={(e) => setOpinion(e.target.value)}
                        ></textarea>

                        {/* Buttons */}
                        <div className="btn-group">
                            <button type="submit" className="btn-submit">SUBMIT</button>
                            <button type="button" className="btn-cancel" onClick={closePopup}>CANCEL</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const AuthenticationPopup = ({ status, onClose }) => {
  return (
    <div className="auth_popup_overlay">
      <div className="auth_popup_content">
        <div className="wrapper">
          <button className="close_button" onClick={onClose}>×</button>
          <h3 className="prod-auth-header">Product Authentication</h3>
          <div className={`auth-status ${status.includes("valid") ? "valid" : "invalid"}`}>
            {status}
          </div>
          <button 
            className="btn-close" 
            onClick={onClose}
            style={{ marginTop: '20px' }}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};


const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const product = products.find((item) => item.id === id);

  // if (!product) {
  //   return <h2>Product not found</h2>;
  // }

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [authStatus, setAuthStatus] = useState(null);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const { addToCart, error: cartError, loading: cartLoading } = useCart();
  const [addingToCart, setAddingToCart] = useState(null); // Track which product is being added
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching product...");
        // Simplified request - no authentication headers
        console.log(`Fetching product of id: ${id}`);
          const response = await axios.get(`http://localhost:3000/api/products/getProduct/${id}`);
          
              console.log("Specific Product Response received:", response.data);
              console.log("1Current products state:", product)
              
              // Check if response has data property
              if (response.data && (response.data.data || Array.isArray(response.data))) {
                // Handle both possible response formats
                const productsData = Array.isArray(response.data) ? response.data : 
                                    (response.data.data ? response.data.data : []);
                
                  setProduct(productsData);
                console.log("2Current products state:", product)
                // console.log("The products are:", products);
              } else {
                console.error("Unexpected response format:", response.data);
                setError("Invalid data format received from server");
              }
              
              setLoading(false);
            } catch (err) {
              console.error("Error fetching the product:", err);
              setError(err.message || "Failed to fetch the product");
              setLoading(false);
            }
          };
      
          fetchData();
        }, [id]);
      
        useEffect(() => {
                console.log("3Current products state:", product);
              }, [product]);
      
  // useEffect(() => {
  //   if (reviews.length > 0) {
  //     const avg = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  //     setAverageRating(avg);
  //   }
  // }, [reviews]);

  // const handleWishlist = () => {
  //   if (!localStorage.getItem('token')) {
  //     alert("Please log in to add items to your wishlist");
  //     return;
  //   }
  //   setIsWishlisted(!isWishlisted);
  // };

  // const handleAddToCart = () => {
  //   if (!localStorage.getItem('token')) {
  //     alert("Please log in to add items to your cart");
  //     return;
  //   }
    
  //   if (product) {
  //     addToCart({
  //       id: product.id,
  //       title: product.name,
  //       price: product.price,
  //       image: product.product_image || '/images/product-placeholder.jpg',
  //       quantity: 1
  //     });
  //   }
  // };

  // const handleWishlist = () => {
  //   setIsWishlisted(!isWishlisted);
  // };

  // Define inline styles for the buttons
  const buyNowButtonStyle = {
    flex: '1',
    minWidth: '150px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgb(24, 161, 148)',
    color: 'white',
    fontSize: '16px',
    fontWeight: '500',
    border: 'none',
    borderRadius: '25px', 
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(230, 184, 176, 0.3)'
  };

  // Style for when the item is in cart
  const inCartButtonStyle = {
    ...buyNowButtonStyle,
    background: '#c2c2c2' // Grey color for "Added to Cart" state
  };

  // Style for circular buttons (Authentication and Review)
  const reviewButtonStyle = {
    flex: '1',
    minWidth: '150px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    color: '#d0d0d0',
    fontSize: '16px',
    fontWeight: '500',
    border: '1px solid #d0d0d0',
    borderRadius: '25px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',

  };

  const addProductToCart = async (product) => {
    console.log("Adding product to cart:", product);
    const productId = product.id || product.product_id;
    
    try {
      setAddingToCart(productId); // Set the product being added
      const success = await addToCart(product);
      
      if (success) {
        setIsInCart(true);
        console.log("successfully added to cart", success)
      } else {
        // Show a more user-friendly message
        alert(cartError || "Failed to add product to cart. Please try again.");
      }
    } catch (err) {
      console.error("Error in addProductToCart:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setAddingToCart(null); // Clear the adding state
    }
  };
  // const handleAddToCart = () => {
  //   if (isInCart) {
  //     alert("Already in cart!");
  //   } else {
  //     setIsInCart(true);
  //     alert("Added to cart!");
  //   }
  // };


  const toggleRatingPopup = () => {
    setShowRatingPopup(!showRatingPopup);
  };

  // Helper function to generate star icons
  // const renderStars = (rating) => {
  //   return [...Array(5)].map((_, i) => (
  //     <span key={i} style={{ color: i < rating ? "#FFD700" : "#ccc", fontSize: "23px" }}>★</span>
  //   ));
  // };
  const renderStars = (rating) => {
    const numericRating = Math.round(parseFloat(rating));
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`star ${i < numericRating ? 'filled' : ''}`}>★</span>
    ));
  };

  // const addReview = (newReview) => {
  //   const isReviewed = reviews.some(review => review.email === newReview.email);
  //   if (isReviewed) {
  //     alert("Product already reviewed!");
  //     return;
  //   }
  //   setReviews([...reviews, newReview]);
  // };

    const addReview = (newReview) => {
        if (!localStorage.getItem('token')) {
            alert("Please log in to leave a review");
            return;
        }
        const updatedReviews = [...reviews, newReview];
        setReviews(updatedReviews);
        localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));
    };

  // Recalculate the average rating whenever the reviews change
  // useEffect(() => {
  //   if (reviews.length) {
  //     const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  //     setAverageRating(avgRating);
  //   }
  // }, [reviews]);

  // useEffect(() => {
  //   if (product) {
  //     localStorage.setItem(`rating_${product.id}`, JSON.stringify(averageRating)); // Store rating
  //   }
  // }, [averageRating, product]);

  const handleAuthResult = (status) => {
    setAuthStatus(status);
    setShowAuthPopup(true);
  };

    if (loading) return (
        <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading product details...</p>
        </div>
    );

    if (error) return (
        <div className="error-state">
            <div className="error-icon">!</div>
            <p>{error}</p>
            <button onClick={() => navigate(-1)} className="btn-primary">
                <IonIcon icon={arrowBackOutline} />
                Back to Products
            </button>
        </div>
    );

    if (!product) return (
        <div className="not-found">
            <h2>Product Not Found</h2>
            <p>We couldn't find the product you're looking for.</p>
            <button onClick={() => navigate('/')} className="btn-primary">
                Browse Products
            </button>
        </div>
    );

  return (
    <div className="PD_product_detail_page">
      <div className="PD_product-detail">
        <div className="PD_product-container">
          <div className="PD_back-button" onClick={() => navigate(-1)}><IonIcon icon={arrowBackOutline} /></div>
          {/* <img src={product.image} alt={product.name} className="product-image" /> */}
          <img 
            className="PD_product-image"
            src={product.image || product.product_image || '/images/product-placeholder.jpg'} 
            alt={product.name}
            onError={(e) => e.target.src = '/images/product-placeholder.jpg'}
          />
          <div className="PD_product-info">
            <h2>{product.name}</h2>
            <p className="PD_about-product">{product.description}</p>
            {/* Display Average Rating */}
            <div className="average-rating">
              <div>{renderStars(Math.round(averageRating))} ({averageRating.toFixed(1)})</div>
            </div>
            <div>
              <h3 className="PD_product-price">Rs. {product.price.toLocaleString()}</h3>
              {product.originalPrice && (
                <span className="PD_original-price">Rs. {product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            {/* <div className="PD_product_detail_buttons">
              <button className={`PD_cart-button ${isInCart ? 'in-cart':''}`} onClick={handleAddToCart}>{isInCart?'Added to Cart':'Add to Cart'}</button>
              <div className="PD_authentication_button">
                <ProductAuthentication productId={id} />
              </div>
              <button className="PD_cart-button" onClick={toggleRatingPopup}>Review Product</button>
            </div> */}
            
            <div className="PD_product_detail_buttons">
              <button 
                className={`PD_cart-button ${isInCart ? 'in-cart':''}`} 
                onClick={() => addProductToCart(product)}
                style={isInCart ? inCartButtonStyle : buyNowButtonStyle}
              >
                {isInCart ? 'Added to Cart' : 'Buy now'}
              </button>

              <button 
                onClick={toggleRatingPopup} 
                aria-label="Review Product"
                style={reviewButtonStyle}
                className="PD_review-button"
              >
                {/* <Star size={20} color="#777" /> */}
                Review Product
              </button>
              
              {/* <div className="PD_authentication_button">
                <button 
                  aria-label="Authenticate Product"
                  style={authButtonStyle}
                >
                  {/* <ShieldCheck size={20} color="#777" />
                  Authenticate Product
                </button>
              </div> */}

              <div className="PD_authentication_button">
                <ProductAuthentication 
                productId={id} 
                onAuthComplete={handleAuthResult} 
                />
              </div>
              
            </div>
          </div>
        </div>
      </div>


        {/* Display Individual Reviews 
        <div className="review_box_container">
          {reviews.length ? (
            reviews.map((review, index) => (
              <div key={index} className="review_box">
                <div className="box_top">
                  <div className="user_name">
                    <h4>{review.username}</h4>
                    <span>{review.email}</span>
                  </div>
                  <div className="reviewed_stars">{renderStars(review.rating)}</div>
                </div>
                <div className="box_body">
                  {review.content && <p>"{review.content}"</p>}
                </div>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}     
        </div>
      </div>  */}

      <section id="reviews" className="reviews-section">
        <div className="review_heading">
          <span>Customer Reviews</span>
          <h1>Client Says</h1>
        </div>

                {/* <Rating addReview={addReview} /> */}
                {showRatingPopup && (
  <Rating addReview={addReview} closePopup={toggleRatingPopup}/>
)}

      {reviews.length > 0 ? (
                <div className="review_box_container">
                  {reviews.map((review, index) => (
                    <div key={index} className="review_box">
                      <div className="box_top">
                        <div className="avatar">{review.username.charAt(0).toUpperCase()}</div>
                        <div>
                          <h4>{review.username}</h4>
                          <time>{new Date(review.date).toLocaleDateString()}</time>
                        </div>
                        <div className="review-rating">{renderStars(review.rating)}</div>
                      </div>
                      <div className="box_body">    
                      {review.content && <p className="review-content">"{review.content}"</p>}
                      </div>
                    </div>
      ))}
      </div>
      ) : (
      <div className="no-reviews">
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
      )}
      </section>

      {showAuthPopup && (
    <AuthenticationPopup 
      status={authStatus} 
      onClose={() => setShowAuthPopup(false)} 
    />
  )}
    </div>

    
  );
};

export default ProductDetail;