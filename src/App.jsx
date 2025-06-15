import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginSignup from './components/LoginSignup/LoginSignup';
import Dashboard from './components/exhibitions/Dashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import Profile from './components/artists/profileAdmin';
import AdminLogin from './components/adminlogin/AdminLogin';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route goes to user login/signup */}
        <Route path="/" element={<LoginSignup />} />

        {/* User dashboard */}
        <Route path="/user-dashboard" element={<Dashboard />} />

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
