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

function App() {
  return (
    <Router>
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
    </Router>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> cfc1b5c (commit)
