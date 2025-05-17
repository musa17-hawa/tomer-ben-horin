import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const location = useLocation();
  const isSignInPage = location.pathname === "/";

  return (
    <header className="app-header">
      {!isSignInPage && (
        <nav className="nav-links">
          <Link to="/profile">Profile</Link>
          <Link to="/gallery">Gallery</Link>
          {/* Add more links as needed */}
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
