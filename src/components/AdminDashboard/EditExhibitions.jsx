// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   getDoc,
//   doc,
//   collection,
//   getDocs,
//   updateDoc,
// } from "firebase/firestore";
// import { db } from "../../firebase/config";
// import { FaTrashAlt, FaEdit } from "react-icons/fa";

// const EditExhibition = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     title: "",
//     location: "",
//     description: "",
//     startDate: "",
//     endDate: "",
//     status: "open",
//     imageUrl: "",
//     artists: [],
//     forSingleArtist: false,
//     artworks: [],
//   });
//   const [users, setUsers] = useState([]);
//   const [artistSearch, setArtistSearch] = useState("");
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [editingArtworkIdx, setEditingArtworkIdx] = useState(null);
//   const [newArtwork, setNewArtwork] = useState({
//     name: "",
//     artist: "",
//     description: "",
//     imageFile: null,
//   });

//   useEffect(() => {
//     const fetchExhibition = async () => {
//       const docRef = doc(db, "exhibitions", id);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setForm((prev) => ({ ...prev, ...docSnap.data() }));
//       }
//     };

//     const fetchUsers = async () => {
//       const userSnapshot = await getDocs(collection(db, "users"));
//       const userList = userSnapshot.docs
//         .map((doc) => doc.data().name)
//         .filter(Boolean);
//       setUsers(userList);
//       setFilteredUsers(userList);
//     };

//     fetchExhibition();
//     fetchUsers();
//   }, [id]);

//   useEffect(() => {
//     if (artistSearch.trim() === "") {
//       setFilteredUsers([]);
//     } else {
//       setFilteredUsers(
//         users.filter((name) =>
//           name.toLowerCase().includes(artistSearch.toLowerCase())
//         )
//       );
//     }
//   }, [artistSearch, users]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   //   const handleSave = async () => {
//   //     const docRef = doc(db, "exhibitions", id);
//   //     await updateDoc(docRef, form);
//   //     navigate("/admin/exhibitions");
//   //   };
//   const handleSave = async () => {
//     const docRef = doc(db, "exhibitions", id);
//     const now = new Date();

//     // Filter out imageFile from each artwork before saving
//     const sanitizedArtworks = form.artworks.map((art) => {
//       const { imageFile, ...rest } = art;
//       return rest;
//     });

//     await updateDoc(docRef, {
//       ...form,
//       artworks: sanitizedArtworks,
//       updatedAt: now,
//       createdAt: form.createdAt || now,
//     });

//     navigate("/admin/exhibitions");
//   };

//   const handleAddArtist = (artist) => {
//     if (!form.artists.includes(artist)) {
//       setForm((prev) => ({ ...prev, artists: [...prev.artists, artist] }));
//     }
//     setArtistSearch("");
//   };

//   const handleRemoveArtist = (artist) => {
//     setForm((prev) => ({
//       ...prev,
//       artists: prev.artists.filter((a) => a !== artist),
//     }));
//   };

//   const handleDeleteArtwork = (idx) => {
//     const confirmDelete = window.confirm(
//       "האם את/ה בטוח/ה שברצונך למחוק את היצירה?"
//     );
//     if (!confirmDelete) return;
//     setForm((prev) => ({
//       ...prev,
//       artworks: prev.artworks.filter((_, i) => i !== idx),
//     }));
//   };

//   //   const handleAddArtwork = () => {
//   //     if (!newArtwork.imageFile) return alert("נא לבחור תמונה");
//   //     const imageUrl = URL.createObjectURL(newArtwork.imageFile);
//   //     const newEntry = {
//   //       ...newArtwork,
//   //       imageUrl,
//   //       approved: true,
//   //       createdByAdmin: true,
//   //       id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
//   //     };
//   //     setForm((prev) => ({
//   //       ...prev,
//   //       artworks: [...prev.artworks, newEntry],
//   //     }));
//   //     setNewArtwork({ name: "", artist: "", description: "", imageFile: null });
//   //     setEditingArtworkIdx(null);
//   //   };
//   const handleAddArtwork = () => {
//     if (!newArtwork.imageFile) {
//       alert("נא לבחור תמונה");
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const imageUrl = reader.result;

//       const newEntry = {
//         ...newArtwork,
//         imageUrl,
//         imageFile: null, // don't keep File objects
//         approved: true,
//         createdByAdmin: true,
//         id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
//       };

