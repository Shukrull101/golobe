import { useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AuthShell from './AuthShell.jsx';
import SuccessModal from './SuccessModal.jsx';
import { EyeIcon, EyeOffIcon } from '../../icons/icons.jsx';
import { getPendingReset, MIN_PASSWORD_LENGTH, resetPassword } from '../../auth/authStorage.js';
import a from './Auth.module.css';

function scorePassword(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0..4
}

const LABELS = ['Слишком простой', 'Слабый', 'Средний', 'Хороший', 'Отличный'];

export default function SetPasswordPage() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [shake, setShake] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [canReset] = useState(() => getPendingReset()?.verified === true);

  const strength = useMemo(() => scorePassword(password), [password]);
  const mismatch = confirm.length > 0 && confirm !== password;

  function fail(message) {
    setError(message);
    setShake(true);
    setTimeout(() => setShake(false), 400);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (mismatch || password.length === 0) {
      fail('');
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      fail(`Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов`);
      return;
    }
    try {
      await resetPassword(password);
      setShowSuccess(true);
    } catch (err) {
      fail(err.message);
    }
  }

  if (!canReset && !showSuccess) return <Navigate to="/forgot-password" replace />;

  return (
    <>
    <AuthShell label="Forgot Password (Set a new Password)">
      <h1 className={a.title} style={{ marginTop: 0 }}>Set a password</h1>
      <p className={a.subtitle}>
        Your previous password has been reset. Please set a new password for your account.
      </p>

      <form className={`${a.form} ${shake ? a.shake : ''}`} onSubmit={handleSubmit}>
        <label className={a.field}>
          <span className={a.label}>Create Password</span>
          <input
            className={a.input}
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="button" className={a.eyeBtn} onClick={() => setShowPass((v) => !v)}>
            {showPass ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </label>

        {password && (
          <div aria-hidden="true" style={{ display: 'flex', gap: 6, marginTop: -10 }}>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                style={{
                  height: 4,
                  flex: 1,
                  borderRadius: 2,
                  background: i < strength ? 'var(--globe-mint-deep)' : 'var(--globe-line)',
                  transition: 'background .3s var(--globe-ease)',
                }}
              />
            ))}
          </div>
        )}
        {password && (
          <p style={{ fontSize: 12.5, color: 'var(--globe-muted)', margin: '-8px 0 0' }}>
            {LABELS[strength]}
          </p>
        )}

        <label className={a.field}>
          <span className={a.label}>Re-enter Password</span>
          <input
            className={a.input}
            type={showConfirm ? 'text' : 'password'}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <button type="button" className={a.eyeBtn} onClick={() => setShowConfirm((v) => !v)}>
            {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </label>
        {mismatch && (
          <p style={{ fontSize: 12.5, color: '#D0604A', margin: '-10px 0 0' }}>
            Пароли не совпадают
          </p>
        )}

{error && (
          <p style={{ fontSize: 12.5, color: '#D0604A', margin: '-10px 0 0' }}>{error}</p>
        )}

        <button className={a.submit} type="submit">Set password</button>
      </form>
    </AuthShell>

    <SuccessModal
      open={showSuccess}
      title="Пароль изменён"
      subtitle="Теперь можно войти с новым паролем."
      buttonText="Перейти к входу"
      onConfirm={() => navigate('/login')}
    />
    </>
  );
}
