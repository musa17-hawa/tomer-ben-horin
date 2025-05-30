import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn/SignIn";
import Profile from "./components/ArtistProfile/profile";
import Header from "./components/Header/Header";
import { setupUserInFirestore } from "./useFirestoreUser"; // 👈 Add this import
import "./App.css";

const App = () => {
  useEffect(() => {
    setupUserInFirestore(); // 👈 Call on load
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