//       setForm((prev) => ({
//         ...prev,
//         artworks: [...prev.artworks, newEntry],
//       }));

//       setNewArtwork({ name: "", artist: "", description: "", imageFile: null });
//       setEditingArtworkIdx(null);
//     };

//     reader.readAsDataURL(newArtwork.imageFile);
//   };

//   //   const handleEditArtwork = () => {
//   //     const imageUrl = newArtwork.imageFile
//   //       ? URL.createObjectURL(newArtwork.imageFile)
//   //       : form.artworks[editingArtworkIdx].imageUrl;
//   //     const updatedArtwork = {
//   //       ...newArtwork,
//   //       imageUrl,
//   //       approved: true,
//   //       createdByAdmin: true,
//   //     };
//   //     setForm((prev) => ({
//   //       ...prev,
//   //       artworks: prev.artworks.map((art, idx) =>
//   //         idx === editingArtworkIdx ? updatedArtwork : art
//   //       ),
//   //     }));
//   //     setNewArtwork({ name: "", artist: "", description: "", imageFile: null });
//   //     setEditingArtworkIdx(null);
//   //   };
//   const handleEditArtwork = () => {
//     if (newArtwork.imageFile) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         updateEditedArtwork(reader.result);
//       };
//       reader.readAsDataURL(newArtwork.imageFile);
//     } else {
//       const existingImageUrl = form.artworks[editingArtworkIdx].imageUrl;
//       updateEditedArtwork(existingImageUrl);
//     }
//   };

//   const updateEditedArtwork = (imageUrl) => {
//     const updatedArtwork = {
//       ...newArtwork,
//       imageUrl,
//       approved: true,
//       createdByAdmin: true,
//       id: form.artworks[editingArtworkIdx].id, // preserve ID
//     };

//     setForm((prev) => ({
//       ...prev,
//       artworks: prev.artworks.map((art, idx) =>
//         idx === editingArtworkIdx ? updatedArtwork : art
//       ),
//     }));

//     setNewArtwork({ name: "", artist: "", description: "", imageFile: null });
//     setEditingArtworkIdx(null);
//   };

//   const handleEditBtn = (art, idx) => {
//     setNewArtwork({
//       name: art.name,
//       artist: art.artist,
//       description: art.description,
//       imageFile: null,
//     });
//     setEditingArtworkIdx(idx);
//   };
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setForm((prev) => ({ ...prev, imageUrl: reader.result }));
//     };
//     reader.readAsDataURL(file);
//   };

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDoc,
  doc,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

