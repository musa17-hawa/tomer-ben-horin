import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from './components/exhibitions/Dashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import Profile from './components/artists/profileAdmin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/Admiprofile/:id" element={<Profile />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;