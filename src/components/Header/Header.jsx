import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlaneIcon, StaysIcon, HeartIcon, UserIcon, LogoutIcon } from '../../icons/icons.jsx';
import Logo from '../Logo/Logo.jsx';
import Avatar from '../Avatar/Avatar.jsx';
import styles from './Header.module.css';

/**
 * Header — навигация Globe.
 *
 * variant="hero"  — тёмная плашка поверх фото (главная страница).
 * variant="light" — светлая «плавающая» версия для внутренних страниц
 *                    (страница поиска рейсов и т.п.), см. макет "Flights Search".
 * variant="plain" — белая полоса на всю ширину (личный кабинет).
 *
 * onLogin / onSignup — колбэки, которые должен передать App.jsx.
 * В App.jsx они обычно делают navigate('/login') / navigate('/signup').
 *
 * user — если передан, вместо Login/Sign up показываются Favourites и аватар
 * с меню (onAccount — «My account», onLogout — «Logout», onFavourites — «Favourites»).
 */
export default function Header({
  variant = 'hero',
  onLogin,
  onSignup,
  user,
  onAccount,
  onLogout,
  onFavourites,
}) {
  const [active, setActive] = useState(null);
  const variantClass = { light: styles.light, plain: styles.plain }[variant] ?? styles.hero;

  return (
    <header className={`${styles.header} ${variantClass}`}>
      <nav className={styles.nav}>
        <button
          aria-label="Find Flight"
          className={`${styles.navItem} ${active === 'flight' ? styles.navItemActive : ''}`}
          onMouseEnter={() => setActive('flight')}
          onMouseLeave={() => setActive(null)}
        >
          <PlaneIcon className={styles.navIcon} />
          <span>Find Flight</span>
        </button>
        <button
          aria-label="Find Stays"
          className={`${styles.navItem} ${active === 'stays' ? styles.navItemActive : ''}`}
          onMouseEnter={() => setActive('stays')}
          onMouseLeave={() => setActive(null)}
        >
          <StaysIcon className={styles.navIcon} />
          <span>Find Stays</span>
        </button>
      </nav>

      <Link to="/" className={styles.logoLink} aria-label="golobe — на главную">
        <Logo />
      </Link>

      {user ? (
        <div className={styles.actions}>
          <button className={styles.favBtn} onClick={onFavourites} aria-label="Favourites">
            <HeartIcon /> <span>Favourites</span>
          </button>
          <span className={styles.sep} aria-hidden="true" />
          <UserMenu user={user} onAccount={onAccount} onLogout={onLogout} />
        </div>
      ) : (
        <div className={styles.actions}>
          <button className={styles.loginBtn} onClick={onLogin}>Login</button>
          <button className={styles.signupBtn} onClick={onSignup}>Sign up</button>
        </div>
      )}
    </header>
  );
}

function UserMenu({ user, onAccount, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e) {
      if (!ref.current?.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function pick(fn) {
    setOpen(false);
    fn?.();
  }

  return (
    <div className={styles.userMenu} ref={ref}>
      <button
        className={styles.userBtn}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Меню аккаунта"
      >
        <Avatar user={user} size={36} className={styles.userAvatar} />
        <span className={styles.userName}>
          {user.firstName} {user.lastName ? `${user.lastName[0]}.` : ''}
        </span>
      </button>

      {open && (
        <div className={styles.dropdown} role="menu">
          <div className={styles.dropdownHead}>
            <Avatar user={user} size={40} />
            <div>
              <p className={styles.dropdownName}>{user.firstName} {user.lastName}</p>
              <p className={styles.dropdownEmail}>{user.email}</p>
            </div>
          </div>
          <button role="menuitem" className={styles.dropdownItem} onClick={() => pick(onAccount)}>
            <UserIcon /> My account
          </button>
          <button role="menuitem" className={styles.dropdownItem} onClick={() => pick(onLogout)}>
            <LogoutIcon /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
