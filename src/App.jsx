import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn/SignIn";
import Profile from "./components/ArtistProfile/profile";
import Header from "./components/Header/Header"; // ⬅️ Import header
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Header /> {/* ⬅️ Add header above routes */}
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
