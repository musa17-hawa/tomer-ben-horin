// import React, { useEffect, useState } from "react";
// import { db } from "../../firebase/config";
// import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

// const AdminPendingArtworks = () => {
//   const [pendingGrouped, setPendingGrouped] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [selectedExhibition, setSelectedExhibition] = useState(null);
//   const [zoomedImage, setZoomedImage] = useState(null); // for full-screen image

//   useEffect(() => {
//     const fetchGroupedArtworks = async () => {
//       const exhibitionsSnap = await getDocs(collection(db, "exhibitions"));
//       const exhibitions = exhibitionsSnap.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       const pending = {};
//       await Promise.all(
//         exhibitions.map(async (exhibition) => {
//           const artworksSnap = await getDocs(
//             collection(db, "exhibition_artworks", exhibition.id, "artworks")
//           );
//           const filtered = artworksSnap.docs
//             .map((doc) => ({ id: doc.id, ...doc.data() }))
//             .filter((a) => !a.approved && !a.addedByAdmin);

//           if (filtered.length > 0) {
//             pending[exhibition.id] = {
//               exhibition,
//               artworks: filtered,
//             };
//           }
//         })
//       );

//       setPendingGrouped(pending);
//       const firstExhibitionId = Object.keys(pending)[0];
//       setSelectedExhibition(firstExhibitionId || null);
//       setLoading(false);
//     };

//     fetchGroupedArtworks();
//   }, []);

//   const handleApproval = async (exhibitionId, artworkId, userId) => {
//     const confirm = window.confirm("האם אתה בטוח שברצונך לאשר יצירה זו?");
//     if (!confirm) return;

//     const userRef = doc(
//       db,
//       "users",
//       userId,
//       "registrations",
//       exhibitionId,
//       "artworks",
//       artworkId
//     );
//     const centralRef = doc(
//       db,
//       "exhibition_artworks",
//       exhibitionId,
//       "artworks",
//       artworkId
//     );

//     await Promise.all([
//       updateDoc(userRef, { approved: true }),
//       updateDoc(centralRef, { approved: true }),
//     ]);

//     setPendingGrouped((prev) => {
//       const updated = { ...prev };
//       updated[exhibitionId].artworks = updated[exhibitionId].artworks.filter(
//         (a) => a.id !== artworkId
//       );
//       if (updated[exhibitionId].artworks.length === 0) {
//         delete updated[exhibitionId];
//         setSelectedExhibition(null);
//       }
//       return updated;
//     });
//   };
//   const handleRejection = async (exhibitionId, artworkId, userId) => {
//     const confirm = window.confirm("האם אתה בטוח שברצונך לדחות יצירה זו?");
//     if (!confirm) return;

//     const userRef = doc(
//       db,
//       "users",
//       userId,
//       "registrations",
//       exhibitionId,
//       "artworks",
//       artworkId
//     );
//     const centralRef = doc(
//       db,
//       "exhibition_artworks",
//       exhibitionId,
//       "artworks",
//       artworkId
//     );

//     await Promise.all([
//       updateDoc(userRef, { rejected: true }),
//       updateDoc(centralRef, { rejected: true }),
//     ]);

//     setPendingGrouped((prev) => {
//       const updated = { ...prev };
//       updated[exhibitionId].artworks = updated[exhibitionId].artworks.filter(
//         (a) => a.id !== artworkId
//       );
//       if (updated[exhibitionId].artworks.length === 0) {
//         delete updated[exhibitionId];
//         setSelectedExhibition(null);
//       }
//       return updated;
//     });
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-10" dir="rtl">
//       <h1 className="text-4xl font-extrabold text-pink-600 text-center mb-10">
//         אישור יצירות לפי תערוכה
//       </h1>

