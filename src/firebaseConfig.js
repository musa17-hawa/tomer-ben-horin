// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase config object (replace with your real config)
const firebaseConfig = {
  apiKey: "AIzaSyCE4ImsImwzhr41vf_11x8U4uZUcOcQBy0",
  authDomain: "tomerbinhorin.firebaseapp.com",
  projectId: "tomerbinhorin",
  storageBucket: "tomerbinhorin.firebasestorage.app",
  messagingSenderId: "145113869457",
  appId: "1:145113869457:web:4c51b8eb1379ca7a81e330",
  measurementId: "G-B9TN5BBBF0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // ✅ export this

export { auth }; // ✅ THIS LINE IS CRUCIAL // ✅ make sure this line exists
