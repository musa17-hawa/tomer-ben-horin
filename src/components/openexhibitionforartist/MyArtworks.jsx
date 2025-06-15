import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
// import "./MyArtworks.css";
import styles from "./MyArtworks.module.css";

const MyArtworks = () => {
  const [user, setUser] = useState(null);
  const [groupedArtworks, setGroupedArtworks] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const userDocRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          setUser({ uid: currentUser.uid, ...userSnap.data() });
        }

        const regRef = collection(
          db,
          "users",
          currentUser.uid,
          "registrations"
        );
        const snapshot = await getDocs(regRef);

        const grouped = {};

        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          let title = data.exhibitionTitle;

          if (!title) {
            const exSnap = await getDoc(
              doc(db, "exhibitions", data.exhibitionId)
            );
            title = exSnap.exists() ? exSnap.data().title : "תערוכה לא ידועה";
          }

          if (!grouped[title]) grouped[title] = [];
          grouped[title].push(data);
        }

        setGroupedArtworks(grouped);
      } catch (error) {
        console.error("Failed to load user artworks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  if (loading) return <div className="dashboard-root">טוען...</div>;

  // return (
  //   <div className="dashboard-root">
  //     {/* <h2 className="dashboard-header">העבודות שלי </h2> */}

  //     {Object.entries(groupedArtworks).map(([exhibition, artworks], idx) => (
  //       <div key={idx} className="exhibition-group">
  //         <h3 className="exhibition-group-title">{exhibition}</h3>
  //         <div className="dashboard-cards">
  //           {artworks.map((art, i) => (
  //             <div key={i} className="exhibition-card">
  //               <img
  //                 src={art.imageUrl}
  //                 alt={art.artworkName}
  //                 className="exhibition-image"
  //               />
  //               <h3 className="exhibition-title">{art.artworkName}</h3>
  //               <p className="exhibition-date">{art.description}</p>
  //               <p className="exhibition-status">מידות: {art.size}</p>
  //               <p className="exhibition-status">מחיר: {art.price}</p>
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     ))}
  //   </div>
  // );
  return (
    <div className={styles.root}>
      <h2 className={styles.header}>העבודות שלי</h2>

      {Object.entries(groupedArtworks).map(([exhibition, artworks], idx) => (
        <div key={idx} className={styles.group}>
          <h3 className={styles.groupTitle}>{exhibition}</h3>
          <div className={styles.cards}>
            {artworks.map((art, i) => (
              <div key={i} className={styles.card} tabIndex={0}>
                <img
                  src={art.imageUrl}
                  alt={art.artworkName}
                  className={styles.image}
                />
                <h4 className={styles.title}>{art.artworkName}</h4>
                <p className={styles.date}>{art.description}</p>
                <p className={styles.status}>מידות: {art.size}</p>
                <p className={styles.status}>מחיר: {art.price}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyArtworks;
