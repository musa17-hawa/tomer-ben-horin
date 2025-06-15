// // export default Header;
// import React, { useState, useEffect } from "react";
// import { useLocation, Link, useNavigate } from "react-router-dom";
// import { auth } from "../../firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { MdLogout } from "react-icons/md";
// import "./Header.css";

// const Header = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const isSignInPage = location.pathname === "/";
//   const [user, setUser] = useState(null);

//   // track auth state
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (u) => setUser(u));
//     return unsub;
//   }, []);

//   const handleLogout = async () => {
//     await signOut(auth);
//     navigate("/");
//   };

//   return (
//     <header className="app-header" dir="rtl">
//       {!isSignInPage && (
//         <nav className="nav-links">
//           <Link to="/profile">פרופיל</Link>
//           <Link to="/open-exhibition">תערוכות</Link>
//           <Link to="/my-artworks">יצירות</Link>
//           <a
//             href="#"
//             onClick={(e) => {
//               e.preventDefault();
//               handleLogout();
//             }}
//             className="nav-link logout-link"
//           >
//             <MdLogout size={18} style={{ verticalAlign: "middle" }} /> התנתק
//           </a>
//         </nav>
//       )}
//       <Link to="/">
//         <img
//           src="https://amutatbh.com/wp-content/uploads/2021/03/logo-new.svg"
//           alt="Logo"
//           className="app-logo"
//         />
//       </Link>
//     </header>
//   );
// };

// export default Header;
import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { MdLogout } from "react-icons/md";
import "./Header.css";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignInPage = location.pathname === "/";
  const [user, setUser] = useState(null);

  // track auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  // Function to check if link is active
  const isActive = (path) => location.pathname === path;

  return (
    <header className="app-header" dir="rtl">
      {!isSignInPage && (
        <nav className="nav-links">
          <Link to="/profile" className={isActive("/profile") ? "active" : ""}>
            פרופיל
          </Link>
          <Link
            to="/open-exhibition"
            className={isActive("/open-exhibition") ? "active" : ""}
          >
            תערוכות
          </Link>
          <Link
            to="/my-artworks"
            className={isActive("/my-artworks") ? "active" : ""}
          >
            יצירות
          </Link>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
            className="nav-link logout-link"
          >
            <MdLogout size={18} style={{ verticalAlign: "middle" }} /> התנתק
          </a>
        </nav>
      )}
      <Link to="/">
        <img
          src="https://amutatbh.com/wp-content/uploads/2021/03/logo-new.svg"
          alt="Logo"
          className="app-logo"
        />
      </Link>
    </header>
  );
};

export default Header;
