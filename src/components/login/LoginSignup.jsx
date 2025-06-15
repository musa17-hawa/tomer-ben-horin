import React, { useState } from 'react';
import './LoginSignup.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../../firebase/config";
import { useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from "../../firebase/config";
import logo_icon from '../../assets/A.png';

const LoginSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().isAdmin) {
          // This user is an admin!
        }
        navigate('/user-dashboard');
      }
    } catch (err) {
      console.error(err);
      setError('ההתחברות נכשלה. בדוק את האימייל והסיסמה שלך.');
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
          <div className="text">התחברות</div>
          <div className="underline"></div>
        </div>

        <div className="inputs">
          <div className="input">
            <input
              type="email"
              placeholder="אימייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input">
            <input
              type="password"
              placeholder="טלפון"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="submit-container">
          <div className="submit" onClick={handleLogin}>התחבר</div>
          <div className="register-text">
             <a href="https://amutatbh.com/" target="_blank" rel="noopener noreferrer">אין לך חשבון? הירשם עכשיו</a>
          </div>
          <div className="admin-login-link" style={{ marginTop: 12, textAlign: 'center' }}>
            <a href="/admin-login">כניסת מנהל</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup; 