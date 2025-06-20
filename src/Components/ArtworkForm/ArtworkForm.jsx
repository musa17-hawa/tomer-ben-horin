import React from 'react';
import './ArtworkForm.css';
import { useNavigate, useLocation } from 'react-router-dom';

const ArtworkForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get exhibitionId from query string
  const searchParams = new URLSearchParams(location.search);
  const exhibitionId = searchParams.get('exhibitionId');

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="artwork-form-container">
      <h2 className="artwork-form-title">הוספת יצירת אמנות</h2>
      {exhibitionId && (
        <div className="artwork-form-exhibition-id">מספר תערוכה: {exhibitionId}</div>
      )}
      <form className="artwork-form">
        <div className="artwork-group">
          <label className="artwork-label">תמונה:</label>
          <input type="file" className="artwork-input" />
        </div>

        <div className="artwork-group">
          <label className="artwork-label">שם מלא של האמן:</label>
          <input type="text" className="artwork-input" />
        </div>

        <div className="artwork-group">
          <label className="artwork-label">תיאור היצירה:</label>
          <input type="text" className="artwork-input" />
        </div>

        <div className="artwork-group">
          <label className="artwork-label">מידות היצירה:</label>
          <input type="text" className="artwork-input" />
        </div>

        <div className="artwork-group">
          <label className="artwork-label">מחיר:</label>
          <input type="text" className="artwork-input" />
        </div>

        <div className="artwork-group">
          <label className="artwork-label">שם היצירה:</label>
          <input type="text" className="artwork-input" />
        </div>

        <div className="artwork-buttons">
          <button type="button" className="artwork-cancel" onClick={handleCancel}>ביטול</button>
          <button type="submit" className="artwork-submit">שלח יצירה</button>
        </div>
      </form>
    </div>
  );
};

export default ArtworkForm;
