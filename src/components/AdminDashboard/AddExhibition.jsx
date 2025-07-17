// // import React, { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { addDoc, collection, getDocs } from "firebase/firestore";
// // import { db } from "../../firebase/config";

// // const AddExhibition = () => {
// //   const navigate = useNavigate();
// //   const [form, setForm] = useState({
// //     title: "",
// //     location: "",
// //     description: "",
// //     startDate: "",
// //     endDate: "",
// //     status: "open",
// //     imageUrl: "",
// //     artists: [],
// //     forSingleArtist: false,
// //     artworks: [],
// //   });
// //   const [users, setUsers] = useState([]);
// //   const [artistSearch, setArtistSearch] = useState("");
// //   const [filteredUsers, setFilteredUsers] = useState([]);

// //   useEffect(() => {
// //     const fetchUsers = async () => {
// //       const snapshot = await getDocs(collection(db, "users"));
// //       const names = snapshot.docs.map((doc) => doc.data().name).filter(Boolean);
// //       setUsers(names);
// //     };
// //     fetchUsers();
// //   }, []);

// //   useEffect(() => {
// //     setFilteredUsers(
// //       artistSearch.trim() === ""
// //         ? []
// //         : users.filter((name) =>
// //             name.toLowerCase().includes(artistSearch.toLowerCase())
// //           )
// //     );
// //   }, [artistSearch, users]);

// //   const handleChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setForm((prev) => ({
// //       ...prev,
// //       [name]: type === "checkbox" ? checked : value,
// //     }));
// //   };

// //   const handleAddArtist = (name) => {
// //     if (!form.artists.includes(name)) {
// //       setForm((prev) => ({ ...prev, artists: [...prev.artists, name] }));
// //     }
// //     setArtistSearch("");
// //   };

// //   const handleRemoveArtist = (name) => {
// //     setForm((prev) => ({
// //       ...prev,
// //       artists: prev.artists.filter((a) => a !== name),
// //     }));
// //   };

// //   const handleSubmit = async () => {
// //     await addDoc(collection(db, "exhibitions"), form);
// //     navigate("/admin/exhibitions");
// //   };

