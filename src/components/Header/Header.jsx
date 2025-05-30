import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./Header.css";
import { useState, useEffect, useRef } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";

//logtout button //
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isSignInPage = location.pathname === "/";
  const [message, setMessage] = useState("");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to SignIn page after logout
    } catch (error) {
      setMessage("Error logging out.");
    }
  };

  return (
    <header className="app-header" dir="rtl">
      {!isSignInPage && (
        <nav className="nav-links">
          <Link to="/profile">Profile</Link>
          <Link to="/gallery">Gallery</Link>
          <button
            type="button"
            onClick={handleLogout}
            className="logout-button"
            title="Logout"
          >
            <MdLogout size={24} />
          </button>
        </nav>
      )}
      <img
        src="https://amutatbh.com/wp-content/uploads/2021/03/logo-new.svg"
        alt="Logo"
        className="app-logo"
      />
    </header>
  );
};

export default Header;
