import React from "react";
import "./ProductRatingsTable.css";

const ProductRatingsTable = ({ products }) => {
  // Sort products by average rating (highest first)
  const sortedProducts = [...products].sort((a, b) => b.average_rating - a.average_rating);

  const renderStars = (rating) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={`star ${star <= Math.round(rating) ? "filled" : ""}`}
          >
            ★
          </span>
        ))}
        <span className="rating-number">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="product-ratings-table">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Rating</th>
            <th>Total Reviews</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map((product) => (
            <tr key={product.product_id}>
              <td>{product.name}</td>
              <td className="rating-cell">{renderStars(product.average_rating)}</td>
              <td>{product.review_count}</td>
            </tr>
          ))}
          {sortedProducts.length === 0 && (
            <tr>
              <td colSpan="3" className="no-data">No product ratings available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductRatingsTable;