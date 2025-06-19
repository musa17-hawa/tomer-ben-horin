import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
// import "./AdminAllArtworks.css"; // Assuming you have a CSS file for styling
import "./AdminArtworksReview.css";

export default function AdminArtworksReview() {
  const { exhibitionId } = useParams();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchArtworks() {
      try {
        const all = [];
        const usersSnap = await getDocs(collection(db, "users"));
        for (const userDoc of usersSnap.docs) {
          const userData = userDoc.data();
          const regs = await getDocs(
            collection(db, "users", userDoc.id, "registrations")
          );
          for (const regDoc of regs.docs) {
            if (regDoc.id !== exhibitionId) continue;
            const arts = await getDocs(
              collection(
                db,
                "users",
                userDoc.id,
                "registrations",
                regDoc.id,
                "artworks"
              )
            );
            arts.forEach((artDoc) => {
              all.push({
                id: artDoc.id,
                userId: userDoc.id,
                exhibitionId: regDoc.id,
                artistName: userData.name || "לא ידוע",
                ...artDoc.data(),
              });
            });
          }
        }
        setArtworks(all);
      } catch {
        setError("שגיאה בטעינת היצירות");
      } finally {
        setLoading(false);
      }
    }
    fetchArtworks();
  }, [exhibitionId]);

  async function handleApprove(userId, exId, artId) {
    const ref = doc(
      db,
      "users",
      userId,
      "registrations",
      exId,
      "artworks",
      artId
    );
    await updateDoc(ref, { approved: true });
    setArtworks((prev) =>
      prev.map((a) =>
        a.id === artId && a.userId === userId ? { ...a, approved: true } : a
      )
    );
  }
  async function handleUnApprove(userId, exId, artId) {
    const ref = doc(
      db,
      "users",
      userId,
      "registrations",
      exId,
      "artworks",
      artId
    );
    await updateDoc(ref, { approved: false });
    setArtworks((prev) =>
      prev.map((a) =>
        a.id === artId && a.userId === userId ? { ...a, approved: false } : a
      )
    );
  }

  return (
    <div className="artworks-review-container">
      {/* ——— Sticky Header ——— */}
      {/* <div className="review-header">
        <img
          src="https://amutatbh.com/wp-content/uploads/2021/03/logo-new.svg"
          alt="Logo"
          className="review-logo"
        />
        <h2 className="review-title">אישור יצירות</h2>
      </div> */}
      <div className="review-header">
        <img
          src="https://amutatbh.com/wp-content/uploads/2021/03/logo-new.svg"
          alt="Logo"
          className="review-logo"
          onClick={() => navigate("/user-dashboard")}
          style={{ cursor: "pointer" }}
        />
        <h2 className="review-title">אישור יצירות</h2>
        <div style={{ marginRight: "auto", display: "flex", gap: "1rem" }}>
          <button
            onClick={() => navigate("/user-dashboard")}
            className="header-button"
          >
            חזרה ללוח הניהול
          </button>
          <button
            onClick={() => navigate(`/admin-all-artworks/${exhibitionId}`)}
            className="header-button"
          >
            כל היצירות
          </button>
        </div>
      </div>

      {/* ——— Loading / Error / Empty ——— */}
      {loading && <p className="full-message">טוען…</p>}
      {!loading && error && <p className="full-message error">{error}</p>}
      {!loading && !error && artworks.length === 0 && (
        <p className="full-message">לא נמצאו יצירות להצגה.</p>
      )}

      {/* ——— Grid of Cards ——— */}
      <div className="cards-grid">
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
                  <strong>שנת היצור:</strong> {art.year || "0000"}
                </p>
                <p>
                  <strong>מחיר:</strong> {art.price}
                </p>

                {art.approved ? (
                  <button
                    className="unapprove-button"
                    onClick={() =>
                      handleUnApprove(art.userId, art.exhibitionId, art.id)
                    }
                  >
                    ❌ בטל אישור
                  </button>
                ) : (
                  <button
                    className="approve-button"
                    onClick={() =>
                      handleApprove(art.userId, art.exhibitionId, art.id)
                    }
                  >
                    ✔️ אשר יצירה
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
