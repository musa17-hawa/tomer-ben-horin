import React from "react";
import { Routes, Route } from "react-router-dom";
import ArtistHeader from "./ArtistHeader";
import ArtistProfile from "./ArtistProfile";
import MyArtworks from "./MyArtworks";
import ExhibitionsList from "./opend";
import RegisterArtwork from "../artistDashboard/RegisterArtwork";
import "./ArtistDashboard.css";

const ArtistDashboard = () => {
  return (
    <div className="artist-dashboard">
      <ArtistHeader />
      <main className="artist-dashboard-content">
        <Routes>
          <Route index element={<ExhibitionsList />} />
          <Route path="/profile" element={<ArtistProfile />} />
          <Route path="/artworks" element={<MyArtworks />} />
          <Route path="/exhibitions" element={<ExhibitionsList />} />
          <Route path="/register-artwork" element={<RegisterArtwork />} />
        </Routes>
      </main>
    </div>
  );
};

export default ArtistDashboard; 