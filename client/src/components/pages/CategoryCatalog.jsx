import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Rating, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import Navbar from '../Navbar/navbar1';
import { useNavigate } from 'react-router-dom';
import { useCart } from './cartContext';
import './catalog.css';
import SlidingCart from './slidingCart';


const CategoryCatalog = () => {
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [isSlidingCartOpen, setSlidingCartOpen] = useState(false);
    const { slug } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);  
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryData, setCategoryData] = useState([]);



//   useEffect(() => {
//     const fetchCategoryProducts = async () => {
//       setLoading(true);
//       setError(null);
      
//       try {
//         const response = await axios.get(`http://localhost:3000/api/categories/getCategory/${slug}`);
//         console.log(response.data);
//         setCategoryData(response.data.data);
//       } catch (err) {
//         console.error('Error fetching category products:', err);
//         setError(err.response?.data?.message || 'Failed to fetch products. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategoryProducts();
//   }, [slug]);

useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching category...");
        // Simplified request - no authentication headers
        console.log(`Fetching products for category: ${slug}`);
        const response = await axios.get(`http://localhost:3000/api/categories/getCategory/${slug}`);
        
        console.log("Category Catalog Response received:", response.data);
        console.log("1Current products state:", categoryData)
        
        // Check if response has data property
        if (response.data && (response.data.data || Array.isArray(response.data))) {
          // Handle both possible response formats
          const categoriesData = Array.isArray(response.data) ? response.data : 
                              (response.data.data ? response.data.data : []);
          
            setCategoryData(categoriesData);
          console.log("2Current products state:", categoryData)
          // console.log("The products are:", products);
        } else {
          console.error("Unexpected response format:", response.data);
          setError("Invalid data format received from server");
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching category:", err);
        setError(err.message || "Failed to fetch the category");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  useEffect(() => {
          console.log("3Current products state:", categoryData);
        }, [categoryData]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3000/api/categories/getCategory/${slug}`);
//         const categoryData = response.data.data;
        
//         // Store products in localStorage for later use in product detail page
//         localStorage.setItem('cachedProducts', JSON.stringify(categoryData));
        
//         setCategoryData(categoryData); // Your existing state update
//       } catch (error) {
//         console.error('Error fetching category:', error);
//       }
//     };
    
//     fetchProducts();
//   }, [slug]);


const addProductToCart = (product) => {
    addToCart(product);
    setSlidingCartOpen(true);
  };

  const navigateToProductDetail = (productId) => {
    navigate(`/product/${productId}`);
  };

  // const navigateToSecondHand = () => {
  //   navigate(`/product/${productId}`);
  // }

  const renderStars = (rating) => {
    const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating || 0;
    return [...Array(5)].map((_, i) => (
      <span key={i} style={{ color: i < numericRating ? "#FFD700" : "#ccc", fontSize: "23px" }}>★</span>
    ));
  };

  const getProductRating = (product) => {
    // First try to get rating from local storage
    const storedRating = localStorage.getItem(`rating_${product.id}`);
    if (storedRating) return JSON.parse(storedRating);
    
    // Otherwise use the rating from the API response
    return product.avg_rating ? parseFloat(product.avg_rating) : 0;
  };


  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">Error: {error}</div>;


  if (!loading && !error && categoryData.length === 0) {
    return (
      <main>
        <Navbar />
        <div className="catalog">
          <div className="catalog_container">
            <div className="no-products-message">
              {/* <img src="/empty-state.svg" alt="No products" className="empty-state-img" /> */}
              <Typography variant="h5" className="empty-state-title">
                There are currently no selling products in this category.
              </Typography>
              {/* <Typography variant="body1" className="empty-state-text">
                There are currently no selling products in this category.
              </Typography> */}
              <button 
                className="browse-categories-btn"
                onClick={() => navigate('/catalog')}
              >
                Browse Other Selling Products
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
    <Navbar />
    <div className="catalog">
      <div className="catalog_container">
        {/* <button className='secondhand_button' onClick={() => navigate('/secondhand-category/:slug')}>Second hand products</button> */}
        <div className="products">
          {categoryData.map((product) => {
            const averageRating = getProductRating(product);

            return (
              <div className="product_card" key={product.id}>
                <div className="product_header">
                  <div className="product_title" onClick={() => navigateToProductDetail(product.id)}>
                    <p>{product.title}</p>
                  </div>
                  <div className="product_price">
                    <b>Rs.{product.price}</b>
                    {/* <p>{product.condition}</p>
                    <p>{product.rental?"TRUE": "False"}</p> */}
                  </div>
                </div>

                <div className="product_body">
                  <div className="pro_image" onClick={() => navigateToProductDetail(product.id)}>
                    <img src={product.image} alt={product.title} />
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
                    <button className='add_to_cart_button' onClick={() => addProductToCart(product)}>
                      BUY NOW
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

export default CategoryCatalog;

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from './cartContext';
// import './catalog.css';
// import SlidingCart from './slidingCart';
// import Navbar from '../Navbar/navbar1';
// import axios from 'axios';

// // Create consistent axios instance
// const api = axios.create({
//   baseURL: 'http://localhost:3000/api',
//   withCredentials: true
// });

// const Catalog = () => {
//   const { addToCart, error: cartError, loading: cartLoading } = useCart();
//   const navigate = useNavigate();
//   const [isSlidingCartOpen, setSlidingCartOpen] = useState(false);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [addingToCart, setAddingToCart] = useState(null); // Track which product is being added

//   // Fetch products from database
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         console.log("Fetching products...");
//         const response = await api.get("/products/getAllProducts");
        
//         console.log("Response received:", response.data);
        
//         // Check if response has data property
//         if (response.data && (response.data.data || Array.isArray(response.data))) {
//           // Handle both possible response formats
//           const productsData = Array.isArray(response.data) ? response.data : 
//                               (response.data.data ? response.data.data : []);
          
//           setProducts(productsData);
          
//           // Store products in localStorage for later use in product detail page
//           localStorage.setItem('cachedProducts', JSON.stringify(productsData));
//         } else {
//           console.error("Unexpected response format:", response.data);
//           setError("Invalid data format received from server");
//         }
        
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching products:", err);
//         setError(err.message || "Failed to fetch products");
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const addProductToCart = async (product) => {
//     console.log("Adding product to cart:", product);
//     const productId = product.id || product.product_id;
    
//     try {
//       setAddingToCart(productId); // Set the product being added
//       const success = await addToCart(product);
      
//       if (success) {
//         setSlidingCartOpen(true);
//       } else {
//         // Show a more user-friendly message
//         alert(cartError || "Failed to add product to cart. Please try again.");
//       }
//     } catch (err) {
//       console.error("Error in addProductToCart:", err);
//       alert("An unexpected error occurred. Please try again.");
//     } finally {
//       setAddingToCart(null); // Clear the adding state
//     }
//   };

//   const navigateToProductDetail = (productId) => {
//     navigate(`/product/${productId}`);
//   };

//   const renderStars = (rating) => {
//     const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating || 0;
//     return [...Array(5)].map((_, i) => (
//       <span key={i} style={{ color: i < numericRating ? "#FFD700" : "#ccc", fontSize: "23px" }}>★</span>
//     ));
//   };

//   const getProductRating = (product) => {
//     // First try to get rating from local storage
//     const storedRating = localStorage.getItem(`rating_${product.id || product.product_id}`);
//     if (storedRating) return JSON.parse(storedRating);
    
//     // Otherwise use the rating from the API response
//     return product.avg_rating ? parseFloat(product.avg_rating) : 0;
//   };

//   if (loading) return <div className="loading">Loading products...</div>;
//   if (error) return <div className="error">Error: {error}</div>;
//   if (!products || products.length === 0) return <div className="no-products">No products available</div>;

//   return (
//     <main>
//       <Navbar />
//       <div className="catalog">
//         <div className="catalog_container">
//           <div className="products">
//             {products.map((product) => {
//               const averageRating = getProductRating(product);
//               const productId = product.id || product.product_id;
//               const isAddingThisProduct = addingToCart === productId;

//               return (
//                 <div className="product_card" key={productId}>
//                   <div className="product_header">
//                     <div className="product_title" onClick={() => navigateToProductDetail(productId)}>
//                       <p>{product.title || product.name}</p>
//                     </div>
//                     <div className="product_price">
//                       <b>Rs.{product.price}</b>
//                     </div>
//                   </div>

//                   <div className="product_body">
//                     <div className="pro_image" onClick={() => navigateToProductDetail(productId)}>
//                       <img src={product.image} alt={product.title || product.name} />
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
//                       <button 
//                         className='add_to_cart_button' 
//                         onClick={() => addProductToCart(product)}
//                         disabled={isAddingThisProduct || cartLoading}
//                       >
//                         {isAddingThisProduct ? 'ADDING...' : 'BUY NOW'}
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

// export default Catalog;