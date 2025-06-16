import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import "./AdminArtworksReview.css";

const AdminArtworksReview = () => {
  const { exhibitionId } = useParams();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const allArtworks = [];

        const usersSnapshot = await getDocs(collection(db, "users"));
        for (const userDoc of usersSnapshot.docs) {
          const userData = userDoc.data();
          const registrationsRef = collection(
            db,
            "users",
            userDoc.id,
            "registrations"
          );
          const registrationsSnap = await getDocs(registrationsRef);

          for (const regDoc of registrationsSnap.docs) {
            const regExhibitionId = regDoc.id;
            if (regExhibitionId !== exhibitionId) continue; // Skip if not the selected exhibition

            const artworksRef = collection(
              db,
              "users",
              userDoc.id,
              "registrations",
              regExhibitionId,
              "artworks"
            );
            const artworksSnap = await getDocs(artworksRef);

            artworksSnap.forEach((artDoc) => {
              allArtworks.push({
                id: artDoc.id,
                userId: userDoc.id,
                exhibitionId: regExhibitionId,
                artistName: userData.name || "לא ידוע",
                ...artDoc.data(),
              });
            });
          }
        }

        setArtworks(allArtworks);
        setLoading(false);
        setError("");
      } catch (err) {
        console.error("Error fetching artworks:", err);
        setError("שגיאה בטעינת היצירות");
        setLoading(false);
      }
    };
    fetchArtworks();
  }, [exhibitionId]);

  const handleApprove = async (userId, exhibitionId, artworkId) => {
    try {
      const ref = doc(
        db,
        "users",
        userId,
        "registrations",
        exhibitionId,
        "artworks",
        artworkId
      );
      await updateDoc(ref, { approved: true });
      setArtworks((prev) =>
        prev.map((a) =>
          a.id === artworkId &&
          a.userId === userId &&
          a.exhibitionId === exhibitionId
            ? { ...a, approved: true }
            : a
        )
      );
    } catch (err) {
      setError("שגיאה באישור היצירה");
      console.error("Error approving artwork:", err);
    }
  };

  return (
    <div className="artworks-review-container">
      <h2>אישור יצירות</h2>
      {loading && <p>טוען...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && artworks.length === 0 && (
        <p>לא נמצאו יצירות להצגה.</p>
      )}
      {!loading &&
        !error &&
        artworks.map((art) => (
          <div key={art.id} className="artwork-card">
            {art.imageUrl && (
              <img
                src={art.imageUrl}
                alt={art.artworkName}
                className="artwork-image"
              />
            )}
            <div className="artwork-info">
              <h3>{art.artworkName}</h3>
              <p>
                <strong>אמן:</strong> {art.artistName}
              </p>
              <p>
                <strong>תיאור:</strong> {art.description || "אין תיאור"}
              </p>
              <p>
                <strong>מידות:</strong> {art.size}
              </p>
              <p>
                <strong>מחיר:</strong> {art.price}
              </p>
              {!art.approved ? (
                <button
                  className="approve-button"
                  onClick={() =>
                    handleApprove(art.userId, art.exhibitionId, art.id)
                  }
                >
                  ✔️ אשר יצירה
                </button>
              ) : (
                <span className="approved-badge">✔️ מאושר</span>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default AdminArtworksReview;
