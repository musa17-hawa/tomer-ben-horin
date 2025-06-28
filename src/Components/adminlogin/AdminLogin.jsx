import React, { useState } from 'react';
import './AdminLogin.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../../firebase/config";
import { useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from "../../firebase/config";
import logo_icon from '../../assets/A.png';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Check if user is admin
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists() || !userDoc.data().isAdmin) {
        setError("רק אדמין יכול להיכנס כאן.");
        return;
      }
      navigate('/user-dashboard');
    } catch (err) {
      console.error(err);
      setError('ההתחברות נכשלה. בדוק את האימייל והסיסמה שלך.');
    }
  };
  

  return (
    <div className="login-page-wrapper" dir="rtl">
      <div className="login-box">

        {/* Logo now on the LEFT */}
        <div className="side-container">
          <div className="logo-wrapper">
            <img src={logo_icon} alt="לוגו" className="logo-image" />
          </div>
        </div>

        {/* Login form now on the RIGHT */}
        <div className="container">
          <div className="header">
            <div className="text">כניסה כמנהל</div>
            <div className="underline"></div>
          </div>

          <div className="inputs">
            <div className="input">
              <input
                type="email"
                placeholder="אימייל מנהל"
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
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
