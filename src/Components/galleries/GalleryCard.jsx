import React, { useState } from "react";
import "../exhibitions/Card.css";
import { useNavigate } from "react-router-dom";

function GalleryCard({
  title,
  description,
  imageUrl,
  status,
  location,
  onDelete,
  onEdit,
  onDetails,
  galleryId,
}) {
  const navigate = useNavigate();

  const handleDelete = () => {
    if (onDelete) onDelete();
  };

  const handleViewExhibitions = () => {
    navigate(`/gallery/${galleryId}/exhibitions`);
  };

  // Status badge
  const statusLabel = status === "open" ? "פתוחה" : "סגורה";
  const statusClass = status === "open" ? "open" : "closed";

  return (
    <div className="card-root" style={{ position: "relative" }}>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="card-image"
          style={{
            width: "100%",
            height: "160px",
            objectFit: "cover",
            borderRadius: "12px 12px 0 0",
            marginBottom: "12px",
          }}
        />
      )}
      <div
        className="card-header"
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
      >
        <span
          className="card-title"
          style={{ fontWeight: "bold", fontSize: "1.3em" }}
        >
          {title}
        </span>
      </div>
      {description && (
        <div
          className="card-description"
          style={{
            color: "#444",
            fontSize: "1em",
            marginBottom: 8,
            marginTop: 2,
            minHeight: 32,
          }}
        >
          {description}
        </div>
      )}
      {location && (
        <div
          className="card-location"
          style={{ color: "#888", fontSize: "0.98em", marginBottom: 6 }}
        >
          {location}
        </div>
      )}
      <span
        className={`card-status-badge ${statusClass}`}
        style={{
          display: "block",
          background: status === "open" ? "#e6f7f2" : "#fde6ec",
          color: status === "open" ? "#1bbf83" : "#e42b60",
          borderRadius: 20,
          padding: "12px 0",
          fontWeight: "bold",
          margin: "16px 0",
          textAlign: "center",
          fontSize: "1.1rem",
          boxShadow: status === "open" 
            ? "0 4px 12px rgba(27, 191, 131, 0.3)" 
            : "0 4px 12px rgba(228, 43, 96, 0.3)",
        }}
      >
        {statusLabel}
      </span>
      <div className="card-actions" style={{ display: "flex", gap: "8px", justifyContent: "space-between" }}>
        <button 
          className="card-btn artworks"
          onClick={handleViewExhibitions}
          style={{ flex: "1", padding: "10px 8px", fontSize: "0.95rem" }}
        >
          צפייה בתערוכות
        </button>
        <button 
          className="card-btn edit" 
          onClick={onEdit}
          style={{ flex: "1", padding: "10px 8px", fontSize: "0.95rem" }}
        >
          עריכה <span className="card-edit-icon">&#9998;</span>
        </button>
        <button 
          className="card-btn delete" 
          onClick={handleDelete}
          style={{ 
            width: "50px", 
            height: "50px", 
            minWidth: "50px", 
            minHeight: "50px",
            fontSize: "1.3rem"
          }}
        >
          <span role="img" aria-label="delete">
            🗑️
          </span>
        </button>
      </div>
    </div>
  );
}

export default GalleryCard;