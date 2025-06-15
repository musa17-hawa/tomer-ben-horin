<<<<<<< HEAD
<<<<<<< HEAD
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginSignup from "./Components/LoginSignup/LoginSignup";
import UserDashboard from "./Components/UserDashboard/UserDashboard";
import ArtworkForm from "./Components/ArtworkForm/ArtworkForm";
=======
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import UserDashboard from './components/UserDashboard';
import LoginSignup from './components/LoginSignup/LoginSignup';
import Header from './components/Header';
import RegisterArtwork from './components/RegisterArtwork';
import MyExhibitions from './components/MyExhibitions';
>>>>>>> cfc1b5c (commit)
=======
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './components/exhibitions/Dashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import Profile from './components/artists/profileAdmin';
import LoginSignup from './components/login/LoginSignup';
import AdminLogin from './components/adminlogin/AdminLogin';
>>>>>>> d50b4b1 (committs)

function App() {
  return (
    <Router>
<<<<<<< HEAD
<<<<<<< HEAD
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/register-artwork" element={<ArtworkForm />} />
      </Routes>
=======
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/register-artwork" element={<RegisterArtwork />} />
          <Route path="/my-exhibitions" element={<MyExhibitions />} />
        </Routes>
      </div>
>>>>>>> cfc1b5c (commit)
=======
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/Admiprofile/:id" element={<Profile />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        {/* Add other routes as needed */}
      </Routes>
>>>>>>> d50b4b1 (committs)
    </Router>
  );
}

<<<<<<< HEAD
<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> cfc1b5c (commit)
=======
export default App;
>>>>>>> d50b4b1 (committs)
