import React, { useState } from 'react';
import './ExhibitionModal.css';
import ArtworkModal from '../artworks/ArtworkModal';

const mockArtists = [
  'אמן א',
  'אמן ב',
  'אמן ג',
  'אמן ד',
  'אמן ה',
];

function ExhibitionModal({ isOpen, onClose, onSave }) {
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

  const handleAddArtwork = (data) => {
    setForm((prev) => ({ ...prev, artworks: [...prev.artworks, data] }));
  };

  const handleEditArtwork = (data) => {
    setForm((prev) => ({
      ...prev,
      artworks: prev.artworks.map((art, idx) => idx === editingArtworkIdx ? data : art),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const filteredArtists = mockArtists.filter(a => a.includes(form.artistSearch) && !form.artists.includes(a));

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className="modal-title">הוסף תערוכה חדשה</h2>
        <form className="modal-form" onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '0 auto', padding: '0 1rem' }}>
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
          {/* Section 2: Dates and Status */}
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
            </div>
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
          </div>
          {/* Section 4: Artists */}
          <div className="modal-section">
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
          {/* Section 5: Artworks */}
          <div className="modal-section">
            <div className="modal-field">
              <label>יצירות אמנות</label>
              <button type="button" onClick={() => { setEditingArtworkIdx(null); setArtworkModalOpen(true); }} style={{ marginBottom: 8 }}>הוסף יצירה</button>
              <ul>
                {form.artworks.map((art, idx) => (
                  <li key={idx}>
                    {art.name} - {art.artist}
                    <button type="button" onClick={() => { setEditingArtworkIdx(idx); setArtworkModalOpen(true); }}>ערוך</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button className="modal-save" type="submit">שמור תערוכה</button>
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
      </div>
    </div>
  );
}

export default ExhibitionModal;