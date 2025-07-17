import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db, uploadImageToImgBB } from "../../firebase/config";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";

const RegisterArtwork = () => {
  const queryParams = new URLSearchParams(useLocation().search);
  const exhibitionId = queryParams.get("exhibitionId");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [artwork, setArtwork] = useState({
    artworkName: "",
    description: "",
    size: "",
    year: "",
    price: "",
    image: null,
    firstNameEn: "",
    lastNameEn: "",
    phone: "", // ✅ NEW
    technique: "", // ✅ NEW
  });

  const [imagePreview, setImagePreview] = useState("");
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [exhibitionTitle, setExhibitionTitle] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchExhibitionTitle = async () => {
      const docSnap = await getDoc(doc(db, "exhibitions", exhibitionId));
      if (docSnap.exists()) {
        setExhibitionTitle(docSnap.data().title || "");
      }
    };
    fetchExhibitionTitle();
  }, [exhibitionId]);

  const handleChange = (e) => {
    setArtwork({ ...artwork, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArtwork({ ...artwork, image: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setArtwork({ ...artwork, image: null });
      setImagePreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const {
      artworkName,
      description,
      size,
      year,
      price,
      image,
      firstNameEn,
      lastNameEn,
    } = artwork;

    if (!artworkName || !description || !size || !year || !image) {
      setMessage("אנא מלא את כל השדות החובה כולל תמונה.");
      return;
    }

    try {
      setLoading(true);
      const imageUrl = await uploadImageToImgBB(image);

      const registrationRef = doc(
        db,
        "users",
        userId,
        "registrations",
        exhibitionId
      );

      // Save exhibition title in user's registration
      await setDoc(registrationRef, { exhibitionTitle }, { merge: true });

      const userArtworksRef = collection(registrationRef, "artworks");
      const newDocRef = await addDoc(userArtworksRef, {
        artworkName,
        description,
        size,
        year,
        price: price.trim() === "" ? "please contact artist" : price.trim(),
        imageUrl,
        createdAt: Timestamp.now(),
        approved: false,
        fullName: `${firstNameEn} ${lastNameEn}`.trim(),
        firstNameEn,
        lastNameEn,
        exhibitionId,
        userId,
      });

      // Duplicate artwork to central path for admin
      const centralRef = doc(
        db,
        "exhibition_artworks",
        exhibitionId,
        "artworks",
        newDocRef.id
      );
      await setDoc(centralRef, {
        artworkName,
        description,
        size,
        year,
        price: price.trim() === "" ? "please contact artist" : price.trim(),
        imageUrl,
        createdAt: Timestamp.now(),
        approved: false,
        fullName: `${firstNameEn} ${lastNameEn}`.trim(),
        technique: artwork.technique || "",
        phone: artwork.phone || "",

        exhibitionId,
        userId,
      });

      setMessage("היצירה נוספה בהצלחה!");
      setArtwork({
        artworkName: "",
        description: "",
        size: "",
        year: "",
        price: "",
        image: null,
        firstNameEn: "",
        lastNameEn: "",
        technique: "",
        phone: "",
      });
      setImagePreview("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      setMessage("אירעה שגיאה בהעלאת היצירה.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white py-10 px-4">
      <div className="flex justify-center mb-8">
        <img
          src="https://amutatbh.com/wp-content/uploads/2021/03/logo-new.svg"
          alt="Logo"
          className="h-20 drop-shadow-md"
        />
      </div>
      <div
        className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg"
        dir="rtl"
      >
        <h2 className="text-3xl font-bold text-pink-600 text-center mb-4">
          רישום יצירה לתערוכה
        </h2>
        {exhibitionTitle && (
          <h3 className="text-xl text-center text-gray-700 mb-6 font-semibold">
            {exhibitionTitle}
          </h3>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="rounded-lg max-h-60 object-contain border"
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="firstNameEn"
              value={artwork.firstNameEn}
              onChange={handleChange}
              placeholder="First Name in English"
              className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
            />
            <input
              name="lastNameEn"
              value={artwork.lastNameEn}
              onChange={handleChange}
              placeholder="Last Name in English"
              className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
            />
          </div>

          <input
            name="artworkName"
            value={artwork.artworkName}
            onChange={handleChange}
            placeholder="שם היצירה"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
          />

          <textarea
            name="description"
            value={artwork.description}
            onChange={handleChange}
            rows="3"
            placeholder="תיאור היצירה"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
          ></textarea>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              name="size"
              value={artwork.size}
              onChange={handleChange}
              placeholder="מידות"
              className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
            />
            <input
              name="year"
              type="number"
              value={artwork.year}
              onChange={handleChange}
              placeholder="שנה"
              className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
            />

            <input
              name="price"
              value={artwork.price}
              onChange={handleChange}
              placeholder="מחיר"
              className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="technique"
              value={artwork.technique}
              onChange={handleChange}
              placeholder="טכניקה"
              className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
            />
            <input
              name="phone"
              value={artwork.phone}
              onChange={handleChange}
              placeholder="טלפון ליצירת קשר"
              className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-pink-500 to-pink-400 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:scale-105 transition"
            >
              {loading ? "שולח..." : "שלח יצירה"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/artist-dashboard")}
              className="border border-pink-500 text-pink-500 px-6 py-2 rounded-lg font-semibold hover:bg-pink-50"
            >
              חזור
            </button>
          </div>

          {message && (
            <p className="text-center text-pink-600 mt-4">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterArtwork;
