// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth, db, storage } from "../../firebase";
// import { doc, updateDoc, onSnapshot } from "firebase/firestore";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import "./Profile.css";

// const Profile = () => {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");
//   const [imageFile, setImageFile] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         const docRef = doc(db, "users", user.uid);
//         const unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
//           if (docSnap.exists()) {
//             setProfile(docSnap.data());
//             setMessage("");
//           } else {
//             setProfile(null);
//             setMessage("No profile found.");
//           }
//           setLoading(false);
//         });
//         return () => unsubscribeDoc();
//       } else {
//         setProfile(null);
//         setMessage("Not logged in.");
//         setLoading(false);
//       }
//     });

//     return () => unsubscribeAuth();
//   }, []);

//   const handleChange = (e) => {
//     setProfile({ ...profile, [e.target.name]: e.target.value });
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       setPreviewImage(URL.createObjectURL(file));
//     }
//   };

//   const handleImageUpload = async () => {
//     if (!imageFile) return profile?.image || "";
//     try {
//       const imageRef = ref(storage, `profile_images/${auth.currentUser.uid}`);
//       await uploadBytes(imageRef, imageFile);
//       const downloadURL = await getDownloadURL(imageRef);
//       return downloadURL;
//     } catch (error) {
//       console.error("Image upload failed:", error);
//       setMessage("Failed to upload image.");
//       return profile?.image || "";
//     }
//   };

//   const handleSave = async () => {
//     if (!profile) return;
//     const { name, bio, subject, group, email, place } = profile;
//     if (!name || !bio || !subject || !email || !place) {
//       setMessage("Please fill in all required fields.");
//       return;
//     }

//     try {
//       const imageUrl = await handleImageUpload();
//       const updatedProfile = { ...profile, image: imageUrl };
//       const docRef = doc(db, "users", auth.currentUser.uid);
//       await updateDoc(docRef, updatedProfile);
//       setMessage("Profile updated successfully.");
//     } catch (err) {
//       console.error(err);
//       setMessage("Failed to update profile.");
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       navigate("/");
//     } catch (error) {
//       setMessage("Error logging out.");
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (!profile) return <p>{message}</p>;

//   return (
//     <div className="profile-container">
//       <form className="profile-form">
//         <div className="profile-picture-section">
//           <h3>Profile Picture</h3>
//           <img
//             src={
//               previewImage || profile.image || "https://via.placeholder.com/140"
//             }
//             alt="Profile"
//             className="profile-picture"
//           />
//           <p className="upload-label">JPG or PNG no larger than 5 MB</p>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleFileChange}
//             style={{ display: "none" }}
//             id="fileUpload"
//           />
//           <label htmlFor="fileUpload" className="upload-button">
//             העלאת תמונה
//           </label>
//         </div>

//         <div className="profile-details-section">
//           <h2>{profile.name}</h2>
//           <div className="profile-details-grid">
//             <label htmlFor="name" className="profile-label">
//               <span className="label-text">
//                 שם<span className="required-marker">*</span>
//               </span>
//               <input
//                 id="name"
//                 name="name"
//                 value={profile.name || ""}
//                 onChange={handleChange}
//               />
//             </label>

//             <label htmlFor="bio" className="profile-label">
//               <span className="label-text">
//                 bio / ביו<span className="required-marker">*</span>
//               </span>
//               <textarea
//                 id="bio"
//                 name="bio"
//                 value={profile.bio || ""}
//                 onChange={handleChange}
//               />
//             </label>

//             <label htmlFor="subject" className="profile-label">
//               <span className="label-text">
//                 תחום האומנות<span className="required-marker">*</span>
//               </span>
//               <input
//                 id="subject"
//                 name="subject"
//                 value={profile.subject || ""}
//                 onChange={handleChange}
//               />
//             </label>

//             <label htmlFor="group" className="profile-label">
//               <span className="label-text">קבוצת אמנים</span>
//               <input
//                 id="group"
//                 name="group"
//                 value={profile.group || ""}
//                 onChange={handleChange}
//               />
//             </label>

//             <label htmlFor="email" className="profile-label">
//               <span className="label-text">
//                 Email / אימייל<span className="required-marker">*</span>
//               </span>
//               <input
//                 id="email"
//                 name="email"
//                 value={profile.email || ""}
//                 onChange={handleChange}
//               />
//             </label>

//             <label htmlFor="place" className="profile-label">
//               <span className="label-text">
//                 אזור מגורים<span className="required-marker">*</span>
//               </span>
//               <input
//                 id="place"
//                 name="place"
//                 value={profile.place || ""}
//                 onChange={handleChange}
//               />
//             </label>
//           </div>

//           <div className="actions">
//             <button type="button" onClick={handleSave}>
//               Save changes
//             </button>
//             <button type="button" onClick={handleLogout}>
//               Logout
//             </button>
//           </div>
//           <p>{message}</p>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Profile;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../firebase";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return profile?.image || "";
    try {
      const imageRef = ref(storage, `profile_images/${auth.currentUser.uid}`);
      await uploadBytes(imageRef, imageFile);
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
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

    if (!name) newErrors.name = "שדה חובה";
    if (!bio) newErrors.bio = "שדה חובה";
    if (!subject) newErrors.subject = "שדה חובה";
    if (!email) newErrors.email = "שדה חובה";
    if (!place) newErrors.place = "שדה חובה";

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
    try {
      const imageUrl = await handleImageUpload();
      const updatedProfile = { ...profile, image: imageUrl };
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, updatedProfile);
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      setMessage("Error logging out.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>{message}</p>;

  return (
    <div className="profile-container">
      <form className="profile-form">
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

        <div className="profile-details-section">
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
              />
            </label>
          </div>

          <div className="actions">
            <button type="button" onClick={handleSave}>
              Save changes
            </button>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
          <p>{message}</p>
        </div>
      </form>
    </div>
  );
};

export default Profile;
