// import React, {useEffect, useState} from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { IonIcon } from '@ionic/react';
// import axios from 'axios';
// import { heartOutline, heart, cartOutline, arrowBackOutline } from 'ionicons/icons';
// import ProductAuthentication from "./productAuthentication";  // Import the product authentication component
// import "./rentalProductDescription.css"; // Add styling if needed
// import { ShieldCheck, Star, ShoppingBag } from 'lucide-react';




// // Rating Component Integrated Directly
// const Rating = ({ addReview, closePopup }) => {
//     const [rating, setRating] = useState(0);
//     const [username, setUsername] = useState("");
//     const [email, setEmail] = useState("");
//     const [opinion, setOpinion] = useState("");

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         const newReview = { username, email, rating, content: opinion };
//         addReview(newReview); // Pass review to parent state
//         // Handle form submission logic
//         console.log({ username, email, rating, opinion });
//         alert("Thank you for your feedback!");
//         // Reset fields after submission
//         setUsername("");
//         setEmail("");
//         setRating(0);
//         setOpinion("");
//         closePopup(); // Close the popup after submission
//     };

//     return (
//         <div className="rating_popup_overlay">
//             <div className="rating_popup_content">
//                 <div className="wrapper">
//                     <button className="close_button" onClick={closePopup}>×</button>
//                     <h3>RATE US</h3>
//                     <form onSubmit={handleSubmit}>
//                         {/* Username and Email Fields */}
//                         <input
//                             type="text"
//                             name="username"
//                             placeholder="Enter your name"
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             required
//                         />
//                         <input
//                             type="email"
//                             name="email"
//                             placeholder="Enter your email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />

//                         {/* Star Rating */}
//                         <div className="rating">
//                             {[1, 2, 3, 4, 5].map((num) => (
//                                 <div key={num} className="star" onClick={() => setRating(num)}>
//                                     <svg
//                                       width="30"
//                                       height="30"
//                                       viewBox="0 0 24 24"
//                                       fill={num <= rating ? "#FFD700" : "none"}
//                                       stroke="#FFD700"
//                                       strokeWidth="2"
//                                       strokeLinecap="round"
//                                       strokeLinejoin="round"
//                                     >
//                                       <polygon points="12 2 15 9 22 9 17 14 18 21 12 17 6 21 7 14 2 9 9 9" />
//                                     </svg>
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Opinion Text Area */}
//                         <textarea
//                             name="opinion"
//                             cols={30}
//                             rows={5}
//                             placeholder="Your opinion..."
//                             value={opinion}
//                             onChange={(e) => setOpinion(e.target.value)}
//                         ></textarea>

//                         {/* Buttons */}
//                         <div className="btn-group">
//                             <button type="submit" className="btn-submit">SUBMIT</button>
//                             <button type="button" className="btn-cancel" onClick={closePopup}>CANCEL</button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };


// const RentalProductDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   // const product = products.find((item) => item.id === id);

//   // if (!product) {
//   //   return <h2>Product not found</h2>;
//   // }

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [isInCart, setIsInCart] = useState(false);
//   const [showRatingPopup, setShowRatingPopup] = useState(false);
//   const [reviews, setReviews] = useState([]);
//   const [averageRating, setAverageRating] = useState(0);


//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         console.log("Fetching rental product...");
//         // Simplified request - no authentication headers
//         console.log(`Fetching rental product of id: ${id}`);
//           const response = await axios.get(`http://localhost:3000/api/products/getProduct/${id}`);
          
//               console.log("Specific Rental Product Response received:", response.data);
//               console.log("1Current products state:", product)
              
//               // Check if response has data property
//               // if (response.data && (response.data.data || Array.isArray(response.data))) {
//               //   // Handle both possible response formats
//               //   const productsData = Array.isArray(response.data) ? response.data : 
//               //                       (response.data.data ? response.data.data : []);

//               const apiProduct = response.data.data[0];

//                   if (!apiProduct) {
//                     throw new Error("Product data not found in response");
//                   }

//                   // Transform the API data to match your component's expectations
//                     const formattedProduct = {
//                     id: apiProduct.rental_id,
//                     name: apiProduct.title, // API uses 'title' instead of 'name'
//                     description: apiProduct.description,
//                     price: parseFloat(apiProduct.price), // Convert string to number
//                     rental_price: parseFloat(apiProduct.rental_price),
//                     duration: apiProduct.rental_duration,
//                     return_date: new Date(apiProduct.return_date).toLocaleDateString(),
//                     product_image: apiProduct.image || '/images/product-placeholder.jpg',
//                     avg_rating: parseFloat(apiProduct.swg_rating),
//                     people_rated: parseInt(apiProduct.people_rate)
//                   };

