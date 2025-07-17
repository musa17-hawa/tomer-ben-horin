import React, { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  FaImages,
  FaUserAlt,
  FaChartBar,
  FaThLarge,
  FaPaintBrush,
  FaBars,
  FaSignOutAlt,
} from "react-icons/fa";
import { getAuth, signOut } from "firebase/auth";

const AdminLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [openArtworks, setOpenArtworks] = useState(
    pathname.includes("pending-artworks") || pathname.includes("artworks-list")
  );

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigate("/login"); // Redirect after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { name: "סיכום", path: "/admin/summary", icon: <FaChartBar /> },
    { name: "תערוכות", path: "/admin/exhibitions", icon: <FaThLarge /> },
    { name: "גלריות", path: "/admin/galleries", icon: <FaImages /> },
    { name: "אמנים", path: "/admin/artists", icon: <FaUserAlt /> },
    { name: "סטטיסטיקות", path: "/admin/stats", icon: <FaChartBar /> },
  ];

  return (
    <div dir="rtl" className="min-h-screen flex font-sans bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#fd3470] text-white flex flex-col p-6 fixed top-0 right-0 h-screen z-50 shadow-lg">
        {/* Top section: logo and nav */}
        <div className="flex-1 flex flex-col">
          {/* Logo */}
          <div className="bg-white p-2 rounded-xl shadow-md mb-6">
            <img
              src="https://amutatbh.com/wp-content/uploads/2021/03/logo-new.svg"
              alt="Logo"
              className="h-max w-max object-contain"
            />
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-2 rounded-md hover:bg-pink-600 transition ${
                  pathname === item.path
                    ? "bg-white text-[#fd3470] font-bold"
                    : ""
                }`}
              >
                <span className="ml-2 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}

            {/* Hamburger Style Dropdown */}
            <div>
              <button
                onClick={() => setOpenArtworks((prev) => !prev)}
                className={`flex justify-between items-center w-full px-4 py-2 rounded-md hover:bg-pink-600 transition ${
                  pathname.includes("artworks")
                    ? "bg-white text-[#fd3470] font-bold"
                    : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaPaintBrush />
                  <span>יצירות</span>
                </div>
                <FaBars className="text-lg" />
              </button>

              {openArtworks && (
                <div className="mt-2 flex flex-col gap-1 text-sm text-white pr-6">
                  <Link
                    to="/admin/pending-artworks"
                    className={`text-right px-4 py-1 rounded-md hover:bg-pink-600 transition ${
                      pathname === "/admin/pending-artworks"
                        ? "bg-white text-[#fd3470] font-bold"
                        : ""
                    }`}
                  >
                    יצירות בהמתנה
                  </Link>
                  <Link
                    to="/admin/allArtworks"
                    className={`text-right px-4 py-1 rounded-md hover:bg-pink-600 transition ${
                      pathname === "/admin/allArtworks"
                        ? "bg-white text-[#fd3470] font-bold"
                        : ""
                    }`}
                  >
                    כל היצירות
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Logout Button at the bottom */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center mt-auto bg-white text-[#fd3470] px-4 py-2 rounded-md hover:bg-pink-200 transition font-semibold"
        >
          <FaSignOutAlt className="ml-2" />
          התנתקות
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col mr-64">
        <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-800">מנהל</div>
          <h1 className="text-xl font-bold text-[#fd3470]">לוח ניהול</h1>
        </header>

        <main className="p-6 bg-[url('https://amutatbh.com/wp-content/uploads/2021/03/wall-bg.jpg')] min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
