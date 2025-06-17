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
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleDelete = () => {
    setMenuOpen(false);
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
          borderRadius: 16,
          padding: "6px 0",
          fontWeight: "bold",
          margin: "12px 0",
          textAlign: "center",
        }}
      >
        {statusLabel}
      </span>
      <div className="card-actions">
        <button className="card-btn more" onClick={onDetails}>
          פעולות נוספות
        </button>
        <button
          className="card-btn artworks"
          onClick={handleViewExhibitions}
        >
          צפייה בתערוכות
        </button>
        <button className="card-btn edit" onClick={onEdit}>
          עריכה <span className="card-edit-icon">&#9998;</span>
        </button>
        <button className="card-btn delete" onClick={handleDelete}>
          <span role="img" aria-label="delete">
            🗑️
          </span>
        </button>
      </div>
    </div>
  );
}

export default GalleryCard;