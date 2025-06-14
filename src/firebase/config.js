import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

// Your web app's Firebase configuration
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

export { db, storage, analytics, auth, uploadImageToImgBB };

async function uploadImageToImgBB(file) {
  const apiKey = "c80f72adbb0ff59880276ec1d9ae8dbf"; // User's ImgBB API key
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (data.success) {
    return data.data.url; // This is the direct image URL
  } else {
    throw new Error("Image upload failed");
  }
}

async function handleSubmit(e) {
  e.preventDefault();
  setError('');
  setSuccess(false);
  if (!fullName || !image || !description || !size || !artworkName) {
    setError('אנא מלא את כל השדות החובה.');
    return;
  }
  setLoading(true);
  try {
    // Upload image to ImgBB
    let uploadedImageUrl = '';
    if (image) {
      uploadedImageUrl = await uploadImageToImgBB(image);
    }
    // Save registration to Firestore
    await addDoc(collection(db, 'registrations'), {
      exhibitionId,
      fullName,
      imageUrl: uploadedImageUrl,
      description,
      size,
      artworkName,
      price: price.trim() === '' ? 'please contact artist' : price,
      createdAt: Timestamp.now(),
    });
    setSuccess(true);
    // ...reset form fields...
  } catch (err) {
    setError('אירעה שגיאה בשליחת הטופס.');
    console.error(err);
  } finally {
    setLoading(false);
  }
}

async function handleImageUpload() {
  if (!selectedFile) return profile.image; // or return null if you want to force a new image
  return await uploadImageToImgBB(selectedFile);
} 
