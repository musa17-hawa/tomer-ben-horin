import React, { useState } from 'react';
import '../exhibitions/ExhibitionDetailsModal.css';
import ArtworkModal from './ArtworkModal';
import { updateExhibition } from '../../services/exhibitionService';

function ExhibitionDetailsModal({ isOpen, onClose, exhibition, onUpdateArtworks }) {
  const [tab, setTab] = useState('details');
  const [search, setSearch] = useState('');
  const [artworkModalOpen, setArtworkModalOpen] = useState(false);
  const [editingArtworkIdx, setEditingArtworkIdx] = useState(null);

  if (!isOpen) return null;

  const artworks = exhibition?.artworks || [];
  const filteredArtworks = artworks.filter(a => a.name && a.name.includes(search));

  const handleAddArtwork = async (data) => {
    // Auto-approve artwork created by admin
    const newArtwork = {
      ...data,
      approved: true,
      createdByAdmin: true,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    
    const newArtworks = [...artworks, newArtwork];
    
    try {
      // Update the exhibition in Firebase
      await updateExhibition(exhibition.id, {
        ...exhibition,
        artworks: newArtworks
      });
      
      // Update local state
      onUpdateArtworks(newArtworks);
      setArtworkModalOpen(false);
    } catch (error) {
      console.error('Error saving artwork:', error);
      alert('שגיאה בשמירת היצירה');
    }
  };

  const handleEditArtwork = async (data) => {
    // Auto-approve edited artwork by admin
    const updatedArtwork = {
      ...data,
      approved: true,
      createdByAdmin: true
    };
    
    const newArtworks = artworks.map((art, idx) => 
      idx === editingArtworkIdx ? updatedArtwork : art
    );
    
    try {
      // Update the exhibition in Firebase
      await updateExhibition(exhibition.id, {
        ...exhibition,
        artworks: newArtworks
      });
      
      // Update local state
      onUpdateArtworks(newArtworks);
      setArtworkModalOpen(false);
      setEditingArtworkIdx(null);
    } catch (error) {
      console.error('Error updating artwork:', error);
      alert('שגיאה בעדכון היצירה');
    }
  };

  const handleDeleteArtwork = async (idx) => {
    const newArtworks = artworks.filter((_, i) => i !== idx);
    
    try {
      // Update the exhibition in Firebase
      await updateExhibition(exhibition.id, {
        ...exhibition,
        artworks: newArtworks
      });
      
      // Update local state
      onUpdateArtworks(newArtworks);
    } catch (error) {
      console.error('Error deleting artwork:', error);
      alert('שגיאה במחיקת היצירה');
    }
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
                <div>{exhibition?.title || ''}</div>
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
                <div>{exhibition?.startDate || ''}</div>
              </div>
              <div className="details-field">
                <label>תאריך סגירה</label>
                <div>{exhibition?.endDate || ''}</div>
              </div>
            </div>
            <div className="details-field">
              <label>אמנים משתתפים</label>
              <div>{(exhibition?.artists || []).join(', ')}</div>
            </div>
            <div className="details-field">
              <label>סטטוס</label>
              <div>{exhibition?.status === 'open' ? 'פתוחה' : 'סגורה'}</div>
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
              {filteredArtworks.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#666' }}>
                  {search ? 'לא נמצאו יצירות התואמות לחיפוש' : 'אין יצירות בתערוכה זו'}
                </div>
              ) : (
                filteredArtworks.map((art, idx) => (
                  <div className="artwork-card" key={idx}>
                    <img 
                      src={art.imageUrl || "https://via.placeholder.com/200"} 
                      alt={art.name || 'יצירה'} 
                      className="artwork-image" 
                    />
                    <div className="artwork-info">
                      <div className="artwork-name">{art.name || 'ללא שם'}</div>
                      <div className="artwork-artist">{art.artist || 'אמן לא ידוע'}</div>
                      {art.price && <div className="artwork-price">₪{art.price}</div>}
                      {art.approved && (
                        <div style={{ color: 'green', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                          ✓ מאושר
                        </div>
                      )}
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
                      <button
                        className="artwork-edit"
                        style={{ backgroundColor: '#ff6b6b', borderColor: '#ff6b6b' }}
                        onClick={() => handleDeleteArtwork(idx)}
                      >
                        מחק
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <ArtworkModal
              isOpen={artworkModalOpen}
              onClose={() => {
                setArtworkModalOpen(false);
                setEditingArtworkIdx(null);
              }}
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