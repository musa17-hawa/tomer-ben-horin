// import React, { useEffect, useState } from "react";
// import { db } from "../../firebase/config";
// import { collectionGroup, query, where, getDocs } from "firebase/firestore";

// const CreationsPage = () => {
//   const [pendingImages, setPendingImages] = useState([]);
//   const [approvedImages, setApprovedImages] = useState([]);
//   const [activeTab, setActiveTab] = useState("pending");

//   useEffect(() => {
//     const fetchArtworks = async () => {
//       const allArtworksQuery = query(collectionGroup(db, "artworks"));
//       const snapshot = await getDocs(allArtworksQuery);

//       const pending = [];
//       const approved = [];

//       snapshot.forEach((doc) => {
//         const data = doc.data();
//         if (data.imageUrl) {
//           if (data.approved === true || data.addedByAdmin === true) {
//             approved.push({ id: doc.id, ...data });
//           } else {
//             pending.push({ id: doc.id, ...data });
//           }
//         }
//       });

//       setPendingImages(pending);
//       setApprovedImages(approved);
//     };

//     fetchArtworks();
//   }, []);

//   const renderImages = (list) => {
//     return list.length === 0 ? (
//       <p className="text-gray-500 mt-6">אין תמונות להצגה.</p>
//     ) : (
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
//         {list.map((art) => (
//           <div key={art.id} className="bg-white p-3 rounded-lg shadow">
//             <img
//               src={art.imageUrl}
//               alt={art.name}
//               className="w-full h-48 object-cover rounded"
//             />
//             <p className="mt-2 font-bold text-pink-600 text-sm">{art.name}</p>
//             <p className="text-gray-500 text-xs">{art.artist || "לא ידוע"}</p>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-10" dir="rtl">
//       <h1 className="text-3xl font-extrabold text-pink-600 mb-8">דף יצירות</h1>

//       <div className="flex gap-4 mb-6">
//         <button
//           onClick={() => setActiveTab("pending")}
//           className={`px-6 py-2 rounded-full font-semibold transition ${
//             activeTab === "pending"
//               ? "bg-pink-600 text-white"
//               : "bg-gray-200 hover:bg-gray-300"
//           }`}
//         >
//           ממתין לאישור
//         </button>
//         <button
//           onClick={() => setActiveTab("approved")}
//           className={`px-6 py-2 rounded-full font-semibold transition ${
//             activeTab === "approved"
//               ? "bg-pink-600 text-white"
//               : "bg-gray-200 hover:bg-gray-300"
//           }`}
//         >
//           מאושר / על ידי מנהל
//         </button>
//       </div>

//       {activeTab === "pending" && renderImages(pendingImages)}
//       {activeTab === "approved" && renderImages(approvedImages)}
//     </div>
//   );
// };

// export default CreationsPage;
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, getDoc, query, where } from "firebase/firestore";

const CreationsPage = () => {
  const [pendingGrouped, setPendingGrouped] = useState({});
  const [approvedGrouped, setApprovedGrouped] = useState({});
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    const fetchGroupedArtworks = async () => {
      const exhibitionsSnap = await getDocs(collection(db, "exhibitions"));
      const exhibitions = exhibitionsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const pending = {};
      const approved = {};

      for (const exhibition of exhibitions) {
        const artworksSnap = await getDocs(
          collection(db, "exhibition_artworks", exhibition.id, "artworks")
        );

        const artworks = artworksSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const pendingInThis = artworks.filter(
          (a) => !a.approved && !a.addedByAdmin
        );
        const approvedInThis = artworks.filter(
          (a) => a.approved || a.addedByAdmin
        );

        if (pendingInThis.length > 0) {
          pending[exhibition.id] = {
            exhibition,
            artworks: pendingInThis,
          };
        }
        if (approvedInThis.length > 0) {
          approved[exhibition.id] = {
            exhibition,
            artworks: approvedInThis,
          };
        }
      }

      setPendingGrouped(pending);
      setApprovedGrouped(approved);
    };

    fetchGroupedArtworks();
  }, []);

  const renderGroup = (grouped) => {
    if (Object.keys(grouped).length === 0) {
      return <p className="text-gray-500 mt-6">אין תמונות להצגה.</p>;
    }

    return Object.entries(grouped).map(([exhibitionId, group]) => (
      <div key={exhibitionId} className="mb-10">
        <h2 className="text-2xl font-bold text-pink-600 mb-4">
          {group.exhibition.title} ({group.artworks.length})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {group.artworks.map((art) => (
            <div
              key={art.id}
              className="bg-white p-3 rounded-lg shadow hover:shadow-md transition"
            >
              <img
                src={art.imageUrl}
                alt={art.name}
                className="w-full h-48 object-cover rounded"
              />
              <p className="mt-2 font-bold text-pink-600 text-sm">{art.name}</p>
              <p className="text-gray-500 text-xs">{art.artist || "לא ידוע"}</p>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10" dir="rtl">
      <h1 className="text-3xl font-extrabold text-pink-600 mb-8">דף יצירות</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            activeTab === "pending"
              ? "bg-pink-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          ממתין לאישור
        </button>
        <button
          onClick={() => setActiveTab("approved")}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            activeTab === "approved"
              ? "bg-pink-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          מאושר / על ידי מנהל
        </button>
      </div>

      {activeTab === "pending" && renderGroup(pendingGrouped)}
      {activeTab === "approved" && renderGroup(approvedGrouped)}
    </div>
  );
};

export default CreationsPage;
