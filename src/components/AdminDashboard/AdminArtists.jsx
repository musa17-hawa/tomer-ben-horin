// import React, { useEffect, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../../firebase/config";
// import { useNavigate } from "react-router-dom";

// const AllArtists = () => {
//   const [artists, setArtists] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchArtists = async () => {
//       const snapshot = await getDocs(collection(db, "users"));
//       const artistList = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setArtists(artistList);
//     };

//     fetchArtists();
//   }, []);

//   return (
//     <div className="p-10 max-w-screen-xl mx-auto">
//       <h1 className="text-3xl font-bold text-center text-pink-600 mb-8">
//         כל האמנים
//       </h1>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
//         {artists.map((artist) => (
//           <div
//             key={artist.id}
//             onClick={() => navigate(`/admin/artist/${artist.id}`)}
//             className="bg-white shadow-md rounded-xl p-4 text-center cursor-pointer hover:shadow-xl transition-all"
//           >
//             <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-4 border-pink-200">
//               {artist.image ? (
//                 <img
//                   src={artist.image}
//                   alt={artist.name}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = "/placeholder.jpg";
//                   }}
//                 />
//               ) : (
//                 <div className="bg-gray-300 w-full h-full flex items-center justify-center text-gray-700 font-bold text-xl">
//                   {artist.name?.[0]}
//                 </div>
//               )}
//             </div>
//             <h2 className="text-lg font-bold text-gray-800">{artist.name}</h2>
//             <p className="text-sm text-gray-500">{artist.subject}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AllArtists;

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

const AllArtists = () => {
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtists = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const artistList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setArtists(artistList);
    };

    fetchArtists();
  }, []);

  useEffect(() => {
    let result = [...artists];

    // Filter by search
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(
        (artist) =>
          artist.name?.toLowerCase().includes(s) ||
          artist.subject?.toLowerCase().includes(s)
      );
    }

    // Sort
    result.sort((a, b) => {
      const aVal = (a[sortBy] || "").toString();
      const bVal = (b[sortBy] || "").toString();
      return aVal.localeCompare(bVal, "he", { sensitivity: "base" });
    });

    setFilteredArtists(result);
  }, [artists, search, sortBy]);

  return (
    <div className="p-10 max-w-screen-xl mx-auto" dir="rtl">
      <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">
        כל האמנים
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div className="w-full md:w-2/3 relative">
          <input
            type="text"
            placeholder="🔍 חפש לפי שם או תחום אומנות..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-2xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-pink-300 focus:outline-none bg-gray-50 placeholder-gray-500 text-sm"
          />
        </div>
        <div className="w-full md:w-auto">
          <label className="block mb-1 text-sm text-gray-700 font-medium">
            מיון לפי:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-2xl border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-pink-300 focus:outline-none text-sm"
          >
            <option value="name">שם</option>
            <option value="place">אזור מגורים</option>
            <option value="subject">תחום אומנות</option> {/* ✅ NEW */}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredArtists.map((artist) => (
          <div
            key={artist.id}
            onClick={() => navigate(`/admin/artist/${artist.id}`)}
            className="bg-white shadow-md rounded-xl p-4 text-center cursor-pointer hover:shadow-xl transition-all"
          >
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-4 border-pink-200">
              {artist.image ? (
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.jpg";
                  }}
                />
              ) : (
                <div className="bg-gray-300 w-full h-full flex items-center justify-center text-gray-700 font-bold text-xl">
                  {artist.name?.[0]}
                </div>
              )}
            </div>
            <h2 className="text-lg font-bold text-gray-800">{artist.name}</h2>
            <p className="text-sm text-gray-500">{artist.subject}</p>
            <p className="text-xs text-gray-400 mt-1">{artist.place}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllArtists;
