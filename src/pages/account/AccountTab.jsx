import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../auth/AuthContext.jsx';
import { MIN_PASSWORD_LENGTH, isValidPhone } from '../../auth/authStorage.js';
import { PencilIcon, PlusCircleIcon, CloseIcon, EyeIcon, EyeOffIcon } from '../../icons/icons.jsx';
import { todayISO } from './lib/bookings.js';
import page from './AccountPage.module.css';
import styles from './AccountTab.module.css';

function formatBirthDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
}

export default function AccountTab({ user, notify }) {
  const auth = useAuth();
  const [editing, setEditing] = useState(null);

  /** Обёртка для сохранения: закрывает форму и показывает тост. */
  function save(action, message) {
    return async (values) => {
      await action(values);
      setEditing(null);
      notify(message);
    };
  }

  const editorProps = { onCancel: () => setEditing(null) };

  /** Для действий без формы (кнопки у дополнительных email). */
  async function run(action, message) {
    try {
      await action();
      notify(message);
    } catch (err) {
      notify(err.message, 'error');
    }
  }

  return (
    <>
      <h2 className={page.sectionTitle}>Account</h2>

      <div className={`${page.panel} ${styles.list}`}>
        <Row
          label="Name"
          value={`${user.firstName} ${user.lastName}`.trim()}
          editing={editing === 'name'}
          onChange={() => setEditing('name')}
          editor={
            <InlineForm
              {...editorProps}
              fields={[
                { name: 'firstName', label: 'First Name', autoComplete: 'given-name', required: true },
                { name: 'lastName', label: 'Last Name', autoComplete: 'family-name' },
              ]}
              initial={{ firstName: user.firstName, lastName: user.lastName }}
              onSubmit={save((v) => auth.updateProfile(v), 'Имя обновлено')}
            />
          }
        />

        <Row
          label="Email"
          value={user.email}
          editing={editing === 'email' || editing === 'addEmail'}
          onChange={() => setEditing('email')}
          extraAction={
            <button type="button" className={styles.actionBtn} onClick={() => setEditing('addEmail')}>
              <PlusCircleIcon /> Add another email
            </button>
          }
          below={
            user.extraEmails?.length > 0 && (
              <ul className={styles.extraEmails}>
                {user.extraEmails.map((email) => (
                  <li key={email} className={styles.extraEmail}>
                    <span>{email}</span>
                    <button
                      type="button"
                      className={styles.textBtn}
                      onClick={() =>
                        run(() => auth.makePrimaryEmail(email), 'Основной email изменён — входите с ним')
                      }
                    >
                      Make primary
                    </button>
                    <button
                      type="button"
                      className={styles.iconBtn}
                      aria-label={`Удалить ${email}`}
                      onClick={() => run(() => auth.removeExtraEmail(email), 'Email удалён')}
                    >
                      <CloseIcon width="14" height="14" />
                    </button>
                  </li>
                ))}
              </ul>
            )
          }
          editor={
            editing === 'addEmail' ? (
              <InlineForm
                key="add-email"
                {...editorProps}
                fields={[{ name: 'email', label: 'Another email', type: 'email', autoComplete: 'email', required: true }]}
                initial={{ email: '' }}
                submitLabel="Add"
                onSubmit={save(({ email }) => auth.addExtraEmail(email), 'Email добавлен')}
              />
            ) : (
              <InlineForm
                key="change-email"
                {...editorProps}
                fields={[{ name: 'email', label: 'Email', type: 'email', autoComplete: 'email', required: true }]}
                initial={{ email: user.email }}
                hint="Этот адрес используется для входа в аккаунт."
                onSubmit={save(({ email }) => auth.changeEmail(email), 'Email обновлён')}
              />
            )
          }
        />

        <Row
          label="Password"
          value="••••••••••••"
          editing={editing === 'password'}
          onChange={() => setEditing('password')}
          editor={
            <InlineForm
              {...editorProps}
              fields={[
                { name: 'current', label: 'Current password', type: 'password', autoComplete: 'current-password', required: true },
                { name: 'next', label: 'New password', type: 'password', autoComplete: 'new-password', required: true },
                { name: 'confirm', label: 'Confirm new password', type: 'password', autoComplete: 'new-password', required: true },
              ]}
              initial={{ current: '', next: '', confirm: '' }}
              hint={`Минимум ${MIN_PASSWORD_LENGTH} символов.`}
              validate={(v) => (v.next !== v.confirm ? 'Пароли не совпадают' : null)}
              onSubmit={save((v) => auth.changePassword(v.current, v.next), 'Пароль изменён')}
            />
          }
        />

        <Row
          label="Phone number"
          value={user.phone}
          editing={editing === 'phone'}
          onChange={() => setEditing('phone')}
          editor={
            <InlineForm
              {...editorProps}
              fields={[{ name: 'phone', label: 'Phone number', type: 'tel', autoComplete: 'tel', placeholder: '+1 000-000-0000' }]}
              initial={{ phone: user.phone }}
              validate={(v) => (isValidPhone(v.phone) ? null : 'Некорректный номер телефона')}
              onSubmit={save((v) => auth.updateProfile(v), 'Телефон обновлён')}
            />
          }
        />

        <Row
          label="Address"
          value={user.address}
          editing={editing === 'address'}
          onChange={() => setEditing('address')}
          editor={
            <InlineForm
              {...editorProps}
              fields={[{ name: 'address', label: 'Address', autoComplete: 'street-address', placeholder: 'St 32 main downtown, Los Angeles, California, USA' }]}
              initial={{ address: user.address ?? '' }}
              onSubmit={save((v) => auth.updateProfile(v), 'Адрес обновлён')}
            />
          }
        />

        <Row
          label="Date of birth"
          value={formatBirthDate(user.birthDate)}
          editing={editing === 'birthDate'}
          onChange={() => setEditing('birthDate')}
          editor={
            <InlineForm
              {...editorProps}
              fields={[{ name: 'birthDate', label: 'Date of birth', type: 'date', autoComplete: 'bday', max: todayISO(), min: '1900-01-01' }]}
              initial={{ birthDate: user.birthDate ?? '' }}
              validate={(v) => (v.birthDate && v.birthDate > todayISO() ? 'Дата не может быть в будущем' : null)}
              onSubmit={save((v) => auth.updateProfile(v), 'Дата рождения обновлена')}
            />
          }
        />
      </div>
    </>
  );
}

