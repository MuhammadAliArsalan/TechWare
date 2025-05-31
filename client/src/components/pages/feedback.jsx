import React, { useState } from "react";
import "./feedback.css";

const cardsData = [
  { 
    id: 1, 
    name: "Haiqa Fatima", 
    email: "Haiqa@gmail.com", 
    content: "Not satisfied. The product didn't match the description. Hoping for better quality next time.",
    rating: 2 
  },
  { 
    id: 2, 
    name: "Samrah Fatima", 
    email: "Samrah@gmail.com", 
    content: "Loved it! The product works perfectly and met all my expectations.",
    rating: 5 
  },
  { 
    id: 3, 
    name: "Areesha Rehan", 
    email: "Areesha@gmail.com", 
    content: "Decent but could improve. Good overall, but the packaging needs improvement.",
    rating: 3 
  },
  { 
    id: 4, 
    name: "Ali Arsalan", 
    email: "Ali@gmail.com", 
    content: "Great quality! Really impressed with the material and durability.",
    rating: 4 
  },
];

const Cards = () => {
  const [activeCard, setActiveCard] = useState(null);

  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={`star ${star <= rating ? 'filled' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="feedback-container">
      <h1 className="feedback-heading">CUSTOMER FEEDBACK</h1>
      <p className="feedback-subheading">What our clients say about us</p>
      
      <div className="cards-container">
        {cardsData.map((card) => (
          <div
            key={card.id}
            className={`card ${activeCard === card.id ? "active" : ""} ${
              activeCard !== null && activeCard !== card.id ? "blurred" : ""
            }`}
            onClick={() => setActiveCard(card.id)}
          >
            {activeCard === card.id && (
              <button 
                className="close-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveCard(null);
                }}
              >
                ✖
              </button>
            )}
            
            <div className="card-header">
              <div className="avatar">{card.name.charAt(0)}</div>
              <div className="user-info">
                <h3>{card.name}</h3>
                <p>{card.email}</p>
              </div>
            </div>
            
            {renderStars(card.rating)}
            
            <div className="card-content">
              <p>"{card.content}"</p>
            </div>
            
            <div className="card-footer">
              <div className="date">May 15, 2024</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;
