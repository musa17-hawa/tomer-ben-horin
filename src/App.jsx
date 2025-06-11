import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn/SignIn";
import Profile from "./components/ArtistProfile/profile";
import Header from "./components/Header/Header";
import { setupUserInFirestore } from "./useFirestoreUser"; // 👈 Add this import
import AdminDashboard from "./components/ArtistsCards-profile/art-cards";
import "./App.css";
import AdminProfile from "./components/ArtistsCards-profile/profileAdmin";

const App = () => {
  useEffect(() => {
    setupUserInFirestore(); // 👈 Call on load
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />
        {/* <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes> */}
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/Admiprofile/:id" element={<AdminProfile />} />{" "}
          {/* ✅ Add this */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
