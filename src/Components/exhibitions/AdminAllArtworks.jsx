// import React, { useEffect, useRef, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { collection, doc, getDoc, getDocs } from "firebase/firestore";
// import { db } from "../../firebase/config";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import { QRCodeCanvas } from "qrcode.react";
// import "./AdminAllArtworks.css";

// const AdminAllArtworks = () => {
//   const { exhibitionId } = useParams();
//   const navigate = useNavigate();
//   const [artworks, setArtworks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const hiddenRefs = useRef({});

//   useEffect(() => {
//     const fetchAllArtworks = async () => {
//       const all = [];

//       // 1. Fetch approved artworks from user registrations
//       const usersSnap = await getDocs(collection(db, "users"));
//       for (const userDoc of usersSnap.docs) {
//         const regs = await getDocs(
//           collection(db, "users", userDoc.id, "registrations")
//         );
//         for (const reg of regs.docs) {
//           if (reg.id !== exhibitionId) continue;

//           const arts = await getDocs(
//             collection(
//               db,
//               "users",
//               userDoc.id,
//               "registrations",
//               reg.id,
//               "artworks"
//             )
//           );
//           arts.forEach((doc) => {
//             const data = doc.data();
//             if (data.approved) {
//               all.push({
//                 ...data,
//                 id: doc.id,
//                 artist: userDoc.data(),
//               });
//             }
//           });
//         }
//       }

//       // 2. Fetch admin-added artworks and match artist by name
//       const exhibitionDocRef = doc(db, "exhibitions", exhibitionId);
//       const exhibitionSnap = await getDoc(exhibitionDocRef);
//       if (exhibitionSnap.exists()) {
//         const exhibitionData = exhibitionSnap.data();
//         if (Array.isArray(exhibitionData.artworks)) {
//           for (const [index, art] of exhibitionData.artworks.entries()) {
//             let artistProfile = null;

//             if (art.artist) {
//               const matching = usersSnap.docs.find(
//                 (doc) => doc.data().name === art.artist
//               );
//               if (matching) {
//                 artistProfile = matching.data();
//               }
//             }

//             all.push({
//               ...art,
//               id: `admin-${index}`,
//               artist: artistProfile || {
//                 name: art.artist || "הוספה ע" + '"' + "י מנהל",
//               },
//             });
//           }
//         }
//       }

//       setArtworks(all);
//       setLoading(false);
//     };

//     fetchAllArtworks();
//   }, [exhibitionId]);

//   const handleExportPDF = async (artId) => {
//     const input = hiddenRefs.current[artId];
//     if (!input) return;

//     try {
//       const canvas = await html2canvas(input, {
//         scale: 3,
//         useCORS: true,
//         backgroundColor: "#fff",
//       });
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//       const margin = 10;
//       pdf.addImage(
//         imgData,
//         "PNG",
//         margin,
//         margin,
//         pdfWidth - 2 * margin,
//         pdfHeight - 2 * margin
//       );
//       pdf.save(`artist_profile_${artId}.pdf`);
//     } catch (err) {
//       console.error("PDF export error:", err);
//     }
//   };

//   return (
//     <div className="artworks-review-wrapper">
//       <div className="review-header">
//         <img
//           src="https://amutatbh.com/wp-content/uploads/2021/03/logo-new.svg"
//           alt="Logo"
//           className="review-logo"
//           onClick={() => navigate("/user-dashboard")}
//         />
//         <h2 className="review-title">כל היצירות</h2>
//         <div className="review-buttons">
//           <button
//             onClick={() => navigate("/user-dashboard")}
//             className="header-button"
//           >
//             חזרה ללוח הניהול
//           </button>
//           <button
//             onClick={() => navigate(`/admin-artworks-review/${exhibitionId}`)}
//             className="header-button"
//           >
//             אישור יצירות
//           </button>
//         </div>
//       </div>

//       <div className="artworks-review-container">
//         {loading ? (
//           <p className="full-message">טוען...</p>
//         ) : (
//           <div className="cards-grid">
//             {artworks.map((art) => (
//               <div key={art.id} className="artwork-card">
//                 {art.imageUrl && (
//                   <img
//                     src={art.imageUrl}
//                     alt={art.name}
//                     className="artwork-image"
//                   />
//                 )}
//                 <div className="artwork-info">
//                   <h3>{art.name || "ללא שם"}</h3>
//                   <p>
//                     <strong>אמן:</strong> {art.artist?.name || "לא ידוע"}
//                   </p>
//                   <p>
//                     <strong>תיאור:</strong> {art.description || "אין תיאור"}
//                   </p>
//                   <p>
//                     <strong>שנת היצור:</strong> {art.year || "-"}
//                   </p>
//                   <p>
//                     <strong>מחיר:</strong> {art.price || "-"}
//                   </p>

//                   <button
//                     className="dashboard-btn"
//                     onClick={() => handleExportPDF(art.id)}
//                     style={{ marginTop: "10px" }}
//                   >
//                     יצא פרופיל PDF
//                   </button>
//                 </div>

