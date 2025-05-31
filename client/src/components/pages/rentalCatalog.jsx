// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from './cartContext';
// import './rentalCatalog.css';
// import SlidingCart from './slidingCart';
// import Navbar from '../Navbar/navbar1';
// import axios from 'axios';
// import { Padding } from '@mui/icons-material';

// const RentalCatalog = () => {
//   const { addToCart } = useCart();
//   const navigate = useNavigate();
//   const [isSlidingCartOpen, setSlidingCartOpen] = useState(false);
//   const [rentals, setRentals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch rental products from database
//   useEffect(() => {
//     const fetchRentals = async () => {
//       try {
//         console.log("Fetching rental products...");
//         const response = await axios.get("http://localhost:3000/api/products/getAllRentalProducts");
        
//         console.log("Rental response received:", response.data);
        
//         // Handle response data
//         if (response.data && (response.data.data || Array.isArray(response.data))) {
//           const rentalsData = Array.isArray(response.data) ? response.data : 
//                             (response.data.data ? response.data.data : []);
          
//             const availableRentals = rentalsData.filter(rental => 
//                 rental && rental.rental_available !== false
//                   );
                  
//             setRentals(availableRentals);
//                             // setRentals(rentalsData);
          
//           // Cache rentals for later use
//           localStorage.setItem('cachedRentals', JSON.stringify(availableRentals));
//         } else {
//           console.error("Unexpected rental response format:", response.data);
//           setError("Invalid data format received from server");
//         }
        
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching rental products:", err);
//         setError(err.message || "Failed to fetch rental products");
//         setLoading(false);
//       }
//     };

//     fetchRentals();
//   }, []);

//   // Add this CSS-in-JS object for the title
//   // const titleStyle = {
//   //   display: '-webkit-box',
//   //   WebkitLineClamp: 2,
//   //   WebkitBoxOrient: 'vertical',
//   //   overflow: 'hidden',
//   //   textOverflow: 'ellipsis',
//   //   lineHeight: '1.3em',
//   //   maxHeight: '5.5em', // 2 lines * 1.2em line height
//   //   padding: '15px 0 0 10px',
//   //   fontWeight: '500'
//   //   // margin: '5px 0 0 0'
//   // };


//   const addRentalToCart = (rental) => {
//     if (!rental.rental_available) {
//       alert("This product is no longer available for rent");
//       return;
//     }
    
//     addToCart({
//       ...rental,
//       isRental: true // Add flag to distinguish rental products
//     });
//     setSlidingCartOpen(true);
//   };

//   const navigateToRentalDetail = (rentalId) => {
//     navigate(`/rental-product/${rentalId}`);
//   };

//   const renderStars = (rating) => {
//     const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating || 0;
//     return [...Array(5)].map((_, i) => (
//       <span key={i} style={{ color: i < numericRating ? "#FFD700" : "#ccc", fontSize: "23px" }}>★</span>
//     ));
//   };

//   const getRentalRating = (rental) => {
//     // First try to get rating from local storage
//     const storedRating = localStorage.getItem(`rating_${rental.id}`);
//     if (storedRating) return JSON.parse(storedRating);
    
//     // Otherwise use the rating from the API response
//     return rental.avg_rating ? parseFloat(rental.avg_rating) : 0;
//   };

//   if (loading) return <div className="loading">Loading rental products...</div>;
//   if (error) return <div className="error">Error: {error}</div>;
//   if (!rentals || rentals.length === 0) return (<div className="no-products">No rental products available</div>);

//   return (
//     <main>
//       <Navbar />
//       <div className="catalog">
//         <div className="catalog_container">
//         <button className='secondhand_button' onClick={() => navigate('/rentalsecondhandCatalog')}>Second hand products</button>
//           <div className="products">
//             {rentals.map((rent) => {
//               const averageRating = getRentalRating(rent);

//               return (
//                 <div className="product_card" key={rent.id}>
//                   {/* Product availability badge */}
//                   {/* {rental.rental_available && (
//                     <div className="availability-badge">Available for Rent</div>
//                   )} */}
//                   <div className="product_header">
//                     <div className="product_title" title={rent.title} onClick={() => navigateToRentalDetail(rent.id)}>
//                       {rent.title}
//                     </div>
//                     <div className="product_price">
//                       <b>Rs.{rent.price}</b>
//                       {/* <p>{rent.condition}</p>
//                       <p>{rent.rentalavailable ?"TRUE": "False"}</p> */}
//                       {/* <p>{rent.rental_status}</p> */}
//                     </div>
//                   </div>

