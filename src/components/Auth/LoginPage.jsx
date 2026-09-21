import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthShell from './AuthShell.jsx';
import Logo from '../Logo/Logo.jsx';
import { EyeIcon, EyeOffIcon, FacebookIcon, GoogleIcon, AppleIcon } from '../../icons/icons.jsx';
import { useAuth } from '../../auth/AuthContext.jsx';
import a from './Auth.module.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password, remember });
      navigate(location.state?.from ?? '/account', { replace: true });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
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
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            /> Remember me
          </label>
          <button type="button" className={a.link} onClick={() => navigate('/forgot-password')}>
            Forgot Password
          </button>
        </div>

        {error && (
          <p style={{ fontSize: 12.5, color: '#D0604A', margin: '-10px 0 0' }}>{error}</p>
        )}

        <button className={a.submit} type="submit" disabled={loading}>Login</button>

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
