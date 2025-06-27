import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db, uploadImageToImgBB } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc, onSnapshot } from "firebase/firestore";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import "./ArtistProfile.css";

const MAX_IMAGE_SIZE_MB = 5;

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();
  const profileRef = useRef();
  const printRef = useRef();
  const { id } = useParams();

  // Load profile
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const unsubDoc = onSnapshot(docRef, (snap) => {
          if (snap.exists()) {
            setProfile(snap.data());
            setMessage("");
          } else {
            setProfile(null);
            setMessage("No profile found.");
          }
          setLoading(false);
        });
        return () => unsubDoc();
      } else {
        setProfile(null);
        setMessage("Not logged in.");
        setLoading(false);
      }
    });
    return () => unsubAuth();
  }, []);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setMessage(`File size must be under ${MAX_IMAGE_SIZE_MB} MB.`);
      return;
    }
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setMessage("");
  };

  const uploadImageToImgBB = async (file) => {
    const apiKey = "8f43d546efb93c05215267d303f475e7";
    const form = new FormData();
    form.append("image", file);
    const res = await axios.post(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      form
    );
    return res.data.data.url;
  };

  const handleImageUpload = async () => {
    if (!imageFile) return profile?.image || "";
    try {
      return await uploadImageToImgBB(imageFile);
    } catch {
      setMessage("Failed to upload image.");
      return profile?.image || "";
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    const { name, bio, subject, email, place } = profile;
    const errs = {};

    if (!name) errs.name = "שדה חובה";
    if (!email) errs.email = "שדה חובה";
    if (!subject) errs.subject = "שדה חובה";
    if (!place) errs.place = "שדה חובה";
    if (!bio) errs.bio = "שדה חובה";

    // no numeric-only
    for (let [k, v] of Object.entries({ name, bio, subject, email, place })) {
      if (/^\d+$/.test(v)) errs[k] = "אסור להזין מספר בלבד";
    }

    if (Object.keys(errs).length) {
      setErrors(errs);
      setMessage("");
      return;
    }
    setErrors({});
    setIsSaving(true);

    try {
      const imageUrl = await handleImageUpload();
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        ...profile,
        image: imageUrl,
      });
      setMessage("Profile updated successfully");
      setTimeout(() => setMessage(""), 5000);
    } catch {
      setMessage("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    if (!printRef.current) return;
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#fff",
      });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(img, "PNG", 10, 10, w - 20, h - 20);
      pdf.save("profile.pdf");
    } catch {
      setMessage("Failed to export PDF.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>{message}</p>;

  return (
    <div className="profile-container" ref={profileRef}>
      <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
        {/* Picture */}
        <div className="profile-picture-section">
          <h3>Profile Picture</h3>
          <img
            src={
              previewImage || profile.image || "https://via.placeholder.com/140"
            }
            alt="Profile"
            className="profile-picture"
          />
          <p className="upload-label">JPG or PNG no larger than 5 MB</p>
          <input
            id="fileUpload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <label htmlFor="fileUpload" className="upload-button">
            העלאת תמונה
          </label>
        </div>

        {/* Details */}
        <div className="profile-details-section" dir="rtl">
          <h2>{profile.name}</h2>
          <div className="profile-details-grid">
            {/* 1. Name */}
            <label htmlFor="name" className="profile-label">
              <span className="label-text">
                שם<span className="required-marker">*</span>
              </span>
              {errors.name && <p className="field-error">{errors.name}</p>}
              <input
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                required
              />
            </label>

            {/* 2. Email */}
            <label htmlFor="email" className="profile-label">
              <span className="label-text">
                אימייל<span className="required-marker">*</span>
              </span>
              {errors.email && <p className="field-error">{errors.email}</p>}
              <input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                required
              />
            </label>

            {/* 3. Group */}
            <label htmlFor="group" className="profile-label">
              <span className="label-text">קבוצת אמנים</span>
              {errors.group && <p className="field-error">{errors.group}</p>}
              <input
                id="group"
                name="group"
                value={profile.group || ""}
                onChange={handleChange}
              />
            </label>

            {/* 4. Subject */}
            <label htmlFor="subject" className="profile-label">
              <span className="label-text">
                תחום האומנות<span className="required-marker">*</span>
              </span>
              {errors.subject && (
                <p className="field-error">{errors.subject}</p>
              )}
              <input
                id="subject"
                name="subject"
                value={profile.subject}
                onChange={handleChange}
                required
              />
            </label>

            {/* 5. Place */}
            <label htmlFor="place" className="profile-label">
              <span className="label-text">
                אזור מגורים<span className="required-marker">*</span>
              </span>
              {errors.place && <p className="field-error">{errors.place}</p>}
              <input
                id="place"
                name="place"
                value={profile.place}
                onChange={handleChange}
                required
              />
            </label>

            {/* 6. Bio */}
            <label
              htmlFor="bio"
              className="profile-label"
              style={{ gridColumn: "span 2" }}
            >
              <span className="label-text">
                ביו<span className="required-marker">*</span>
              </span>
              {errors.bio && <p className="field-error">{errors.bio}</p>}
              <textarea
                id="bio"
                name="bio"
                rows={10}
                style={{ overflowY: "hidden" }}
                value={profile.bio || ""}
                onChange={handleChange}
                required
              />
            </label>

            {/* 7. Link */}
            <label htmlFor="link" className="profile-label">
              <span className="label-text">קישור (ל-QR)</span>
              {errors.link && <p className="field-error">{errors.link}</p>}
              <input
                id="link"
                name="link"
                type="url"
                placeholder="https://example.com"
                value={profile.link || ""}
                onChange={handleChange}
              />
            </label>

            {/* 8. QR Code */}
            {profile.link && (
              <div className="qr-code-container">
                <QRCodeCanvas value={profile.link} size={128} />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="profile-buttons">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="save-button"
            >
              {isSaving ? "שומר..." : "שמור שינויים"}
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              className="pdf-button"
              style={{ marginTop: '0.5rem' }}
            >
              Export PDF
            </button>
          </div>

          {message && <p className="message">{message}</p>}
        </div>
      </form>

      {/* PDF Export (hidden) */}
      <div
        ref={printRef}
        style={{
          position: "fixed",
          top: -9999,
          left: -9999,
          width: "210mm",
          padding: "20mm",
          fontFamily: "'Arial', sans-serif",
          backgroundColor: "#fff",
          color: "#222",
          boxSizing: "border-box",
        }}
      >
        {/* Image + Name */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          {profile.image && (
            <img
              src={profile.image}
              alt="Profile"
              style={{
                width: 300,
                height: 300,
                borderRadius: "10%",
                objectFit: "cover",
                border: "3px solid #4a90e2",
                marginBottom: 15,
              }}
            />
          )}
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>
            {profile.name}
          </h1>
        </div>

        {/* 1. Email */}
        <section style={{ marginBottom: 15 }}>
          <h2
            style={{
              fontSize: 20,
              marginBottom: 6,
              borderBottom: "1px solid #ddd",
              paddingBottom: 4,
            }}
          >
            אימייל
          </h2>
          <p style={{ fontSize: 16 }}>{profile.email}</p>
        </section>

        {/* 2. Group */}
        {profile.group && (
          <section style={{ marginBottom: 15 }}>
            <h2
              style={{
                fontSize: 20,
                marginBottom: 6,
                borderBottom: "1px solid #ddd",
                paddingBottom: 4,
              }}
            >
              קבוצת אמנים
            </h2>
            <p style={{ fontSize: 16 }}>{profile.group}</p>
          </section>
        )}

        {/* 3. Subject */}
        <section style={{ marginBottom: 15 }}>
          <h2
            style={{
              fontSize: 20,
              marginBottom: 6,
              borderBottom: "1px solid #ddd",
              paddingBottom: 4,
            }}
          >
            תחום האומנות
          </h2>
          <p style={{ fontSize: 16 }}>{profile.subject}</p>
        </section>

        {/* 4. Place */}
        <section style={{ marginBottom: 15 }}>
          <h2
            style={{
              fontSize: 20,
              marginBottom: 6,
              borderBottom: "1px solid #ddd",
              paddingBottom: 4,
            }}
          >
            אזור מגורים
          </h2>
          <p style={{ fontSize: 16 }}>{profile.place}</p>
        </section>

        {/* 5. Bio */}
        <section style={{ marginBottom: 15 }}>
          <h2
            style={{
              fontSize: 20,
              marginBottom: 6,
              borderBottom: "1px solid #ddd",
              paddingBottom: 4,
            }}
          >
            ביו
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
            {profile.bio}
          </p>
        </section>

        {/* 6. QR Code + Link */}
        {profile.link && (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <h2 style={{ fontSize: 18, marginBottom: 12 }}>QR Code</h2>
            <QRCodeCanvas value={profile.link} size={150} />
            <p style={{ marginTop: 10, fontSize: 14, color: "#555" }}>
              {profile.link}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
