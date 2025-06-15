import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "./Header.css";
<<<<<<< HEAD
import { auth } from "../firebase/config";
=======
import { auth } from "../../firebase";
>>>>>>> d50b4b1 (committs)
import { signOut } from "firebase/auth";
import { MdLogout } from "react-icons/md";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignInPage = location.pathname === "/";
<<<<<<< HEAD
  const isRegisterArtworkPage = location.pathname === "/register-artwork";
=======
>>>>>>> d50b4b1 (committs)
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
<<<<<<< HEAD
      <div className="header-top" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        {/* Right: Logo */}
        <div className="logo">
          <img
            src="https://amutatbh.com/wp-content/uploads/2021/03/logo-new.svg"
            alt="Logo"
            className="app-logo"
            onClick={() => navigate("/dashboard")}
            style={{ cursor: "pointer" }}
          />
        </div>
        {/* Center: Welcome message */}
        <div className="welcome-message" style={{ color: '#e42b60', fontWeight: 'bold', fontSize: '1.2rem', flex: 1, textAlign: 'center' }}>
          ברוך הבא, משתמש
        </div>
        {/* Left: Nav buttons */}
        <div className="header-nav-left">
          {!isSignInPage && (
            <nav className="nav-links" style={isRegisterArtworkPage ? { width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0 } : {}}>
              {isRegisterArtworkPage ? (
                <>
                  <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>
                    פרופיל
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="logout-button"
                    title="התנתק"
                    style={{ marginRight: 0, marginLeft: 0 }}
                  >
                    <MdLogout size={24} />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/my-exhibitions" className={location.pathname === "/my-exhibitions" ? "active" : ""}>
                    תערוכות
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
                </>
              )}
            </nav>
          )}
        </div>
      </div>
=======
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
>>>>>>> d50b4b1 (committs)
    </header>
  );
};

export default Header; 