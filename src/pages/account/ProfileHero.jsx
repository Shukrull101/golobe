import { useRef, useState } from 'react';
import { useAuth } from '../../auth/AuthContext.jsx';
import Avatar from '../../components/Avatar/Avatar.jsx';
import { PencilIcon, UploadIcon, TrashIcon } from '../../icons/icons.jsx';
import { resizeImage } from './lib/image.js';
import styles from './AccountPage.module.css';

/** Обложка + аватар + имя. Картинки сжимаются и сохраняются в профиль. */
export default function ProfileHero({ user, notify }) {
  const { updateProfile } = useAuth();
  const coverInput = useRef(null);
  const avatarInput = useRef(null);
  const [busy, setBusy] = useState(null); // 'cover' | 'avatar' | null

  async function upload(field, file, maxW, maxH) {
    if (!file) return;
    setBusy(field);
    try {
      const dataUrl = await resizeImage(file, maxW, maxH);
      await updateProfile({ [field]: dataUrl });
      notify(field === 'cover' ? 'Обложка обновлена' : 'Фото профиля обновлено');
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setBusy(null);
    }
  }

  async function remove(field) {
    try {
      await updateProfile({ [field]: null });
      notify(field === 'cover' ? 'Обложка удалена' : 'Фото профиля удалено');
    } catch (err) {
      notify(err.message, 'error');
    }
  }

  return (
    <div className={styles.hero}>
      <div
        className={`${styles.cover} ${busy === 'cover' ? styles.busy : ''}`}
        style={user.cover ? { backgroundImage: `url(${user.cover})` } : undefined}
      >
        <div className={styles.coverActions}>
          {user.cover && (
            <button type="button" className={styles.coverBtnGhost} onClick={() => remove('cover')}>
              <TrashIcon /> Remove
            </button>
          )}
          <button
            type="button"
            className={styles.coverBtn}
            onClick={() => coverInput.current.click()}
            disabled={busy === 'cover'}
          >
            <UploadIcon /> {busy === 'cover' ? 'Uploading…' : 'Upload new cover'}
          </button>
        </div>
        <input
          ref={coverInput}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            upload('cover', e.target.files[0], 1600, 600);
            e.target.value = '';
          }}
        />
      </div>

      <div className={styles.avatarWrap}>
        <div className={`${styles.avatarRing} ${busy === 'avatar' ? styles.busy : ''}`}>
          <Avatar user={user} size={152} />
        </div>
        <button
          type="button"
          className={styles.avatarEdit}
          onClick={() => avatarInput.current.click()}
          aria-label="Изменить фото профиля"
          title="Изменить фото профиля"
        >
          <PencilIcon />
        </button>
        {user.avatar && (
          <button
            type="button"
            className={styles.avatarRemove}
            onClick={() => remove('avatar')}
            aria-label="Удалить фото профиля"
            title="Удалить фото профиля"
          >
            <TrashIcon width="12" height="12" />
          </button>
        )}
        <input
          ref={avatarInput}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            upload('avatar', e.target.files[0], 320, 320);
            e.target.value = '';
          }}
        />
      </div>

      <h1 className={styles.name}>{[user.firstName, user.lastName].filter(Boolean).join(' ')}.</h1>
      <p className={styles.email}>{user.email}</p>
    </div>
  );
}
