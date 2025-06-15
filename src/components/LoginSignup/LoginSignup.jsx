import React, { useState } from 'react';
import './LoginSignup.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';
import logo_icon from '../../assets/A.png';

const LoginSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

 /* const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/user-dashboard');
    } catch (err) {
      console.error(err);
      setError('ההתחברות נכשלה. בדוק את האימייל והסיסמה שלך.');
    }
  };*/

  return (
    <div className="login-page-wrapper" dir="rtl">
      <div className="login-box">
        {/* Logo on the RIGHT */}
        <div className="side-container">
          <div className="logo-wrapper">
            <img src={logo_icon} alt="לוגו" className="logo-image" />
          </div>
        </div>

        {/* Form on the LEFT */}
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
                style={{ textAlign: 'right' }}
              />
            </div>
            <div className="input">
              <input
                type="password"
                placeholder="סיסמה"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ textAlign: 'right' }}
              />
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="submit-container">
            <div className="submit" onClick={handleLogin}>התחבר</div>
            <div className="register-text">
              אין לך חשבון?{' '}
              <a href="https://amutatbh.com/" target="_blank" rel="noreferrer">
                הירשם עכשיו
              </a>
              <br />
              מנהל?{' '}
              <a href="/admin-login">
                התחבר כאן
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