// //   return (
// //     <div className="max-w-4xl mx-auto py-10 px-4 text-right bg-white shadow-xl rounded-xl">
// //       <h1 className="text-3xl font-extrabold text-pink-600 mb-8">
// //         הוסף תערוכה חדשה
// //       </h1>
// //       <div className="grid md:grid-cols-2 gap-6 mb-6">
// //         <div>
// //           <label className="block mb-1">שם התערוכה</label>
// //           <input
// //             type="text"
// //             name="title"
// //             value={form.title}
// //             onChange={handleChange}
// //             className="w-full border px-4 py-2 rounded-lg"
// //           />
// //         </div>
// //         <div>
// //           <label className="block mb-1">מיקום</label>
// //           <input
// //             type="text"
// //             name="location"
// //             value={form.location}
// //             onChange={handleChange}
// //             className="w-full border px-4 py-2 rounded-lg"
// //           />
// //         </div>
// //       </div>
// //       <div className="mb-6">
// //         <label className="block mb-1">תיאור</label>
// //         <textarea
// //           name="description"
// //           value={form.description}
// //           onChange={handleChange}
// //           className="w-full border px-4 py-2 rounded-lg"
// //         />
// //       </div>
// //       <div className="grid md:grid-cols-3 gap-6 mb-6">
// //         <div>
// //           <label className="block mb-1">תאריך פתיחה</label>
// //           <input
// //             type="date"
// //             name="startDate"
// //             value={form.startDate}
// //             onChange={handleChange}
// //             className="w-full border px-4 py-2 rounded-lg"
// //           />
// //         </div>
// //         <div>
// //           <label className="block mb-1">תאריך סגירה</label>
// //           <input
// //             type="date"
// //             name="endDate"
// //             value={form.endDate}
// //             onChange={handleChange}
// //             className="w-full border px-4 py-2 rounded-lg"
// //           />
// //         </div>
// //         <div>
// //           <label className="block mb-1">סטטוס</label>
// //           <select
// //             name="status"
// //             value={form.status}
// //             onChange={handleChange}
// //             className="w-full border px-4 py-2 rounded-lg"
// //           >
// //             <option value="open">פתוחה</option>
// //             <option value="closed">סגורה</option>
// //           </select>
// //         </div>
// //       </div>
// //       <div className="mb-6">
// //         <label className="block mb-1">תמונה</label>
// //         <input
// //           type="text"
// //           name="imageUrl"
// //           value={form.imageUrl}
// //           onChange={handleChange}
// //           placeholder="קישור לתמונה"
// //           className="w-full border px-4 py-2 rounded-lg"
// //         />
// //       </div>
// //       <div className="mb-6">
// //         <label className="block mb-1">חיפוש אמנים</label>
// //         <input
// //           type="text"
// //           value={artistSearch}
// //           onChange={(e) => setArtistSearch(e.target.value)}
// //           className="w-full border px-4 py-2 rounded-lg mb-2"
// //           placeholder="הקלד שם אמן..."
// //         />
// //         <div className="flex flex-wrap gap-2">
// //           {filteredUsers.map((name) => (
// //             <button
// //               key={name}
// //               onClick={() => handleAddArtist(name)}
// //               className="bg-gray-200 px-3 py-1 rounded-full hover:bg-gray-300"
// //             >
// //               {name}
// //             </button>
// //           ))}
// //         </div>
// //         <div className="mt-4">
// //           <p className="mb-1 font-semibold">אמנים שנבחרו:</p>
// //           <div className="flex flex-wrap gap-2">
// //             {form.artists.map((name) => (
// //               <span
// //                 key={name}
// //                 className="bg-pink-100 px-3 py-1 rounded-full text-sm"
// //               >
// //                 {name}
// //                 <button
// //                   onClick={() => handleRemoveArtist(name)}
// //                   className="ml-2 text-red-500"
// //                 >
// //                   ×
// //                 </button>
// //               </span>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //       <div className="mb-6">
// //         <label className="inline-flex items-center">
// //           <input
// //             type="checkbox"
// //             name="forSingleArtist"
// //             checked={form.forSingleArtist}
// //             onChange={handleChange}
// //             className="ml-2"
// //           />
// //           תערוכה לאמן יחיד
// //         </label>
// //       </div>
// //       <button
// //         onClick={handleSubmit}
// //         className="bg-pink-600 text-white px-6 py-2 rounded-full font-bold hover:bg-pink-700"
// //       >
// //         שמור תערוכה
// //       </button>
// //     </div>
// //   );
// // };

