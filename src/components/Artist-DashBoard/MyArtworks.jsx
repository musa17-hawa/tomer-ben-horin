// import React, { useEffect, useState } from "react";
// import { auth, db } from "../../firebase/config";
// import {
//   collection,
//   getDocs,
//   getDoc,
//   doc,
//   deleteDoc,
// } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";
// import AOS from "aos";
// import "aos/dist/aos.css";

// const MyArtworksTabs = () => {
//   const [artworksByExhibition, setArtworksByExhibition] = useState({});
//   const [selectedExhibition, setSelectedExhibition] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [toastMessage, setToastMessage] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     AOS.init({ duration: 800 });
//   }, []);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(async (user) => {
//       if (!user) return;

//       try {
//         const regRef = collection(db, "users", user.uid, "registrations");
//         const registrationsSnap = await getDocs(regRef);

//         const fetchData = await Promise.all(
//           registrationsSnap.docs.map(async (reg) => {
//             const exhibitionId = reg.id;

//             const [exhibitionSnap, artworksSnap] = await Promise.all([
//               getDoc(doc(db, "exhibitions", exhibitionId)),
//               getDocs(
//                 collection(
//                   db,
//                   "users",
//                   user.uid,
//                   "registrations",
//                   exhibitionId,
//                   "artworks"
//                 )
//               ),
//             ]);

//             const artworks = artworksSnap.docs.map((doc) => ({
//               id: doc.id,
//               exhibitionId,
//               ...doc.data(),
//             }));

//             if (!artworks.length) return null;

//             const title = exhibitionSnap.exists()
//               ? exhibitionSnap.data().title
//               : "תערוכה לא ידועה";

//             return { title, artworks };
//           })
//         );

//         const filteredData = fetchData.filter((item) => item !== null);
//         const dataByTitle = {};
//         filteredData.forEach(({ title, artworks }) => {
//           dataByTitle[title] = artworks;
//         });

//         const firstExhibition = Object.keys(dataByTitle)[0];
//         setArtworksByExhibition(dataByTitle);
//         setSelectedExhibition(firstExhibition);
//       } catch (err) {
//         console.error("Error fetching artworks:", err);
//       } finally {
//         setLoading(false);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const showToast = (message) => {
//     setToastMessage(message);
//     setTimeout(() => setToastMessage(""), 3000);
//   };

//   const handleDelete = async (exhibitionId, artworkId) => {
//     const confirmed = window.confirm("אתה בטוח שברצונך למחוק את היצירה?");
//     if (!confirmed) return;

//     try {
//       const ref = doc(
//         db,
//         "users",
//         auth.currentUser.uid,
//         "registrations",
//         exhibitionId,
//         "artworks",
//         artworkId
//       );
//       await deleteDoc(ref);

//       setArtworksByExhibition((prev) => {
//         const updated = { ...prev };
//         updated[selectedExhibition] = updated[selectedExhibition].filter(
//           (art) => art.id !== artworkId
//         );
//         return updated;
//       });

//       showToast("✔️ היצירה נמחקה בהצלחה!");
//     } catch (err) {
//       console.error("שגיאה במחיקת היצירה:", err);
//     }
//   };

//   if (loading)
//     return (
//       <div className="text-center py-12 text-white font-bold animate-pulse">
//         טוען...
//       </div>
//     );

//   if (!Object.keys(artworksByExhibition).length)
//     return (
//       <div className="text-center py-12 text-white font-bold">
//         לא נמצאו יצירות
//       </div>
//     );

//   return (
//     <div
//       dir="rtl"
//       className="min-h-screen bg-[url('https://amutatbh.com/wp-content/uploads/2021/03/wall-bg.jpg')] bg-cover bg-center bg-fixed bg-no-repeat px-4 pt-32 pb-16 relative"
//     >
//       {/* Toast Message */}
//       {toastMessage && (
//         <div className="fixed top-6 right-6 z-50 bg-pink-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all animate-fadeIn">
//           {toastMessage}
//         </div>
//       )}

