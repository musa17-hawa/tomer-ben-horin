import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration (updated)
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

export { db, storage, analytics }; 