//                   setProduct(formattedProduct);
                
//                   // setProduct(productsData);
//                 console.log("2Current products state:", product)
//                 // console.log("The products are:", products);
//               // } else {
//               //   console.error("Unexpected response format:", response.data);
//               //   setError("Invalid data format received from server");
//               // }
              
//               setLoading(false);
//             } catch (err) {
//               console.error("Error fetching the product:", err);
//               setError(err.message || "Failed to fetch the product");
//               setLoading(false);
//             }
//           };
      
//           fetchData();
//         }, [id]);
      
//         useEffect(() => {
//                 console.log("3Current products state:", product);
//               }, [product]);
      
//   // useEffect(() => {
//   //   if (reviews.length > 0) {
//   //     const avg = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
//   //     setAverageRating(avg);
//   //   }
//   // }, [reviews]);

//   // const handleWishlist = () => {
//   //   if (!localStorage.getItem('token')) {
//   //     alert("Please log in to add items to your wishlist");
//   //     return;
//   //   }
//   //   setIsWishlisted(!isWishlisted);
//   // };

//   // const handleAddToCart = () => {
//   //   if (!localStorage.getItem('token')) {
//   //     alert("Please log in to add items to your cart");
//   //     return;
//   //   }
    
//   //   if (product) {
//   //     addToCart({
//   //       id: product.id,
//   //       title: product.name,
//   //       price: product.price,
//   //       image: product.product_image || '/images/product-placeholder.jpg',
//   //       quantity: 1
//   //     });
//   //   }
//   // };

//   // const handleWishlist = () => {
//   //   setIsWishlisted(!isWishlisted);
//   // };

//   // Define inline styles for the buttons
//   const buyNowButtonStyle = {
//     flex: '1',
//     minWidth: '150px',
//     height: '50px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     background: '#b1857d', // Rose gold color from Samsung example
//     color: 'white',
//     fontSize: '16px',
//     fontWeight: '500',
//     border: 'none',
//     borderRadius: '25px', // Rounded corners like in the Samsung example
//     cursor: 'pointer',
//     transition: 'all 0.3s ease',
//     boxShadow: '0 2px 8px rgba(230, 184, 176, 0.3)'
//   };

//   // Style for when the item is in cart
//   const inCartButtonStyle = {
//     ...buyNowButtonStyle,
//     background: '#c2c2c2' // Grey color for "Added to Cart" state
//   };

//   // Style for circular buttons (Authentication and Review)
//   const reviewButtonStyle = {
//     flex: '1',
//     minWidth: '150px',
//     height: '50px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     background: 'transparent',
//     color: '#d0d0d0',
//     fontSize: '16px',
//     fontWeight: '500',
//     border: '1px solid #d0d0d0',
//     borderRadius: '25px',
//     cursor: 'pointer',
//     transition: 'all 0.3s ease',

//   };

//   const handleAddToCart = () => {
//     if (isInCart) {
//       alert("Already in cart!");
//     } else {
//       setIsInCart(true);
//       alert("Added to cart!");
//     }
//   };


//   const toggleRatingPopup = () => {
//     setShowRatingPopup(!showRatingPopup);
//   };

//   // Helper function to generate star icons
//   // const renderStars = (rating) => {
//   //   return [...Array(5)].map((_, i) => (
//   //     <span key={i} style={{ color: i < rating ? "#FFD700" : "#ccc", fontSize: "23px" }}>★</span>
//   //   ));
//   // };
//   const renderStars = (rating) => {
//     const numericRating = Math.round(parseFloat(rating));
//     return [...Array(5)].map((_, i) => (
//       <span key={i} className={`star ${i < numericRating ? 'filled' : ''}`}>★</span>
//     ));
//   };

//   // const addReview = (newReview) => {
//   //   const isReviewed = reviews.some(review => review.email === newReview.email);
//   //   if (isReviewed) {
//   //     alert("Product already reviewed!");
//   //     return;
//   //   }
//   //   setReviews([...reviews, newReview]);
//   // };

//   const addReview = (newReview) => {
//     if (!localStorage.getItem('token')) {
//       alert("Please log in to leave a review");
//       return;
//     }
//     const updatedReviews = [...reviews, newReview];
//     setReviews(updatedReviews);
//     localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));
//   };

