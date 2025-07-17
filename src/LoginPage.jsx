import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "./firebase/config"; // Adjust path if needed

const LoginSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

      if (user) {
        console.log("User UID:", user.uid);
        navigate("/artist-dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("ההתחברות נכשלה. בדוק את האימייל והסיסמה שלך.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-6 py-10"
      style={{
        backgroundImage:
          'url("https://amutatbh.com/wp-content/uploads/2021/03/wall-bg.jpg")',
      }}
    >
      <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden w-full max-w-6xl grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center p-10 bg-[#fd3470] text-white text-center">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <img
              src="https://amutatbh.com/wp-content/uploads/2021/03/logo-new.svg"
              alt="Logo"
              className="w-60 h-auto"
            />
          </div>
          <p className="text-sm font-light mt-6">ברוכים הבאים לעמותה</p>
        </div>

        {/* Right Panel */}
        <div className="p-12 flex flex-col justify-center text-right">
          <h3 className="text-4xl font-bold text-[#fd3470] mb-8 text-center md:text-right">
            התחברות
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-5"
          >
            <input
              type="email"
              placeholder="אימייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fd3470] text-right"
              required
            />
            <input
              type="password"
              placeholder="סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fd3470] text-right"
              required
            />

            {error && (
              <p className="text-red-600 text-sm text-center font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#fd3470] text-white text-lg font-semibold rounded-xl hover:scale-[1.02] hover:bg-pink-600 transition-transform duration-200"
            >
              התחבר
            </button>
          </form>

          <div className="mt-6 text-sm text-center text-gray-700">
            <a
              href="https://amutatbh.com/artist-register/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#fd3470] hover:underline"
            >
              אין לך חשבון? הירשם עכשיו
            </a>
          </div>

          <div className="mt-3 text-sm text-center">
            <a href="/admin-login" className="text-[#fd3470] hover:underline">
              כניסת מנהל
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