//       {loading ? (
//         <p className="text-center text-gray-600">טוען נתונים…</p>
//       ) : Object.keys(pendingGrouped).length === 0 ? (
//         <p className="text-center text-gray-500 text-lg">אין יצירות ממתינות.</p>
//       ) : (
//         <>
//           <div className="flex flex-wrap justify-center gap-3 mb-6">
//             {Object.entries(pendingGrouped).map(([id, group]) => (
//               <button
//                 key={id}
//                 onClick={() => setSelectedExhibition(id)}
//                 className={`px-4 py-2 rounded-full border font-semibold transition ${
//                   selectedExhibition === id
//                     ? "bg-pink-600 text-white"
//                     : "bg-white text-pink-600 border-pink-300 hover:bg-pink-50"
//                 }`}
//               >
//                 {group.exhibition.title}
//               </button>
//             ))}
//           </div>

//           {selectedExhibition && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//               {pendingGrouped[selectedExhibition].artworks.map((art) => (
//                 <div
//                   key={art.id}
//                   className="bg-white rounded-xl shadow hover:shadow-lg transition"
//                 >
//                   <img
//                     src={art.imageUrl}
//                     alt={art.artworkName}
//                     onClick={() => setZoomedImage(art.imageUrl)}
//                     className="w-full h-52 object-cover rounded-t-xl cursor-pointer"
//                     title="לחץ להגדלה"
//                   />
//                   <div className="p-4">
//                     <h3 className="text-lg font-bold text-pink-600">
//                       {art.artworkName}
//                     </h3>
//                     <p className="text-sm text-gray-700">
//                       <strong>אמן:</strong> {art.fullName || "לא ידוע"}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       <strong>תיאור:</strong> {art.description || "—"}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       <strong>שנה:</strong> {art.year || "—"}
//                     </p>
//                     <p className="text-sm text-gray-600 mb-3">
//                       <strong>מחיר:</strong> {art.price || "—"}
//                     </p>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() =>
//                           handleApproval(selectedExhibition, art.id, art.userId)
//                         }
//                         className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg"
//                       >
//                         ✔️ אשר יצירה
//                       </button>
//                       <button
//                         onClick={() =>
//                           handleRejection(
//                             selectedExhibition,
//                             art.id,
//                             art.userId
//                           )
//                         }
//                         className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg"
//                       >
//                         ❌ דחה
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </>
//       )}

