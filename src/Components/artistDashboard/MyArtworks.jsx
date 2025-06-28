// import React, { useEffect, useState } from "react";
// import { auth, db } from "../../firebase/config";
// import { collection, getDocs, getDoc, doc } from "firebase/firestore";
// import styles from "./MyArtworks.module.css";

// const MyArtworks = () => {
//   const [user, setUser] = useState(null);
//   const [groupedArtworks, setGroupedArtworks] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchArtworks = async () => {
//       try {
//         const currentUser = auth.currentUser;
//         if (!currentUser) return;

//         const userDocRef = doc(db, "users", currentUser.uid);
//         const userSnap = await getDoc(userDocRef);
//         if (userSnap.exists()) {
//           setUser({ uid: currentUser.uid, ...userSnap.data() });
//         }

//         const regRef = collection(
//           db,
//           "users",
//           currentUser.uid,
//           "registrations"
//         );
//         const registrationsSnap = await getDocs(regRef);

//         const grouped = {};

//         for (const reg of registrationsSnap.docs) {
//           const regData = reg.data();
//           const exhibitionId = reg.id;
//           let exhibitionTitle = regData.exhibitionTitle;

//           if (!exhibitionTitle) {
//             const exSnap = await getDoc(doc(db, "exhibitions", exhibitionId));
//             exhibitionTitle = exSnap.exists()
//               ? exSnap.data().title
//               : "תערוכה לא ידועה";
//           }

//           const artworksRef = collection(
//             db,
//             "users",
//             currentUser.uid,
//             "registrations",
//             exhibitionId,
//             "artworks"
//           );
//           const artworksSnap = await getDocs(artworksRef);
//           const artworksList = artworksSnap.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//           }));

//           grouped[exhibitionTitle] = artworksList;
//         }

//         setGroupedArtworks(grouped);
//       } catch (error) {
//         console.error("Failed to load artworks:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchArtworks();
//   }, []);

//   if (loading) return <div className={styles.root}>טוען...</div>;

//   return (
//     <div className={styles.root}>
//       <h2 className={styles.header}>העבודות שלי</h2>

//       {Object.entries(groupedArtworks).map(([exhibition, artworks], idx) => (
//         <div key={idx} className={styles.group}>
//           <h3 className={styles.groupTitle}>{exhibition}</h3>
//           <div className={styles.cards}>
//             {artworks.map((art, i) => (
//               <div key={i} className={styles.card}>
//                 <img
//                   src={art.imageUrl}
//                   alt={art.artworkName}
//                   className={styles.image}
//                 />
//                 <h4 className={styles.title}>{art.artworkName}</h4>
//                 <p className={styles.date}>{art.description}</p>
//                 <p className={styles.status}>מידות: {art.size}</p>
//                 <p className={styles.status}>מחיר: {art.price}</p>
//                 <p className={styles.status}>
//                   סטטוס: {art.approved ? "✔️ אושרה" : "⏳ ממתינה לאישור"}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MyArtworks;
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import styles from "./MyArtworks.module.css";

const MyArtworksTabs = () => {
  const [artworksByExhibition, setArtworksByExhibition] = useState({});
  const [selectedExhibition, setSelectedExhibition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const regRef = collection(
          db,
          "users",
          currentUser.uid,
          "registrations"
        );
        const registrationsSnap = await getDocs(regRef);

        const data = {};

        for (const reg of registrationsSnap.docs) {
          const regData = reg.data();
          const exhibitionId = reg.id;
          const exhibitionSnap = await getDoc(
            doc(db, "exhibitions", exhibitionId)
          );
          const title = exhibitionSnap.exists()
            ? exhibitionSnap.data().title
            : "תערוכה לא ידועה";

          const artworksSnap = await getDocs(
            collection(
              db,
              "users",
              currentUser.uid,
              "registrations",
              exhibitionId,
              "artworks"
            )
          );

          data[title] = artworksSnap.docs.map((doc) => ({
            id: doc.id,
            exhibitionId, // Needed for deletion
            ...doc.data(),
          }));
        }

        const firstExhibition = Object.keys(data)[0];
        setArtworksByExhibition(data);
        setSelectedExhibition(firstExhibition);
      } catch (err) {
        console.error("Error fetching artworks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const handleDelete = async (exhibitionId, artworkId) => {
    const confirmed = window.confirm("אתה בטוח שברצונך למחוק את היצירה?");
    if (!confirmed) return;

    try {
      const artworkRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "registrations",
        exhibitionId,
        "artworks",
        artworkId
      );
      await deleteDoc(artworkRef);

      setArtworksByExhibition((prev) => {
        const updated = { ...prev };
        updated[selectedExhibition] = updated[selectedExhibition].filter(
          (art) => art.id !== artworkId
        );
        return updated;
      });
    } catch (err) {
      console.error("שגיאה במחיקת היצירה:", err);
    }
  };

  if (loading) return <div className={styles.root}>טוען...</div>;
  if (!selectedExhibition) return <div>לא נמצאו יצירות</div>;

  return (
    <div className={styles.root}>
      <h2 className={styles.header}>העבודות שלי לפי תערוכה</h2>

      <div className={styles.tabs}>
        {Object.keys(artworksByExhibition).map((title) => (
          <button
            key={title}
            onClick={() => setSelectedExhibition(title)}
            className={`${styles.tabButton} ${
              title === selectedExhibition ? styles.activeTab : ""
            }`}
          >
            {title}
          </button>
        ))}
      </div>

      <div className={styles.artworksGrid}>
        {artworksByExhibition[selectedExhibition].map((art) => (
          <div key={art.id} className={styles.card}>
            <img
              src={art.imageUrl}
              alt={art.artworkName}
              className={styles.image}
            />
            <h4>{art.artworkName}</h4>
            <p>{art.description}</p>
            <p>מידות: {art.size}</p>
            <p>מחיר: {art.price}</p>
            <p className={styles.status}>
              סטטוס: {art.approved ? "✔️ אושרה" : "⏳ ממתינה לאישור"}
            </p>
            <button
              onClick={() => handleDelete(art.exhibitionId, art.id)}
              style={{
                backgroundColor: "#e74c3c",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                marginTop: "10px",
                cursor: "pointer",
              }}
            >
              מחק יצירה
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyArtworksTabs;
