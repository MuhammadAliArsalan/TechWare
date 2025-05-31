import React from "react";
import "./LoadingSpinner.css"; // We'll create this CSS file next

const LoadingSpinner = ({ message = "Loading seller analytics..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="spinner-chart">
            <div className="spinner-bar bar1"></div>
            <div className="spinner-bar bar2"></div>
            <div className="spinner-bar bar3"></div>
            <div className="spinner-bar bar4"></div>
            <div className="spinner-pie"></div>
          </div>
        </div>
        <h3 className="loading-text">{message}</h3>
        <div className="loading-progress">
          <div className="progress-bar">
            <div className="progress-value"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;