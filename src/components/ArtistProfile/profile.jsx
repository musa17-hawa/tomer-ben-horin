import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../firebase";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";
import "./Profile.css";
import axios from "axios";

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
  const profileRef = useRef(); // visible form
  const printRef = useRef(); // clean export

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data());
            setMessage("");
          } else {
            setProfile(null);
            setMessage("No profile found.");
          }
          setLoading(false);
        });
        return () => unsubscribeDoc();
      } else {
        setProfile(null);
        setMessage("Not logged in.");
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Cleanup the previewImage URL object to avoid memory leaks
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
      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        setMessage(`File size must be under ${MAX_IMAGE_SIZE_MB} MB.`);
        return;
      }
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setMessage("");
    }
  };
  const uploadImageToImgBB = async (imageFile) => {
    const apiKey = "8f43d546efb93c05215267d303f475e7"; // Replace with your actual API key
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formData
      );
      return response.data.data.url;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error("Failed to upload image to ImgBB.");
    }
  };

  // const handleImageUpload = async () => {
  //   if (!imageFile) return profile?.image || "";
  //   try {
  //     const imageRef = ref(storage, `profile_images/${auth.currentUser.uid}`);
  //     await uploadBytes(imageRef, imageFile);
  //     const downloadURL = await getDownloadURL(imageRef);
  //     return downloadURL;
  //   } catch (error) {
  //     console.error("Image upload failed:", error);
  //     setMessage("Failed to upload image.");
  //     return profile?.image || "";
  //   }
  // };
  const handleImageUpload = async () => {
    if (!imageFile) return profile?.image || "";
    try {
      const imageUrl = await uploadImageToImgBB(imageFile);
      return imageUrl;
    } catch (error) {
      console.error("Image upload failed:", error);
      setMessage("Failed to upload image.");
      return profile?.image || "";
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    const { name, bio, subject, group, email, place } = profile;
    const newErrors = {};

    // Required fields validation
    if (!name) newErrors.name = "שדה חובה";
    if (!bio) newErrors.bio = "שדה חובה";
    if (!subject) newErrors.subject = "שדה חובה";
    if (!email) newErrors.email = "שדה חובה";
    if (!place) newErrors.place = "שדה חובה";

    // No numeric-only values validation
    const stringFields = { name, bio, subject, email, place };
    for (const [key, value] of Object.entries(stringFields)) {
      if (/^\d+$/.test(value)) {
        newErrors[key] = "אסור להזין מספר בלבד";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage("");
      return;
    }

    setErrors({});
    setIsSaving(true);
    try {
      const imageUrl = await handleImageUpload();
      const updatedProfile = { ...profile, image: imageUrl };
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, updatedProfile);
      setMessage("Profile updated successfully");
      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // const handleLogout = async () => {
  //   try {
  //     await signOut(auth);
  //     navigate("/");
  //   } catch (error) {
  //     setMessage("Error logging out.");
  //   }
  // };

  const handleExportPDF = async () => {
    const input = printRef.current;
    if (!input) return;
    try {
      const canvas = await html2canvas(input, {
        scale: 3, // higher scale = better resolution
        useCORS: true,
        backgroundColor: "#fff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add image with some margin
      const margin = 10;
      pdf.addImage(
        imgData,
        "PNG",
        margin,
        margin,
        pdfWidth - 2 * margin,
        pdfHeight - 2 * margin
      );
      pdf.save("profile.pdf");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      setMessage("Failed to export PDF.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>{message}</p>;

  return (
    <div className="profile-container" ref={profileRef}>
      <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
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
          <h2>{profile.name}</h2>

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
              />
            </label>

            <label htmlFor="bio" className="profile-label">
              <span className="label-text">
                bio / ביו<span className="required-marker">*</span>
              </span>
              {errors.bio && <p className="field-error">{errors.bio}</p>}
              <textarea
                id="bio"
                name="bio"
                value={profile.bio || ""}
                onChange={handleChange}
                required
              />
            </label>

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
                value={profile.subject || ""}
                onChange={handleChange}
                required
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
              />
            </label>

            <label htmlFor="email" className="profile-label">
              <span className="label-text">
                Email / אימייל<span className="required-marker">*</span>
              </span>
              {errors.email && <p className="field-error">{errors.email}</p>}
              <input
                id="email"
                name="email"
                value={profile.email || ""}
                onChange={handleChange}
                required
                type="email"
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
              />
            </label>

            <label htmlFor="link" className="profile-label">
              <span className="label-text">Link (for QR code)</span>
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

            {/* QR Code display */}
            {profile.link && (
              <div className="qr-code-container">
                <QRCodeCanvas value={profile.link} size={128} />
              </div>
            )}
          </div>

          <div className="actions">
            <button type="button" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "שומר..." : "שמור שינויים"}
            </button>
            {/* <button type="button" onClick={handleLogout}>Logout</button> */}
            <button type="button" onClick={handleExportPDF}>
              Export PDF
            </button>
          </div>

          {message && <p className="message">{message}</p>}
        </div>
      </form>

      {/* Hidden div for clean PDF export */}
      <div
        ref={printRef}
        style={{
          position: "fixed",
          top: -9999,
          left: -9999,
          width: "210mm", // A4 width
          padding: "20mm",
          fontFamily: "'Arial', sans-serif",
          backgroundColor: "#fff",
          color: "#222",
          boxSizing: "border-box",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          {profile.image && (
            <img
              src={profile.image}
              alt="Profile"
              style={{
                width: 160,
                height: 160,
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #4a90e2",
                marginBottom: "15px",
              }}
            />
          )}
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "700" }}>
            {profile.name}
          </h1>
        </div>

        <section style={{ marginBottom: "15px" }}>
          <h2
            style={{
              fontSize: "20px",
              marginBottom: "6px",
              borderBottom: "1px solid #ddd",
              paddingBottom: "4px",
            }}
          >
            Bio / ביו
          </h2>
          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.5",
              whiteSpace: "pre-wrap",
            }}
          >
            {profile.bio}
          </p>
        </section>

        <section style={{ marginBottom: "15px" }}>
          <h2
            style={{
              fontSize: "20px",
              marginBottom: "6px",
              borderBottom: "1px solid #ddd",
              paddingBottom: "4px",
            }}
          >
            תחום האומנות
          </h2>
          <p style={{ fontSize: "16px" }}>{profile.subject}</p>
        </section>

        {profile.group && (
          <section style={{ marginBottom: "15px" }}>
            <h2
              style={{
                fontSize: "20px",
                marginBottom: "6px",
                borderBottom: "1px solid #ddd",
                paddingBottom: "4px",
              }}
            >
              קבוצת אמנים
            </h2>
            <p style={{ fontSize: "16px" }}>{profile.group}</p>
          </section>
        )}

        <section style={{ marginBottom: "15px" }}>
          <h2
            style={{
              fontSize: "20px",
              marginBottom: "6px",
              borderBottom: "1px solid #ddd",
              paddingBottom: "4px",
            }}
          >
            Email / אימייל
          </h2>
          <p style={{ fontSize: "16px" }}>{profile.email}</p>
        </section>

        <section style={{ marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "20px",
              marginBottom: "6px",
              borderBottom: "1px solid #ddd",
              paddingBottom: "4px",
            }}
          >
            אזור מגורים
          </h2>
          <p style={{ fontSize: "16px" }}>{profile.place}</p>
        </section>

        {profile.link && (
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "12px" }}>QR Code</h2>
            <QRCodeCanvas value={profile.link} size={150} />
            <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
              {profile.link}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
