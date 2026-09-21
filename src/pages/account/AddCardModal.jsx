import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import { CloseIcon, ChevronDown } from '../../icons/icons.jsx';
import {
  COUNTRIES,
  cardLength,
  cvcLength,
  detectBrand,
  digitsOnly,
  formatCardNumber,
  formatExpiry,
  validateCard,
} from './lib/cards.js';
import BrandBadge from './BrandBadge.jsx';
import styles from './PaymentTab.module.css';

function emptyForm(user) {
  return {
    number: '',
    expiry: '',
    cvc: '',
    holder: `${user.firstName} ${user.lastName}`.trim(),
    country: 'United States',
    saveForCheckout: true,
  };
}

/** Модалка монтируется заново при каждом открытии, поэтому форма всегда чистая. */
export default function AddCardModal({ user, onClose, onAdded }) {
  const { addCard } = useAuth();
  const [form, setForm] = useState(() => emptyForm(user));
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const firstInput = useRef(null);

  useEffect(() => {
    firstInput.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const brand = detectBrand(form.number);

  function set(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  }

  function setNumber(value) {
    const number = formatCardNumber(value);
    // у новой платёжной системы CVC может быть короче (AMEX 4 → VISA 3)
    const maxCvc = cvcLength(detectBrand(number));
    setForm((f) => ({ ...f, number, cvc: f.cvc.slice(0, maxCvc) }));
    if (errors.number) setErrors((e) => ({ ...e, number: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const found = validateCard(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    setSubmitError('');
    try {
      const u = await addCard({ ...form, number: digitsOnly(form.number), brand });
      onAdded(u.cards[u.cards.length - 1]);
    } catch (err) {
      setSubmitError(err.message);
      setLoading(false);
    }
  }

  // портал в body: анимированный родитель (transform) иначе «обрезает» position: fixed
  return createPortal(
    <div className={styles.overlay} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="add-card-title">
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
          <CloseIcon />
        </button>

        <h2 id="add-card-title" className={styles.modalTitle}>Add a new Card</h2>

        <form className={styles.modalForm} onSubmit={handleSubmit} noValidate>
          <Field label="Card Number" error={errors.number}>
            <input
              ref={firstInput}
              className={styles.modalInput}
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4321 4321 4321 4321"
              value={form.number}
              // + пробелы между группами цифр
              maxLength={cardLength(brand) + 4}
              onChange={(e) => setNumber(e.target.value)}
            />
            <span className={styles.fieldBrand}><BrandBadge brand={brand} small /></span>
          </Field>

          <div className={styles.modalRow}>
            <Field label="Exp. Date" error={errors.expiry}>
              <input
                className={styles.modalInput}
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                maxLength={5}
                value={form.expiry}
                onChange={(e) => {
                  const next = e.target.value;
                  // при стирании не подставляем «/» обратно
                  set('expiry', next.length < form.expiry.length ? next : formatExpiry(next));
                }}
              />
            </Field>
            <Field label="CVC" error={errors.cvc}>
              <input
                className={styles.modalInput}
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder={brand === 'amex' ? '1234' : '123'}
                type="password"
                value={form.cvc}
                maxLength={cvcLength(brand)}
                onChange={(e) => set('cvc', digitsOnly(e.target.value).slice(0, cvcLength(brand)))}
              />
            </Field>
          </div>

          <Field label="Name on Card" error={errors.holder}>
            <input
              className={styles.modalInput}
              autoComplete="cc-name"
              placeholder="John Doe"
              value={form.holder}
              onChange={(e) => set('holder', e.target.value)}
            />
          </Field>

          <Field label="Country or Region">
            <select
              className={`${styles.modalInput} ${styles.select}`}
              autoComplete="country-name"
              value={form.country}
              onChange={(e) => set('country', e.target.value)}
            >
              {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown className={styles.selectChevron} />
          </Field>

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={form.saveForCheckout}
              onChange={(e) => set('saveForCheckout', e.target.checked)}
            />
            Securely save my information for 1-click checkout
          </label>

          {submitError && <p className={styles.submitError}>{submitError}</p>}

          <button type="submit" className={styles.addCardBtn} disabled={loading}>
            {loading ? 'Adding…' : 'Add Card'}
          </button>

          <p className={styles.finePrint}>
            By confirming your subscription, you allow The Outdoor Inn Crowd Limited to charge your
            card for this payment and future payments in accordance with their terms. You can always
            cancel your subscription.
          </p>
        </form>
      </div>
    </div>,
    document.body,
  );
}

function Field({ label, error, children }) {
  return (
    <div className={styles.fieldWrap}>
      <label className={`${styles.modalField} ${error ? styles.modalFieldError : ''}`}>
        <span className={styles.modalLabel}>{label}</span>
        {children}
      </label>
      {error && <p className={styles.fieldError}>{error}</p>}
    </div>
  );
}
