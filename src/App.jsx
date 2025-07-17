import { Routes, Route, Navigate } from "react-router-dom";
import ExhibitionsList from "./components/Artist-DashBoard/ArtistDashboard";
import ArtistBioEdit from "./components/Artist-DashBoard/ArtistBioEdit";
import RegisterArtwork from "./components/Artist-DashBoard/RegisterArtwork";
import MyArtworks from "./components/Artist-DashBoard/MyArtworks";
import ArtistProfile from "./components/Artist-DashBoard/ArtistProfile";
import LoginSignup from "./LoginPage";
import "aos/dist/aos.css";
import AdminLogin from "./AdminLogin";
import AdminLayout from "./components/AdminDashboard/AdminLayout";
import AdminSummary from "./components/AdminDashboard/AdminSummary";

import AdminExhibitions from "./components/AdminDashboard/AdminExhibitions";
import AdminArtists from "./components/AdminDashboard/AdminArtists";
import AdminArtworks from "./components/AdminDashboard/CreationsPage";
import AdminStats from "./components/AdminDashboard/AdminStats";
import EditExhibition from "./components/AdminDashboard/EditExhibitions";
import AddExhibition from "./components/AdminDashboard/AddExhibition";
import AdminViewArtist from "./components/AdminDashboard/AdminViewArtist";
import AdminGalleries from "./components/AdminDashboard/AdminGalleries";
import AddGallery from "./components/AdminDashboard/AddGallery";
import EditGallery from "./components/AdminDashboard/EditGallery";
import AdminGalleryDetails from "./components/AdminDashboard/AdminGalleryDetails";
import CreationsPage from "./components/AdminDashboard/CreationsPage";
import AdminPendingArtworks from "./components/AdminDashboard/AdminPendingArtworks";
import AdminAllArtworks from "./components/AdminDashboard/AdminAllArtworks";
import ExhibitionArtworksView from "./components/Artist-DashBoard/ExhibitionArtworksView";
function App() {
  return (
    <Routes>
      {/* Artist routes */}
      <Route path="/" element={<LoginSignup />} />
      <Route path="/artist-dashboard" element={<ExhibitionsList />} />
      <Route path="/artist-dashboard/edit-bio" element={<ArtistBioEdit />} />
      <Route
        path="/artist-dashboard/register-artwork"
        element={<RegisterArtwork />}
      />
      <Route
        path="/artist-dashboard/exhibition/:id"
        element={<ExhibitionArtworksView />}
      />
      <Route path="/artist-dashboard/my-artworks" element={<MyArtworks />} />
      <Route path="/artist-dashboard/profile" element={<ArtistProfile />} />
      Admin login
      <Route path="/admin-login" element={<AdminLogin />} />
      {/* Admin panel layout with nested pages */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminSummary />} />
        <Route path="summary" element={<AdminSummary />} />
        <Route path="exhibitions" element={<AdminExhibitions />} />
        <Route path="exhibitions/edit/:id" element={<EditExhibition />} />
        <Route path="exhibitions/add" element={<AddExhibition />} />
        <Route path="artist/:id" element={<AdminViewArtist />} />

        {/* ✅ FIXED path for creations */}
        <Route path="creations" element={<CreationsPage />} />
        <Route path="pending-artworks" element={<AdminPendingArtworks />} />
        <Route path="allArtworks" element={<AdminAllArtworks />} />

        {/* ✅ GALLERY ROUTES */}
        <Route path="galleries" element={<AdminGalleries />} />
        <Route path="galleries/add" element={<AddGallery />} />
        <Route path="galleries/edit/:galleryId" element={<EditGallery />} />
        <Route path="galleries/:galleryId" element={<AdminGalleryDetails />} />
        <Route
          path="galleries/:galleryId/add-exhibition"
          element={<AddExhibition />}
        />

        <Route path="artists" element={<AdminArtists />} />
        <Route path="stats" element={<AdminStats />} />
      </Route>
      {/* <Route path="/admin/artist/:id" element={<AdminViewArtist />} /> */}
      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
