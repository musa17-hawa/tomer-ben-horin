import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { MdLogout } from "react-icons/md";
import "./AdminHeader.css";

const AdminHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin-login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="admin-header" dir="rtl">
      <div className="admin-header-content">
        <img
          src="https://amutatbh.com/wp-content/uploads/2021/03/logo-new.svg"
          alt="לוגו"
          className="admin-header-logo"
          onClick={() => navigate("/admin-dashboard")}
        />
        <div className="admin-header-title">לוח ניהול</div>
        <button
          className="admin-header-logout"
          onClick={handleLogout}
          title="התנתק"
        >
          <MdLogout size={24} />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
