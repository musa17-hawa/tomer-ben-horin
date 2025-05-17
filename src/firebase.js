import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
// Note: In production, these values should be in environment variables
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyAX9UoRVd27t-A1vV4kaMyqh2KPtTZbrmo",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "signin-350d8.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "signin-350d8",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "signin-350d8.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "258082082764",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:258082082764:web:83a8a553b80d9944cf1769",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-KSG916T437",
};

// Initialize Firebase with error handling
let app;
let analytics;
let auth;
let db;
let storage;

try {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// Export Firebase services
export { app, analytics, auth, db, storage };
