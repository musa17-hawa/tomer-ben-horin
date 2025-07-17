// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { auth, db } from "../../firebase/config";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";

// const ArtistBioEdit = () => {
//   const [exhibitionId, setExhibitionId] = useState("");
//   const [profile, setProfile] = useState({});
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const queryParams = new URLSearchParams(location.search);
//     const exId = queryParams.get("exhibitionId");
//     setExhibitionId(exId);
//   }, [location]);

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (user) => {
//       if (user && exhibitionId) {
//         const userDoc = await getDoc(doc(db, "users", user.uid));
//         if (userDoc.exists()) setProfile(userDoc.data());
//       }
//     });
//     return () => unsub();
//   }, [exhibitionId]);

//   if (!profile.name)
//     return <div className="text-center py-20 text-gray-500">טוען...</div>;

//   return (
//     <div className="min-h-screen bg-[url('https://amutatbh.com/wp-content/uploads/2021/03/wall-bg.jpg')] py-8 px-4">
//       <div className="flex justify-center mb-8" dir="rtl">
//         <img
//           src="https://amutatbh.com/wp-content/uploads/2021/03/logo-new.svg"
//           alt="Logo"
//           className="h-20 drop-shadow-md"
//         />
//       </div>
//       <div
//         className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-8"
//         dir="rtl"
//       >
//         <h1 className="text-3xl font-bold text-pink-600 text-center mb-10">
//           עריכת פרופיל לתערוכה
//         </h1>
//         <div className="grid md:grid-cols-3 gap-10">
//           <div className="flex flex-col items-center md:items-start">
//             <img
//               src={profile.image || "/placeholder.jpg"}
//               alt="Profile"
//               className="w-full max-w-xs h-auto rounded-lg shadow-md object-cover mb-4"
//             />
//             <p className="text-sm text-gray-500">תמונת פרופיל</p>
//           </div>

//           <div className="md:col-span-2">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   שם מלא <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={profile.name || ""}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 text-right bg-gray-50"
//                   readOnly
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   אימייל <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   value={profile.email || ""}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 text-right bg-gray-50"
//                   readOnly
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   קבוצת השתתפות <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={profile.group || ""}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 text-right bg-gray-50"
//                   readOnly
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   תחום אומנות <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={profile.subject || ""}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 text-right bg-gray-50"
//                   readOnly
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   אזור מגורים <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={profile.place || ""}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 text-right bg-gray-50"
//                   readOnly
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   קישור אישי
//                 </label>
//                 <input
//                   type="text"
//                   value={profile.link || ""}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 text-right bg-gray-50"
//                   readOnly
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   ביוגרפיה <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   value={profile.bio || ""}
//                   rows="12"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 text-right bg-gray-50"
//                   readOnly
//                 ></textarea>
//               </div>
//             </div>

//             <div className="mt-10 space-y-6">
//               <div
//                 onClick={() =>
//                   navigate(
//                     `/artist-dashboard/register-artwork?exhibitionId=${exhibitionId}`
//                   )
//                 }
//                 className="cursor-pointer flex items-center justify-between bg-pink-100 hover:bg-pink-200 transition shadow-md rounded-xl p-6"
//               >
//                 <div className="flex items-center space-x-4 rtl:space-x-reverse">
//                   <div className="bg-pink-400 text-white p-3 rounded-full shadow-inner">
//                     <span className="text-xl">🎨</span>
//                   </div>
//                   <div>
//                     <h3 className="text-pink-800 font-bold text-lg" dir="rtl">
//                       העלאת יצירה
//                     </h3>
//                     <p className="text-sm text-pink-700" dir="rtl">
//                       לחץ כאן כדי להעלות את היצירה שלך לתערוכה
//                     </p>
//                   </div>
//                 </div>
//                 <svg
//                   className="w-6 h-6 text-pink-600"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M9 5l7 7-7 7"
//                   />
//                 </svg>
//               </div>
//               <div className="flex justify-end">
//                 <button
//                   className="border border-pink-500 text-pink-500 px-6 py-2 rounded-lg font-semibold hover:bg-pink-50"
//                   onClick={() => navigate("/artist-dashboard")}
//                 >
//                   חזור
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ArtistBioEdit;
// Updated ArtistBioEdit.jsx with editable bio, link, phone, and upload artwork card preserved
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const ArtistBioEdit = () => {
  const [exhibitionId, setExhibitionId] = useState("");
  const [userId, setUserId] = useState("");
  const [profile, setProfile] = useState({});
  const [editableFields, setEditableFields] = useState({
    bio: "",
    link: "",
    phone: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const exId = queryParams.get("exhibitionId");
    setExhibitionId(exId);
  }, [location]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user && exhibitionId) {
        setUserId(user.uid);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfile(data);
          setEditableFields({
            bio: data.bio || "",
            link: data.link || "",
            phone: "",
          });
        }
      }
    });
    return () => unsub();
  }, [exhibitionId]);

  const handleChange = (field, value) => {
    setEditableFields((prev) => ({ ...prev, [field]: value }));
  };

  // const handleSave = async () => {
  //   if (!userId || !exhibitionId) return;
  //   const regRef = doc(db, `users/${userId}/registrations/${exhibitionId}`);
  //   await setDoc(
  //     regRef,
  //     {
  //       bio: editableFields.bio,
  //       link: editableFields.link,
  //       phone: editableFields.phone,
  //     },
  //     { merge: true }
  //   );
  //   alert("עודכן בהצלחה!");
  // };
  const handleSave = async () => {
    if (!userId || !exhibitionId) return;

    if (!editableFields.phone.trim()) {
      alert("נא להזין מספר טלפון. השדה חובה.");
      return;
    }

    await setDoc(
      doc(db, `users/${userId}/registrations/${exhibitionId}`),
      {
        bio: editableFields.bio,
        link: editableFields.link,
        phone: editableFields.phone,
      },
      { merge: true }
    );

    alert("עודכן בהצלחה!");
    if (!/^[0-9+\-\s]{7,15}$/.test(editableFields.phone)) {
      alert("מספר הטלפון אינו תקין.");
      return;
    }
  };

  if (!profile.name)
    return <div className="text-center py-20 text-gray-500">טוען...</div>;

  return (
    <div className="min-h-screen bg-[url('https://amutatbh.com/wp-content/uploads/2021/03/wall-bg.jpg')] py-8 px-4">
      <div className="flex justify-center mb-8" dir="rtl">
        <img
          src="https://amutatbh.com/wp-content/uploads/2021/03/logo-new.svg"
          alt="Logo"
          className="h-20 drop-shadow-md"
        />
      </div>
      <div
        className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-8"
        dir="rtl"
      >
        <h1 className="text-3xl font-bold text-pink-600 text-center mb-10">
          עריכת פרופיל לתערוכה
        </h1>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center md:items-start">
            <img
              src={profile.image || "/placeholder.jpg"}
              alt="Profile"
              className="w-full max-w-xs h-auto rounded-lg shadow-md object-cover mb-4"
            />
            <p className="text-sm text-gray-500">תמונת פרופיל</p>
          </div>

          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                readOnly
                value={profile.name || ""}
                className="w-full border bg-gray-50 px-4 py-2 rounded-lg text-right"
              />
              <input
                readOnly
                value={profile.email || ""}
                className="w-full border bg-gray-50 px-4 py-2 rounded-lg text-right"
              />
              <input
                readOnly
                value={profile.group || ""}
                className="w-full border bg-gray-50 px-4 py-2 rounded-lg text-right"
              />
              <input
                readOnly
                value={profile.subject || ""}
                className="w-full border bg-gray-50 px-4 py-2 rounded-lg text-right"
              />
              <input
                readOnly
                value={profile.place || ""}
                className="w-full border bg-gray-50 px-4 py-2 rounded-lg text-right"
              />

              <input
                type="text"
                value={editableFields.link}
                onChange={(e) => handleChange("link", e.target.value)}
                className="w-full border px-4 py-2 rounded-lg text-right"
                placeholder="קישור אישי"
              />

              <label className="block text-sm font-medium text-gray-700 mb-1">
                מספר טלפון <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={editableFields.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full border px-4 py-2 rounded-lg text-right"
                placeholder="מספר טלפון"
              />

              <textarea
                value={editableFields.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                rows="8"
                className="w-full md:col-span-2 border px-4 py-2 rounded-lg text-right"
                placeholder="ביוגרפיה"
              />
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleSave}
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg"
              >
                שמור
              </button>
            </div>

            <div className="mt-10 space-y-6">
              <div
                onClick={() =>
                  navigate(
                    `/artist-dashboard/register-artwork?exhibitionId=${exhibitionId}`
                  )
                }
                className="cursor-pointer flex items-center justify-between bg-pink-100 hover:bg-pink-200 transition shadow-md rounded-xl p-6"
              >
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="bg-pink-400 text-white p-3 rounded-full shadow-inner">
                    <span className="text-xl">🎨</span>
                  </div>
                  <div>
                    <h3 className="text-pink-800 font-bold text-lg" dir="rtl">
                      העלאת יצירה
                    </h3>
                    <p className="text-sm text-pink-700" dir="rtl">
                      לחץ כאן כדי להעלות את היצירה שלך לתערוכה
                    </p>
                  </div>
                </div>
                <svg
                  className="w-6 h-6 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <div className="flex justify-end">
                <button
                  className="border border-pink-500 text-pink-500 px-6 py-2 rounded-lg font-semibold hover:bg-pink-50"
                  onClick={() => navigate("/artist-dashboard")}
                >
                  חזור
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistBioEdit;
