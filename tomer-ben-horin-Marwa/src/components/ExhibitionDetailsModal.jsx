import React, { useState } from 'react';
import './ExhibitionDetailsModal.css';
import ArtworkModal from './ArtworkModal';

function ExhibitionDetailsModal({ isOpen, onClose, exhibition, onUpdateArtworks }) {
  const [tab, setTab] = useState('details');
  const [search, setSearch] = useState('');
  const [artworkModalOpen, setArtworkModalOpen] = useState(false);
  const [editingArtworkIdx, setEditingArtworkIdx] = useState(null);

  if (!isOpen) return null;

  const artworks = exhibition?.artworks || [];
  const filteredArtworks = artworks.filter(a => a.name.includes(search));

  const handleAddArtwork = (data) => {
    const newArtworks = [...artworks, {
      ...data,
      image: data.image ? URL.createObjectURL(data.image) : undefined,
    }];
    onUpdateArtworks(newArtworks);
  };

  const handleEditArtwork = (data) => {
    const newArtworks = artworks.map((art, idx) => idx === editingArtworkIdx ? {
      ...art,
      ...data,
      image: data.image ? URL.createObjectURL(data.image) : art.image,
    } : art);
    onUpdateArtworks(newArtworks);
  };

  return (
    <div className="details-modal-backdrop">
      <div className="details-modal-container">
        <button className="details-modal-close" onClick={onClose}>×</button>
        <h2 className="details-modal-title">פרטי תערוכה</h2>
        <div className="details-modal-tabs">
          <button className={tab === 'details' ? 'active' : ''} onClick={() => setTab('details')}>פרטי תערוכה</button>
          <button className={tab === 'artworks' ? 'active' : ''} onClick={() => setTab('artworks')}>יצירות אמנות</button>
        </div>
        {tab === 'details' && (
          <div className="details-modal-content">
            <div className="details-row">
              <div className="details-field">
                <label>שם התערוכה</label>
                <div>{exhibition?.name || ''}</div>
              </div>
              <div className="details-field">
                <label>מיקום</label>
                <div>{exhibition?.location || ''}</div>
              </div>
            </div>
            <div className="details-field">
              <label>תיאור</label>
              <div>{exhibition?.description || ''}</div>
            </div>
            <div className="details-row">
              <div className="details-field">
                <label>תאריך פתיחה</label>
                <div>{exhibition?.openDate || ''}</div>
              </div>
              <div className="details-field">
                <label>תאריך סגירה</label>
                <div>{exhibition?.closeDate || ''}</div>
              </div>
            </div>
            <div className="details-field">
              <label>אמנים משתתפים</label>
              <div>{(exhibition?.artists || []).join(', ')}</div>
            </div>
          </div>
        )}
        {tab === 'artworks' && (
          <div className="artworks-tab-content">
            <div className="artworks-toolbar">
              <input
                className="artworks-search"
                type="text"
                placeholder="חפש לפי שם יצירה"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button
                className="artworks-add-btn"
                onClick={() => {
                  setEditingArtworkIdx(null);
                  setArtworkModalOpen(true);
                }}
              >
                הוסף יצירה +
              </button>
            </div>
            <div className="artworks-grid">
              {filteredArtworks.map((art, idx) => (
                <div className="artwork-card" key={idx}>
                  <img src={art.image} alt={art.name} className="artwork-image" />
                  <div className="artwork-info">
                    <div className="artwork-name">{art.name}</div>
                    <div className="artwork-artist">{art.artist}</div>
                    <div className="artwork-price">₪{art.price}</div>
                  </div>
                  <div className="artwork-actions">
                    <button
                      className="artwork-edit"
                      onClick={() => {
                        setEditingArtworkIdx(idx);
                        setArtworkModalOpen(true);
                      }}
                    >
                      ערוך
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <ArtworkModal
              isOpen={artworkModalOpen}
              onClose={() => setArtworkModalOpen(false)}
              onSave={editingArtworkIdx === null ? handleAddArtwork : handleEditArtwork}
              artwork={editingArtworkIdx !== null ? artworks[editingArtworkIdx] : null}
              isEdit={editingArtworkIdx !== null}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ExhibitionDetailsModal; 