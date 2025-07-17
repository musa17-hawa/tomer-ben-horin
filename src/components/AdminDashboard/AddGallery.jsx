// // ✅ AddGallery.jsx (fixed)
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { db } from "../../firebase/config";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// import { uploadToImgBB } from "../../utils/imgbb";

// const AddGallery = () => {
//   const [form, setForm] = useState({
//     title: "",
//     location: "",
//     description: "",
//     status: "open",
//     image: null,
//     imageUrl: "",
//   });
//   const [previewImage, setPreviewImage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;
//     if (type === "file" && files[0]) {
//       setForm((prev) => ({ ...prev, [name]: files[0] }));
//       setPreviewImage(URL.createObjectURL(files[0]));
//     } else {
//       setForm((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       let imageUrl = "";
//       if (form.image) {
//         imageUrl = await uploadToImgBB(form.image);
//       }
//       await addDoc(collection(db, "galleries"), {
//         title: form.title,
//         location: form.location,
//         description: form.description,
//         status: form.status,
//         imageUrl,
//         createdAt: serverTimestamp(),
//       });
//       navigate("/admin/galleries");
//     } catch (err) {
//       console.error("Error adding gallery:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6" dir="rtl">
//       <h2 className="text-3xl font-bold text-pink-600 mb-6">הוסף גלריה חדשה</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           name="title"
//           value={form.title}
//           onChange={handleChange}
//           placeholder="הכנס שם גלריה"
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           name="location"
//           value={form.location}
//           onChange={handleChange}
//           placeholder="הכנס מיקום"
//           className="w-full p-2 border rounded"
//           required
//         />
//         <textarea
//           name="description"
//           value={form.description}
//           onChange={handleChange}
//           placeholder="הכנס תיאור לגלריה"
//           className="w-full p-2 border rounded"
//         />
//         <select
//           name="status"
//           value={form.status}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         >
//           <option value="open">פתוחה</option>
//           <option value="closed">סגורה</option>
//         </select>
//         <div className="space-y-2">
//           {previewImage && (
//             <img
//               src={previewImage}
//               alt="Gallery preview"
//               className="w-32 h-32 object-cover rounded"
//             />
//           )}
//           <input
//             name="image"
//             type="file"
//             accept="image/*"
//             onChange={handleChange}
//             className="block"
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
//         >
//           {loading ? "שומר..." : "שמור גלריה"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddGallery;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uploadToImgBB } from "../../utils/imgbb";

const AddGallery = () => {
  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    status: "open",
    image: null,
    imageUrl: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files[0]) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let imageUrl = "";
      if (form.image) {
        imageUrl = await uploadToImgBB(form.image);
      }
      await addDoc(collection(db, "galleries"), {
        title: form.title,
        location: form.location,
        description: form.description,
        status: form.status,
        imageUrl,
        createdAt: serverTimestamp(),
      });
      navigate("/admin/galleries");
    } catch (err) {
      console.error("Error adding gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center p-6"
      dir="rtl"
    >
      <div className="w-full max-w-4xl bg-white p-10 rounded-2xl shadow-xl">
        <h2 className="text-5xl font-extrabold text-pink-600 mb-10 text-center">
          הוסף גלריה חדשה
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8 text-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="הכנס שם גלריה"
              className="p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="הכנס מיקום"
              className="p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="הכנס תיאור לגלריה"
            className="w-full h-32 p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="open">פתוחה</option>
            <option value="closed">סגורה</option>
          </select>

          <div className="flex flex-col gap-4 items-center">
            {previewImage && (
              <img
                src={previewImage}
                alt="Gallery preview"
                className="w-48 h-48 object-cover rounded-xl shadow border"
              />
            )}
            <input
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-lg text-gray-700 bg-white border border-gray-300 rounded-xl p-3 file:mr-4 file:py-3 file:px-5 file:border-0 file:text-base file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 text-white text-xl py-4 rounded-xl hover:bg-pink-700 transition duration-200 font-bold shadow"
          >
            {loading ? "שומר..." : "שמור גלריה"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGallery;
