import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { MdLogout } from "react-icons/md";

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
      <div className="header-left">
        <img
          src="https://amutatbh.com/wp-content/uploads/2021/03/logo-new.svg"
          alt="Logo"
          className="app-logo"
          onClick={() => navigate("/dashboard")}
          style={{ cursor: "pointer" }}
        />
      </div>
      {!isSignInPage && (
        <nav className="nav-links">
          <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
            תערוכות
          </Link>
          <Link to="/artists" className={location.pathname === "/artists" ? "active" : ""}>
            אמנים
          </Link>
          <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>
            פרופיל
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="logout-button"
            title="התנתק"
          >
            <MdLogout size={24} />
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header; 