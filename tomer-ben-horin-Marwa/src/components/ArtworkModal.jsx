import React, { useState, useEffect } from 'react';
import './ExhibitionModal.css';

const mockArtists = [
  'אמן א',
  'אמן ב',
  'אמן ג',
  'אמן ד',
  'אמן ה',
];

function ArtworkModal({ isOpen, onClose, onSave, artwork, isEdit }) {
  const [form, setForm] = useState({
    name: '',
    artist: '',
    description: '',
    image: null,
    price: '',
    dimensions: '',
    year: '',
    medium: '',
  });

  useEffect(() => {
    if (artwork) {
      setForm({
        name: artwork.name || '',
        artist: artwork.artist || '',
        description: artwork.description || '',
        image: null,
        price: artwork.price || '',
        dimensions: artwork.dimensions || '',
        year: artwork.year || '',
        medium: artwork.medium || '',
      });
    } else {
      setForm({
        name: '',
        artist: '',
        description: '',
        image: null,
        price: '',
        dimensions: '',
        year: '',
        medium: '',
      });
    }
  }, [artwork, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleArtistSearch = (e) => {
    setForm((prev) => ({ ...prev, artistSearch: e.target.value }));
  };

  const handleArtistSelect = (artist) => {
    setForm((prev) => ({ ...prev, artist, artistSearch: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const filteredArtists = mockArtists.filter(a => a.includes(form.artistSearch));

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className="modal-title">{isEdit ? 'ערוך יצירה' : 'הוסף יצירה חדשה'}</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-row">
            <div className="modal-field">
              <label>שם היצירה</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="הכנס שם יצירה" required />
            </div>
            <div className="modal-field">
              <label>אמן</label>
              <input name="artist" value={form.artist} onChange={handleChange} placeholder="הכנס שם אמן" required />
            </div>
          </div>
          <div className="modal-field">
            <label>תיאור</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="הכנס תיאור היצירה" />
          </div>
          <div className="modal-row">
            <div className="modal-field">
              <label>מחיר</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="הכנס מחיר" />
            </div>
            <div className="modal-field">
              <label>מידות</label>
              <input name="dimensions" value={form.dimensions} onChange={handleChange} placeholder="הכנס מידות" />
            </div>
          </div>
          <div className="modal-row">
            <div className="modal-field">
              <label>שנת יצירה</label>
              <input name="year" type="number" value={form.year} onChange={handleChange} placeholder="הכנס שנת יצירה" />
            </div>
            <div className="modal-field">
              <label>טכניקה</label>
              <input name="medium" value={form.medium} onChange={handleChange} placeholder="הכנס טכניקה" />
            </div>
          </div>
          <div className="modal-field">
            <label>תמונה</label>
            <input name="image" type="file" accept="image/*" onChange={handleChange} />
          </div>
          <button className="modal-save" type="submit">{isEdit ? 'שמור שינויים' : 'הוסף יצירה'}</button>
        </form>
      </div>
    </div>
  );
}

export default ArtworkModal; 