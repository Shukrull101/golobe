import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthShell from './AuthShell.jsx';
import Logo from '../Logo/Logo.jsx';
import { EyeIcon, EyeOffIcon, FacebookIcon, GoogleIcon, AppleIcon } from '../../icons/icons.jsx';
import a from './Auth.module.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('john.doe@gmail.com');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    navigate('/'); 
  }

  return (
    <AuthShell label="Login" showHomeLink>
      <div className={a.eyebrow}><Logo size={18} /></div>
      <h1 className={a.title}>Login</h1>
      <p className={a.subtitle}>Login to access your Globe account</p>

      <form className={a.form} onSubmit={handleSubmit}>
        <label className={a.field}>
          <span className={a.label}>Email</span>
          <input
            className={a.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className={a.field}>
          <span className={a.label}>Password</span>
          <input
            className={a.input}
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className={a.eyeBtn}
            onClick={() => setShowPass((v) => !v)}
            aria-label="Показать пароль"
          >
            {showPass ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </label>

        <div className={a.rowBetween}>
          <label className={a.checkboxLabel}>
            <input type="checkbox" /> Remember me
          </label>
          <button type="button" className={a.link} onClick={() => navigate('/forgot-password')}>
            Forgot Password
          </button>
        </div>

        <button className={a.submit} type="submit">Login</button>

        <p className={a.footNote}>
          Don&rsquo;t have an account?{' '}
          <button type="button" className={a.link} onClick={() => navigate('/signup')}>Sign up</button>
        </p>

        <div className={a.divider}>Or login with</div>
        <div className={a.socialRow}>
          <button type="button" className={a.socialBtn}><FacebookIcon /></button>
          <button type="button" className={a.socialBtn}><GoogleIcon /></button>
          <button type="button" className={a.socialBtn}><AppleIcon /></button>
        </div>
      </form>
    </AuthShell>
  );
}
