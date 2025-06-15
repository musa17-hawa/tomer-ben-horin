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
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().isAdmin) {
          // This user is an admin!
          navigate('/admin-dashboard');
        } else {
          setError('אינך מנהל. אין לך הרשאה להיכנס כאן.');
        }
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
            />
          </div>
          <div className="input">
            <input
              type="password"
              placeholder="סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="submit-container">
          <div className="submit" onClick={handleLogin}>התחבר</div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 