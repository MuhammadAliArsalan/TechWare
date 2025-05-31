import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Rating, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import Navbar from '../Navbar/navbar1';
import { useNavigate } from 'react-router-dom';
import { useCart } from './cartContext';
import './catalog.css';
import SlidingCart from './slidingCart';


const SecondhandRentalCategoryCatalog = () => {
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [isSlidingCartOpen, setSlidingCartOpen] = useState(false);
    const { slug } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);  
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rentalCategoryData, setRentalCategoryData] = useState([]);


useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching rental category...");
        // Simplified request - no authentication headers
        console.log(`Fetching products for rental category: ${slug}`);
        const response = await axios.get(`http://localhost:3000/api/categories/getCategory/${slug}/rental`);
        
        console.log("Rental Category Catalog Response received:", response.data);
        console.log("1Current products state:", rentalCategoryData)
        
        // Check if response has data property
        if (response.data && (response.data.data || Array.isArray(response.data))) {
          // Handle both possible response formats
          const categoriesData = Array.isArray(response.data) ? response.data : 
                              (response.data.data ? response.data.data : []);
          
            setRentalCategoryData(categoriesData);
          console.log("2Current products state:", rentalCategoryData)
          // console.log("The products are:", products);
        } else {
          console.error("Unexpected response format:", response.data);
          setError("Invalid data format received from server");
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching rental category:", err);
        setError(err.message || "Failed to fetch the category");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  useEffect(() => {
          console.log("3Current products state:", rentalCategoryData);
        }, [rentalCategoryData]);

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

  return (
    <main>
    <Navbar />
    <div className="catalog">
      <div className="catalog_container">
        <button className='secondhand_button' onClick={() => navigate('/secondhandCatalog')}>Second hand products</button>
        <div className="products">
          {rentalCategoryData.map((product) => {
            const averageRating = getProductRating(product);

            return (
              <div className="product_card" key={product.id}>
                <div className="product_header">
                  <div className="product_title" onClick={() => navigateToProductDetail(product.id)}>
                    <p>{product.title}</p>
                  </div>
                  <div className="product_price">
                    <b>Rs.{product.price}</b>
                    {/* <p>{product.condition}</p> */}
                    {/* <p>{product.rental?"TRUE": "False"}</p> */}
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

export default SecondhandRentalCategoryCatalog;