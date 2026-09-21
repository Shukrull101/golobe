import styles from './Avatar.module.css';

/** Аватар пользователя: фото, если загружено, иначе — инициалы на мятном фоне. */
export default function Avatar({ user, size = 40, className = '' }) {
  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || '?';

  return (
    <span
      className={`${styles.avatar} ${className}`}
      style={{ '--avatar-size': `${size}px` }}
    >
      {user?.avatar ? (
        <img src={user.avatar} alt="" className={styles.img} />
      ) : (
        <span className={styles.initials}>{initials}</span>
      )}
    </span>
  );
}
