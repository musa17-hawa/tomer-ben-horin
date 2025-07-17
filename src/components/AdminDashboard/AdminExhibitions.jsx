import React, { useEffect, useState } from "react";
import { collection, getDocs, query, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Link } from "react-router-dom";
import { FaTrashAlt, FaEdit, FaSearch, FaSort } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const AdminExhibitions = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("status");

  // const fetchExhibitions = async () => {
  //   const q = query(collection(db, "exhibitions"));
  //   const snapshot = await getDocs(q);
  //   const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  //   const sortedData = data.sort((a, b) => {
  //     if (a.status === "open" && b.status !== "open") return -1;
  //     if (a.status !== "open" && b.status === "open") return 1;

  //     if (sortBy === "title") {
  //       return a.title?.localeCompare(b.title);
  //     } else if (sortBy === "startDate") {
  //       const dateA = new Date(a.startDate?.toDate?.() || a.startDate);
  //       const dateB = new Date(b.startDate?.toDate?.() || b.startDate);
  //       return dateA - dateB;
  //     }

  //     return 0;
  //   });

  //   setExhibitions(sortedData);
  // };
  const fetchExhibitions = async () => {
    const q = query(collection(db, "exhibitions"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const sortedData = data.sort((a, b) => {
      if (a.status === "open" && b.status !== "open") return -1;
      if (a.status !== "open" && b.status === "open") return 1;

      if (sortBy === "startDate") {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateA - dateB;
      }

      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }

      return 0;
    });

    setExhibitions(sortedData);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this exhibition?")) {
      await deleteDoc(doc(db, "exhibitions", id));
      fetchExhibitions();
    }
  };

  useEffect(() => {
    fetchExhibitions();
  }, [sortBy]);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const filtered = exhibitions.filter((exh) =>
    exh.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="text-right p-6 min-h-screen bg-white">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-extrabold text-[#fd3470]">
          ניהול תערוכות
        </h2>
        <div className="flex flex-wrap justify-end items-center gap-4">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="חפש לפי שם תערוכה..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 px-4 py-2 pr-10 rounded-full shadow-sm w-full"
            />
            <FaSearch className="absolute top-2.5 right-3 text-gray-400" />
          </div>
          <div className="relative w-52">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 px-4 py-2 pr-10 rounded-full shadow-sm w-full appearance-none"
            >
              <option value="startDate">לפי תאריך התחלה</option>
              <option value="title">לפי שם</option>
              <option value="status">לפי סטטוס</option>
            </select>
            <FaSort className="absolute top-2.5 right-3 text-gray-400" />
          </div>
          <Link
            to="/admin/exhibitions/add"
            className="bg-[#fd3470] text-white font-bold px-6 py-2 rounded-full hover:bg-pink-600 shadow-md transition"
          >
            הוסף תערוכה חדשה +
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((exh) => (
          <div
            key={exh.id}
            data-aos="fade-up"
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden border border-gray-200 flex flex-col"
          >
            <div className="h-60 w-full overflow-hidden">
              <img
                src={
                  exh.imageUrl ||
                  "https://via.placeholder.com/600x400?text=No+Image"
                }
                alt={exh.title}
                className="w-full h-full object-cover object-center rounded-t-2xl"
              />
            </div>
            <div className="p-4 flex flex-col gap-2 text-sm">
              <h3 className="text-center text-lg font-bold text-[#fd3470]">
                {exh.title}
              </h3>
              <p className="text-center text-gray-500 text-sm">
                {exh.location}
              </p>
              <p className="text-center text-xs text-gray-500">
                {/* {new Date(exh.startDate).toLocaleDateString()} -{" "}
                {new Date(exh.endDate).toLocaleDateString()} */}
                {new Date(exh.startDate).toLocaleDateString("he-IL")} -{" "}
                {new Date(exh.endDate).toLocaleDateString("he-IL")}
              </p>

              <span
                className={`text-center text-xs font-semibold px-3 py-1 rounded-full w-fit mx-auto ${
                  exh.status === "open"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {exh.status === "open" ? "פתוחה" : "סגורה"}
              </span>
              {exh.description && (
                <p className="text-center text-gray-700 text-xs leading-snug line-clamp-3">
                  {exh.description}
                </p>
              )}
              {exh.forSingleArtist && (
                <span className="text-pink-700 text-xs font-medium text-center">
                  תערוכה לאמן יחיד 🎨
                </span>
              )}
              <div className="flex justify-center gap-6 mt-3">
                <Link
                  to={`/admin/exhibitions/edit/${exh.id}`}
                  className="text-blue-600 hover:text-blue-800 text-xl"
                  title="Edit"
                >
                  <span role="img" aria-label="edit">
                    ✏️
                  </span>
                </Link>
                <button
                  onClick={() => handleDelete(exh.id)}
                  className="text-red-600 hover:text-red-800 text-xl"
                  title="Delete"
                >
                  <span role="img" aria-label="delete">
                    🗑️
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminExhibitions;