//   // Recalculate the average rating whenever the reviews change
//   // useEffect(() => {
//   //   if (reviews.length) {
//   //     const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
//   //     setAverageRating(avgRating);
//   //   }
//   // }, [reviews]);

//   // useEffect(() => {
//   //   if (product) {
//   //     localStorage.setItem(`rating_${product.id}`, JSON.stringify(averageRating)); // Store rating
//   //   }
//   // }, [averageRating, product]);

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
//     <div className="PD_product_detail_page">
//       <div className="PD_product-detail">
//         <div className="PD_product-container">
//           <div className="PD_back-button" onClick={() => navigate(-1)}><IonIcon icon={arrowBackOutline} /></div>
//           {/* <img src={product.image} alt={product.name} className="product-image" /> */}
//           <img 
//             className="PD_product-image"
//             src={product.image || product.product_image || '/images/product-placeholder.jpg'} 
//             alt={product.name}
//             onError={(e) => e.target.src = '/images/product-placeholder.jpg'}
//           />
//           <div className="PD_product-info">
//             <h2>{product.name}</h2>
//             <p className="PD_about-product">{product.description}</p>
//             {/* Display Average Rating */}
//             <div className="average-rating">
//               <div>{renderStars(Math.round(averageRating))} ({averageRating.toFixed(1)})</div>
//             </div>
//             {/* <div>
//               <h3 className="PD_product-price">Rs. {product.price.toLocaleString()}</h3>
//               {product.originalPrice && (
//                 <span className="PD_original-price">Rs. {product.originalPrice.toLocaleString()}</span>
//               )}
//             </div> */}
//             <div>
//               <h3 className="PD_product-price">
//                 Rs. {product.price ? product.price.toLocaleString() : 'N/A'}
//               </h3>
//               {product.rental_price && (
//                 <p>Rental Price: Rs. {product.rental_price.toLocaleString()}/month</p>
//               )}
//               {product.duration && <p>Rental Period: {product.duration} months</p>}
//               {product.return_date && <p>Return by: {product.return_date}</p>}
//             </div>
//             {/* <div className="PD_product_detail_buttons">
//               <button className={`PD_cart-button ${isInCart ? 'in-cart':''}`} onClick={handleAddToCart}>{isInCart?'Added to Cart':'Add to Cart'}</button>
//               <div className="PD_authentication_button">
//                 <ProductAuthentication productId={id} />
//               </div>
//               <button className="PD_cart-button" onClick={toggleRatingPopup}>Review Product</button>
//             </div> */}
            
//             <div className="PD_product_detail_buttons">
//               <button 
//                 className={`PD_cart-button ${isInCart ? 'in-cart':''}`} 
//                 onClick={handleAddToCart}
//                 style={isInCart ? inCartButtonStyle : buyNowButtonStyle}
//               >
//                 {isInCart ? 'Added to Cart' : 'Buy now'}
//               </button>

//               <button 
//                 onClick={toggleRatingPopup} 
//                 aria-label="Review Product"
//                 style={reviewButtonStyle}
//                 className="PD_review-button"
//               >
//                 {/* <Star size={20} color="#777" /> */}
//                 Review Product
//               </button>
              
//               {/* <div className="PD_authentication_button">
//                 <button 
//                   aria-label="Authenticate Product"
//                   style={authButtonStyle}
//                 >
//                   {/* <ShieldCheck size={20} color="#777" /> 
//                   Authenticate Product
//                 </button>
//               </div> */}

//               {/* <div className="PD_authentication_button">
//                 <ProductAuthentication 
//                 productId={id} 
//                 onAuthComplete={handleAuthResult} 
//                 />
//               </div> */}
              
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Review Section */}
//       {/* <div className="review_container">
//         <div className="review_heading">
//           <span>Customer Reviews</span>
//           <h1>Client Says</h1>
//         </div>

//         {/* Display Individual Reviews 
//         <div className="review_box_container">
//           {reviews.length ? (
//             reviews.map((review, index) => (
//               <div key={index} className="review_box">
//                 <div className="box_top">
//                   <div className="user_name">
//                     <h4>{review.username}</h4>
//                     <span>{review.email}</span>
//                   </div>
//                   <div className="reviewed_stars">{renderStars(review.rating)}</div>
//                 </div>
//                 <div className="box_body">
//                   {review.content && <p>"{review.content}"</p>}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p>No reviews yet.</p>
//           )}     
//         </div>
//       </div>  */}

