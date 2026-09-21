import { useState } from 'react';
import { PlaneIcon, StaysIcon } from '../../icons/icons.jsx';
import Logo from '../Logo/Logo.jsx';
import styles from './Header.module.css';

/**
 * Header — навигация Globe.
 *
 * variant="hero"  — тёмная плашка поверх фото (главная страница).
 * variant="light" — светлая «плавающая» версия для внутренних страниц
 *                    (страница поиска рейсов и т.п.), см. макет "Flights Search".
 *
 * onLogin / onSignup — колбэки, которые должен передать App.jsx.
 * В App.jsx они обычно делают navigate('/login') / navigate('/signup').
 */
export default function Header({ variant = 'hero', onLogin, onSignup }) {
  const [active, setActive] = useState(null);

  return (
    <header className={`${styles.header} ${variant === 'light' ? styles.light : styles.hero}`}>
      <nav className={styles.nav}>
        <button
          className={`${styles.navItem} ${active === 'flight' ? styles.navItemActive : ''}`}
          onMouseEnter={() => setActive('flight')}
          onMouseLeave={() => setActive(null)}
        >
          <PlaneIcon className={styles.navIcon} />
          Find Flight
        </button>
        <button
          className={`${styles.navItem} ${active === 'stays' ? styles.navItemActive : ''}`}
          onMouseEnter={() => setActive('stays')}
          onMouseLeave={() => setActive(null)}
        >
          <StaysIcon className={styles.navIcon} />
          Find Stays
        </button>
      </nav>

      <Logo />

      <div className={styles.actions}>
        <button className={styles.loginBtn} onClick={onLogin}>Login</button>
        <button className={styles.signupBtn} onClick={onSignup}>Sign up</button>
      </div>
    </header>
  );
}
