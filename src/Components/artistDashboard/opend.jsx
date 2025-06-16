import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getExhibitionsByStatus } from "../../services/exhibitionService";
import { auth, db } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "./opend.css";

const ExhibitionsList = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUser({ uid: currentUser.uid, ...userDoc.data() });
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadExhibitions = async () => {
      try {
        const data = await getExhibitionsByStatus("open");
        setExhibitions(data);
      } catch (err) {
        setError("Failed to load exhibitions");
      } finally {
        setLoading(false);
      }
    };
    loadExhibitions();
  }, []);

  const filteredExhibitions = exhibitions.filter((exhibition) =>
    exhibition.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-root">
      <input
        className="dashboard-search"
        type="text"
        placeholder=" 🔍חפש לפי שם תערוכה"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="dashboard-cards">
        {filteredExhibitions.map((exhibition) => (
          <div key={exhibition.id} className="exhibition-card">
            {exhibition.imageUrl && (
              <img
                src={exhibition.imageUrl}
                alt={exhibition.title}
                className="exhibition-image"
              />
            )}

            <h3>{exhibition.title}</h3>

            {/* NEW: gallery description */}
            {exhibition.description && (
              <p className="exhibition-description">{exhibition.description}</p>
            )}

            <p className="exhibition-location">{exhibition.location}</p>

            <p className="exhibition-dates">
              {new Date(exhibition.startDate).toLocaleDateString()} –{" "}
              {new Date(exhibition.endDate).toLocaleDateString()}
            </p>

            <button
              onClick={() =>
                navigate(`/artist-dashboard/register-artwork?exhibitionId=${exhibition.id}`)
              }
              className="exhibition-btn"
            >
              הרשמה לתערוכה
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExhibitionsList;