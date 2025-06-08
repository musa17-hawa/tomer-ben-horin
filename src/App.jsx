import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginSignup from "./Components/LoginSignup/LoginSignup";
import UserDashboard from "./Components/UserDashboard/UserDashboard";
import ArtworkForm from "./Components/ArtworkForm/ArtworkForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/register-artwork" element={<ArtworkForm />} />
      </Routes>
    </Router>
  );
}

export default App;
