// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { db } from "../../firebase/config";
// import {
//   doc,
//   getDoc,
//   collection,
//   query,
//   where,
//   getDocs,
// } from "firebase/firestore";

// const AdminGalleryDetails = () => {
//   const { galleryId } = useParams();
//   const [gallery, setGallery] = useState(null);
//   const [exhibitions, setExhibitions] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchGallery = async () => {
//       const docRef = doc(db, "galleries", galleryId);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setGallery({ id: docSnap.id, ...docSnap.data() });
//       }
//     };

//     // const fetchExhibitions = async () => {
//     //   const q = query(
//     //     collection(db, "exhibitions"),
//     //     where("galleryId", "==", galleryId)
//     //   );
//     //   const querySnapshot = await getDocs(q);
//     //   setExhibitions(
//     //     querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
//     //   );
//     // };
//     const fetchExhibitions = async () => {
//       const cleanId = galleryId.trim(); // ✅ prevent mismatch due to whitespace
//       const q = query(
//         collection(db, "exhibitions"),
//         where("galleryId", "==", cleanId)
//       );
//       const querySnapshot = await getDocs(q);
//       setExhibitions(
//         querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
//       );
//     };

//     fetchGallery();
//     fetchExhibitions();
//   }, [galleryId]);

//   if (!gallery)
//     return <div className="text-center mt-10">טוען מידע על הגלריה...</div>;

//   return (
//     <div className="max-w-6xl mx-auto p-8" dir="rtl">
//       <div className="flex items-center gap-6 mb-10">
//         {gallery.imageUrl && (
//           <img
//             src={gallery.imageUrl}
//             alt={gallery.name}
//             className="w-32 h-32 rounded-xl object-cover border border-pink-200"
//           />
//         )}
//         <div>
//           <h1 className="text-4xl font-extrabold text-pink-600">
//             {gallery.name}
//           </h1>
//           <p className="text-gray-600 mt-2">{gallery.description}</p>
//         </div>
//       </div>

//       <div className="mb-6 text-left">
//         <button
//           onClick={() =>
//             navigate(`/admin/galleries/${galleryId}/add-exhibition`)
//           }
//           className="bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 font-bold"
//         >
//           הוסף תערוכה לגלריה זו
//         </button>
//       </div>

//       <h2 className="text-2xl font-bold text-gray-800 mb-4">
//         התערוכות בגלריה:
//       </h2>
//       {exhibitions.length === 0 ? (
//         <p className="text-gray-500">לא קיימות תערוכות עדיין בגלריה זו.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {exhibitions.map((ex) => (
//             <div
//               key={ex.id}
//               className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
//             >
//               {ex.imageUrl && (
//                 <img
//                   src={ex.imageUrl}
//                   alt={ex.title}
//                   className="w-full h-48 object-cover"
//                 />
//               )}
//               <div className="p-4">
//                 <h3 className="text-lg font-bold text-pink-600">{ex.title}</h3>
//                 <p className="text-sm text-gray-500">{ex.location}</p>
//                 <p className="text-xs text-gray-400 mt-1">
//                   {ex.startDate} - {ex.endDate}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminGalleryDetails;
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db } from "../../firebase/config";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

const AdminGalleryDetails = () => {
  const { galleryId } = useParams();
  const [gallery, setGallery] = useState(null);
  const [exhibitions, setExhibitions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGallery = async () => {
      const docRef = doc(db, "galleries", galleryId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setGallery({ id: docSnap.id, ...docSnap.data() });
      }
    };

    const fetchExhibitions = async () => {
      const cleanId = galleryId.trim(); // ✅ prevent mismatch due to whitespace
      const q = query(
        collection(db, "exhibitions"),
        where("galleryId", "==", cleanId)
      );
      const querySnapshot = await getDocs(q);
      setExhibitions(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchGallery();
    fetchExhibitions();
  }, [galleryId]);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this exhibition?")) {
      await deleteDoc(doc(db, "exhibitions", id));
      setExhibitions((prev) => prev.filter((ex) => ex.id !== id));
    }
  };

  if (!gallery)
    return <div className="text-center mt-10">טוען מידע על הגלריה...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8" dir="rtl">
      {/* <div className="flex items-center gap-6 mb-10">
        {gallery.imageUrl && (
          <img
            src={gallery.imageUrl}
            alt={gallery.name}
            className="w-32 h-32 rounded-xl object-cover border border-pink-200"
          />
        )}
        <div>
          <h1 className="text-4xl font-extrabold text-pink-600">
            {gallery.name}
          </h1>
          <p className="text-gray-600 mt-2">{gallery.description}</p>
        </div>
      </div>

      <div className="mb-6 text-left">
        <button
          onClick={() =>
            navigate(`/admin/galleries/${galleryId}/add-exhibition`)
          }
          className="bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 font-bold"
        >
          הוסף תערוכה לגלריה זו
        </button>
      </div> */}
      <div
        className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center justify-between gap-6 mb-10"
        dir="rtl"
      >
        <div className="flex items-center gap-6 w-full md:w-2/3">
          {gallery.imageUrl && (
            <img
              src={gallery.imageUrl}
              alt={gallery.name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-xl object-cover border border-pink-300 shadow-md"
            />
          )}
          <div className="text-right">
            <h1 className="text-3xl font-extrabold text-pink-600">
              {gallery.name}
            </h1>
            <p className="text-gray-600 mt-2">{gallery.description}</p>
          </div>
        </div>

        <div className="w-full md:w-1/3 flex justify-center md:justify-end">
          <button
            onClick={() =>
              navigate(`/admin/galleries/${galleryId}/add-exhibition`)
            }
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 py-3 rounded-full shadow transition-all duration-300"
          >
            הוסף תערוכה לגלריה זו
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        התערוכות בגלריה:
      </h2>

      {exhibitions.length === 0 ? (
        <p className="text-gray-500">לא קיימות תערוכות עדיין בגלריה זו.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {exhibitions.map((ex) => (
            <div
              key={ex.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {ex.imageUrl && (
                <img
                  src={ex.imageUrl}
                  alt={ex.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-bold text-pink-600">{ex.title}</h3>
                <p className="text-sm text-gray-500">{ex.location}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {ex.startDate} - {ex.endDate}
                </p>
                <div className="flex justify-center gap-6 mt-4">
                  <Link
                    to={`/admin/exhibitions/edit/${ex.id}`}
                    className="text-blue-600 hover:text-blue-800 text-xl"
                    title="Edit"
                  >
                    ✏️
                  </Link>
                  <button
                    onClick={() => handleDelete(ex.id)}
                    className="text-red-600 hover:text-red-800 text-xl"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminGalleryDetails;
