import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthShell from './AuthShell.jsx';
import { ChevronLeft, FacebookIcon, GoogleIcon, AppleIcon } from '../../icons/icons.jsx';
import a from './Auth.module.css';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('john.doe@gmail.com');

  function handleSubmit(e) {
    e.preventDefault();
    navigate('/verify-code');
  }

  return (
    <AuthShell label="Forgot Password">
      <button type="button" className={a.backLink} onClick={() => navigate('/login')}>
        <ChevronLeft /> Back to login
      </button>

      <h1 className={a.title} style={{ marginTop: 0 }}>Forgot your password?</h1>
      <p className={a.subtitle}>
        Don&rsquo;t worry, happens to all of us. Enter your email below to recover your password.
      </p>

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

        <button className={a.submit} type="submit">Submit</button>

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
