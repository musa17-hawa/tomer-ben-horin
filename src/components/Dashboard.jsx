import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Card from './Card';
import ExhibitionModal from './ExhibitionModal';
import ExhibitionEditModal from './ExhibitionEditModal';
import ExhibitionDetailsModal from './ExhibitionDetailsModal';
import ArtistsPage from './ArtistsPage';
import Profile from './Profile';
import { 
  createExhibition, 
  getAllExhibitions, 
  updateExhibition, 
  deleteExhibition 
} from '../services/exhibitionService';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

const initialCardsData = [
  { title: 'תערוכה', count: 5, date: '11.6.2025', status: 'פתוחה' },
  { title: 'תערוכה', count: 4, date: '20.6.2025', status: 'סגורה' },
  { title: 'תערוכה', count: 3, date: '7.7.2025', status: 'פתוחה' },
  { title: 'תערוכה', count: 2, date: '22.6.2025', status: 'סגורה' },
  { title: 'תערוכה', count: 1, date: '28.5.2025', status: 'סגורה' },
  { title: 'תערוכה', count: 10, date: '17.5.2025', status: 'סגורה' },
  { title: 'תערוכה', count: 9, date: '30.6.2025', status: 'סגורה' },
  { title: 'תערוכה', count: 8, date: '9.6.2025', status: 'פתוחה' },
  { title: 'תערוכה', count: 7, date: '27.6.2025', status: 'סגורה' },
  { title: 'תערוכה', count: 6, date: '17.6.2025', status: 'סגורה' },
];

const Dashboard = () => {
  const [cardsData, setCardsData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedExhibitionIdx, setSelectedExhibitionIdx] = useState(null);
  const [showArtists, setShowArtists] = useState(false);
  const [editingArtist, setEditingArtist] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadExhibitions();
  }, []);

  const loadExhibitions = async () => {
    try {
      setLoading(true);
      const data = await getAllExhibitions();
      setCardsData(data);
    } catch (err) {
      setError('Failed to load exhibitions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    try {
      const storageRef = ref(storage, `exhibitions/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      console.log("Upload snapshot:", snapshot);
      return await getDownloadURL(storageRef);
    } catch (err) {
      console.error("Image upload failed:", err);
      return null;
    }
  };

  const handleAddExhibition = async (data) => {
    try {
      setLoading(true);
      let imageUrl = data.imageUrl;
      if (data.image) {
        imageUrl = await uploadImage(data.image);
      }

      const exhibitionData = {
        ...data,
        imageUrl,
        image: data.image ? data.image : null
      };

      await createExhibition(exhibitionData);
      await loadExhibitions();
    } catch (err) {
      setError('Failed to add exhibition');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditExhibition = async (data) => {
    try {
      setLoading(true);
      const exhibition = cardsData[selectedExhibitionIdx];
      let imageUrl = exhibition.imageUrl;
      
      if (data.image) {
        imageUrl = await uploadImage(data.image);
      }

      const exhibitionData = {
        ...data,
        imageUrl,
        image: undefined
      };

      await updateExhibition(exhibition.id, exhibitionData);
      await loadExhibitions();
    } catch (err) {
      setError('Failed to update exhibition');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async (idx) => {
    try {
      setLoading(true);
      const exhibition = cardsData[idx];
      await deleteExhibition(exhibition.id);
      await loadExhibitions();
    } catch (err) {
      setError('Failed to delete exhibition');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLabels = (idx) => {
    alert('פונקציית יצור לייבלים תתווסף בקרוב');
  };

  const handleEditClick = (idx) => {
    setSelectedExhibitionIdx(idx);
    setEditModalOpen(true);
  };

  const handleDetailsClick = (idx) => {
    setSelectedExhibitionIdx(idx);
    setDetailsModalOpen(true);
  };

  const filteredCards = cardsData.filter(card => card.title.includes(search));

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="dashboard-root">
      <header className="dashboard-header">
        <img
          src="https://amutatbh.com/wp-content/uploads/2021/03/logo-new.svg"
          alt="לוגו"
          className="dashboard-logo"
        />
        <div className="dashboard-greeting">
          <span>ברוך הבא, אדמין</span>
        </div>
        <div className="dashboard-nav">
          <button
            className="dashboard-btn artists"
            onClick={() => setShowArtists(show => !show)}
          >
            {showArtists ? 'תערוכות' : 'אמנים'}
          </button>
        </div>
      </header>
      {showArtists ? (
        editingArtist ? (
          <Profile artist={editingArtist} onBack={() => setEditingArtist(null)} />
        ) : (
          <ArtistsPage onEditArtist={setEditingArtist} />
        )
      ) : (
        <>
          <div className="dashboard-actions">
            <button className="dashboard-btn add" onClick={() => setModalOpen(true)}>הוסף תערוכה +</button>
            <input
              className="dashboard-search"
              type="text"
              placeholder="חפש לפי שם תערוכה"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="dashboard-cards">
            {filteredCards.map((card, idx) => (
              <Card
                key={idx}
                {...card}
                onDelete={() => handleDeleteCard(idx)}
                onCreateLabels={() => handleCreateLabels(idx)}
                onEdit={() => handleEditClick(idx)}
              />
            ))}
          </div>
          <ExhibitionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleAddExhibition} />
          <ExhibitionEditModal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            onSave={handleEditExhibition}
            exhibition={selectedExhibitionIdx !== null ? cardsData[selectedExhibitionIdx] : null}
          />
          <ExhibitionDetailsModal
            isOpen={detailsModalOpen}
            onClose={() => setDetailsModalOpen(false)}
            exhibition={selectedExhibitionIdx !== null ? cardsData[selectedExhibitionIdx] : null}
            onUpdateArtworks={(newArtworks) => {
              setCardsData(cardsData.map((ex, idx) => idx === selectedExhibitionIdx ? { ...ex, artworks: newArtworks } : ex));
            }}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard; 