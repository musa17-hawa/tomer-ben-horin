import React, { useEffect, useRef } from 'react';
import './CardActionsMenu.css';

function CardActionsMenu({ onDelete, onCreateLabels, onClose, style }) {
  const menuRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="card-actions-menu" ref={menuRef} style={style}>
      <button className="card-actions-menu-item delete" onClick={onDelete}>מחק תערוכה</button>
      <button className="card-actions-menu-item" onClick={onCreateLabels}>יצור לייבלים</button>
    </div>
  );
}

export default CardActionsMenu; 