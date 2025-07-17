import React, { useState } from "react";

const GalleryModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    status: "פתוחה",
    image: null,
    imageUrl: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center font-sans">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 text-right relative">
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-gray-600 hover:text-red-500 text-lg"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-pink-600">
          הוסף גלריה חדשה
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="title"
            placeholder="שם הגלריה"
            value={formData.title}
            onChange={handleChange}
            className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
          <textarea
            name="description"
            placeholder="תיאור קצר"
            value={formData.description}
            onChange={handleChange}
            className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            rows={3}
          />
          <input
            name="location"
            placeholder="מיקום"
            value={formData.location}
            onChange={handleChange}
            className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border border-gray-300 rounded-xl p-3"
          >
            <option value="פתוחה">פתוחה</option>
            <option value="סגורה">סגורה</option>
          </select>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="p-1"
            accept="image/*"
          />

          <button
            type="submit"
            className="bg-pink-500 text-white py-2 rounded-xl hover:bg-pink-600 transition"
          >
            שמור גלריה
          </button>
        </form>
      </div>
    </div>
  );
};

export default GalleryModal;