// // export default AddExhibition;
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { db, storage } from "../../firebase/config";
// import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// const AddExhibition = () => {
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
//   const [imageFile, setImageFile] = useState(null);
//   const [newArtwork, setNewArtwork] = useState({
//     name: "",
//     description: "",
//     imageFile: null,
//     artist: "",
//   });

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const snapshot = await getDocs(collection(db, "users"));
//       const names = snapshot.docs.map((doc) => doc.data().name).filter(Boolean);
//       setUsers(names);
//     };
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     setFilteredUsers(
//       artistSearch.trim() === ""
//         ? []
//         : users.filter((name) =>
//             name.toLowerCase().includes(artistSearch.toLowerCase())
//           )
//     );
//   }, [artistSearch, users]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleImageUpload = async () => {
//     if (!imageFile) return "";
//     const imageRef = ref(
//       storage,
//       `exhibitions/${Date.now()}_${imageFile.name}`
//     );
//     await uploadBytes(imageRef, imageFile);
//     return await getDownloadURL(imageRef);
//   };

//   const handleAddArtist = (name) => {
//     if (!form.artists.includes(name)) {
//       setForm((prev) => ({ ...prev, artists: [...prev.artists, name] }));
//     }
//     setArtistSearch("");
//   };

//   const handleRemoveArtist = (name) => {
//     setForm((prev) => ({
//       ...prev,
//       artists: prev.artists.filter((a) => a !== name),
//     }));
//   };

//   const handleArtworkImageUpload = async (file) => {
//     const artRef = ref(storage, `artworks/${Date.now()}_${file.name}`);
//     await uploadBytes(artRef, file);
//     return await getDownloadURL(artRef);
//   };

//   const handleAddArtwork = async () => {
//     if (!newArtwork.name || !newArtwork.imageFile) return;
//     const imageUrl = await handleArtworkImageUpload(newArtwork.imageFile);
//     const artwork = {
//       ...newArtwork,
//       imageUrl,
//       approved: true,
//       createdByAdmin: true,
//     };
//     setForm((prev) => ({ ...prev, artworks: [...prev.artworks, artwork] }));
//     setNewArtwork({ name: "", description: "", imageFile: null, artist: "" });
//   };

//   const handleSubmit = async () => {
//     const uploadedImageUrl = await handleImageUpload();
//     const payload = {
//       ...form,
//       imageUrl: uploadedImageUrl,
//       createdAt: Timestamp.now(),
//     };
//     await addDoc(collection(db, "exhibitions"), payload);
//     navigate("/admin/exhibitions");
//   };

//   return (
//     <div className="max-w-4xl mx-auto py-10 px-4 text-right bg-white shadow-xl rounded-xl">
//       <h1 className="text-3xl font-extrabold text-pink-600 mb-8">
//         הוסף תערוכה חדשה
//       </h1>
//       <div className="grid md:grid-cols-2 gap-6 mb-6">
//         <div>
//           <label className="block mb-1">שם התערוכה</label>
//           <input
//             type="text"
//             name="title"
//             value={form.title}
//             onChange={handleChange}
//             className="w-full border px-4 py-2 rounded-lg"
//           />
//         </div>
//         <div>
//           <label className="block mb-1">מיקום</label>
//           <input
//             type="text"
//             name="location"
//             value={form.location}
//             onChange={handleChange}
//             className="w-full border px-4 py-2 rounded-lg"
//           />
//         </div>
//       </div>
//       <div className="mb-6">
//         <label className="block mb-1">תיאור</label>
//         <textarea
//           name="description"
//           value={form.description}
//           onChange={handleChange}
//           className="w-full border px-4 py-2 rounded-lg"
//         />
//       </div>
//       <div className="grid md:grid-cols-3 gap-6 mb-6">
//         <div>
//           <label className="block mb-1">תאריך פתיחה</label>
//           <input
//             type="date"
//             name="startDate"
//             value={form.startDate}
//             onChange={handleChange}
//             className="w-full border px-4 py-2 rounded-lg"
//           />
//         </div>
//         <div>
//           <label className="block mb-1">תאריך סגירה</label>
//           <input
//             type="date"
//             name="endDate"
//             value={form.endDate}
//             onChange={handleChange}
//             className="w-full border px-4 py-2 rounded-lg"
//           />
//         </div>
//         <div>
//           <label className="block mb-1">סטטוס</label>
//           <select
//             name="status"
//             value={form.status}
//             onChange={handleChange}
//             className="w-full border px-4 py-2 rounded-lg"
//           >
//             <option value="open">פתוחה</option>
//             <option value="closed">סגורה</option>
//           </select>
//         </div>
//       </div>
//       <div className="mb-6">
//         <label className="block mb-1">תמונה ראשית</label>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => setImageFile(e.target.files[0])}
//           className="w-full border px-4 py-2 rounded-lg"
//         />
//       </div>
//       <div className="mb-6">
//         <label className="block mb-1">חיפוש אמנים</label>
//         <input
//           type="text"
//           value={artistSearch}
//           onChange={(e) => setArtistSearch(e.target.value)}
//           className="w-full border px-4 py-2 rounded-lg mb-2"
//           placeholder="הקלד שם אמן..."
//         />
//         <div className="flex flex-wrap gap-2">
//           {filteredUsers.map((name) => (
//             <button
//               key={name}
//               onClick={() => handleAddArtist(name)}
//               className="bg-gray-200 px-3 py-1 rounded-full hover:bg-gray-300"
//             >
//               {name}
//             </button>
//           ))}
//         </div>
//         <div className="mt-4">
//           <p className="mb-1 font-semibold">אמנים שנבחרו:</p>
//           <div className="flex flex-wrap gap-2">
//             {form.artists.map((name) => (
//               <span
//                 key={name}
//                 className="bg-pink-100 px-3 py-1 rounded-full text-sm"
//               >
//                 {name}
//                 <button
//                   onClick={() => handleRemoveArtist(name)}
//                   className="ml-2 text-red-500"
//                 >
//                   ×
//                 </button>
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>
//       <div className="mb-6">
//         <label className="inline-flex items-center">
//           <input
//             type="checkbox"
//             name="forSingleArtist"
//             checked={form.forSingleArtist}
//             onChange={handleChange}
//             className="ml-2"
//           />
//           תערוכה לאמן יחיד
//         </label>
//       </div>
//       <div className="mb-6">
//         <h2 className="text-lg font-bold mb-2">הוסף יצירה של אדמין</h2>
//         <input
//           type="text"
//           placeholder="שם היצירה"
//           value={newArtwork.name}
//           onChange={(e) =>
//             setNewArtwork((prev) => ({ ...prev, name: e.target.value }))
//           }
//           className="w-full border px-4 py-2 rounded-lg mb-2"
//         />
//         <input
//           type="text"
//           placeholder="אמן (רשות)"
//           value={newArtwork.artist}
//           onChange={(e) =>
//             setNewArtwork((prev) => ({ ...prev, artist: e.target.value }))
//           }
//           className="w-full border px-4 py-2 rounded-lg mb-2"
//         />
//         <textarea
//           placeholder="תיאור"
//           value={newArtwork.description}
//           onChange={(e) =>
//             setNewArtwork((prev) => ({ ...prev, description: e.target.value }))
//           }
//           className="w-full border px-4 py-2 rounded-lg mb-2"
//         />
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) =>
//             setNewArtwork((prev) => ({ ...prev, imageFile: e.target.files[0] }))
//           }
//           className="w-full border px-4 py-2 rounded-lg mb-4"
//         />
//         <button
//           onClick={handleAddArtwork}
//           className="bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700"
//         >
//           הוסף יצירה
//         </button>
//       </div>
//       <button
//         onClick={handleSubmit}
//         className="bg-pink-600 text-white px-6 py-2 rounded-full font-bold hover:bg-pink-700"
//       >
//         שמור תערוכה
//       </button>
//     </div>
//   );
// };

