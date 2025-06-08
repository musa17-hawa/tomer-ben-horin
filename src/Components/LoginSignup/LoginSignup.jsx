import React, { useState } from 'react';
import './LoginSignup.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "@/firebaseConfig";
import { useNavigate } from 'react-router-dom';

import user_icon from '../assets/person.png';
import email_icon from '../assets/email.png';
import phone_icon from '../assets/phone.jpg';
import logo_icon from '../assets/A.png';

const LoginSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Login failed. Check your email and password.');
    }
  };

  return (
    <div className="login-box">
      <div className="side-container">
        <div className="logo-wrapper">
          <img src={logo_icon} alt="Logo" className="logo-image" />
        </div>
      </div>

      <div className="container">
        <div className="header">
          <img src={user_icon} alt="User Icon" className="avatar-icon" />
          <div className="text">Log in</div>
          <div className="underline"></div>
        </div>

        <div className="inputs">
          <div className="input">
            <img src={email_icon} alt="Email" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input">
            <img src={phone_icon} alt="Password" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="submit-container">
          <div className="submit" onClick={handleLogin}>Log in</div>
          <div className="register-text">
            Don’t have an account? <a href="#">Register now</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
