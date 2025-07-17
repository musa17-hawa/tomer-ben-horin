import React, { useState, useEffect } from "react";
import ArtworkModal from "./ArtworkModal";

const mockArtists = ["אמן א", "אמן ב", "אמן ג", "אמן ד", "אמן ה"];

export default function ExhibitionEditModal({
  isOpen,
  onClose,
  onSave,
  exhibition,
}) {
  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    startDate: "",
    endDate: "",
    image: null,
    artists: [],
    artistSearch: "",
    status: "open",
    artworks: [],
    imageUrl: "",
  });
  const [artworkModalOpen, setArtworkModalOpen] = useState(false);
  const [editingArtworkIdx, setEditingArtworkIdx] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (exhibition) {
      setForm({
        ...form,
        ...exhibition,
        artistSearch: "",
        image: null,
      });
      setPreviewImage(exhibition.imageUrl || null);
    } else {
      setPreviewImage(null);
    }
  }, [exhibition, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files[0]) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArtistSelect = (artist) => {
    if (!form.artists.includes(artist)) {
      setForm((prev) => ({
        ...prev,
        artists: [...prev.artists, artist],
        artistSearch: "",
      }));
    }
  };

  const handleArtistRemove = (artist) => {
    setForm((prev) => ({
      ...prev,
      artists: prev.artists.filter((a) => a !== artist),
    }));
  };

  const handleAddArtwork = (data) => {
    const newArtwork = {
      ...data,
      approved: true,
      createdByAdmin: true,
      id: Date.now().toString(),
    };
    setForm((prev) => ({ ...prev, artworks: [...prev.artworks, newArtwork] }));
    setToast("היצירה נוספה בהצלחה!");
  };

  const handleEditArtwork = (data) => {
    const updatedArtwork = { ...data, approved: true, createdByAdmin: true };
    setForm((prev) => ({
      ...prev,
      artworks: prev.artworks.map((a, i) =>
        i === editingArtworkIdx ? updatedArtwork : a
      ),
    }));
    setToast("היצירה עודכנה בהצלחה!");
  };

  const handleDeleteArtwork = (idx) => {
    setForm((prev) => ({
      ...prev,
      artworks: prev.artworks.filter((_, i) => i !== idx),
    }));
    setToast("היצירה נמחקה בהצלחה!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const filteredArtists = mockArtists.filter(
    (a) => a.includes(form.artistSearch) && !form.artists.includes(a)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-2xl font-bold">עריכת תערוכה</h2>
          <button className="text-gray-600 text-2xl" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">שם התערוכה</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1">מיקום</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">תיאור</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded p-2"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1">תאריך התחלה</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1">תאריך סיום</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block mb-1">סטטוס</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="open">פתוחה</option>
                <option value="closed">סגורה</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div>
              <label className="block mb-1">תמונה</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="block"
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="preview"
                  className="mt-2 w-32 h-32 object-cover rounded"
                />
              )}
            </div>
            <div className="flex-1">
              <label className="block mb-1">אמנים</label>
              <input
                type="text"
                value={form.artistSearch}
                onChange={(e) =>
                  setForm({ ...form, artistSearch: e.target.value })
                }
                placeholder="חפש אמן..."
                className="w-full border rounded p-2 mb-2"
              />
              <div className="flex flex-wrap gap-2">
                {form.artists.map((artist) => (
                  <span
                    key={artist}
                    className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm"
                  >
                    {artist}
                    <button
                      type="button"
                      onClick={() => handleArtistRemove(artist)}
                      className="ml-1 text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              {filteredArtists.length > 0 && (
                <ul className="bg-white border mt-2 rounded shadow max-h-32 overflow-auto">
                  {filteredArtists.map((a) => (
                    <li
                      key={a}
                      onClick={() => handleArtistSelect(a)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">יצירות אמנות</h3>
              <button
                type="button"
                onClick={() => {
                  setEditingArtworkIdx(null);
                  setArtworkModalOpen(true);
                }}
                className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
              >
                + הוסף יצירה
              </button>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {form.artworks.length === 0 && (
                <li className="text-gray-500">אין יצירות</li>
              )}
              {form.artworks.map((art, idx) => (
                <li
                  key={idx}
                  className="border rounded p-3 flex gap-4 items-center"
                >
                  {art.imageUrl && (
                    <img
                      src={art.imageUrl}
                      alt={art.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-bold">{art.name}</div>
                    <div className="text-sm text-pink-600">{art.artist}</div>
                    <div className="text-sm text-gray-600">
                      {art.description}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      className="text-blue-600"
                      onClick={() => {
                        setEditingArtworkIdx(idx);
                        setArtworkModalOpen(true);
                      }}
                    >
                      ערוך
                    </button>
                    <button
                      type="button"
                      className="text-red-600"
                      onClick={() => handleDeleteArtwork(idx)}
                    >
                      מחק
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-3 rounded hover:bg-pink-700"
          >
            שמור שינויים
          </button>
        </form>

        {toast && (
          <div className="fixed bottom-6 right-6 bg-pink-600 text-white px-4 py-2 rounded shadow">
            {toast}
          </div>
        )}

        <ArtworkModal
          isOpen={artworkModalOpen}
          onClose={() => setArtworkModalOpen(false)}
          onSave={(data) => {
            editingArtworkIdx === null
              ? handleAddArtwork(data)
              : handleEditArtwork(data);
            setArtworkModalOpen(false);
            setEditingArtworkIdx(null);
          }}
          artwork={
            editingArtworkIdx !== null ? form.artworks[editingArtworkIdx] : null
          }
          isEdit={editingArtworkIdx !== null}
        />
      </div>
    </div>
  );
}