// export default AddExhibition;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
import { useParams } from "react-router-dom";

const AddExhibition = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "open",
    imageUrl: "", // base64 will go here
    artists: [],
    forSingleArtist: false,
    artworks: [],
  });

  const [users, setUsers] = useState([]);
  const [artistSearch, setArtistSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { galleryId } = useParams(); // detect if adding in gallery

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const names = snapshot.docs.map((doc) => doc.data().name).filter(Boolean);
      setUsers(names);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      artistSearch.trim() === ""
        ? []
        : users.filter((name) =>
            name.toLowerCase().includes(artistSearch.toLowerCase())
          )
    );
  }, [artistSearch, users]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

  const handleAddArtist = (name) => {
    if (!form.artists.includes(name)) {
      setForm((prev) => ({ ...prev, artists: [...prev.artists, name] }));
    }
    setArtistSearch("");
  };

  const handleRemoveArtist = (name) => {
    setForm((prev) => ({
      ...prev,
      artists: prev.artists.filter((a) => a !== name),
    }));
  };

  // const handleSubmit = async () => {
  //   await addDoc(collection(db, "exhibitions"), {
  //     ...form,
  //     createdAt: Timestamp.now(),
  //     updatedAt: Timestamp.now(),
  //   });
  //   navigate("/admin/exhibitions");
  // };
  const handleSubmit = async () => {
    await addDoc(collection(db, "exhibitions"), {
      ...form,
      galleryId: galleryId || "", // add this line
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    // navigate accordingly
    navigate(
      galleryId ? `/admin/galleries/${galleryId}` : "/admin/exhibitions"
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 text-right bg-white shadow-xl rounded-xl">
      <h1 className="text-3xl font-extrabold text-pink-600 mb-8">
        הוסף תערוכה חדשה
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
        <div className="mt-4">
          <p className="mb-1 font-semibold">אמנים שנבחרו:</p>
          <div className="flex flex-wrap gap-2">
            {form.artists.map((name) => (
              <span
                key={name}
                className="bg-pink-100 px-3 py-1 rounded-full text-sm"
              >
                {name}
                <button
                  onClick={() => handleRemoveArtist(name)}
                  className="ml-2 text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
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

      <button
        onClick={handleSubmit}
        className="bg-pink-600 text-white px-6 py-2 rounded-full font-bold hover:bg-pink-700"
      >
        שמור תערוכה
      </button>
    </div>
  );
};

export default AddExhibition;
