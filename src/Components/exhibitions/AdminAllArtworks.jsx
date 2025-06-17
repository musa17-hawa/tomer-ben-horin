import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import "./AdminAllArtworks.css";

const AdminAllArtworks = () => {
  const { exhibitionId } = useParams();
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllArtworks = async () => {
      const all = [];

      // 1. Fetch approved artworks from user registrations
      const usersSnap = await getDocs(collection(db, "users"));
      for (const userDoc of usersSnap.docs) {
        const regs = await getDocs(
          collection(db, "users", userDoc.id, "registrations")
        );
        for (const reg of regs.docs) {
          if (reg.id !== exhibitionId) continue;

          const arts = await getDocs(
            collection(
              db,
              "users",
              userDoc.id,
              "registrations",
              reg.id,
              "artworks"
            )
          );
          arts.forEach((doc) => {
            const data = doc.data();
            if (data.approved) {
              all.push({
                ...data,
                id: doc.id,
                artistName: userDoc.data().name || "לא ידוע",
              });
            }
          });
        }
      }

      // 2. Fetch admin-added artworks from exhibitions/{exhibitionId}.artworks
      const exhibitionDocRef = doc(db, "exhibitions", exhibitionId);
      const exhibitionSnap = await getDoc(exhibitionDocRef);

      if (exhibitionSnap.exists()) {
        const exhibitionData = exhibitionSnap.data();
        if (Array.isArray(exhibitionData.artworks)) {
          exhibitionData.artworks.forEach((art, index) => {
            all.push({
              ...art,
              id: `admin-${index}`,
              artistName: art.artist || "הוספה ע״י מנהל",
            });
          });
        }
      }

      setArtworks(all);
      setLoading(false);
    };

    fetchAllArtworks();
  }, [exhibitionId]);

  return (
    <>
      {/* Full-width sticky header */}
      <div className="review-header">
        <img
          src="https://amutatbh.com/wp-content/uploads/2021/03/logo-new.svg"
          alt="Logo"
          className="review-logo"
          onClick={() => navigate("/user-dashboard")}
          style={{ cursor: "pointer" }}
        />
        <h2 className="review-title">כל היצירות</h2>
        <div className="review-buttons">
          <button
            onClick={() => navigate("/user-dashboard")}
            className="header-button"
          >
            חזרה ללוח הניהול
          </button>
          <button
            onClick={() => navigate(`/admin-artworks-review/${exhibitionId}`)}
            className="header-button"
          >
            אישור יצירות
          </button>
        </div>
      </div>

      {/* Artwork container */}
      <div className="artworks-review-container">
        {loading ? (
          <p className="full-message">טוען...</p>
        ) : (
          <div className="cards-grid">
            {artworks.map((art) => (
              <div key={art.id} className="artwork-card">
                {art.imageUrl && (
                  <img
                    src={art.imageUrl}
                    alt={art.name || art.artworkName || "Artwork"}
                    className="artwork-image"
                  />
                )}
                <div className="artwork-info">
                  <h3>{art.name || art.artworkName || "ללא שם"}</h3>
                  <p>
                    <strong>אמן:</strong> {art.artistName}
                  </p>
                  <p>
                    <strong>תיאור:</strong> {art.description || "אין תיאור"}
                  </p>
                  <p>
                    <strong>מידות:</strong> {art.size || art.dimensions || "-"}
                  </p>
                  <p>
                    <strong>שנת היצור:</strong> {art.year || "0000"}
                  </p>
                  <p>
                    <strong>מחיר:</strong> {art.price || "-"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
export default AdminAllArtworks;
