import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginSignup from "./Components/mainLogInPage/LoginSignup";
import Dashboard from "./Components/exhibitions/Dashboard";
import AdminDashboard from "./Components/admin/AdminDashboard";
import Profile from "./Components/artists/profileAdmin";
import AdminLogin from "./Components/adminlogin/AdminLogin";
import ArtistDashboard from "./Components/artistDashboard/ArtistDashboard";
import AdminArtworksReview from "./Components/exhibitions/AdminArtworksReview";
import AdminAllArtworks from "./Components/exhibitions/AdminAllArtworks";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route goes to user login/signup */}
        <Route path="/" element={<LoginSignup />} />

        {/* User dashboard */}
        <Route path="/user-dashboard" element={<Dashboard />} />

        {/* Artist dashboard */}
        <Route path="/artist-dashboard/*" element={<ArtistDashboard />} />

        {/* Admin routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/Admiprofile/:id" element={<Profile />} />
        <Route
          path="/admin-artworks-review/:exhibitionId"
          element={<AdminArtworksReview />}
        />
        <Route
          path="/admin-all-artworks/:exhibitionId"
          element={<AdminAllArtworks />}
        />

        <Route
          path="/admin-artworks-review"
          element={<AdminArtworksReview />}
        />

        {/* Catch-all fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
