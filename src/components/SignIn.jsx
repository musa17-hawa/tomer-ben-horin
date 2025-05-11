// export default SignIn;
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // adjust path if needed
import "./SignIn.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("hi 🎉"); // 👈 Success
    } catch (error) {
      console.error(error.message);
      alert("Incorrect email or password"); // 👈 Error message
    }
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>התחבר לחשבון</h2>
        <div className="form-group">
          <label htmlFor="email">כתובת אימייל</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">סיסמה</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">התחברות לאתר</button>
        <div className="signup-link">
          <p>
            New here?{" "}
            <a href="https://amutatbh.com/artist-register/">
              Sign up now on the main website
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
