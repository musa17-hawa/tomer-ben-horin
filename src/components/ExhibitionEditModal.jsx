import React, { useState, useEffect } from 'react';
import './ExhibitionModal.css';
import ArtworkModal from './ArtworkModal';

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
    status: 'upcoming',
    artworks: [],
  });
  const [artworkModalOpen, setArtworkModalOpen] = useState(false);
  const [editingArtworkIdx, setEditingArtworkIdx] = useState(null);

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
        status: exhibition.status || 'upcoming',
        artworks: exhibition.artworks || [],
      });
    }
  }, [exhibition, isOpen]);

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

  const handleDeleteArtwork = (idx) => {
    setForm((prev) => ({
      ...prev,
      artworks: prev.artworks.filter((_, i) => i !== idx),
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
        <h2 className="modal-title">ערוך תערוכה</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-row">
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
          <div className="modal-row">
            <div className="modal-field">
              <label>תאריך פתיחה</label>
              <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
            </div>
            <div className="modal-field">
              <label>תאריך סגירה</label>
              <input name="endDate" type="date" value={form.endDate} onChange={handleChange} required />
            </div>
          </div>
          <div className="modal-field">
            <label>סטטוס</label>
            <select name="status" value={form.status} onChange={handleChange} required>
              <option value="upcoming">מתקרב</option>
              <option value="ongoing">פעיל</option>
              <option value="past">הסתיים</option>
            </select>
          </div>
          <div className="modal-field">
            <label>תמונת תערוכה</label>
            <input name="image" type="file" accept="image/*" onChange={handleChange} />
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
          <div className="modal-field">
            <label>יצירות אמנות</label>
            <button type="button" onClick={() => { setEditingArtworkIdx(null); setArtworkModalOpen(true); }}>הוסף יצירה</button>
            <ul>
              {form.artworks.map((art, idx) => (
                <li key={idx}>
                  {art.name} - {art.artist}
                  <button type="button" onClick={() => { setEditingArtworkIdx(idx); setArtworkModalOpen(true); }}>ערוך</button>
                  <button type="button" onClick={() => handleDeleteArtwork(idx)}>מחק</button>
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
      </div>
    </div>
  );
}

export default ExhibitionEditModal; 