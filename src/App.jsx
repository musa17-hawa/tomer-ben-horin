import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn/SignIn";
import Profile from "./components/ArtistProfile/profile";
import Header from "./components/Header/Header";
import { setupUserInFirestore } from "./useFirestoreUser"; // 👈 Add this import
import AdminDashboard from "./components/ArtistsCards-profile/art-cards";
import "./App.css";
import AdminProfile from "./components/ArtistsCards-profile/profileAdmin";
import ImportArtists from "./importArtits"; // Import the component if needed
import UserDashboard from "./components/artistDashboard/UserDashboard";
import RegisterArtwork from "./components/openexhibitionforartist/RegisterArtwork"; // Import the RegisterArtwork component
import UserDashboard2 from "./components/openexhibitionforartist/opend"; // Import the UserDashboard2 component
import MyArtworks from "./components/openexhibitionforartist/MyArtworks";

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
          <Route path="/profile/:id" element={<Profile />} />q
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes> */}
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/Admiprofile/:id" element={<AdminProfile />} />
          <Route path="/import-artists" element={<ImportArtists />} />{" "}
          <Route path="/UserDashboard" element={<UserDashboard />} />
          <Route path="/register-artwork" element={<RegisterArtwork />} />
          <Route path="/open-exhibition" element={<UserDashboard2 />} />
          <Route path="/my-artworks" element={<MyArtworks />} />
          {/* ✅ NEW */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