//       {zoomedImage && (
//         <div
//           className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
//           onClick={() => setZoomedImage(null)}
//         >
//           <img
//             src={zoomedImage}
//             alt="Zoomed"
//             className="max-w-full max-h-full rounded-xl shadow-lg border-4 border-white"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminPendingArtworks;
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const AdminPendingArtworks = () => {
  const [pendingGrouped, setPendingGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedExhibition, setSelectedExhibition] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);

  useEffect(() => {
    const fetchGroupedArtworks = async () => {
      const exhibitionsSnap = await getDocs(collection(db, "exhibitions"));
      const exhibitions = exhibitionsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const pending = {};
      await Promise.all(
        exhibitions.map(async (exhibition) => {
          const artworksSnap = await getDocs(
            collection(db, "exhibition_artworks", exhibition.id, "artworks")
          );
          const filtered = artworksSnap.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((a) => !a.approved && !a.addedByAdmin); // keep rejected too

          if (filtered.length > 0) {
            pending[exhibition.id] = {
              exhibition,
              artworks: filtered,
            };
          }
        })
      );

      setPendingGrouped(pending);
      const firstExhibitionId = Object.keys(pending)[0];
      setSelectedExhibition(firstExhibitionId || null);
      setLoading(false);
    };

    fetchGroupedArtworks();
  }, []);

  const handleApproval = async (exhibitionId, artworkId, userId) => {
    const confirm = window.confirm("האם אתה בטוח שברצונך לאשר יצירה זו?");
    if (!confirm) return;

    const userRef = doc(
      db,
      "users",
      userId,
      "registrations",
      exhibitionId,
      "artworks",
      artworkId
    );
    const centralRef = doc(
      db,
      "exhibition_artworks",
      exhibitionId,
      "artworks",
      artworkId
    );

    await Promise.all([
      updateDoc(userRef, { approved: true }),
      updateDoc(centralRef, { approved: true }),
    ]);

    removeArtworkFromState(exhibitionId, artworkId);
  };

  const handleRejection = async (exhibitionId, artworkId, userId) => {
    const confirm = window.confirm("האם אתה בטוח שברצונך לדחות יצירה זו?");
    if (!confirm) return;

    const userRef = doc(
      db,
      "users",
      userId,
      "registrations",
      exhibitionId,
      "artworks",
      artworkId
    );
    const centralRef = doc(
      db,
      "exhibition_artworks",
      exhibitionId,
      "artworks",
      artworkId
    );

    await Promise.all([
      updateDoc(userRef, { rejected: true }),
      updateDoc(centralRef, { rejected: true }),
    ]);

    removeArtworkFromState(exhibitionId, artworkId);
  };

  const handlePermanentDelete = async (exhibitionId, artworkId, userId) => {
    const confirm = window.confirm(
      "האם אתה בטוח שברצונך למחוק לצמיתות את היצירה?"
    );
    if (!confirm) return;

    const userRef = doc(
      db,
      "users",
      userId,
      "registrations",
      exhibitionId,
      "artworks",
      artworkId
    );
    const centralRef = doc(
      db,
      "exhibition_artworks",
      exhibitionId,
      "artworks",
      artworkId
    );

    await Promise.all([deleteDoc(userRef), deleteDoc(centralRef)]);

    removeArtworkFromState(exhibitionId, artworkId);
  };

  const removeArtworkFromState = (exhibitionId, artworkId) => {
    setPendingGrouped((prev) => {
      const updated = { ...prev };
      updated[exhibitionId].artworks = updated[exhibitionId].artworks.filter(
        (a) => a.id !== artworkId
      );
      if (updated[exhibitionId].artworks.length === 0) {
        delete updated[exhibitionId];
        setSelectedExhibition(null);
      }
      return updated;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10" dir="rtl">
      <h1 className="text-4xl font-extrabold text-pink-600 text-center mb-10">
        אישור יצירות לפי תערוכה
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">טוען נתונים…</p>
      ) : Object.keys(pendingGrouped).length === 0 ? (
        <p className="text-center text-gray-500 text-lg">אין יצירות ממתינות.</p>
      ) : (
        <>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {Object.entries(pendingGrouped).map(([id, group]) => (
              <button
                key={id}
                onClick={() => setSelectedExhibition(id)}
                className={`px-4 py-2 rounded-full border font-semibold transition ${
                  selectedExhibition === id
                    ? "bg-pink-600 text-white"
                    : "bg-white text-pink-600 border-pink-300 hover:bg-pink-50"
                }`}
              >
                {group.exhibition.title}
              </button>
            ))}
          </div>

          {selectedExhibition && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {pendingGrouped[selectedExhibition].artworks.map((art) => (
                <div
                  key={art.id}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition"
                >
                  <img
                    src={art.imageUrl}
                    alt={art.artworkName}
                    onClick={() => setZoomedImage(art.imageUrl)}
                    className="w-full h-52 object-cover rounded-t-xl cursor-pointer"
                    title="לחץ להגדלה"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-pink-600">
                      {art.artworkName}
                    </h3>
                    <p className="text-sm text-gray-700">
                      <strong>אמן:</strong> {art.fullName || "לא ידוע"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>תיאור:</strong> {art.description || "—"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>שנה:</strong> {art.year || "—"}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      <strong>מחיר:</strong> {art.price || "—"}
                    </p>
                    <div className="flex gap-2">
                      {!art.approved && (
                        <button
                          onClick={() =>
                            handleApproval(
                              selectedExhibition,
                              art.id,
                              art.userId
                            )
                          }
                          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg"
                        >
                          ✔️ אשר יצירה
                        </button>
                      )}
                      {!art.rejected && (
                        <button
                          onClick={() =>
                            handleRejection(
                              selectedExhibition,
                              art.id,
                              art.userId
                            )
                          }
                          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 rounded-lg"
                        >
                          ❌ דחה
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handlePermanentDelete(
                            selectedExhibition,
                            art.id,
                            art.userId
                          )
                        }
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg"
                      >
                        🗑️ מחק לצמיתות
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={() => setZoomedImage(null)}
        >
          <img
            src={zoomedImage}
            alt="Zoomed"
            className="max-w-full max-h-full rounded-xl shadow-lg border-4 border-white"
          />
        </div>
      )}
    </div>
  );
};

export default AdminPendingArtworks;
