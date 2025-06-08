import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logob.png';
import personIcon from '../assets/person.png';
import './UserDashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();

  const exhibitions = [
    { id: 1, date: '3.6.2025' },
    { id: 2, date: '4.6.2025' },
    { id: 3, date: '12.6.2025' },
    { id: 4, date: '18.5.2025' },
    { id: 5, date: '2.6.2025' },
    { id: 6, date: '16.5.2025' },
    { id: 7, date: '4.6.2025' },
    { id: 8, date: '15.6.2025' },
    { id: 9, date: '13.5.2025' },
    { id: 10, date: '14.6.2025' },
  ];

  const handleRegisterClick = () => {
    navigate('/register-artwork');
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="artist-dashboard">
      <nav className="main-navbar">
        <div className="navbar-flex">
          {/* Logo (clickable) */}
          <img
            src={logo}
            alt="Logo"
            className="navbar-logo"
            onClick={() => navigate('/dashboard')}
            style={{ cursor: 'pointer' }}
          />

          {/* Navigation Links */}
          <ul className="nav-links">
            <li><a href="#artist">דף אמן</a></li>
            <li><a href="#exhibitions">תערוכות</a></li>
          </ul>

          {/* Profile Icon */}
          <div className="profile-wrapper">
            <img src={personIcon} alt="Profile" className="profile-icon" />
          </div>

          {/* Logout Button */}
          <button className="logout-button" onClick={handleLogout}>
            התנתק
          </button>
        </div>
      </nav>

      {/* Welcome Title */}
      <h1 className="welcome-title">ברוך הבא, פאטמה</h1>

      {/* Exhibitions Grid */}
      <div className="exhibition-grid">
        {exhibitions.map((exhibition) => (
          <div className="exhibition-card" key={exhibition.id}>
            <div className="exhibition-title">תערוכה {exhibition.id}</div>
            <div className="exhibition-date">
              תערוכה {exhibition.id}
              <br />
              {exhibition.date}
            </div>
            <div className="exhibition-status">פתוחה</div>
            <button className="register-button" onClick={handleRegisterClick}>
              הירשם לתערוכה
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
