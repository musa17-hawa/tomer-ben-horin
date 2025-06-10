import React, { useState } from 'react';
import './Card.css';
import CardActionsMenu from './CardActionsMenu';
import DeleteConfirmModal from './DeleteConfirmModal';

function Card({ title, count, date, status, image, onDelete, onCreateLabels, onEdit, onDetails }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    setMenuOpen(false);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setDeleteModalOpen(false);
    if (onDelete) onDelete();
  };

  return (
    <div className="card-root" style={{ position: 'relative' }}>
      {image && <img src={image} alt={title} className="card-image" />}
      <div className="card-header">
        <span className="card-title">{title}</span>
        <span className="card-count">{count} תערוכות</span>
        <span className="card-date">{date}</span>
        <span className={`card-status ${status === 'פתוחה' ? 'open' : 'closed'}`}>{status}</span>
      </div>
      <div className="card-actions">
        <button className="card-btn edit" onClick={onEdit}>עריכה <span className="card-edit-icon">&#9998;</span></button>
        <button className="card-btn more" onClick={() => setMenuOpen((v) => !v)}>פעולות נוספות</button>
        {menuOpen && (
          <CardActionsMenu
            onDelete={handleDelete}
            onCreateLabels={onCreateLabels}
            onClose={() => setMenuOpen(false)}
            style={{ left: 0, top: 40 }}
          />
        )}
      </div>
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}

export default Card; 