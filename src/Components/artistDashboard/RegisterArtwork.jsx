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
import "./RegisterArtwork.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const RegisterArtwork = () => {
  const query = useQuery();
  const exhibitionId = query.get("exhibitionId");

  const [exhibitionName, setExhibitionName] = useState("");
  const [artworkName, setArtworkName] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [year, setYear] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchExhibition = async () => {
      if (exhibitionId) {
        const docRef = doc(db, "exhibitions", exhibitionId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setExhibitionName(docSnap.data().title || "");
        }
      }
    };
    fetchExhibition();
  }, [exhibitionId]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setImagePreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!artworkName || !description || !size || !image || !phone) {
      setError("אנא מלא את כל השדות החובה.");
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        setError("המשתמש לא מחובר. אנא התחבר מחדש.");
        return;
      }

      let imageUrl = "";
      if (image) {
        imageUrl = await uploadImageToImgBB(image);
      }

      const exhibitionRef = doc(db, "exhibitions", exhibitionId);
      const exhibitionSnap = await getDoc(exhibitionRef);
      const exhibitionTitle = exhibitionSnap.exists()
        ? exhibitionSnap.data().title
        : "Untitled";

      // Save phone to registration document
      const registrationRef = doc(
        db,
        "users",
        user.uid,
        "registrations",
        exhibitionId
      );
      await setDoc(registrationRef, { exhibitionTitle, phone }, { merge: true });

      // Add artwork under this registration
      const artworkRef = collection(registrationRef, "artworks");
      const newArtworkDoc = await addDoc(artworkRef, {
        artworkName,
        description,
        imageUrl,
        year,
        size,
        price: price.trim() === "" ? "please contact artist" : price.trim(),
        createdAt: Timestamp.now(),
        approved: false,
        phone, // Save phone with artwork for easy access
      });

      // Duplicate to centralized path
      const centralRef = doc(
        db,
        "exhibition_artworks",
        exhibitionId,
        "artworks",
        newArtworkDoc.id
      );
      await setDoc(centralRef, {
        artworkName,
        description,
        imageUrl,
        year,
        size,
        price: price.trim() === "" ? "please contact artist" : price.trim(),
        createdAt: Timestamp.now(),
        approved: false,
        userId: user.uid,
        artistName: user.displayName,
        phone, // Save phone in central doc
      });

      setSuccess(true);
      setArtworkName("");
      setDescription("");
      setImage(null);
      setImagePreview("");
      setSize("");
      setYear("");
      setPrice("");
      setPhone("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Registration failed:", err);
      setError("אירעה שגיאה בשליחת הטופס.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="artwork-form-container">
      <h2 className="form-title">הרשמה לתערוכה</h2>
      {exhibitionName && (
        <div
          className="exhibition-name"
          style={{ textAlign: "center", marginBottom: "20px" }}
        >
          {exhibitionName}
        </div>
      )}
      <form className="artwork-form" onSubmit={handleSubmit}>
        <label>
          שם היצירה*:
          <input
            type="text"
            value={artworkName}
            onChange={(e) => setArtworkName(e.target.value)}
            required
          />
        </label>

        <label>
          תיאור היצירה:
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label>
          מידות היצירה*:
          <input
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            required
          />
        </label>

        <label>
          שנת היצירה:*
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            placeholder="למשל: 2023"
          />
        </label>

        <label>
          תמונת היצירה*:
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            required
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                maxWidth: "100%",
                marginTop: "10px",
                borderRadius: "8px",
              }}
            />
          )}
        </label>

        <label>
          מחיר (לא חובה):
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="please contact artist"
          />
        </label>

        <label>
          מספר טלפון*:
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="הכנס מספר טלפון"
            pattern="[0-9\-\+\s]{9,15}"
          />
        </label>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">ההרשמה בוצעה בהצלחה!</div>}

        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {loading ? "שולח..." : "שלח הרשמה"}
          </button>
          <button type="button" onClick={() => navigate("/artist-dashboard")}>
            חזור
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterArtwork;
