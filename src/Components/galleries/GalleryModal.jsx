import React, { useState } from 'react';
import '../exhibitions/ExhibitionModal.css';

function GalleryModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    title: '',
    location: '',
    description: '',
    image: null,
    status: 'open',
    imageUrl: '',
  });
  const [previewImage, setPreviewImage] = useState(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className="modal-title">הוסף גלריה חדשה</h2>
        <form className="modal-form" onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '0 auto', padding: '0 1rem' }}>
          {/* Section 1: Basic Info */}
          <div className="modal-section">
            <div className="modal-row two-cols">
              <div className="modal-field">
                <label>שם הגלריה</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="הכנס שם גלריה" required />
              </div>
              <div className="modal-field">
                <label>מיקום</label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="הכנס מיקום" required />
              </div>
            </div>
            <div className="modal-field">
              <label>תיאור</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="הכנס תיאור הגלריה" />
            </div>
          </div>
          {/* Section 2: Status */}
          <div className="modal-section">
            <div className="modal-row two-cols">
              <div className="modal-field">
                <label>סטטוס</label>
                <select name="status" value={form.status} onChange={handleChange} required>
                  <option value="open">פתוחה</option>
                  <option value="closed">סגורה</option>
                </select>
              </div>
            </div>
          </div>
          {/* Section 3: Image */}
          <div className="modal-section">
            <div className="modal-field">
              <label>תמונת גלריה</label>
              <div className="custom-image-upload">
                <img
                  src={previewImage || form.imageUrl || "https://via.placeholder.com/140"}
                  alt="Gallery Preview"
                  style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px', border: '1px solid #eee' }}
                />
                <input
                  id="gallery-image-upload"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="gallery-image-upload" className="custom-upload-btn">
                  {previewImage || form.imageUrl ? 'שנה תמונה' : 'העלאת תמונה'}
                </label>
              </div>
            </div>
          </div>
          <button className="modal-save" type="submit">שמור גלריה</button>
        </form>
      </div>
    </div>
  );
}

export default GalleryModal;