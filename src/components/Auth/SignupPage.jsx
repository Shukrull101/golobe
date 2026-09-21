import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthShell from './AuthShell.jsx';
import Logo from '../Logo/Logo.jsx';
import { EyeIcon, EyeOffIcon, FacebookIcon, GoogleIcon, AppleIcon } from '../../icons/icons.jsx';
import { useAuth } from '../../auth/AuthContext.jsx';
import { MIN_PASSWORD_LENGTH } from '../../auth/authStorage.js';
import a from './Auth.module.css';

export default function SignupPage() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const { register } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const mismatch = form.confirm.length > 0 && form.confirm !== form.password;

  function field(name) {
    return {
      value: form[name],
      onChange: (e) => setForm((f) => ({ ...f, [name]: e.target.value })),
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!agree) return;
    setError('');
    if (form.password.length < MIN_PASSWORD_LENGTH) {
      setError(`Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов`);
      return;
    }
    if (mismatch) {
      setError('Пароли не совпадают');
      return;
    }
    setLoading(true);
    try {
      const { confirm: _c, ...data } = form;
      await register(data);
      navigate('/account', { replace: true });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <AuthShell label="Sign up" mirrored showHomeLink>
      <div className={a.eyebrow}><Logo size={18} /></div>
      <h1 className={a.title}>Sign up</h1>
      <p className={a.subtitle}>Let&rsquo;s get you all set up so you can access your personal account.</p>

      <form className={a.form} onSubmit={handleSubmit}>
        <div className={a.row}>
          <label className={a.field}>
            <span className={a.label}>First Name</span>
            <input className={a.input} type="text" required {...field('firstName')} />
          </label>
          <label className={a.field}>
            <span className={a.label}>Last Name</span>
            <input className={a.input} type="text" required {...field('lastName')} />
          </label>
        </div>

        <div className={a.row}>
          <label className={a.field}>
            <span className={a.label}>Email</span>
            <input className={a.input} type="email" required {...field('email')} />
          </label>
          <label className={a.field}>
            <span className={a.label}>Phone Number</span>
            <input className={a.input} type="tel" required {...field('phone')} />
          </label>
        </div>

        <label className={a.field}>
          <span className={a.label}>Password</span>
          <input className={a.input} type={showPass ? 'text' : 'password'} required {...field('password')} />
          <button type="button" className={a.eyeBtn} onClick={() => setShowPass((v) => !v)}>
            {showPass ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </label>

        <label className={a.field}>
          <span className={a.label}>Confirm Password</span>
          <input className={a.input} type={showConfirm ? 'text' : 'password'} required {...field('confirm')} />
          <button type="button" className={a.eyeBtn} onClick={() => setShowConfirm((v) => !v)}>
            {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </label>

        <label className={a.checkboxLabel}>
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span className={a.terms}>
            I agree to all the <a className={a.link} href="#">Terms</a> and{' '}
            <a className={a.link} href="#">Privacy Policies</a>.
          </span>
        </label>

        {error && (
          <p style={{ fontSize: 12.5, color: '#D0604A', margin: '-10px 0 0' }}>{error}</p>
        )}

        <button className={a.submit} type="submit" disabled={!agree || loading}>Create account</button>

        <p className={a.footNote}>
          Already have an account?{' '}
          <button type="button" className={a.link} onClick={() => navigate('/login')}>Login</button>
        </p>

        <div className={a.divider}>Or Sign up with</div>
        <div className={a.socialRow}>
          <button type="button" className={a.socialBtn}><FacebookIcon /></button>
          <button type="button" className={a.socialBtn}><GoogleIcon /></button>
          <button type="button" className={a.socialBtn}><AppleIcon /></button>
        </div>
      </form>
    </AuthShell>
  );
}
