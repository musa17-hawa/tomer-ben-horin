import React, { useState, useEffect } from 'react';
import './ExhibitionModal.css';
import ArtworkModal from '../artworks/ArtworkModal';

const mockArtists = [
  'אמן א',
  'אמן ב',
  'אמן ג',
  'אמן ד',
  'אמן ה',
];

function ExhibitionEditModal({ isOpen, onClose, onSave, exhibition }) {
  const [form, setForm] = useState({
    title: '',
    location: '',
    description: '',
    startDate: '',
    endDate: '',
    image: null,
    artists: [],
    artistSearch: '',
    status: 'open',
    artworks: [],
    imageUrl: '',
  });
  const [artworkModalOpen, setArtworkModalOpen] = useState(false);
  const [editingArtworkIdx, setEditingArtworkIdx] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (exhibition) {
      setForm({
        title: exhibition.title || '',
        location: exhibition.location || '',
        description: exhibition.description || '',
        startDate: exhibition.startDate || '',
        endDate: exhibition.endDate || '',
        image: null,
        artists: exhibition.artists || [],
        artistSearch: '',
        status: exhibition.status || 'open',
        artworks: exhibition.artworks || [],
        imageUrl: exhibition.imageUrl || '',
      });
      setPreviewImage(exhibition.imageUrl || null);
    } else {
      setPreviewImage(null);
    }
  }, [exhibition, isOpen]);

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
    if (!form.artists.includes(artist)) {
      setForm((prev) => ({ ...prev, artists: [...prev.artists, artist], artistSearch: '' }));
    }
  };

  const handleArtistRemove = (artist) => {
    setForm((prev) => ({ ...prev, artists: prev.artists.filter(a => a !== artist) }));
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddArtwork = (data) => {
    // Auto-approve artwork created by admin
    const newArtwork = {
      ...data,
      approved: true,
      createdByAdmin: true,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    
    setForm((prev) => ({ ...prev, artworks: [...prev.artworks, newArtwork] }));
    showToast('היצירה נוספה בהצלחה!');
  };

  const handleEditArtwork = (data) => {
    // Auto-approve edited artwork by admin
    const updatedArtwork = {
      ...data,
      approved: true,
      createdByAdmin: true
    };
    
    setForm((prev) => ({
      ...prev,
      artworks: prev.artworks.map((art, idx) => idx === editingArtworkIdx ? updatedArtwork : art),
    }));
    showToast('היצירה עודכנה בהצלחה!');
  };

  const handleDeleteArtwork = (idx) => {
    setForm((prev) => ({
      ...prev,
      artworks: prev.artworks.filter((_, i) => i !== idx),
    }));
    showToast('היצירה נמחקה בהצלחה!');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const filteredArtists = mockArtists.filter(a => a.includes(form.artistSearch) && !form.artists.includes(a));

  return (
    <div className="modal-backdrop">
      <div className="modal-container fullscreen">
        <div className="modal-header-bar">
          <button className="modal-back-link" onClick={onClose}>← חזרה למסך הראשי</button>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-content-centered">
          <h2 className="modal-title">ערוך תערוכה</h2>
          <form className="modal-form" onSubmit={handleSubmit} style={{ maxWidth: 700, margin: '0 auto', padding: '0 1rem' }}>
            {/* Section 1: Basic Info */}
            <div className="modal-section">
              <div className="modal-row two-cols">
                <div className="modal-field">
                  <label>שם התערוכה</label>
                  <input name="title" value={form.title} onChange={handleChange} placeholder="הכנס שם תערוכה" required />
                </div>
                <div className="modal-field">
                  <label>מיקום</label>
                  <input name="location" value={form.location} onChange={handleChange} placeholder="הכנס מיקום" required />
                </div>
              </div>
              <div className="modal-field">
                <label>תיאור</label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="הכנס תיאור התערוכה" />
              </div>
            </div>
            {/* Section 2: Dates + Status */}
            <div className="modal-section">
              <div className="modal-row two-cols">
                <div className="modal-field">
                  <label>תאריך פתיחה</label>
                  <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
                </div>
                <div className="modal-field">
                  <label>תאריך סגירה</label>
                  <input name="endDate" type="date" value={form.endDate} onChange={handleChange} required />
                </div>
                <div className="modal-field">
                  <label>סטטוס</label>
                  <select name="status" value={form.status} onChange={handleChange} required>
                    <option value="open">פתוחה</option>
                    <option value="closed">סגורה</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Section 3: Image Upload + Artists */}
            <div className="modal-section">
              <div className="modal-row two-cols">
                <div className="modal-field">
                  <label>תמונת תערוכה</label>
                  <div className="custom-image-upload">
                    <img
                      src={previewImage || form.imageUrl || "https://via.placeholder.com/140"}
                      alt="Exhibition Preview"
                      style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px', border: '1px solid #eee' }}
                    />
                    <input
                      id="exhibition-image-upload"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="exhibition-image-upload" className="custom-upload-btn">
                      {previewImage || form.imageUrl ? 'שנה תמונה' : 'העלאת תמונה'}
                    </label>
                  </div>
                </div>
                <div className="modal-field">
                  <label>אמנים משתתפים</label>
                  <div className="artist-search-container">
                    <input
                      type="text"
                      placeholder="בחר אמנים"
                      value={form.artistSearch}
                      onChange={handleArtistSearch}
                    />
                    {form.artistSearch && filteredArtists.length > 0 && (
                      <ul className="artist-dropdown">
                        {filteredArtists.map((artist) => (
                          <li key={artist} onClick={() => handleArtistSelect(artist)}>{artist}</li>
                        ))}
                      </ul>
                    )}
                    <div className="selected-artists">
                      {form.artists.map((artist) => (
                        <span key={artist} className="selected-artist">
                          {artist}
                          <button type="button" onClick={() => handleArtistRemove(artist)}>×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Section 4: Artworks */}
            <div className="modal-section">
              <div className="artworks-header-row">
                <span style={{ fontWeight: 'bold', fontSize: '1.1em' }}>יצירות אמנות</span>
                <button type="button" className="add-artwork-btn filled" onClick={() => { setEditingArtworkIdx(null); setArtworkModalOpen(true); }}>+ הוסף יצירה</button>
              </div>
              <ul className="artworks-list">
                {form.artworks.length === 0 && (
                  <li className="artwork-item-empty">לא נוספו יצירות עדיין</li>
                )}
                {form.artworks.map((art, idx) => (
                  <li key={idx} className="artwork-item">
                    {art.imageUrl && (
                      <img src={art.imageUrl} alt={art.name} className="artwork-thumb" />
                    )}
                    <span className="artwork-info" title={art.name + ' - ' + art.artist}>{art.name} - {art.artist}</span>
                    <button type="button" className="artwork-edit-btn" onClick={() => { setEditingArtworkIdx(idx); setArtworkModalOpen(true); }}>✏️ ערוך</button>
                    <button type="button" className="artwork-delete-btn" onClick={() => handleDeleteArtwork(idx)}>🗑️ מחק</button>
                    <div className="artwork-details-hover">
                      <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{art.name}</div>
                      <div style={{ color: '#e42b60', marginBottom: 4 }}>{art.artist}</div>
                      <div style={{ color: '#444', fontSize: '0.98em' }}>{art.description}</div>
                      {art.approved && (
                        <div style={{ color: 'green', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                          ✓ מאושר אוטומטית
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <button className="modal-save" type="submit">שמור שינויים</button>
          </form>
          <ArtworkModal
            isOpen={artworkModalOpen}
            onClose={() => setArtworkModalOpen(false)}
            onSave={(data) => {
              if (editingArtworkIdx === null) {
                handleAddArtwork(data);
              } else {
                handleEditArtwork(data);
              }
              setArtworkModalOpen(false);
              setEditingArtworkIdx(null);
            }}
            artwork={editingArtworkIdx !== null ? form.artworks[editingArtworkIdx] : null}
            isEdit={editingArtworkIdx !== null}
          />
          {toast && <div className="toast-message">{toast}</div>}
        </div>
      </div>
    </div>
  );
}

export default ExhibitionEditModal;