//       <section id="reviews" className="reviews-section">
//         <div className="review_heading">
//           <span>Customer Reviews</span>
//           <h1>Client Says</h1>
//         </div>

//       {/* Rating Popup */}
//       {showRatingPopup && (
//         <Rating addReview={addReview} closePopup={toggleRatingPopup} />
//       )}

//       {reviews.length > 0 ? (
//                 <div className="review_box_container">
//                   {reviews.map((review, index) => (
//                     <div key={index} className="review_box">
//                       <div className="box_top">
//                         <div className="avatar">{review.username.charAt(0).toUpperCase()}</div>
//                         <div>
//                           <h4>{review.username}</h4>
//                           <time>{new Date(review.date).toLocaleDateString()}</time>
//                         </div>
//                         <div className="review-rating">{renderStars(review.rating)}</div>
//                       </div>
//                       <div className="box_body">    
//                       {review.content && <p className="review-content">"{review.content}"</p>}
//                       </div>
//                     </div>
//       ))}
//       </div>
//       ) : (
//       <div className="no-reviews">
//         <p>No reviews yet. Be the first to review this product!</p>
//       </div>
//       )}
//       </section>
//     </div>
//   );
// };

// export default RentalProductDetail;

import React, { useEffect, useState } from "react";
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
import "./rentalProductDescription.css"; // Add styling if needed
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


const RentalProductDetail = () => {
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
  const [rentalDuration, setRentalDuration] = useState(1);
  const { addToCart, error: cartError, loading: cartLoading } = useCart();
    const [addingToCart, setAddingToCart] = useState(null); // Track which product is being added


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching product...");
        // Simplified request - no authentication headers
        console.log(`Fetching product of id: ${id}`);
          const response = await axios.get(`http://localhost:3000/api/products/getRentalProduct/${id}`);
          
              console.log("Specific Product Response received:", response.data);
              console.log("1Current products state:", product)
              
              // Check if response has data property
              // if (response.data && (response.data.data || Array.isArray(response.data))) {
                

              //   const productData = Array.isArray(response.data) ? response.data[0] : 
              //      (response.data.data ? response.data.data : null);
              //   setProduct(productData);

              if (!response.data || !response.data.data || !response.data.data[0]) {
        throw new Error("Invalid product data format");
      }

      const apiProduct = response.data.data[0];

      // Transform API data to match component expectations
      const formattedProduct = {
        id: apiProduct.product_id,
        name: apiProduct.title, // Map title to name
        description: apiProduct.description,
        price: parseFloat(apiProduct.price), // Convert string to number
        product_image: apiProduct.image, // Map image to product_image
        avg_rating: parseFloat(apiProduct.swg_rating || 0),
        people_rated: parseInt(apiProduct.people_rated || 0)
      };

      setProduct(formattedProduct);
      setLoading(false);

                console.log("2Current products state:", product)
                // console.log("The products are:", products);
              // } else {
              //   console.error("Unexpected response format:", response.data);
              //   setError("Invalid data format received from server");
              // }
              
              // setLoading(false);
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
    background: 'rgb(24, 161, 148)', // Rose gold color from Samsung example
    color: 'white',
    fontSize: '16px',
    fontWeight: '500',
    border: 'none',
    borderRadius: '25px', // Rounded corners like in the Samsung example
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
              <h3 className="PD_product-price">Rs. {product.price}</h3>
              {product.originalPrice && (
                <span className="PD_original-price">Rs. {product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            {/* Add this right below the price display */}
            <div className="rental-duration-container">
              <label htmlFor="rental-duration" className="rental-label">Rental Duration:</label>
              <div className="rental-select-wrapper">
                <select
                  id="rental-duration"
                  value={rentalDuration}
                  onChange={(e) => setRentalDuration(parseInt(e.target.value))}
                  className="rental-select"
                >
                  {[...Array(30)].map((_, i) => (
                    <option key={i+1} value={i+1}>
                      {i+1} day{i+1 !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
                <IonIcon icon={arrowBackOutline} className="rental-select-arrow" />
              </div>
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
                {isInCart ? 'Added to Cart' : 'Rent now'}
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
                <ProductAuthentication 
                productId={id} 
                onAuthComplete={handleAuthResult} 
                />
              </div> */}
              
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

        {showRatingPopup && (
  <Rating addReview={addReview} closePopup={toggleRatingPopup} />
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

export default RentalProductDetail;