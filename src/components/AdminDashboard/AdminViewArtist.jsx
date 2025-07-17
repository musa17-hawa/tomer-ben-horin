import React, { useState, useEffect, useRef } from "react";
import { db } from "../../firebase/config";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const MAX_IMAGE_SIZE_MB = 5;

const AdminViewArtist = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const printRef = useRef();
  const navigate = useNavigate();
  const { id: artistId } = useParams();

  useEffect(() => {
    if (!artistId) return;
    const docRef = doc(db, "users", artistId);
    const unsubDoc = onSnapshot(docRef, async (snap) => {
      if (!snap.exists()) {
        setMessage("לא נמצא פרופיל");
        setLoading(false);
        return;
      }
      const data = snap.data();
      setProfile(data);
      setLoading(false);
    });
    return () => unsubDoc();
  }, [artistId]);

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
      await updateDoc(doc(db, "users", artistId), {
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
      const aspectRatio = canvas.width / canvas.height;
      const pdfHeight = pdfWidth / aspectRatio;

      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight - 20);
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
      className="min-h-screen bg-[url('https://amutatbh.com/wp-content/uploads/2021/03/wall-bg.jpg')] bg-cover py-12 px-6"
      dir="rtl"
    >
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
        <h1 className="text-4xl font-extrabold text-center text-pink-700 mb-10">
          עריכת פרופיל אמן
        </h1>

        <div className="flex flex-col items-center mb-8">
          <label className="block text-sm font-medium mb-2">תמונת פרופיל</label>
          <img
            src={imageSrc}
            alt="Profile"
            className="w-48 h-48 rounded-full object-cover border shadow"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm"
          />
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

      <div
        ref={printRef}
        style={{ position: "absolute", left: "-9999px", top: 0 }}
        className="p-6 text-black bg-white max-w-lg mx-auto mt-10"
      >
        <img
          src={imageSrc}
          alt="Profile"
          crossOrigin="anonymous"
          onError={(e) => (e.target.src = "/download.png")}
          className="w-40 h-40 object-cover mb-4 rounded-full"
        />

        <h2 className="text-2xl font-bold mb-4">{profile.name}</h2>
        <p className="mb-2">📧 {profile.email}</p>
        <p className="mb-2">🎨 {profile.subject}</p>
        <p className="mb-2">🏠 {profile.place}</p>
        <p className="mb-2">🧑‍🤝‍🧑 {profile.group}</p>
        <p className="mb-4 whitespace-pre-wrap">{profile.bio}</p>

        {profile.link && (
          <div className="mt-4 flex justify-center">
            <QRCodeCanvas value={profile.link} size={100} />
          </div>
        )}
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

export default AdminViewArtist;
