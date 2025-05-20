// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAX9UoRVd27t-A1vV4kaMyqh2KPtTZbrmo",
  authDomain: "signin-350d8.firebaseapp.com",
  projectId: "signin-350d8",
  storageBucket: "signin-350d8.firebasestorage.app",
  messagingSenderId: "258082082764",
  appId: "1:258082082764:web:83a8a553b80d9944cf1769",
  measurementId: "G-KSG916T437"
};

// Initialize Firebase
console.log("Initializing Firebase with config:", firebaseConfig);
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
console.log("Firestore initialized:", db);

const auth = getAuth(app);
const storage = getStorage(app);

// Analytics may cause issues in some environments - wrap in try/catch
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.warn("Analytics could not be initialized:", error);
}

export { app, db, auth, storage, analytics };