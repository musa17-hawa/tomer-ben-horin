import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

const MyExhibitions = () => {
  const [myExhibitions, setMyExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyExhibitions = async () => {
      setLoading(true);
      setError('');
      try {
        const user = auth.currentUser;
        if (!user) {
          setError('משתמש לא מחובר');
          setLoading(false);
          return;
        }
        // Get all registrations for this user
        const regQuery = query(collection(db, 'registrations'), where('userId', '==', user.uid));
        const regSnap = await getDocs(regQuery);
        const exhibitionIds = regSnap.docs.map(doc => doc.data().exhibitionId);
        // Fetch exhibition details
        const exhibitions = [];
        for (const exId of exhibitionIds) {
          const exDoc = await getDoc(doc(db, 'exhibitions', exId));
          if (exDoc.exists()) {
            exhibitions.push({ id: exDoc.id, ...exDoc.data() });
          }
        }
        setMyExhibitions(exhibitions);
      } catch (err) {
        setError('שגיאה בטעינת התערוכות');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyExhibitions();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: 40 }}>טוען...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</div>;

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 16 }}>
      <h2 style={{ textAlign: 'center', color: '#e42b60', fontWeight: 'bold', marginBottom: 32 }}>התערוכות שלי</h2>
      {myExhibitions.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888' }}>לא נרשמת עדיין לאף תערוכה.</div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
          {myExhibitions.map(ex => (
            <div key={ex.id} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 24, minWidth: 260, maxWidth: 320 }}>
              {ex.imageUrl && <img src={ex.imageUrl} alt={ex.title} style={{ width: '100%', borderRadius: 12, marginBottom: 12 }} />}
              <h3 style={{ color: '#e42b60', margin: '8px 0' }}>{ex.title}</h3>
              <div>{ex.location}</div>
              <div>{new Date(ex.startDate).toLocaleDateString()} - {new Date(ex.endDate).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyExhibitions; 