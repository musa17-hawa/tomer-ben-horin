import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { MdLogout } from "react-icons/md";
import "./ArtistHeader.css";

const ArtistHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const isActive = (path) => {
    console.log(`Checking path: ${path}, Current pathname: ${location.pathname}`);
    if (path === "/artist-dashboard/profile") {
      const result = location.pathname === "/artist-dashboard" || location.pathname === "/artist-dashboard/profile";
      console.log(`Profile isActive result: ${result}`);
      return result;
    }
    const result = location.pathname === path;
    console.log(`Generic isActive result for ${path}: ${result}`);
    return result;
  };

  return (
    <header className="artist-header" dir="rtl">
      <nav className="artist-nav-links">
        <Link 
          to="/artist-dashboard/profile" 
          className={isActive("/artist-dashboard/profile") ? "active" : ""}
        >
          פרופיל
        </Link>
        <Link 
          to="/artist-dashboard/exhibitions" 
          className={isActive("/artist-dashboard/exhibitions") ? "active" : ""}
        >
          תערוכות
        </Link>
        <Link 
          to="/artist-dashboard/artworks" 
          className={isActive("/artist-dashboard/artworks") ? "active" : ""}
        >
          יצירות
        </Link>
        <button
          onClick={handleLogout}
          className="artist-logout-button"
        >
          <MdLogout size={18} style={{ verticalAlign: "middle" }} /> התנתק
        </button>
      </nav>
      <Link to="/">
        <img
          src="https://amutatbh.com/wp-content/uploads/2021/03/logo-new.svg"
          alt="Logo"
          className="artist-logo"
        />
      </Link>
    </header>
  );
};

export default ArtistHeader; 