//                   <div className="product_body">
//                     <div className="pro_image" onClick={() => navigateToRentalDetail(rent.id)}>
//                       <img src={rent.image} alt={rent.title} />
//                     </div>
//                   </div>

//                   <div className="button">
//                     <div className="show_rating">
//                       <div className="catalog_review_stars">
//                         {renderStars(averageRating)}
//                       </div>
//                       <p>({typeof averageRating === 'number' ? averageRating.toFixed(1) : '0.0'})</p>
//                     </div>
//                     <div className="add_to_cart">
//                       <button className='add_to_cart_button' onClick={() => navigateToRentalDetail(rent.id)}>
//                         RENT NOW
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//       <SlidingCart
//         isOpen={isSlidingCartOpen}
//         onClose={() => setSlidingCartOpen(false)}
//         onViewFullCart={() => navigate('/cart')}
//       />
//     </main>
//   );
// };

// export default RentalCatalog;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './cartContext';
import './catalog.css';
import SlidingCart from './slidingCart';
import Navbar from '../Navbar/navbar1';
import axios from 'axios';

// Create consistent axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true
});

const RentalCatalog = () => {
  const { addToCart, error: cartError, loading: cartLoading } = useCart();
  const navigate = useNavigate();
  const [isSlidingCartOpen, setSlidingCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null); // Track which product is being added

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products...");
        const response = await api.get("/products/getAllRentalProducts");
        
        console.log("Response received:", response.data);
        
        // Check if response has data property
        if (response.data && (response.data.data || Array.isArray(response.data))) {
          // Handle both possible response formats
          const productsData = Array.isArray(response.data) ? response.data : 
                              (response.data.data ? response.data.data : []);
          
          setProducts(productsData);
          
          // Store products in localStorage for later use in product detail page
          localStorage.setItem('cachedProducts', JSON.stringify(productsData));
        } else {
          console.error("Unexpected response format:", response.data);
          setError("Invalid data format received from server");
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to fetch products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addProductToCart = async (product) => {
    console.log("Adding product to cart:", product);
    const productId = product.id || product.product_id;
    
    try {
      setAddingToCart(productId); // Set the product being added
      const success = await addToCart(product);
      
      if (success) {
        setSlidingCartOpen(true);
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

  const navigateToProductDetail = (productId) => {
    navigate(`/rental-product/${productId}`);
  };

  const renderStars = (rating) => {
    const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating || 0;
    return [...Array(5)].map((_, i) => (
      <span key={i} style={{ color: i < numericRating ? "#FFD700" : "#ccc", fontSize: "23px" }}>★</span>
    ));
  };

  const getProductRating = (product) => {
    // First try to get rating from local storage
    const storedRating = localStorage.getItem(`rating_${product.id || product.product_id}`);
    if (storedRating) return JSON.parse(storedRating);
    
    // Otherwise use the rating from the API response
    return product.avg_rating ? parseFloat(product.avg_rating) : 0;
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!products || products.length === 0) return <div className="no-products">No products available</div>;

  return (
    <main>
      <Navbar />
      <div className="catalog">
        <div className="catalog_container">
          <button onClick={() => navigate('/rentalsecondhandCatalog')}>Secondhand Products</button>
          <div className="products">
            {products.map((product) => {
              const averageRating = getProductRating(product);
              const productId = product.id || product.product_id;
              const isAddingThisProduct = addingToCart === productId;

              return (
                <div className="product_card" key={productId}>
                  <div className="product_header">
                    <div className="product_title" onClick={() => navigateToProductDetail(productId)}>
                      <p>{product.title || product.name}</p>
                    </div>
                    <div className="product_price">
                      <b>Rs.{product.price}</b>
                    </div>
                  </div>

                  <div className="product_body">
                    <div className="pro_image" onClick={() => navigateToProductDetail(productId)}>
                      <img src={product.image} alt={product.title || product.name} />
                    </div>
                  </div>

                  <div className="button">
                    <div className="show_rating">
                      <div className="catalog_review_stars">
                        {renderStars(averageRating)}
                      </div>
                      <p>({typeof averageRating === 'number' ? averageRating.toFixed(1) : '0.0'})</p>
                    </div>
                    <div className="add_to_cart">
                      <button 
                        className='add_to_cart_button' 
                        // onClick={() => addProductToCart(product)}
                        // disabled={isAddingThisProduct || cartLoading}
                        onClick={() => navigateToProductDetail(productId)}
                      >
                        {isAddingThisProduct ? 'ADDING...' : 'RENT NOW'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <SlidingCart
        isOpen={isSlidingCartOpen}
        onClose={() => setSlidingCartOpen(false)}
        onViewFullCart={() => navigate('/cart')}
      />
    </main>
  );
};

export default RentalCatalog;