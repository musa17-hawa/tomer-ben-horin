import React, { useState } from "react";
import "./Card.css";
import CardActionsMenu from "./CardActionsMenu";
import { useNavigate } from "react-router-dom";

function Card({
  title,
  description,
  imageUrl,
  status,
  startDate,
  endDate,
  onDelete,
  onCreateLabels,
  onEdit,
  onDetails,
  exhibitionId,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDelete = () => {
    setMenuOpen(false);
    if (onDelete) onDelete();
  };

  const handleConfirmDelete = () => {
    // This function is no longer needed in Card, as Dashboard will handle confirmation
  };

  // Format date range
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("he-IL");
  };
  const dateRange =
    startDate && endDate
      ? `${formatDate(startDate)} - ${formatDate(endDate)}`
      : "";

  // Status badge
  const statusLabel = status === "open" ? "פתוחה" : "סגורה";
  const statusClass = status === "open" ? "open" : "closed";
  const navigate = useNavigate();

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
      {dateRange && (
        <div
          className="card-date-range"
          style={{ color: "#888", fontSize: "0.98em", marginBottom: 6 }}
        >
          {dateRange}
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
        {/* noor */}
        <button
          className="card-btn artworks"
          onClick={() => navigate(`/admin-artworks-review/${exhibitionId}`)}
        >
          צפייה ביצירות
        </button>

        <button className="card-btn edit" onClick={onEdit}>
          עריכה <span className="card-edit-icon">&#9998;</span>
        </button>
        <button className="card-btn delete" onClick={handleDelete}>
          <span role="img" aria-label="delete">
            🗑️
          </span>
        </button>
        {menuOpen && (
          <CardActionsMenu
            onDelete={handleDelete}
            onCreateLabels={onCreateLabels}
            onClose={() => setMenuOpen(false)}
            style={{ left: 0, top: 40 }}
          />
        )}
      </div>
    </div>
  );
}

export default Card;
