// src/components/AdminDashboard/ArtworkModal.jsx
import React, { useState } from "react";

const ArtworkModal = ({ isOpen, onClose, onSave, artwork, isEdit }) => {
  const [form, setForm] = useState(
    artwork || { name: "", artist: "", description: "", imageUrl: "" }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        className="bg-white p-6 rounded-lg w-[90%] max-w-lg shadow-lg text-right"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-pink-600">
          {isEdit ? "ערוך יצירה" : "הוסף יצירה"}
        </h2>

        <div className="mb-3">
          <label className="block font-medium">שם היצירה</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded p-2 mt-1"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block font-medium">שם האמן</label>
          <input
            name="artist"
            value={form.artist}
            onChange={handleChange}
            className="w-full border rounded p-2 mt-1"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block font-medium">תיאור</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded p-2 mt-1"
            rows="3"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">תמונה (URL)</label>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full border rounded p-2 mt-1"
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            ביטול
          </button>
          <button
            type="submit"
            className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
          >
            שמור
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArtworkModal;
