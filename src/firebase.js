// // import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";
// // import { getAuth } from "firebase/auth";
// // import { getFirestore } from "firebase/firestore";
// // import { getStorage } from "firebase/storage";

// // // Firebase configuration using .env variables
// // const firebaseConfig = {
// //   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
// //   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
// //   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
// //   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
// //   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
// //   appId: import.meta.env.VITE_FIREBASE_APP_ID,
// //   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
// // };

// // // Initialize Firebase
// // let app, analytics, auth, db, storage;

// // try {
// //   app = initializeApp(firebaseConfig);
// //   analytics = getAnalytics(app);
// //   auth = getAuth(app);
// //   db = getFirestore(app);
// //   storage = getStorage(app);
// // } catch (error) {
// //   console.error("Error initializing Firebase:", error);
// // }

// // export { app, analytics, auth, db, storage };
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
// import axios from "axios"; // ✅ Required for uploading to ImgBB

// // Firebase configuration using .env variables
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
//   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
// };

// // Initialize Firebase
// let app, analytics, auth, db, storage;

// try {
//   app = initializeApp(firebaseConfig);
//   analytics = getAnalytics(app);
//   auth = getAuth(app);
//   db = getFirestore(app);
//   storage = getStorage(app);
// } catch (error) {
//   console.error("Error initializing Firebase:", error);
// }

// // ✅ ImgBB Upload Utility
// const imgbbAPIKey = import.meta.env.VITE_IMGBB_API_KEY; // 🔐 Set this in your .env

// export const uploadImageToImgBB = async (imageFile) => {
//   const formData = new FormData();
//   formData.append("image", imageFile);

//   try {
//     const response = await axios.post(
//       `https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`,
//       formData
//     );
//     return response.data.data.url;
//   } catch (error) {
//     console.error("ImgBB upload failed:", error);
//     throw new Error("Image upload failed");
//   }
// };

// export { app, analytics, auth, db, storage };
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import axios from "axios";

// Firebase configuration from .env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app, analytics, auth, db, storage;
try {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// ✅ ImgBB Upload Utility
const imgbbAPIKey = "8f43d546efb93c05215267d303f475e7";

export const uploadImageToImgBB = async (imageFile) => {
  if (!imgbbAPIKey) {
    throw new Error("ImgBB API key is missing from .env");
  }
  if (!imageFile) {
    throw new Error("No image file provided for upload.");
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`,
      formData
    );

    if (!response.data.success) {
      console.error("ImgBB response error:", response.data);
      throw new Error("ImgBB upload failed: " + response.data.error.message);
    }

    return response.data.data.url;
  } catch (error) {
    console.error(
      "ImgBB upload failed:",
      error.response?.data || error.message
    );
    throw new Error("Image upload failed");
  }
};

export { app, analytics, auth, db, storage };
