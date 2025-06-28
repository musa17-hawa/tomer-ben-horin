import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db, uploadImageToImgBB } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import "./ArtistProfile.css";

const MAX_IMAGE_SIZE_MB = 5;

const ArtistBioEdit = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [exhibitionId, setExhibitionId] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Get exhibitionId from URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const exId = queryParams.get("exhibitionId");
    setExhibitionId(exId);
  }, [location]);

  // Load profile from user document and registration document
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user && exhibitionId) {
        try {
          // First, get the main user profile
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          let mainProfile = {};
          if (userDocSnap.exists()) {
            mainProfile = userDocSnap.data();
          }

          // Then, try to get the registration-specific bio from artworks/bio
          const bioDocRef = doc(db, "users", user.uid, "registrations", exhibitionId, "artworks", "bio");
          const bioSnap = await getDoc(bioDocRef);
          
          let registrationProfile = {};
          if (bioSnap.exists()) {
            registrationProfile = bioSnap.data();
          }

          // Merge profiles: use registration profile if it exists, otherwise use main profile
          const mergedProfile = {
            name: registrationProfile.name || mainProfile.name || "",
            email: registrationProfile.email || mainProfile.email || "",
            phone: registrationProfile.phone || mainProfile.phone || "",
            bio: registrationProfile.bio || mainProfile.bio || "",
            website: registrationProfile.website || mainProfile.website || "",
            instagram: registrationProfile.instagram || mainProfile.instagram || "",
            facebook: registrationProfile.facebook || mainProfile.facebook || "",
            imageUrl: registrationProfile.imageUrl || mainProfile.imageUrl || mainProfile.image || "",
            subject: registrationProfile.subject || mainProfile.subject || "",
            place: registrationProfile.place || mainProfile.place || ""
          };

          setProfile(mergedProfile);
          setMessage("");
        } catch (error) {
          console.error("Error loading profile:", error);
          setMessage("שגיאה בטעינת הפרופיל");
        }
        setLoading(false);
      } else if (!user) {
        setProfile(null);
        setMessage("לא מחובר");
        setLoading(false);
      }
    });
    return () => unsubAuth();
  }, [exhibitionId]);

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
      setMessage(`גודל הקובץ חייב להיות פחות מ-${MAX_IMAGE_SIZE_MB} MB.`);
      return;
    }
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setMessage("");
  };

  const handleImageUpload = async () => {
    if (!imageFile) return profile?.imageUrl || "";
    try {
      return await uploadImageToImgBB(imageFile);
    } catch (err) {
      setMessage("שגיאה בהעלאת התמונה." + (err.message ? ` (${err.message})` : ""));
      return profile?.imageUrl || "";
    }
  };

  const handleSave = async () => {
    if (!profile || !exhibitionId) return;
    
    const { name, bio, subject, email, place } = profile;
    const errs = {};

    if (!name) errs.name = "שדה חובה";
    if (!email) errs.email = "שדה חובה";
    if (!bio) errs.bio = "שדה חובה";

    // no numeric-only
    for (let [k, v] of Object.entries({ name, bio, subject, email, place })) {
      if (typeof v === 'string' && /^\d+$/.test(v)) errs[k] = "אסור להזין מספר בלבד";
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
      const user = auth.currentUser;
      
      // Save to artworks/bio document under registration
      const bioDocRef = doc(db, "users", user.uid, "registrations", exhibitionId, "artworks", "bio");
      await setDoc(bioDocRef, {
        ...profile,
        imageUrl: imageUrl,
        lastUpdated: new Date()
      }, { merge: true });

      setMessage("הפרופיל נשמר בהצלחה לתערוכה זו");
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      setMessage("שגיאה בשמירת הפרופיל." + (err.message ? ` (${err.message})` : ""));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/artist-dashboard');
  };

  if (loading) return <p className="loading">טוען...</p>;
  if (!profile) return <p className="message">{message}</p>;

  return (
    <div className="profile-container">
      <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
        <h2 className="form-title">עריכת פרופיל האמן לתערוכה</h2>
        
        {/* Picture */}
        <div className="profile-picture-section">
          <h3>תמונת פרופיל</h3>
          <img
            src={
              previewImage || profile.imageUrl || "https://via.placeholder.com/140"
            }
            alt="Profile"
            className="profile-picture"
          />
          <p className="upload-label">JPG או PNG לא יותר מ-5 MB</p>
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
          <div className="profile-details-grid">
            {/* Name */}
            <label htmlFor="name" className="profile-label">
              <span className="label-text">שם מלא*</span>
              <input
                id="name"
                name="name"
                type="text"
                value={profile.name || ""}
                onChange={handleChange}
                className={`profile-input ${errors.name ? "error" : ""}`}
                placeholder="הכנס את שמך המלא"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </label>

            {/* Email */}
            <label htmlFor="email" className="profile-label">
              <span className="label-text">אימייל*</span>
              <input
                id="email"
                name="email"
                type="email"
                value={profile.email || ""}
                onChange={handleChange}
                className={`profile-input ${errors.email ? "error" : ""}`}
                placeholder="הכנס את כתובת האימייל שלך"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </label>

            {/* Phone */}
            <label htmlFor="phone" className="profile-label">
              <span className="label-text">טלפון</span>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={profile.phone || ""}
                onChange={handleChange}
                className="profile-input"
                placeholder="הכנס את מספר הטלפון שלך"
              />
            </label>

            {/* Subject */}
            <label htmlFor="subject" className="profile-label">
              <span className="label-text">נושא</span>
              <input
                id="subject"
                name="subject"
                type="text"
                value={profile.subject || ""}
                onChange={handleChange}
                className="profile-input"
                placeholder="הכנס את הנושא שלך"
              />
            </label>

            {/* Place */}
            <label htmlFor="place" className="profile-label">
              <span className="label-text">מקום</span>
              <input
                id="place"
                name="place"
                type="text"
                value={profile.place || ""}
                onChange={handleChange}
                className="profile-input"
                placeholder="הכנס את המקום שלך"
              />
            </label>

            {/* Website */}
            <label htmlFor="website" className="profile-label">
              <span className="label-text">אתר אינטרנט</span>
              <input
                id="website"
                name="website"
                type="url"
                value={profile.website || ""}
                onChange={handleChange}
                className="profile-input"
                placeholder="הכנס את כתובת האתר שלך"
              />
            </label>

            {/* Instagram */}
            <label htmlFor="instagram" className="profile-label">
              <span className="label-text">אינסטגרם</span>
              <input
                id="instagram"
                name="instagram"
                type="text"
                value={profile.instagram || ""}
                onChange={handleChange}
                className="profile-input"
                placeholder="הכנס את שם המשתמש באינסטגרם"
              />
            </label>

            {/* Facebook */}
            <label htmlFor="facebook" className="profile-label">
              <span className="label-text">פייסבוק</span>
              <input
                id="facebook"
                name="facebook"
                type="text"
                value={profile.facebook || ""}
                onChange={handleChange}
                className="profile-input"
                placeholder="הכנס את שם המשתמש בפייסבוק"
              />
            </label>

            {/* Bio */}
            <label htmlFor="bio" className="profile-label full-width" style={{ width: '100%' }}>
              <span className="label-text">ביוגרפיה*</span>
              <textarea
                id="bio"
                name="bio"
                value={profile.bio || ""}
                onChange={handleChange}
                className={`profile-textarea ${errors.bio ? "error" : ""}`}
                placeholder="ספר על עצמך, על האמנות שלך, על התהליך היצירתי שלך..."
                rows="5"
                style={{ minHeight: '100px', height: '120px', maxHeight: '200px', width: '100%', minWidth: '320px', maxWidth: '600px' }}
              />
              {errors.bio && <span className="error-message">{errors.bio}</span>}
              {/* Buttons directly under bio, grouped visually */}
              <div className="profile-buttons" style={{ marginTop: '1.2rem', width: '100%' }}>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="save-button"
                >
                  {isSaving ? "שומר..." : "שמור פרופיל לתערוכה"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="cancel-button"
                >
                  חזור לתערוכות
                </button>
              </div>
            </label>
          </div>
        </div>

        {message && (
          <div className={`message ${message.includes("שגיאה") ? "error" : "success"}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default ArtistBioEdit; 