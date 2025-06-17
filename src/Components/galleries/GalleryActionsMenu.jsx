import React, { useEffect, useRef } from 'react';
import '../exhibitions/CardActionsMenu.css';

function GalleryActionsMenu({ onDelete, onExport, onViewExhibitions, onClose, style }) {
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
      <button className="card-actions-menu-item" onClick={onViewExhibitions}>צפה בתערוכות</button>
      <button className="card-actions-menu-item" onClick={onExport}>ייצא פרטי גלריה</button>
      <button className="card-actions-menu-item delete" onClick={onDelete}>מחק גלריה</button>
    </div>
  );
}

export default GalleryActionsMenu;