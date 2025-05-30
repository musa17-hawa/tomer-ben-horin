import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase"; // adjust if needed

export const setupUserInFirestore = () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        const userData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || " name ", // fallback if displayName is null
          image: user.photoURL,
          bio: "",
          group: "",
          //   link: "https://shobiddak.com/prayers/prayer_today?town_id=2",
          place: "",
          subject: "",
          createdAt: serverTimestamp(),
        };

        try {
          await setDoc(userRef, userData);
          console.log("✅ User document created in Firestore.");
        } catch (error) {
          console.error("❌ Error adding user to Firestore:", error);
        }
      } else {
        console.log("ℹ️ User already exists in Firestore.");
      }
    }
  });
};
