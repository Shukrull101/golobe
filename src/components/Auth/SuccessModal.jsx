import { useEffect } from 'react';
import styles from './SuccessModal.module.css';

/**
 * SuccessModal — универсальная модалка-подтверждение поверх всего экрана.
 * Используется, например, после смены пароля (SetPasswordPage), чтобы
 * явно показать пользователю, что действие прошло успешно, прежде чем
 * куда-то его перенаправлять.
 */
export default function SuccessModal({ open, title, subtitle, buttonText = 'Продолжить', onConfirm }) {
  useEffect(() => {
    if (!open) return;
    function onKey(e) { if (e.key === 'Escape') onConfirm?.(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onConfirm]);

  if (!open) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.card}>
        <div className={styles.checkWrap}>
          <svg viewBox="0 0 52 52" className={styles.checkSvg}>
            <circle cx="26" cy="26" r="24" className={styles.checkCircle} />
            <path d="M15 27l7 7 15-15" className={styles.checkMark} />
          </svg>
        </div>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        <button className={styles.button} onClick={onConfirm}>{buttonText}</button>
      </div>
    </div>
  );
}
