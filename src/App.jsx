import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginSignup from './Components/mainLogInPage/LoginSignup';
import Dashboard from './Components/exhibitions/Dashboard';
import AdminDashboard from './Components/admin/AdminDashboard';
import Profile from './Components/artists/profileAdmin';
import AdminLogin from './Components/adminlogin/AdminLogin';
import ArtistDashboard from './Components/artistDashboard/ArtistDashboard';

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

        {/* Catch-all fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
