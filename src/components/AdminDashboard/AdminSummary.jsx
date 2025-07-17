// // src/components/AdminDashboard/AdminSummary.jsx

// import React, { useEffect, useState } from "react";
// import {
//   collection,
//   collectionGroup,
//   getDocs,
//   query,
//   where,
// } from "firebase/firestore";
// import { db } from "../../firebase/config"; // Ensure this path is correct

// const AdminSummary = () => {
//   const [artistsCount, setArtistsCount] = useState(0);
//   const [artworksCount, setArtworksCount] = useState(0);
//   const [approvedCount, setApprovedCount] = useState(0);
//   const [pendingCount, setPendingCount] = useState(0);

//   useEffect(() => {
//     const fetchSummaryData = async () => {
//       try {
//         const usersSnapshot = await getDocs(collection(db, "users"));
//         const artists = usersSnapshot.docs.filter((doc) => !doc.data().isAdmin);
//         setArtistsCount(artists.length);

//         const artworksSnapshot = await getDocs(collectionGroup(db, "artworks"));
//         setArtworksCount(artworksSnapshot.size);

//         const approvedSnapshot = await getDocs(
//           query(collectionGroup(db, "artworks"), where("approved", "==", true))
//         );
//         setApprovedCount(approvedSnapshot.size);

//         const pendingSnapshot = await getDocs(
//           query(collectionGroup(db, "artworks"), where("approved", "==", false))
//         );
//         setPendingCount(pendingSnapshot.size);
//       } catch (error) {
//         console.error("שגיאה בטעינת נתונים:", error);
//       }
//     };

//     fetchSummaryData();
//   }, []);

//   return (
//     <div className="p-6 text-right" dir="rtl">
//       <h1 className="text-3xl font-bold text-[#fd3470] mb-6">
//         לוח בקרה ניהולי
//       </h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-pink-100 p-6 rounded-2xl shadow-lg">
//           <h2 className="text-xl font-semibold mb-2">מספר אומנים</h2>
//           <p className="text-3xl font-bold">{artistsCount}</p>
//         </div>
//         <div className="bg-pink-100 p-6 rounded-2xl shadow-lg">
//           <h2 className="text-xl font-semibold mb-2">כלל היצירות</h2>
//           <p className="text-3xl font-bold">{artworksCount}</p>
//         </div>
//         <div className="bg-green-100 p-6 rounded-2xl shadow-lg">
//           <h2 className="text-xl font-semibold mb-2">מאושרות</h2>
//           <p className="text-3xl font-bold">{approvedCount}</p>
//         </div>
//         <div className="bg-yellow-100 p-6 rounded-2xl shadow-lg">
//           <h2 className="text-xl font-semibold mb-2">ממתינות לאישור</h2>
//           <p className="text-3xl font-bold">{pendingCount}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminSummary;
import React, { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  collectionGroup,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { FaUserAlt, FaPaintBrush, FaCheck, FaClock } from "react-icons/fa";

const AdminSummary = () => {
  const [artistsCount, setArtistsCount] = useState(0);
  const [artworksCount, setArtworksCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [openExhibitions, setOpenExhibitions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Count users (non-admins)
        const usersSnap = await getDocs(collection(db, "users"));
        const artists = usersSnap.docs.filter((doc) => !doc.data().isAdmin);
        setArtistsCount(artists.length);

        // Count all artworks
        const artworksSnap = await getDocs(collectionGroup(db, "artworks"));
        setArtworksCount(artworksSnap.size);

        // Count approved artworks
        const approvedSnap = await getDocs(
          query(collectionGroup(db, "artworks"), where("approved", "==", true))
        );
        setApprovedCount(approvedSnap.size);

        // Count pending artworks
        const pendingSnap = await getDocs(
          query(collectionGroup(db, "artworks"), where("approved", "==", false))
        );
        setPendingCount(pendingSnap.size);

        // Get the 3 latest open exhibitions
        const exhibitionsSnap = await getDocs(
          query(
            collection(db, "exhibitions"),
            where("status", "==", "open"),
            orderBy("startDate", "desc"),
            limit(4)
          )
        );

        const exhibitions = exhibitionsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOpenExhibitions(exhibitions);
      } catch (error) {
        console.error("שגיאה בטעינת הסיכום:", error.message);
      }
    };

    fetchData();
  }, []);

  // Helper to format dates safely
  const formatDate = (date) => {
    if (!date) return "לא זמין";
    if (typeof date.toDate === "function") {
      return date.toDate().toLocaleDateString("he-IL");
    }
    try {
      return new Date(date).toLocaleDateString("he-IL");
    } catch {
      return "לא זמין";
    }
  };

  return (
    <div className="p-6 text-right" dir="rtl">
      <h2 className="text-3xl font-bold text-[#fd3470] mb-8">
        לוח ניהול - סיכום כללי
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <SummaryCard
          label="סה״כ אמנים"
          value={artistsCount}
          icon={<FaUserAlt />}
        />
        <SummaryCard
          label="סה״כ יצירות"
          value={artworksCount}
          icon={<FaPaintBrush />}
        />
        <SummaryCard label="מאושרות" value={approvedCount} icon={<FaCheck />} />
        <SummaryCard label="ממתינות" value={pendingCount} icon={<FaClock />} />
      </div>

      <h3 className="text-2xl font-semibold text-gray-700 mb-4">
        התערוכות הפתוחות האחרונות
      </h3>
      <div className="flex flex-col gap-6">
        {openExhibitions.length === 0 ? (
          <p className="text-gray-500">לא נמצאו תערוכות פתוחות.</p>
        ) : (
          openExhibitions.map((exh) => (
            <div
              key={exh.id}
              className="bg-white rounded-xl shadow-md p-4 border-r-4 border-[#fd3470]"
            >
              <h4 className="text-lg font-bold text-[#fd3470] mb-2">
                {exh.title || "ללא כותרת"}
              </h4>
              <p className="text-sm text-gray-600 mb-1">
                תאריך התחלה: {formatDate(exh.startDate)}
              </p>
              {exh.location && (
                <p className="text-sm text-gray-600">מיקום: {exh.location}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, icon }) => (
  <div className="bg-white border-t-4 border-[#fd3470] shadow-md rounded-xl p-6 flex flex-col items-center justify-center text-center">
    <div className="text-3xl text-[#fd3470] mb-2">{icon}</div>
    <div className="text-gray-600 font-medium">{label}</div>
    <div className="text-xl font-bold">{value}</div>
  </div>
);

export default AdminSummary;
