import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthShell from './AuthShell.jsx';
import { ChevronLeft, EyeIcon, EyeOffIcon } from '../../icons/icons.jsx';
import a from './Auth.module.css';

const RESEND_SECONDS = 30;

export default function VerifyCodePage() {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [reveal, setReveal] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (cooldown === 0) return;
    const id = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  function handleSubmit(e) {
    e.preventDefault();
    navigate('/set-password');
  }

  function handleResend() {
    if (cooldown > 0) return;
    setCooldown(RESEND_SECONDS);
  }

  return (
    <AuthShell label="Verify code">
      <button type="button" className={a.backLink} onClick={() => navigate('/forgot-password')}>
        <ChevronLeft /> Back to login
      </button>

      <h1 className={a.title} style={{ marginTop: 0 }}>Verify code</h1>
      <p className={a.subtitle}>An authentication code has been sent to your email.</p>

      <form className={a.form} onSubmit={handleSubmit}>
        <label className={a.field}>
          <span className={a.label}>Enter Code</span>
          <input
            className={a.input}
            type={reveal ? 'text' : 'password'}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="7789BM6X"
            required
          />
          <button type="button" className={a.eyeBtn} onClick={() => setReveal((v) => !v)}>
            {reveal ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </label>

        <p className={a.resendHint}>
          Didn&rsquo;t receive a code?{' '}
          <button type="button" className={a.link} onClick={handleResend} disabled={cooldown > 0}>
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend'}
          </button>
        </p>

        <button className={a.submit} type="submit">Verify</button>
      </form>
    </AuthShell>
  );
}
