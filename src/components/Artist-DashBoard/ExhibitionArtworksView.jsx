// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { db, auth } from "../../firebase/config";
// import { collection, getDocs, doc, getDoc } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";

// const ExhibitionArtworksView = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [artworks, setArtworks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (!user) {
//         navigate("/login");
//         return;
//       }

//       try {
//         const snapshot = await getDocs(
//           collection(db, "users", user.uid, "registrations", id, "artworks")
//         );

//         const data = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setArtworks(data);
//       } catch (err) {
//         console.error("Error loading artworks:", err);
//       } finally {
//         setLoading(false);
//       }
//     });

//     return () => unsubscribe();
//   }, [id, navigate]);

//   if (loading)
//     return (
//       <div className="text-center text-xl mt-20 text-pink-600">טוען...</div>
//     );

//   return (
//     <div
//       className="min-h-screen bg-gradient-to-b from-[#fff1f3] to-[#fbe4ec] pt-32 pb-12 px-6"
//       dir="rtl"
//     >
//       <h1 className="text-3xl font-bold text-center text-[#fd3470] mb-8">
//         כל היצירות בתערוכה
//       </h1>

//       {artworks.length === 0 ? (
//         <div className="text-center text-lg text-gray-600 bg-white py-10 rounded-xl shadow">
//           לא נמצאו יצירות בתערוכה זו.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//           {artworks.map((art) => (
//             <div
//               key={art.id}
//               className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
//             >
//               <img
//                 src={art.imageUrl}
//                 alt={art.artworkName}
//                 className="w-full h-64 object-cover"
//               />
//               <div className="p-4">
//                 <h3 className="text-lg font-bold text-[#fd3470]">
//                   {art.artworkName}
//                 </h3>
//                 <p className="text-sm text-gray-600 mt-1 line-clamp-2">
//                   {art.description || "ללא תיאור"}
//                 </p>
//                 <p className="text-sm mt-2 text-gray-800">📏 {art.size}</p>
//                 <p className="text-sm text-gray-800">💰 {art.price}</p>
//                 <p className="text-sm text-gray-600 mt-1">
//                   {art.approved ? "✔️ אושרה" : "⏳ בהמתנה"}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ExhibitionArtworksView;
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase/config";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ExhibitionArtworksView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const snapshot = await getDocs(
          collection(db, "users", user.uid, "registrations", id, "artworks")
        );

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArtworks(data);
      } catch (err) {
        console.error("Error loading artworks:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [id, navigate]);

  const handleDelete = async (artworkId) => {
    const confirmed = window.confirm("האם אתה בטוח שברצונך למחוק את היצירה?");
    if (!confirmed) return;

    try {
      const userId = auth.currentUser.uid;

      // Delete from user's own subcollection
      const userRef = doc(
        db,
        "users",
        userId,
        "registrations",
        id,
        "artworks",
        artworkId
      );
      await deleteDoc(userRef);

      // Delete from centralized admin artworks path
      const adminRef = doc(
        db,
        "exhibition_artworks",
        id,
        "artworks",
        artworkId
      );
      await deleteDoc(adminRef);

      // Remove from local state
      setArtworks((prev) => prev.filter((art) => art.id !== artworkId));
      setToastMessage("✔️ היצירה נמחקה בהצלחה!");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (error) {
      console.error("שגיאה במחיקת היצירה:", error);
    }
  };

  if (loading)
    return (
      <div className="text-center text-xl mt-20 text-pink-600">טוען...</div>
    );

  return (
    <div
      className="min-h-screen bg-[url('https://amutatbh.com/wp-content/uploads/2021/03/wall-bg.jpg')] pt-36 pb-12 px-6"
      dir="rtl"
    >
      {/* Toast Message */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-pink-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all animate-fadeIn">
          {toastMessage}
        </div>
      )}

      {/* Header */}
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

      <h1 className="text-3xl font-bold text-center text-[#fd3470] mb-8">
        כל היצירות בתערוכה
      </h1>

      {artworks.length === 0 ? (
        <div className="text-center text-lg text-gray-600 bg-white py-10 rounded-xl shadow">
          לא נמצאו יצירות בתערוכה זו.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {artworks.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 relative"
            >
              <img
                src={art.imageUrl}
                alt={art.artworkName}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-[#fd3470]">
                  {art.artworkName}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {art.description || "ללא תיאור"}
                </p>
                <p className="text-sm mt-2 text-gray-800">📏 {art.size}</p>
                <p className="text-sm text-gray-800">💰 {art.price}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {art.approved ? "✔️ אושרה" : "⏳ בהמתנה"}
                </p>
                <button
                  onClick={() => handleDelete(art.id)}
                  className="mt-3 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded-full shadow"
                >
                  🗑️ מחק יצירה
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Back Button */}
      <div className="mt-12 text-center">
        <button
          onClick={() => navigate("/artist-dashboard/my-artworks")}
          className="bg-[#fd3470] hover:bg-pink-600 text-white px-6 py-2 rounded-full shadow-lg"
        >
          חזור לרשימת היצירות שלי
        </button>
      </div>
    </div>
  );
};

export default ExhibitionArtworksView;