//       {/* Header */}
//       <div className="fixed top-1 left-4 right-4 z-40 backdrop-blur-lg bg-white/80 rounded-2xl shadow-lg px-6 py-4 flex justify-between items-center w-full mx-auto">
//         <img
//           src="https://amutatbh.com/wp-content/uploads/2021/03/logo-new.svg"
//           alt="Logo"
//           className="h-12"
//         />
//         <nav className="flex gap-6 font-semibold text-[#fd3470]">
//           <button
//             onClick={() => navigate("/artist-dashboard/profile")}
//             className="hover:underline"
//           >
//             פרופיל
//           </button>
//           <button
//             onClick={() => navigate("/artist-dashboard/my-artworks")}
//             className="hover:underline"
//           >
//             היצירות שלי
//           </button>
//           <button
//             onClick={() => navigate("/artist-dashboard")}
//             className="hover:underline"
//           >
//             תערוכות פתוחות
//           </button>
//         </nav>
//       </div>

//       {/* Artworks by Exhibition */}
//       {Object.entries(artworksByExhibition).map(([title, artworks]) => (
//         <div key={title} className="mt-24" data-aos="fade-up">
//           <h2 className="text-center text-3xl font-extrabold bg-white rounded-xl max-w-lg mx-auto py-4 px-6 shadow-md text-[#fd3470] mb-10 border border-pink-300">
//             🎨 {title}
//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
//             {artworks.map((art) => (
//               <div
//                 key={art.id}
//                 className="group bg-white text-black rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-2 relative"
//                 data-aos="fade-up"
//               >
//                 <div className="w-full h-[350px]">
//                   <img
//                     src={art.imageUrl}
//                     alt={art.artworkName}
//                     className="object-cover w-full h-full"
//                   />
//                 </div>
//                 <div className="absolute inset-0 bg-white bg-opacity-90 opacity-0 group-hover:opacity-100 transition duration-300 px-4 py-6 flex flex-col justify-center items-center text-center font-bold">
//                   <h3 className="text-xl mb-2 text-pink-600">
//                     {art.artworkName}
//                   </h3>
//                   <p className="text-sm mb-1 text-black">{art.description}</p>
//                   <p className="text-sm mb-1 text-black">📏 {art.size}</p>
//                   <p className="text-sm mb-1 text-black">💰 {art.price}</p>
//                   <p className="text-sm mb-4 text-black">
//                     {art.approved ? "✔️ אושרה" : "⏳ בהמתנה"}
//                   </p>
//                   <button
//                     onClick={() => handleDelete(art.exhibitionId, art.id)}
//                     className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 text-sm rounded-full shadow transition-all"
//                   >
//                     🗑️ מחק יצירה
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MyArtworksTabs;
// MyArtworksTabs.jsx with Gallery Card layout and working links
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const MyArtworksTabs = () => {
  const [artworksByExhibition, setArtworksByExhibition] = useState({});
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      try {
        const regRef = collection(db, "users", user.uid, "registrations");
        const registrationsSnap = await getDocs(regRef);

        const fetchData = await Promise.all(
          registrationsSnap.docs.map(async (reg) => {
            const exhibitionId = reg.id;

            const [exhibitionSnap, artworksSnap] = await Promise.all([
              getDoc(doc(db, "exhibitions", exhibitionId)),
              getDocs(
                collection(
                  db,
                  "users",
                  user.uid,
                  "registrations",
                  exhibitionId,
                  "artworks"
                )
              ),
            ]);

            const artworks = artworksSnap.docs.map((doc) => ({
              id: doc.id,
              exhibitionId,
              ...doc.data(),
            }));

            if (!artworks.length) return null;

            const exhibitionData = exhibitionSnap.exists()
              ? exhibitionSnap.data()
              : {};

            const title = exhibitionData.title || "תערוכה לא ידועה";
            const startDate = exhibitionData.startDate || "";
            const status = exhibitionData.status || "unknown";

            return {
              title,
              startDate,
              status,
              artworks,
              exhibitionId,
            };
          })
        );

        const filteredData = fetchData.filter((item) => item !== null);
        const dataByTitle = {};
        filteredData.forEach(({ title, ...rest }) => {
          dataByTitle[title] = rest;
        });

        setArtworksByExhibition(dataByTitle);
      } catch (err) {
        console.error("Error fetching artworks:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleDelete = async (exhibitionId, artworkId) => {
    const confirmed = window.confirm("אתה בטוח שברצונך למחוק את היצירה?");
    if (!confirmed) return;

    try {
      const ref = doc(
        db,
        "users",
        auth.currentUser.uid,
        "registrations",
        exhibitionId,
        "artworks",
        artworkId
      );
      await deleteDoc(ref);

      setArtworksByExhibition((prev) => {
        const updated = { ...prev };
        const target = Object.values(updated).find(
          (ex) => ex.exhibitionId === exhibitionId
        );
        if (target) {
          target.artworks = target.artworks.filter(
            (art) => art.id !== artworkId
          );
        }
        return updated;
      });

      showToast("✔️ היצירה נמחקה בהצלחה!");
    } catch (err) {
      console.error("שגיאה במחיקת היצירה:", err);
    }
  };

  if (loading)
    return (
      <div className="text-center py-12 text-white font-bold animate-pulse">
        טוען...
      </div>
    );

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[url('https://amutatbh.com/wp-content/uploads/2021/03/wall-bg.jpg')] bg-fixed px-4 pt-36 pb-16 relative"
    >
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-pink-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all animate-fadeIn">
          {toastMessage}
        </div>
      )}

      <div className="fixed top-1 left-4 right-4 z-40 backdrop-blur-lg bg-white/80 rounded-2xl shadow-lg px-6 py-4 flex justify-between items-center w-full mx-auto">
        <img
          src="https://amutatbh.com/wp-content/uploads/2021/03/logo-new.svg"
          alt="Logo"
          className="h-12"
        />
        <nav className="flex gap-6 font-semibold text-[#fd3470]">
          <button
            onClick={() => navigate("/artist-dashboard/profile")}
            className="hover:underline"
          >
            פרופיל
          </button>
          <button
            onClick={() => navigate("/artist-dashboard/my-artworks")}
            className="hover:underline"
          >
            היצירות שלי
          </button>
          <button
            onClick={() => navigate("/artist-dashboard")}
            className="hover:underline"
          >
            תערוכות פתוחות
          </button>
        </nav>
      </div>
      <h1 className="text-3xl font-bold text-center text-[#fd3470] mb-2">
        כל היצירות בכל תערוכה
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        {Object.entries(artworksByExhibition).map(
          ([title, { artworks, startDate, status, exhibitionId }]) => (
            <div
              key={title}
              className="bg-white rounded-3xl shadow-lg p-6 border border-pink-200"
              data-aos="fade-up"
            >
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-[#fd3470] mb-1">
                  {title}
                </h2>
                <p className="text-sm text-gray-600">
                  📅 {startDate} | סטטוס:{" "}
                  {status === "open" ? "פתוחה" : "סגורה"}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                {artworks.slice(0, 3).map((art) => (
                  <img
                    key={art.id}
                    src={art.imageUrl}
                    alt={art.artworkName}
                    className="w-full h-36 object-cover rounded-xl shadow"
                  />
                ))}
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() =>
                    navigate(
                      `/artist-dashboard/register-artwork?exhibitionId=${exhibitionId}`
                    )
                  }
                  className="bg-[#fd3470] hover:bg-pink-600 text-white px-4 py-2 rounded-full text-sm shadow "
                >
                  ➕ הוסף יצירה
                </button>
                <button
                  onClick={() =>
                    navigate(`/artist-dashboard/exhibition/${exhibitionId}`)
                  }
                  className="bg-[#fd3470] hover:bg-pink-600 text-white px-4 py-2 rounded-full text-sm shadow  "
                >
                  ▶️ צפה בכל היצירות
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MyArtworksTabs;