const EditExhibition = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "open",
    imageUrl: "",
    artists: [],
    forSingleArtist: false,
    artworks: [],
  });
  const [users, setUsers] = useState([]);
  const [artistSearch, setArtistSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingArtworkIdx, setEditingArtworkIdx] = useState(null);
  const [newArtwork, setNewArtwork] = useState({
    name: "",
    artist: "",
    description: "",
    technique: "",
    phone: "",
    imageFile: null,
  });

  useEffect(() => {
    const fetchExhibition = async () => {
      const docRef = doc(db, "exhibitions", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setForm((prev) => ({ ...prev, ...docSnap.data() }));
      }
    };

    const fetchUsers = async () => {
      const userSnapshot = await getDocs(collection(db, "users"));
      const userList = userSnapshot.docs
        .map((doc) => doc.data().name)
        .filter(Boolean);
      setUsers(userList);
      setFilteredUsers(userList);
    };

    fetchExhibition();
    fetchUsers();
  }, [id]);

  useEffect(() => {
    if (artistSearch.trim() === "") {
      setFilteredUsers([]);
    } else {
      setFilteredUsers(
        users.filter((name) =>
          name.toLowerCase().includes(artistSearch.toLowerCase())
        )
      );
    }
  }, [artistSearch, users]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    const docRef = doc(db, "exhibitions", id);
    const now = new Date();
    // const sanitizedArtworks = form.artworks.map((art) => {
    //   const { imageFile, ...rest } = art;
    //   return rest;
    // });
    const sanitizedArtworks = form.artworks.map((art) => {
      const { imageFile, ...rest } = art;

      // Remove undefined fields manually
      Object.keys(rest).forEach((key) => {
        if (rest[key] === undefined) {
          delete rest[key];
        }
      });

      return rest;
    });

    await updateDoc(docRef, {
      ...form,
      artworks: sanitizedArtworks,
      updatedAt: now,
      createdAt: form.createdAt || now,
    });

    navigate("/admin/exhibitions");
  };

  const handleAddArtist = (artist) => {
    if (!form.artists.includes(artist)) {
      setForm((prev) => ({ ...prev, artists: [...prev.artists, artist] }));
    }
    setArtistSearch("");
  };

  const handleRemoveArtist = (artist) => {
    setForm((prev) => ({
      ...prev,
      artists: prev.artists.filter((a) => a !== artist),
    }));
  };

  const handleDeleteArtwork = (idx) => {
    const confirmDelete = window.confirm(
      "האם את/ה בטוח/ה שברצונך למחוק את היצירה?"
    );
    if (!confirmDelete) return;
    setForm((prev) => ({
      ...prev,
      artworks: prev.artworks.filter((_, i) => i !== idx),
    }));
  };

  const handleAddArtwork = () => {
    if (!newArtwork.imageFile) {
      alert("נא לבחור תמונה");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result;

      const newEntry = {
        ...newArtwork,
        imageUrl,
        imageFile: null,
        approved: true,
        createdByAdmin: true,
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      };

      setForm((prev) => ({
        ...prev,
        artworks: [...prev.artworks, newEntry],
      }));

      setNewArtwork({
        name: "",
        artist: "",
        description: "",
        technique: "",
        phone: "",
        imageFile: null,
      });
      setEditingArtworkIdx(null);
    };

    reader.readAsDataURL(newArtwork.imageFile);
  };

  const handleEditArtwork = () => {
    if (newArtwork.imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateEditedArtwork(reader.result);
      };
      reader.readAsDataURL(newArtwork.imageFile);
    } else {
      const existingImageUrl = form.artworks[editingArtworkIdx].imageUrl;
      updateEditedArtwork(existingImageUrl);
    }
  };

  const updateEditedArtwork = (imageUrl) => {
    const updatedArtwork = {
      ...newArtwork,
      imageUrl,
      approved: true,
      createdByAdmin: true,
      id: form.artworks[editingArtworkIdx].id,
    };

    setForm((prev) => ({
      ...prev,
      artworks: prev.artworks.map((art, idx) =>
        idx === editingArtworkIdx ? updatedArtwork : art
      ),
    }));

    setNewArtwork({
      name: "",
      artist: "",
      description: "",
      technique: "",
      phone: "",
      imageFile: null,
    });
    setEditingArtworkIdx(null);
  };

  const handleEditBtn = (art, idx) => {
    setNewArtwork({
      name: art.name,
      artist: art.artist,
      description: art.description,
      technique: art.technique || "",
      phone: art.phone || "",
      imageFile: null,
    });
    setEditingArtworkIdx(idx);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 text-right bg-white shadow-xl rounded-xl">
      <h1 className="text-3xl font-extrabold text-pink-600 mb-8">
        ערוך תערוכה
      </h1>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block mb-1">שם התערוכה</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-1">מיקום</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block mb-1">תיאור</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-lg"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block mb-1">תאריך פתיחה</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-1">תאריך סגירה</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-1">סטטוס</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
          >
            <option value="open">פתוחה</option>
            <option value="closed">סגורה</option>
          </select>
        </div>
      </div>
      {/* 
      <div className="mb-6">
        <label className="block mb-1">תמונה</label>
        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="תמונה"
            className="w-40 h-40 object-cover rounded mb-2"
          />
        )}
        {/* <input
          type="text"
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="הדבק קישור לתמונה או העלה"
          className="w-full border px-4 py-2 rounded-lg"
        /> */}
      {/* </div>  */}
      <div className="mb-6">
        <label className="block mb-1">תמונה (תעלה תמונה מהמחשב)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full border px-4 py-2 rounded-lg"
        />
        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="preview"
            className="mt-2 w-48 rounded"
          />
        )}
      </div>

      <div className="mb-6">
        <label className="block mb-1">חיפוש אמנים</label>
        <input
          type="text"
          value={artistSearch}
          onChange={(e) => setArtistSearch(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg mb-2"
          placeholder="הקלד שם אמן..."
        />
        {filteredUsers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filteredUsers.map((name) => (
              <button
                key={name}
                onClick={() => handleAddArtist(name)}
                className="bg-gray-200 px-3 py-1 rounded-full hover:bg-gray-300"
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            name="forSingleArtist"
            checked={form.forSingleArtist}
            onChange={handleChange}
            className="ml-2"
          />
          תערוכה לאמן יחיד
        </label>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4">הוספת יצירה חדשה</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="שם יצירה"
            className="border p-2 rounded"
            value={newArtwork.name}
            onChange={(e) =>
              setNewArtwork({ ...newArtwork, name: e.target.value })
            }
          />
          <input
            placeholder="אמן"
            className="border p-2 rounded"
            value={newArtwork.artist}
            onChange={(e) =>
              setNewArtwork({ ...newArtwork, artist: e.target.value })
            }
          />
          <input
            type="file"
            accept="image/*"
            className="border p-2 rounded"
            onChange={(e) =>
              setNewArtwork({ ...newArtwork, imageFile: e.target.files[0] })
            }
          />
          <textarea
            placeholder="תיאור"
            className="border p-2 rounded col-span-2"
            value={newArtwork.description}
            onChange={(e) =>
              setNewArtwork({ ...newArtwork, description: e.target.value })
            }
          />
          <input
            placeholder="טכניקה"
            className="border p-2 rounded"
            value={newArtwork.technique}
            onChange={(e) =>
              setNewArtwork({ ...newArtwork, technique: e.target.value })
            }
          />

          <input
            placeholder="מספר טלפון"
            className="border p-2 rounded"
            value={newArtwork.phone}
            onChange={(e) =>
              setNewArtwork({ ...newArtwork, phone: e.target.value })
            }
          />
        </div>
        <button
          onClick={
            editingArtworkIdx === null ? handleAddArtwork : handleEditArtwork
          }
          className="mt-4 bg-pink-600 text-white px-4 py-2 rounded-full"
        >
          {editingArtworkIdx === null ? "הוסף יצירה" : "שמור שינויים ביצירה"}
        </button>
      </div>

      {form.artworks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">
            יצירות שנוספו על ידי האדמין
          </h2>
          <ul className="space-y-4">
            {form.artworks.map((art, idx) => (
              <li
                key={idx}
                className="border p-4 rounded-lg flex gap-4 items-center bg-white shadow"
              >
                {art.imageUrl && (
                  <img
                    src={art.imageUrl}
                    alt={art.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-grow">
                  <p className="font-bold text-pink-600 text-lg">{art.name}</p>
                  <p className="text-sm text-gray-600 mb-1">{art.artist}</p>
                  <p className="text-sm text-gray-700 italic">
                    {art.description}
                  </p>
                </div>
                <button
                  onClick={() => handleEditBtn(art, idx)}
                  className="text-blue-500 hover:text-blue-700 mr-3"
                >
                  <span role="img" aria-label="edit">
                    ✏️
                  </span>{" "}
                </button>
                <button
                  onClick={() => handleDeleteArtwork(idx)}
                  className="text-red-600 hover:text-red-800"
                >
                  <span role="img" aria-label="delete">
                    🗑️
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* <button
        onClick={handleSave}
        className="bg-pink-600 text-white px-6 py-2 rounded-full font-bold hover:bg-pink-700  ml-4"
      >
        שמור שינויים
      </button> */}
      {editingArtworkIdx !== null && (
        <p className="text-red-600 font-bold mb-2">
          סיים עריכת היצירה ולחץ "שמור שינויים ביצירה" לפני המשך.
        </p>
      )}

      <button
        onClick={() => {
          if (editingArtworkIdx !== null) {
            alert("שמור קודם את השינויים ביצירה לפני שמירה כוללת");
            return;
          }
          handleSave();
        }}
        className={`bg-pink-600 text-white px-6 py-2 rounded-full font-bold ml-4 ${
          editingArtworkIdx !== null
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-pink-700"
        }`}
      >
        שמור שינויים
      </button>

      <button
        onClick={() => navigate("/admin/exhibitions")}
        className="ml-4 bg-gray-300 text-gray-800 px-6 py-2 rounded-full font-bold hover:bg-gray-400"
      >
        חזרה
      </button>
    </div>
  );
};

export default EditExhibition;
