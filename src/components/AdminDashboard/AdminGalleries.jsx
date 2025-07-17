// // import React, { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { db } from "../../firebase/config";
// // import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

// // const AdminGalleries = () => {
// //   const [galleries, setGalleries] = useState([]);
// //   const [filteredGalleries, setFilteredGalleries] = useState([]);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [sortOption, setSortOption] = useState("name");
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const fetchGalleries = async () => {
// //       const snapshot = await getDocs(collection(db, "galleries"));
// //       const galleryList = snapshot.docs.map((doc) => ({
// //         id: doc.id,
// //         ...doc.data(),
// //       }));
// //       setGalleries(galleryList);
// //     };

// //     fetchGalleries();
// //   }, []);

// //   useEffect(() => {
// //     let filtered = [...galleries];

// //     if (searchTerm.trim()) {
// //       filtered = filtered.filter(
// //         (g) =>
// //           g.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //           g.location?.toLowerCase().includes(searchTerm.toLowerCase())
// //       );
// //     }

// //     if (sortOption === "name") {
// //       filtered.sort((a, b) => a.name.localeCompare(b.name, "he"));
// //     } else if (sortOption === "location") {
// //       filtered.sort((a, b) =>
// //         a.location?.localeCompare(b.location ?? "", "he")
// //       );
// //     }

// //     setFilteredGalleries(filtered);
// //   }, [searchTerm, sortOption, galleries]);

// //   const handleDelete = async (id) => {
// //     const confirmDelete = window.confirm("למחוק את הגלריה הזו?");
// //     if (!confirmDelete) return;

// //     await deleteDoc(doc(db, "galleries", id));
// //     setGalleries((prev) => prev.filter((g) => g.id !== id));
// //   };

// //   return (
// //     <div className="max-w-6xl mx-auto p-8" dir="rtl">
// //       <h1 className="text-3xl font-bold text-pink-600 mb-6 text-center">
// //         ניהול גלריות
// //       </h1>

// //       <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
// //         <input
// //           type="text"
// //           placeholder="חפש לפי שם או מיקום..."
// //           value={searchTerm}
// //           onChange={(e) => setSearchTerm(e.target.value)}
// //           className="w-full sm:w-1/2 px-4 py-2 border rounded-md"
// //         />

// //         <select
// //           value={sortOption}
// //           onChange={(e) => setSortOption(e.target.value)}
// //           className="px-4 py-2 border rounded-md"
// //         >
// //           <option value="name">מיין לפי שם</option>
// //           <option value="location">מיין לפי מיקום</option>
// //         </select>

// //         <button
// //           onClick={() => navigate("/admin/galleries/add")}
// //           className="bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 font-bold"
// //         >
// //           ➕ הוסף גלריה חדשה
// //         </button>
// //       </div>

// //       {filteredGalleries.length === 0 ? (
// //         <p className="text-gray-500 text-center">אין גלריות להצגה.</p>
// //       ) : (
// //         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
// //           {filteredGalleries.map((gallery) => (
// //             <div
// //               key={gallery.id}
// //               className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
// //             >
// //               {gallery.imageUrl && (
// //                 <img
// //                   src={gallery.imageUrl}
// //                   alt={gallery.name}
// //                   className="w-full h-48 object-cover"
// //                 />
// //               )}
// //               <div className="p-4">
// //                 <h2 className="text-xl font-bold text-pink-600">
// //                   {gallery.name}
// //                 </h2>
// //                 <p className="text-sm text-gray-500 mb-2">{gallery.location}</p>
// //                 <p className="text-sm text-gray-400 line-clamp-2">
// //                   {gallery.description}
// //                 </p>

// //                 <div className="flex justify-between mt-4 text-sm">
// //                   <button
// //                     onClick={() => navigate(`/admin/galleries/${gallery.id}`)}
// //                     className="text-blue-600 hover:underline"
// //                   >
// //                     📂 הצג תערוכות
// //                   </button>
// //                   <button
// //                     onClick={() =>
// //                       navigate(`/admin/galleries/edit/${gallery.id}`)
// //                     }
// //                     className="text-green-600 hover:underline"
// //                   >
// //                     ✏️ ערוך
// //                   </button>

// //                   <button
// //                     onClick={() => handleDelete(gallery.id)}
// //                     className="text-red-600 hover:underline"
// //                   >
// //                     🗑️ מחק
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default AdminGalleries;
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { db } from "../../firebase/config";
// import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

// const AdminGalleries = () => {
//   const [galleries, setGalleries] = useState([]);
//   const [filteredGalleries, setFilteredGalleries] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortOption, setSortOption] = useState("title");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchGalleries = async () => {
//       const snapshot = await getDocs(collection(db, "galleries"));
//       const galleryList = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setGalleries(galleryList);
//     };

//     fetchGalleries();
//   }, []);

//   useEffect(() => {
//     let filtered = [...galleries];

//     if (searchTerm.trim()) {
//       filtered = filtered.filter(
//         (g) =>
//           g.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           g.location?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (sortOption === "title") {
//       filtered.sort((a, b) =>
//         (a.title ?? "").localeCompare(b.title ?? "", "he")
//       );
//     } else if (sortOption === "location") {
//       filtered.sort((a, b) =>
//         (a.location ?? "").localeCompare(b.location ?? "", "he")
//       );
//     }

//     setFilteredGalleries(filtered);
//   }, [searchTerm, sortOption, galleries]);

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm("למחוק את הגלריה הזו?");
//     if (!confirmDelete) return;

//     await deleteDoc(doc(db, "galleries", id));
//     setGalleries((prev) => prev.filter((g) => g.id !== id));
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-8" dir="rtl">
//       <h1 className="text-3xl font-bold text-pink-600 mb-6 text-center">
//         ניהול גלריות
//       </h1>

//       <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="חפש לפי שם או מיקום..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full sm:w-1/2 px-4 py-2 border rounded-md"
//         />

//         <select
//           value={sortOption}
//           onChange={(e) => setSortOption(e.target.value)}
//           className="px-4 py-2 border rounded-md"
//         >
//           <option value="title">מיין לפי שם</option>
//           <option value="location">מיין לפי מיקום</option>
//         </select>

//         <button
//           onClick={() => navigate("/admin/galleries/add")}
//           className="bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 font-bold"
//         >
//           ➕ הוסף גלריה חדשה
//         </button>
//       </div>

//       {filteredGalleries.length === 0 ? (
//         <p className="text-gray-500 text-center">אין גלריות להצגה.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {filteredGalleries.map((gallery) => (
//             <div
//               key={gallery.id}
//               className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
//             >
//               {gallery.imageUrl && (
//                 <img
//                   src={gallery.imageUrl}
//                   alt={gallery.title}
//                   className="w-full h-48 object-cover"
//                 />
//               )}
//               <div className="p-4">
//                 <h2 className="text-xl font-bold text-pink-600">
//                   {gallery.title}
//                 </h2>
//                 <p className="text-sm text-gray-500 mb-2">{gallery.location}</p>
//                 <p className="text-sm text-gray-400 line-clamp-2">
//                   {gallery.description}
//                 </p>

//                 <div className="flex justify-between mt-4 text-sm">
//                   <button
//                     onClick={() => navigate(`/admin/galleries/${gallery.id}`)}
//                     className="text-blue-600 hover:underline"
//                   >
//                     📂 הצג תערוכות
//                   </button>
//                   <button
//                     onClick={() =>
//                       navigate(`/admin/galleries/edit/${gallery.id}`)
//                     }
//                     className="text-green-600 hover:underline"
//                   >
//                     ✏️ ערוך
//                   </button>

//                   <button
//                     onClick={() => handleDelete(gallery.id)}
//                     className="text-red-600 hover:underline"
//                   >
//                     🗑️ מחק
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminGalleries;
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { db } from "../../firebase/config";
// import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

// const AdminGalleries = () => {
//   const [galleries, setGalleries] = useState([]);
//   const [filteredGalleries, setFilteredGalleries] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortOption, setSortOption] = useState("title");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchGalleries = async () => {
//       const snapshot = await getDocs(collection(db, "galleries"));
//       const galleryList = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setGalleries(galleryList);
//     };

//     fetchGalleries();
//   }, []);

//   useEffect(() => {
//     let filtered = [...galleries];

//     if (searchTerm.trim()) {
//       filtered = filtered.filter(
//         (g) =>
//           g.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           g.location?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (sortOption === "title") {
//       filtered.sort((a, b) =>
//         (a.title ?? "").localeCompare(b.title ?? "", "he")
//       );
//     } else if (sortOption === "location") {
//       filtered.sort((a, b) =>
//         (a.location ?? "").localeCompare(b.location ?? "", "he")
//       );
//     }

//     setFilteredGalleries(filtered);
//   }, [searchTerm, sortOption, galleries]);

//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm("למחוק את הגלריה הזו?");
//     if (!confirmDelete) return;

//     await deleteDoc(doc(db, "galleries", id));
//     setGalleries((prev) => prev.filter((g) => g.id !== id));
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-10" dir="rtl">
//       <h1 className="text-4xl font-extrabold text-pink-600 mb-10 text-center">
//         ניהול גלריות
//       </h1>

//       <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 bg-white/70 backdrop-blur-lg shadow-lg rounded-xl p-4">
//         <input
//           type="text"
//           placeholder="חפש לפי שם או מיקום..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
//         />

//         <select
//           value={sortOption}
//           onChange={(e) => setSortOption(e.target.value)}
//           className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
//         >
//           <option value="title">מיין לפי שם</option>
//           <option value="location">מיין לפי מיקום</option>
//         </select>

//         <button
//           onClick={() => navigate("/admin/galleries/add")}
//           className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 font-bold"
//         >
//           ➕ הוסף גלריה חדשה
//         </button>
//       </div>

//       {filteredGalleries.length === 0 ? (
//         <p className="text-gray-500 text-center text-lg">אין גלריות להצגה.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//           {filteredGalleries.map((gallery, index) => (
//             <div
//               key={gallery.id}
//               className="bg-white rounded-2xl shadow-md hover:shadow-xl transform transition duration-300 hover:scale-[1.02] overflow-hidden animate-fadeIn"
//               style={{ animationDelay: `${index * 80}ms` }}
//             >
//               {gallery.imageUrl && (
//                 <img
//                   src={gallery.imageUrl}
//                   alt={gallery.title}
//                   className="w-full h-56 object-cover"
//                 />
//               )}
//               <div className="p-5">
//                 <h2 className="text-2xl font-bold text-pink-600 mb-1 text-center ">
//                   {gallery.title}
//                 </h2>
//                 <p className="text-sm text-gray-500 mb-2">{gallery.location}</p>
//                 <p className="text-sm text-gray-600 mb-4 line-clamp-3">
//                   {gallery.description}
//                 </p>

//                 <div className="flex flex-wrap justify-between mt-4 gap-2 text-sm">
//                   <button
//                     onClick={() => navigate(`/admin/galleries/${gallery.id}`)}
//                     className="flex items-center gap-1 bg-yellow-200 hover:bg-yellow-300 text-black font-semibold px-4 py-1 rounded-full shadow transition-all duration-300"
//                   >
//                     📂 הצג תערוכות
//                   </button>

//                   <button
//                     onClick={() =>
//                       navigate(`/admin/galleries/edit/${gallery.id}`)
//                     }
//                     className="flex items-center gap-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-1 rounded-full shadow transition-all duration-300"
//                   >
//                     ✏️ ערוך
//                   </button>

//                   <button
//                     onClick={() => handleDelete(gallery.id)}
//                     className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-1 rounded-full shadow transition-all duration-300"
//                   >
//                     🗑️ מחק
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminGalleries;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import AOS from "aos";
import "aos/dist/aos.css";

const AdminGalleries = () => {
  const [galleries, setGalleries] = useState([]);
  const [filteredGalleries, setFilteredGalleries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("title");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGalleries = async () => {
      const snapshot = await getDocs(collection(db, "galleries"));
      const galleryList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGalleries(galleryList);
    };

    fetchGalleries();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    let filtered = [...galleries];

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (g) =>
          g.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          g.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOption === "title") {
      filtered.sort((a, b) =>
        (a.title ?? "").localeCompare(b.title ?? "", "he")
      );
    } else if (sortOption === "location") {
      filtered.sort((a, b) =>
        (a.location ?? "").localeCompare(b.location ?? "", "he")
      );
    }

    setFilteredGalleries(filtered);
  }, [searchTerm, sortOption, galleries]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("למחוק את הגלריה הזו?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "galleries", id));
    setGalleries((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10" dir="rtl">
      <h1 className="text-4xl font-extrabold text-pink-600 mb-10 text-center">
        ניהול גלריות
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 bg-white/70 backdrop-blur-lg shadow-lg rounded-xl p-4">
        <input
          type="text"
          placeholder="חפש לפי שם או מיקום..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
        />

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
        >
          <option value="title">מיין לפי שם</option>
          <option value="location">מיין לפי מיקום</option>
        </select>

        <button
          onClick={() => navigate("/admin/galleries/add")}
          className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 font-bold"
        >
          ➕ הוסף גלריה חדשה
        </button>
      </div>

      {filteredGalleries.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">אין גלריות להצגה.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredGalleries.map((gallery, index) => (
            <div
              key={gallery.id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transform transition duration-300 hover:scale-[1.02] overflow-hidden"
            >
              {gallery.imageUrl && (
                <img
                  src={gallery.imageUrl}
                  alt={gallery.title}
                  className="w-full h-56 object-cover"
                />
              )}
              <div className="p-5">
                <h2 className="text-2xl font-bold text-pink-600 mb-1 text-center">
                  {gallery.title}
                </h2>
                <p className="text-sm text-gray-500 mb-2">{gallery.location}</p>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {gallery.description}
                </p>

                <div className="flex flex-wrap justify-between mt-4 gap-2 text-sm">
                  <button
                    onClick={() => navigate(`/admin/galleries/${gallery.id}`)}
                    className="flex items-center gap-1 bg-yellow-200 hover:bg-yellow-300 text-black font-semibold px-4 py-1 rounded-full shadow transition-all duration-300"
                  >
                    📂 הצג תערוכות
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/admin/galleries/edit/${gallery.id}`)
                    }
                    className="flex items-center gap-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-1 rounded-full shadow transition-all duration-300"
                  >
                    ✏️ ערוך
                  </button>

                  <button
                    onClick={() => handleDelete(gallery.id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-1 rounded-full shadow transition-all duration-300"
                  >
                    🗑️ מחק
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

export default AdminGalleries;
