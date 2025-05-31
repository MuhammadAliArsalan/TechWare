import React from "react";
import "./StatCard.css";

const StatCard = ({ title, value, icon, trend }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        {trend && (
          <div className={`stat-trend ${trend.direction}`}>
            {trend.direction === "up" ? "↑" : "↓"} {trend.value}%
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;