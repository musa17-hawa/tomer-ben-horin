import { useState, useEffect, useRef } from "react";
import "./Profile.css";
import { createProfile, updateProfile } from "../services/profileService";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

const Profile = ({ artist, onBack }) => {
  const [profile, setProfile] = useState(artist || {});
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const profileRef = useRef();

  useEffect(() => {
    if (artist) setProfile(artist);
  }, [artist]);

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setMessage("");
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    const storageRef = ref(storage, `profiles/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSave = async () => {
    const { name, bio, subject, email, place } = profile;
    const newErrors = {};
    if (!name) newErrors.name = "שדה חובה";
    if (!bio) newErrors.bio = "שדה חובה";
    if (!subject) newErrors.subject = "שדה חובה";
    if (!email) newErrors.email = "שדה חובה";
    if (!place) newErrors.place = "שדה חובה";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage("");
      return;
    }
    setErrors({});
    setIsSaving(true);
    try {
      let imageUrl = profile.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const profileData = {
        ...profile,
        imageUrl,
        image: undefined // Remove the file object before saving
      };

      if (profile.id) {
        await updateProfile(profile.id, profileData);
      } else {
        await createProfile(profileData);
      }

      setMessage("השינויים נשמרו בהצלחה");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage("שגיאה בשמירת הפרופיל");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-container" ref={profileRef} dir="rtl">
      <form className="profile-form" onSubmit={e => e.preventDefault()}>
        <div className="profile-picture-section">
          <h3>תמונת פרופיל</h3>
          <img
            src={
              previewImage ||
              profile.image ||
              "https://via.placeholder.com/140"
            }
            alt="תמונת פרופיל"
            className="profile-picture"
          />
          <p className="upload-label">JPG או PNG עד 5MB</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="fileUpload"
          />
          <label htmlFor="fileUpload" className="upload-button">
            העלאת תמונה
          </label>
        </div>

        <div className="profile-details-section" dir="rtl">
          <h2 style={{ fontFamily: "inherit" }}>{profile.name}</h2>
          <div className="profile-details-grid">
            <label htmlFor="name" className="profile-label">
              <span className="label-text">
                שם<span className="required-marker">*</span>
              </span>
              {errors.name && <p className="field-error">{errors.name}</p>}
              <input
                id="name"
                name="name"
                value={profile.name || ""}
                onChange={handleChange}
                required
                placeholder="הכנס שם"
                style={{ fontFamily: "inherit" }}
              />
            </label>
            <label htmlFor="bio" className="profile-label">
              <span className="label-text">
                ביו<span className="required-marker">*</span>
              </span>
              {errors.bio && <p className="field-error">{errors.bio}</p>}
              <textarea
                id="bio"
                name="bio"
                value={profile.bio || ""}
                onChange={handleChange}
                required
                placeholder="הכנס ביו"
                style={{ fontFamily: "inherit" }}
              />
            </label>
            <label htmlFor="subject" className="profile-label">
              <span className="label-text">
                תחום האומנות<span className="required-marker">*</span>
              </span>
              {errors.subject && <p className="field-error">{errors.subject}</p>}
              <input
                id="subject"
                name="subject"
                value={profile.subject || ""}
                onChange={handleChange}
                required
                placeholder="הכנס תחום"
                style={{ fontFamily: "inherit" }}
              />
            </label>
            <label htmlFor="group" className="profile-label">
              <span className="label-text">קבוצת אמנים</span>
              {errors.group && <p className="field-error">{errors.group}</p>}
              <input
                id="group"
                name="group"
                value={profile.group || ""}
                onChange={handleChange}
                placeholder="הכנס קבוצה"
                style={{ fontFamily: "inherit" }}
              />
            </label>
            <label htmlFor="email" className="profile-label">
              <span className="label-text">
                אימייל<span className="required-marker">*</span>
              </span>
              {errors.email && <p className="field-error">{errors.email}</p>}
              <input
                id="email"
                name="email"
                value={profile.email || ""}
                onChange={handleChange}
                required
                type="email"
                placeholder="הכנס אימייל"
                style={{ fontFamily: "inherit" }}
              />
            </label>
            <label htmlFor="place" className="profile-label">
              <span className="label-text">
                אזור מגורים<span className="required-marker">*</span>
              </span>
              {errors.place && <p className="field-error">{errors.place}</p>}
              <input
                id="place"
                name="place"
                value={profile.place || ""}
                onChange={handleChange}
                required
                placeholder="הכנס אזור מגורים"
                style={{ fontFamily: "inherit" }}
              />
            </label>
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
                style={{ fontFamily: "inherit" }}
              />
            </label>
            {/* QR Code display */}
            {profile.link && (
              <div className="qr-code-container">
                {/* QR code can be rendered here if needed */}
              </div>
            )}
          </div>
          <div className="actions">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="save-button"
              style={{ fontFamily: "inherit" }}
            >
              {isSaving ? "שומר..." : "שמור שינויים"}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="logout-button"
              style={{ fontFamily: "inherit" }}
            >
              ביטול
            </button>
          </div>
          {message && <p className="message-box">{message}</p>}
        </div>
      </form>
    </div>
  );
};

export default Profile;