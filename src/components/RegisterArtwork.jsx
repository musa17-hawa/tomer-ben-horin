import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, addDoc, Timestamp, doc, getDoc } from 'firebase/firestore';
import { uploadImageToImgBB } from '../firebase/config';
import './RegisterArtwork.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const RegisterArtwork = () => {
  const query = useQuery();
  const exhibitionId = query.get('exhibitionId');
  const [exhibitionName, setExhibitionName] = useState('');
  const [fullName, setFullName] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [description, setDescription] = useState('');
  const [size, setSize] = useState('');
  const [artworkName, setArtworkName] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const fullNameRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Fetch exhibition name
    const fetchExhibition = async () => {
      if (exhibitionId) {
        const docRef = doc(db, 'exhibitions', exhibitionId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setExhibitionName(docSnap.data().title || '');
        }
      }
    };
    fetchExhibition();
  }, [exhibitionId]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    } else {
      setImage(null);
      setImagePreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!fullName || !image || !description || !size || !artworkName) {
      setError('אנא מלא את כל השדות החובה.');
      return;
    }
    setLoading(true);
    try {
      // Upload image to ImgBB
      let uploadedImageUrl = '';
      if (image) {
        uploadedImageUrl = await uploadImageToImgBB(image);
      }
      // Save registration to Firestore
      await addDoc(collection(db, 'registrations'), {
        exhibitionId,
        fullName,
        imageUrl: uploadedImageUrl,
        description,
        size,
        artworkName,
        price: price.trim() === '' ? 'please contact artist' : price,
        createdAt: Timestamp.now(),
      });
      setSuccess(true);
      setFullName('');
      setImage(null);
      setImagePreview('');
      setDescription('');
      setSize('');
      setArtworkName('');
      setPrice('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      // Focus the first field after reset
      setTimeout(() => {
        if (fullNameRef.current) {
          fullNameRef.current.focus();
        }
      }, 100);
    } catch (err) {
      setError('אירעה שגיאה בשליחת הטופס.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-artwork-page">
      <div className="register-artwork-root">
        <h2 style={{ marginBottom: 8 }}>הרשמה לתערוכה</h2>
        {exhibitionName && <div style={{ textAlign: 'center', color: '#333', fontWeight: 500, fontSize: '1.1rem', marginBottom: 24 }}>{exhibitionName}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>שם מלא של האמן*:</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required className="form-input" ref={fullNameRef} />
          </div>
          <div className="form-group">
            <label>העלה תמונה של היצירה*:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} required className="form-input" ref={fileInputRef} />
            {imagePreview && <img src={imagePreview} alt="preview" className="image-preview" />}
          </div>
          <div className="form-group">
            <label>תיאור היצירה*:</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} required className="form-input" />
          </div>
          <div className="form-group">
            <label>מידות היצירה*:</label>
            <input type="text" value={size} onChange={e => setSize(e.target.value)} required className="form-input" />
          </div>
          <div className="form-group">
            <label>שם היצירה*:</label>
            <input type="text" value={artworkName} onChange={e => setArtworkName(e.target.value)} required className="form-input" />
          </div>
          <div className="form-group">
            <label>מחיר היצירה (אופציונלי):</label>
            <input type="text" value={price} onChange={e => setPrice(e.target.value)} placeholder="please contact artist" className="form-input" />
          </div>
          {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
          {success && <div style={{ color: 'green', marginBottom: 8 }}>ההרשמה בוצעה בהצלחה!</div>}
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button type="submit" className="exhibition-btn" disabled={loading}>
              {loading ? 'שולח...' : 'שלח הרשמה'}
            </button>
            <button
              type="button"
              className="back-btn"
              onClick={() => navigate('/user-dashboard')}
              style={{ background: '#fff', color: '#e42b60', border: '1.5px solid #e42b60', borderRadius: 8, fontWeight: 600, fontSize: '1.1rem', padding: '14px 0', minWidth: 120, cursor: 'pointer', transition: 'background 0.2s' }}
            >
              חזור
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterArtwork; 