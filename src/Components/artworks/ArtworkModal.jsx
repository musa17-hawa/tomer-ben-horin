import React, { useState, useEffect } from 'react';
import '../exhibitions/ExhibitionModal.css';
import { uploadToImgBB } from '../../utils/imgbb';

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
    imageUrl: '',
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);

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
        imageUrl: artwork.imageUrl || '',
      });
      setPreviewImage(artwork.imageUrl || null);
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
        imageUrl: '',
      });
      setPreviewImage(null);
    }
  }, [artwork, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file' && files[0]) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArtistSearch = (e) => {
    setForm((prev) => ({ ...prev, artistSearch: e.target.value }));
  };

  const handleArtistSelect = (artist) => {
    setForm((prev) => ({ ...prev, artist, artistSearch: '' }));
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const errors = {};
    if (!form.name || form.name.length > 100) errors.name = "שם היצירה נדרש (עד 100 תווים)";
    if (!form.artist || form.artist.length > 60) errors.artist = "שם האמן נדרש (עד 60 תווים)";
    if (form.description && form.description.length > 500) errors.description = "תיאור עד 500 תווים";
    if (form.price && (isNaN(form.price) || Number(form.price) < 0)) errors.price = "מחיר חייב להיות מספר חיובי";
    if (form.dimensions && !/^\d+\s*[x\*]\s*\d+$/.test(form.dimensions)) errors.dimensions = "מידות בפורמט 80x50 או 80*50";
    if (form.year && (!/^\d{4}$/.test(form.year) || form.year < 1800 || form.year > new Date().getFullYear())) errors.year = "שנה בין 1800 לשנה הנוכחית";
    if (form.medium && form.medium.length > 60) errors.medium = "טכניקה עד 60 תווים";

    if (Object.keys(errors).length > 0) {
      alert(Object.values(errors).join('\n'));
      return;
    }

    setUploading(true);
    let imageUrl = form.imageUrl;
    if (form.image) {
      try {
        imageUrl = await uploadToImgBB(form.image);
      } catch (err) {
        alert('Image upload failed');
        setUploading(false);
        return;
      }
    }
    setUploading(false);
    onSave({
      ...form,
      imageUrl: imageUrl || null,
      image: null // Don't store the file object
    });
    showToast(isEdit ? 'היצירה עודכנה בהצלחה!' : 'היצירה נוספה בהצלחה!');
    setTimeout(() => onClose(), 1200);
  };

  const filteredArtists = mockArtists.filter(a => a.includes(form.artistSearch));

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className="modal-title">{isEdit ? 'ערוך יצירה' : 'הוסף יצירה חדשה'}</h2>
        <form className="modal-form" onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '0 auto', padding: '0 1rem' }}>
          {/* Section 1: Basic Info */}
          <div className="modal-section">
            <div className="modal-row two-cols">
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
          </div>
          {/* Section 2: Details */}
          <div className="modal-section">
            <div className="modal-row two-cols">
              <div className="modal-field">
                <label>מחיר</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="הכנס מחיר" />
              </div>
              <div className="modal-field">
                <label>מידות</label>
                <input name="dimensions" value={form.dimensions} onChange={handleChange} placeholder="הכנס מידות" />
              </div>
            </div>
            <div className="modal-row two-cols">
              <div className="modal-field">
                <label>שנת יצירה</label>
                <input name="year" type="number" value={form.year} onChange={handleChange} placeholder="הכנס שנת יצירה" />
              </div>
              <div className="modal-field">
                <label>טכניקה</label>
                <input name="medium" value={form.medium} onChange={handleChange} placeholder="הכנס טכניקה" />
              </div>
            </div>
          </div>
          {/* Section 3: Image */}
          <div className="modal-section">
            <div className="modal-field">
              <label>תמונה</label>
              <div className="custom-image-upload">
                <img
                  src={previewImage || form.imageUrl || "https://via.placeholder.com/140"}
                  alt="Artwork Preview"
                  style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px', border: '1px solid #eee' }}
                />
                <input
                  id="artwork-image-upload"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="artwork-image-upload" className="custom-upload-btn">
                  {previewImage || form.imageUrl ? 'שנה תמונה' : 'העלאת תמונה'}
                </label>
              </div>
            </div>
          </div>
          <button className="modal-save" type="submit" disabled={uploading}>{isEdit ? 'שמור שינויים' : 'הוסף יצירה'}</button>
        </form>
        {toast && <div className="toast-message">{toast}</div>}
      </div>
    </div>
  );
}

export default ArtworkModal; 