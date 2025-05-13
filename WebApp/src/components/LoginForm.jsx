import { Mail, Phone, LogIn, User, ArrowLeft } from 'lucide-react';
import './LoginForm.css';

function LoginForm() {
  return (
    <div className="login-container">
      <div className="login-header">
        <h2 className="login-title">התחבר לחשבון</h2>
        <div className="login-subtitle">התחברו כדי לגשת לחשבון האישי שלכם</div>
      </div>

      <form className="login-form">
        <div className="form-group">
          <label htmlFor="username">כתובת אימייל</label>
          <div className="input-wrapper">
            <input 
              type="email" 
              id="username" 
              name="username" 
              placeholder="הקליד את כתובת האימייל שלך" 
              required 
              onInvalid={(e) => e.target.setCustomValidity('אנא מלא כתובת אימייל')}
              onInput={(e) => e.target.setCustomValidity('')}
            />
            <Mail className="input-icon" size={18} />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="phone">מספר טלפון</label>
          <div className="input-wrapper">
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              placeholder="הקליד את מספר הטלפון שלך" 
              required 
              onInvalid={(e) => e.target.setCustomValidity('אנא מלא מספר טלפון')}
              onInput={(e) => e.target.setCustomValidity('')}
            />
            <Phone className="input-icon" size={18} />
          </div>
        </div>

        <button type="submit" className="login-btn">
          <span>התחברות לאתר</span>
          <LogIn size={18} />
        </button>
      </form>

      <div className="divider">
        <span>או</span>
      </div>

      <div className="register-box">
        <h3 className="register-title">אתם חדשים כאן?</h3>
        <p className="register-subtitle">הירשמו באתר הראשי שלנוה</p>
        <a href="/register" className="register-btn">
          <span>הרשמה לאתר הראשי</span>
          <User size={18} />
        </a>
      </div>
      
      {/* <div className="back-link">
        <a href="/">
          <ArrowLeft size={16} />
          <span>חזרה לדף הבית</span>
        </a>
      </div> */}
    </div>
  );
}

export default LoginForm;
