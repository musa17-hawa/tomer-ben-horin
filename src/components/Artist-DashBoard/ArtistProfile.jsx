import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MAX_IMAGE_SIZE_MB = 5;

const ArtistProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const printRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const unsubDoc = onSnapshot(docRef, (snap) => {
          if (snap.exists()) setProfile(snap.data());
          setLoading(false);
        });
        return () => unsubDoc();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

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
    if (!file || file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setMessage("קובץ תמונה גדול מדי (מקסימום 5MB)");
      return;
    }
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setMessage("");
  };

  const uploadImageToImgBB = async (file) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    const form = new FormData();
    form.append("image", file);

    const res = await axios.post(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      form
    );

    return res.data.data.url;
  };

  const handleImageUpload = async () => {
    if (imageFile) {
      try {
        return await uploadImageToImgBB(imageFile);
      } catch {
        setMessage("שגיאה בהעלאת תמונה");
        return profile?.image || "";
      }
    }
    return profile?.image || "";
  };

  const handleSave = async () => {
    const { name, bio, subject, email, place } = profile;
    const errs = {};
    if (!name) errs.name = "שדה חובה";
    if (!email) errs.email = "שדה חובה";
    if (!subject) errs.subject = "שדה חובה";
    if (!place) errs.place = "שדה חובה";
    if (!bio) errs.bio = "שדה חובה";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setIsSaving(true);
    try {
      const imageUrl = await handleImageUpload();
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        ...profile,
        image: imageUrl,
      });
      setMessage("הפרופיל עודכן בהצלחה");
    } catch {
      setMessage("שגיאה בעדכון הפרופיל");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    if (!printRef.current) return;
    const container = printRef.current;
    const images = container.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map((img) => {
        return new Promise((resolve) => {
          if (img.complete && img.naturalWidth !== 0) resolve();
          else {
            img.onload = resolve;
            img.onerror = resolve;
          }
        });
      })
    );

    try {
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("artist-profile.pdf");
    } catch (err) {
      console.error("PDF export failed:", err);
    }
  };

  if (loading) return <p className="text-center py-20">טוען...</p>;
  if (!profile)
    return <p className="text-center py-20 text-red-500">{message}</p>;

  const imageSrc = previewImage || profile.image || "/placeholder.jpg";

  return (
    <div
      className="min-h-screen bg-[url('https://amutatbh.com/wp-content/uploads/2021/03/wall-bg.jpg')] py-12 px-6"
      dir="rtl"
    >
      {/* Header */}
      <div className="fixed top-1 left-4 right-4 z-50 backdrop-blur-lg bg-white/80 rounded-2xl shadow-lg px-6 py-4 flex justify-between items-center w-full  mx-auto transition-all duration-300 ease-in-out">
        <div className="flex items-center gap-3">
          <img
            src="https://amutatbh.com/wp-content/uploads/2021/03/logo-new.svg"
            alt="Logo"
            className="h-12"
          />
        </div>
        <nav className="flex gap-6 font-semibold text-[#fd3470]">
          <button
            onClick={() => navigate("/artist-dashboard/profile")}
            className="hover:underline"
          >
            פרופיל
          </button>
          <button
            onClick={() => navigate("/artist-dashboard/my-artworks")}
            className="hover:underline"
          >
            היצירות שלי
          </button>
          <button
            onClick={() => navigate("/artist-dashboard")}
            className="hover:underline"
          >
            תערוכות פתוחות
          </button>
        </nav>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8 mt-20">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-8">
          עריכת פרופיל
        </h1>

        <div className="flex flex-col items-center mb-8">
          <label className="block text-sm font-medium mb-2">תמונת פרופיל</label>
          <img
            src={imageSrc}
            alt="Profile"
            className="w-48 h-48 rounded-full object-cover border shadow"
            onError={(e) => (e.target.src = "/placeholder.jpg")}
          />
          <label className="mt-4 inline-block bg-pink-600 text-white px-6 py-2 rounded-full cursor-pointer hover:bg-pink-700 transition">
            העלה תמונה חדשה
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="שם *"
            name="name"
            value={profile.name}
            onChange={handleChange}
            error={errors.name}
          />
          <InputField
            label="אימייל *"
            name="email"
            type="email"
            value={profile.email}
            onChange={handleChange}
            error={errors.email}
          />
          <InputField
            label="קבוצה"
            name="group"
            value={profile.group}
            onChange={handleChange}
          />
          <InputField
            label="תחום אומנות *"
            name="subject"
            value={profile.subject}
            onChange={handleChange}
            error={errors.subject}
          />
          <InputField
            label="אזור מגורים *"
            name="place"
            value={profile.place}
            onChange={handleChange}
            error={errors.place}
          />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ביוגרפיה *
            </label>
            <textarea
              name="bio"
              value={profile.bio || ""}
              rows="10"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-2xl px-5 py-3 bg-gray-50"
            ></textarea>
            {errors.bio && (
              <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
            )}
          </div>
          <InputField
            label="קישור אישי"
            name="link"
            type="url"
            value={profile.link}
            onChange={handleChange}
          />
          <div className="flex justify-center items-center">
            {profile.link && <QRCodeCanvas value={profile.link} size={100} />}
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-12">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-pink-600 text-white px-8 py-3 rounded-xl shadow hover:bg-pink-700 transition"
          >
            {isSaving ? "שומר..." : "שמור שינויים"}
          </button>
          <button
            onClick={handleExportPDF}
            className="border border-pink-500 text-pink-600 px-8 py-3 rounded-xl hover:bg-pink-50 shadow"
          >
            ייצוא PDF
          </button>
        </div>

        {message && <p className="text-center text-pink-600 mt-6">{message}</p>}
      </div>

      {/* PDF hidden layout */}
      {/* PDF hidden layout */}
      <div
        ref={printRef}
        style={{ position: "absolute", left: "-9999px", top: 0 }}
        className="text-black bg-white w-[794px] h-[1123px] overflow-hidden"
      >
        <img
          src="/up.jpg"
          alt="Header"
          className="w-full h-auto"
          crossOrigin="anonymous"
        />
        <div className="px-10 py-6 text-right font-sans">
          <h2 className="text-3xl font-bold mb-2">{profile.name}</h2>
          <p className="text-lg mb-4">{profile.place}</p>
          <div className="flex gap-6 mb-4">
            {/* <img
              src={imageSrc}
              alt="Artist"
              className="w-48 h-48 object-cover rounded-xl border shadow"
              crossOrigin="anonymous"
            /> */}
            <img
              src={
                /^https?:\/\//.test(imageSrc)
                  ? `https://corsproxy.io/?${encodeURIComponent(imageSrc)}`
                  : imageSrc
              }
              alt="Artist"
              className="w-48 h-48 object-cover rounded-xl border shadow"
              crossOrigin="anonymous"
            />

            <div className="flex flex-col justify-center text-right text-blue-600 text-lg">
              {profile.phone && (
                <a href={`tel:${profile.phone}`}>{profile.phone}</a>
              )}
              {profile.email && (
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              )}
            </div>
            {profile.link && (
              <QRCodeCanvas value={profile.link} size={100} className="ml-4" />
            )}
          </div>
          <p className="whitespace-pre-line text-[16px] leading-relaxed mt-6">
            {profile.bio}
          </p>
        </div>
        <img
          src="/down.jpg"
          alt="Footer"
          className="w-full absolute bottom-0 left-0"
          style={{ height: "auto" }}
          crossOrigin="anonymous"
        />
      </div>
    </div>
  );
};

const InputField = ({ label, name, type = "text", value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-gray-50"
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default ArtistProfile;
