import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './cartContext';
import './catalog.css';
import SlidingCart from './slidingCart';
import Navbar from '../Navbar/navbar1';
import axios from 'axios';

const RentalSecondhandCatalog = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isSlidingCartOpen, setSlidingCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching products...");
        // Simplified request - no authentication headers
        const response = await axios.get("http://localhost:3000/api/products/listRentalSecondHand");
        
        console.log("Response received:", response.data);
        
        // Check if response has data property
        if (response.data && (response.data.data || Array.isArray(response.data))) {
          // Handle both possible response formats
          const productsData = Array.isArray(response.data) ? response.data : 
                              (response.data.data ? response.data.data : []);
          
          setProducts(productsData);
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

  // useEffect(() => {
  //         console.log("3Current products state:", products);
  //       }, [products]);

  // Add this to your product listing page where you get all products
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products/listRentalSecondHand');
      const products = response.data.data;
      
      // Store products in localStorage for later use in product detail page
      localStorage.setItem('cachedProducts', JSON.stringify(products));
      
      setProducts(products); // Your existing state update
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  fetchProducts();
}, []);

  const addProductToCart = (product) => {
    addToCart(product);
    setSlidingCartOpen(true);
  };

  const navigateToProductDetail = (productId) => {
    navigate(`/product/${productId}`);
  };

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
  if (!products || products.length === 0) return <div className="no-products">No products available</div>;

  return (
    <main>
      <Navbar />
      <div className="catalog">
        <div className="catalog_container">
          <div className="products">
            {products.map((product) => {
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
                      {/* <p>{product.rental}</p> */}
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

export default RentalSecondhandCatalog;