function Row({ label, value, editing, onChange, extraAction, below, editor }) {
  return (
    <div className={`${styles.row} ${editing ? styles.rowEditing : ''}`}>
      <div className={styles.rowMain}>
        <div className={styles.rowText}>
          <p className={styles.label}>{label}</p>
          <p className={`${styles.value} ${value ? '' : styles.valueEmpty}`}>{value || 'Not specified'}</p>
          {below}
        </div>
        {!editing && (
          <div className={styles.rowActions}>
            {extraAction}
            <button type="button" className={styles.actionBtn} onClick={onChange}>
              <PencilIcon /> Change
            </button>
          </div>
        )}
      </div>
      {editing && <div className={styles.editor}>{editor}</div>}
    </div>
  );
}

/**
 * Небольшая форма редактирования внутри строки.
 * onSubmit может бросить ошибку — её текст покажется под полями.
 */
function InlineForm({ fields, initial, onSubmit, onCancel, validate, hint, submitLabel = 'Save' }) {
  const [values, setValues] = useState(initial);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [reveal, setReveal] = useState({});
  const firstInput = useRef(null);

  useEffect(() => {
    firstInput.current?.focus();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const problem = validate?.(values);
    if (problem) {
      setError(problem);
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      onKeyDown={(e) => e.key === 'Escape' && onCancel()}
    >
      <div className={styles.formFields} data-count={fields.length}>
        {fields.map((f, i) => {
          const isPassword = f.type === 'password';
          return (
            <label key={f.name} className={styles.field}>
              <span className={styles.fieldLabel}>{f.label}</span>
              <input
                ref={i === 0 ? firstInput : undefined}
                className={styles.input}
                type={isPassword && reveal[f.name] ? 'text' : (f.type ?? 'text')}
                value={values[f.name]}
                onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                autoComplete={f.autoComplete}
                placeholder={f.placeholder}
                required={f.required}
                min={f.min}
                max={f.max}
              />
              {isPassword && (
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setReveal((r) => ({ ...r, [f.name]: !r[f.name] }))}
                  aria-label="Показать пароль"
                >
                  {reveal[f.name] ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              )}
            </label>
          );
        })}
      </div>

      {hint && !error && <p className={styles.hint}>{hint}</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.formActions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
        <button type="submit" className={styles.saveBtn} disabled={loading}>
          {loading ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
