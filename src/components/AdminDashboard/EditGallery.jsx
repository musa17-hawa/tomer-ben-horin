import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { uploadToImgBB } from "../../utils/imgbb";

const EditGallery = () => {
  const { galleryId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    status: "פתוחה",
    imageUrl: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      const docRef = doc(db, "galleries", galleryId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setForm(data);
        setPreviewImage(data.imageUrl || null);
      }
    };

    fetchGallery();
  }, [galleryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = form.imageUrl;

    if (imageFile) {
      imageUrl = await uploadToImgBB(imageFile);
    }

    await updateDoc(doc(db, "galleries", galleryId), {
      ...form,
      imageUrl,
    });

    navigate("/admin/galleries");
  };

  return (
    <div
      className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10"
      dir="rtl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name & Location */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-bold mb-1">שם הגלריה</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-bold mb-1">מיקום</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold mb-1">תיאור</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-bold mb-1">סטטוס</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="פתוחה">פתוחה</option>
            <option value="סגורה">סגורה</option>
          </select>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-bold mb-1">תמונת גלריה</label>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-32 h-32 object-cover rounded mb-2"
            />
          )}
          <label className="inline-block px-4 py-2 border border-pink-600 text-pink-600 rounded hover:bg-pink-50 cursor-pointer">
            שנה תמונה
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 rounded-full"
        >
          שמור שינויים
        </button>
      </form>
    </div>
  );
};

export default EditGallery;
