// import React, { useEffect, useState } from "react";
// import { db } from "../../firebase/config";
// import {
//   collection,
//   getDocs,
//   query,
//   where,
//   Timestamp,
// } from "firebase/firestore";
// import { FaUserAlt, FaPaintBrush, FaImages, FaThLarge } from "react-icons/fa";

// const AdminSummary = () => {
//   const [totalArtists, setTotalArtists] = useState(0);
//   const [totalGalleries, setTotalGalleries] = useState(0);
//   const [totalExhibitions, setTotalExhibitions] = useState(0);
//   const [totalArtworks, setTotalArtworks] = useState(0);
//   const [comingSoon, setComingSoon] = useState([]);

//   useEffect(() => {
//     fetchCounts();
//   }, []);

//   const fetchCounts = async () => {
//     try {
//       const usersSnap = await getDocs(collection(db, "users"));
//       setTotalArtists(usersSnap.size);

//       const galleriesSnap = await getDocs(collection(db, "galleries"));
//       setTotalGalleries(galleriesSnap.size);

//       const exhibitionsSnap = await getDocs(collection(db, "exhibitions"));
//       setTotalExhibitions(exhibitionsSnap.size);

//       // Count artworks from all exhibition_artworks subcollections
//       let artworkCount = 0;
//       for (const doc of exhibitionsSnap.docs) {
//         const exhibitionId = doc.id;
//         const artworksSnap = await getDocs(
//           collection(db, `exhibition_artworks/${exhibitionId}/artworks`)
//         );
//         artworkCount += artworksSnap.size;
//       }
//       setTotalArtworks(artworkCount);

//       // ✅ Fetch upcoming exhibitions using only one filter (no index needed)
//       const now = Timestamp.now();
//       const comingQuery = query(
//         collection(db, "exhibitions"),
//         where("startDate", ">", now)
//       );
//       const comingSnap = await getDocs(comingQuery);
//       setComingSoon(
//         comingSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
//       );
//     } catch (error) {
//       console.error("Error fetching admin summary:", error);
//     }
//   };

//   return (
//     <div className="p-4 md:p-8">
//       <h1 className="text-2xl font-bold text-pink-600 mb-6">
//         לוח ניהול - סיכום כללי
//       </h1>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//         <SummaryCard
//           icon={<FaUserAlt />}
//           label="סה״כ אמנים"
//           value={totalArtists}
//         />
//         <SummaryCard
//           icon={<FaPaintBrush />}
//           label="סה״כ יצירות"
//           value={totalArtworks}
//         />
//         <SummaryCard
//           icon={<FaThLarge />}
//           label="סה״כ תערוכות"
//           value={totalExhibitions}
//         />
//         <SummaryCard
//           icon={<FaImages />}
//           label="סה״כ גלריות"
//           value={totalGalleries}
//         />
//       </div>

//       <h2 className="text-xl font-semibold text-gray-800 mb-4">
//         התערוכות הפתוחות הקרובות
//       </h2>
//       {comingSoon.length === 0 ? (
//         <p className="text-gray-600">אין תערוכות קרובות בזמן הקרוב.</p>
//       ) : (
//         <ul className="space-y-2">
//           {comingSoon.map((ex) => (
//             <li
//               key={ex.id}
//               className="bg-white shadow p-3 rounded-lg border-r-4 border-pink-500"
//             >
//               <p className="text-pink-700 font-semibold">{ex.title}</p>
//               <p className="text-sm text-gray-600">
//                 תאריך התחלה:{" "}
//                 {ex.startDate?.toDate().toLocaleDateString("he-IL") ||
//                   "תאריך לא ידוע"}{" "}
//                 | מיקום: {ex.location || "ללא מיקום"}
//               </p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// const SummaryCard = ({ icon, label, value }) => (
//   <div className="bg-white p-6 rounded-xl shadow-md text-center border-t-4 border-pink-500">
//     <div className="text-3xl text-pink-500 mb-2">{icon}</div>
//     <div className="text-lg text-gray-700 font-semibold">{label}</div>
//     <div className="text-pink-600 text-2xl font-bold">{value}</div>
//   </div>
// );

// export default AdminSummary;
import React, { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { FaUserAlt, FaPaintBrush, FaImages, FaThLarge } from "react-icons/fa";

const AdminSummary = () => {
  const [totalArtists, setTotalArtists] = useState(0);
  const [totalGalleries, setTotalGalleries] = useState(0);
  const [totalExhibitions, setTotalExhibitions] = useState(0);
  const [totalArtworks, setTotalArtworks] = useState(0);
  const [comingSoon, setComingSoon] = useState([]);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      setTotalArtists(usersSnap.size);

      const galleriesSnap = await getDocs(collection(db, "galleries"));
      setTotalGalleries(galleriesSnap.size);

      const exhibitionsSnap = await getDocs(collection(db, "exhibitions"));
      setTotalExhibitions(exhibitionsSnap.size);

      // Count artworks from all exhibition_artworks subcollections
      let artworkCount = 0;
      for (const doc of exhibitionsSnap.docs) {
        const exhibitionId = doc.id;
        const artworksSnap = await getDocs(
          collection(db, `exhibition_artworks/${exhibitionId}/artworks`)
        );
        artworkCount += artworksSnap.size;
      }
      setTotalArtworks(artworkCount);

      // ✅ Fetch upcoming exhibitions using the confirmed working logic
      const comingSnap = await getDocs(
        query(
          collection(db, "exhibitions"),
          where("status", "==", "open"),
          orderBy("startDate", "desc"),
          limit(4)
        )
      );
      setComingSoon(
        comingSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    } catch (error) {
      console.error("Error fetching admin summary:", error);
    }
  };

  // ✅ Format string dates safely
  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("he-IL");
    } catch {
      return "תאריך לא תקין";
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold text-pink-600 mb-6">
        לוח ניהול - סיכום כללי
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <SummaryCard
          icon={<FaUserAlt />}
          label="סה״כ אמנים"
          value={totalArtists}
        />
        <SummaryCard
          icon={<FaPaintBrush />}
          label="סה״כ יצירות"
          value={totalArtworks}
        />
        <SummaryCard
          icon={<FaThLarge />}
          label="סה״כ תערוכות"
          value={totalExhibitions}
        />
        <SummaryCard
          icon={<FaImages />}
          label="סה״כ גלריות"
          value={totalGalleries}
        />
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        התערוכות הפתוחות הקרובות
      </h2>
      {comingSoon.length === 0 ? (
        <p className="text-gray-600">אין תערוכות קרובות בזמן הקרוב.</p>
      ) : (
        <ul className="space-y-2">
          {comingSoon.map((ex) => (
            <li
              key={ex.id}
              className="bg-white shadow p-3 rounded-lg border-r-4 border-pink-500"
            >
              <p className="text-pink-700 font-semibold">{ex.title}</p>
              <p className="text-sm text-gray-600">
                תאריך התחלה: {formatDate(ex.startDate)} | מיקום:{" "}
                {ex.location || "ללא מיקום"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const SummaryCard = ({ icon, label, value }) => (
  <div className="bg-white p-6 rounded-xl shadow-md text-center border-t-4 border-pink-500">
    <div className="text-3xl text-pink-500 mb-2">{icon}</div>
    <div className="text-lg text-gray-700 font-semibold">{label}</div>
    <div className="text-pink-600 text-2xl font-bold">{value}</div>
  </div>
);

export default AdminSummary;
