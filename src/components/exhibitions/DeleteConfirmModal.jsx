import React from 'react';
import './DeleteConfirmModal.css';

function DeleteConfirmModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="delete-modal-backdrop">
      <div className="delete-modal-container">
        <div className="delete-modal-message">האם אתה בטוח שברצונך למחוק את התערוכה?</div>
        <div className="delete-modal-actions">
          <button className="delete-modal-btn delete" onClick={onConfirm}>מחק</button>
          <button className="delete-modal-btn cancel" onClick={onCancel}>ביטול</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal; 