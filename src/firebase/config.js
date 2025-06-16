import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAX9UoRVd27t-A1vV4kaMyqh2KPtTZbrmo",
  authDomain: "signin-350d8.firebaseapp.com",
  projectId: "signin-350d8",
  storageBucket: "signin-350d8.appspot.com",
  messagingSenderId: "258082082764",
  appId: "1:258082082764:web:83a8a553b80d9944cf1769",
  measurementId: "G-KSG916T437"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// ImgBB Upload Function
async function uploadImageToImgBB(file) {
  const apiKey = "c80f72adbb0ff59880276ec1d9ae8dbf";
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (data.success) {
    return data.data.url;
  } else {
    throw new Error("Image upload failed");
  }
}

// Optional utility functions (keep only if needed)
async function handleImageUpload(selectedFile, profile) {
  if (!selectedFile) return profile.image;
  return await uploadImageToImgBB(selectedFile);
}

export { db, storage, analytics, auth, uploadImageToImgBB };