//                 <div
//                   ref={(el) => (hiddenRefs.current[art.id] = el)}
//                   style={{
//                     position: "absolute",
//                     left: "-9999px",
//                     top: 0,
//                     width: "210mm",
//                     padding: "20px",
//                     backgroundColor: "#fff",
//                   }}
//                   dir="rtl"
//                 >
//                   <h1>{art.artist?.name}</h1>
//                   <img
//                     src={art.artist?.image || "https://via.placeholder.com/140"}
//                     alt="Profile"
//                     width={140}
//                     height={140}
//                     style={{ borderRadius: "50%" }}
//                   />
//                   <p>{art.artist?.bio || ""}</p>
//                   <p>
//                     <b>תחום האומנות:</b> {art.artist?.subject || "-"}
//                   </p>
//                   <p>
//                     <b>קבוצת אמנים:</b> {art.artist?.group || "-"}
//                   </p>
//                   <p>
//                     <b>אימייל:</b> {art.artist?.email || "-"}
//                   </p>
//                   <p>
//                     <b>מקום מגורים:</b> {art.artist?.place || "-"}
//                   </p>
//                   {art.artist?.link && (
//                     <QRCodeCanvas value={art.artist.link} size={128} />
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminAllArtworks;
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";
import "./AdminAllArtworks.css";

const AdminAllArtworks = () => {
  const { exhibitionId } = useParams();
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const hiddenRefs = useRef({});

  useEffect(() => {
    const fetchAllArtworks = async () => {
      try {
        const all = [];

        // 1. Fetch from centralized exhibition_artworks collection
        const snapshot = await getDocs(
          collection(db, "exhibition_artworks", exhibitionId, "artworks")
        );

        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          if (!data.approved) continue;

          let artistData = {
            name: data.artistName || "לא ידוע",
            bio: "",
            subject: "",
            group: "",
            email: "",
            place: "",
            link: "",
            image: "",
          };

          if (data.userId) {
            const artistDoc = await getDoc(doc(db, "users", data.userId));
            if (artistDoc.exists()) {
              artistData = { ...artistData, ...artistDoc.data() };
            }
          }

          all.push({
            ...data,
            id: docSnap.id,
            artist: artistData,
          });
        }

        // 2. Fetch admin-added artworks from exhibitions/{exhibitionId}
        const exhibitionDoc = await getDoc(
          doc(db, "exhibitions", exhibitionId)
        );
        if (exhibitionDoc.exists()) {
          const exData = exhibitionDoc.data();
          if (Array.isArray(exData.artworks)) {
            for (let i = 0; i < exData.artworks.length; i++) {
              const art = exData.artworks[i];
              all.push({
                ...art,
                id: `admin-${i}`,
                artist: {
                  name: art.artist || 'הוספה ע"י מנהל',
                  bio: "",
                  subject: "",
                  group: "",
                  email: "",
                  place: "",
                  link: "",
                  image: "",
                },
              });
            }
          }
        }

        setArtworks(all);
      } catch (err) {
        console.error("שגיאה בטעינת היצירות:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllArtworks();
  }, [exhibitionId]);

  const handleExportPDF = async (artId) => {
    const input = hiddenRefs.current[artId];
    if (!input) return;

    try {
      const canvas = await html2canvas(input, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#fff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      const margin = 10;
      pdf.addImage(
        imgData,
        "PNG",
        margin,
        margin,
        pdfWidth - 2 * margin,
        pdfHeight - 2 * margin
      );
      pdf.save(`artist_profile_${artId}.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
    }
  };

  return (
    <div className="artworks-review-wrapper">
      <div className="review-header">
        <img
          src="https://amutatbh.com/wp-content/uploads/2021/03/logo-new.svg"
          alt="Logo"
          className="review-logo"
          onClick={() => navigate("/user-dashboard")}
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
                    alt={art.name || "ללא שם"}
                    className="artwork-image"
                  />
                )}
                <div className="artwork-info">
                  <h3>{art.name || art.artworkName || "ללא שם"}</h3>
                  <p>
                    <strong>אמן:</strong> {art.artist?.name || "לא ידוע"}
                  </p>
                  <p>
                    <strong>תיאור:</strong> {art.description || "אין תיאור"}
                  </p>
                  <p>
                    <strong>שנת היצור:</strong> {art.year || "-"}
                  </p>
                  <p>
                    <strong>מחיר:</strong> {art.price || "-"}
                  </p>

                  <button
                    className="dashboard-btn"
                    onClick={() => handleExportPDF(art.id)}
                    style={{ marginTop: "10px" }}
                  >
                    יצא פרופיל PDF
                  </button>
                </div>

                <div
                  ref={(el) => (hiddenRefs.current[art.id] = el)}
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    top: 0,
                    width: "210mm",
                    padding: "20px",
                    backgroundColor: "#fff",
                  }}
                  dir="rtl"
                >
                  <h1>{art.artist?.name}</h1>
                  <img
                    src={art.artist?.image || "https://via.placeholder.com/140"}
                    alt="Profile"
                    width={140}
                    height={140}
                    style={{ borderRadius: "50%" }}
                  />
                  <p>{art.artist?.bio || ""}</p>
                  <p>
                    <b>תחום האומנות:</b> {art.artist?.subject || "-"}
                  </p>
                  <p>
                    <b>קבוצת אמנים:</b> {art.artist?.group || "-"}
                  </p>
                  <p>
                    <b>אימייל:</b> {art.artist?.email || "-"}
                  </p>
                  <p>
                    <b>מקום מגורים:</b> {art.artist?.place || "-"}
                  </p>
                  {art.artist?.link && (
                    <QRCodeCanvas value={art.artist.link} size={128} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAllArtworks;
