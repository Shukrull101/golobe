import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import { useAuth } from '../../auth/AuthContext.jsx';
import ProfileHero from './ProfileHero.jsx';
import AccountTab from './AccountTab.jsx';
import HistoryTab from './HistoryTab.jsx';
import PaymentTab from './PaymentTab.jsx';
import styles from './AccountPage.module.css';

const TABS = [
  { id: 'account', label: 'Account', Component: AccountTab },
  { id: 'history', label: 'History', Component: HistoryTab },
  { id: 'payments', label: 'Payment methods', Component: PaymentTab },
];

/**
 * Личный кабинет. Активная вкладка хранится в URL (?tab=history),
 * чтобы по ссылке можно было открыть нужный раздел.
 */
export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tabIndex = Math.max(0, TABS.findIndex((t) => t.id === params.get('tab')));
  const { Component } = TABS[tabIndex];

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const notify = useCallback((text, kind = 'success') => {
    clearTimeout(toastTimer.current);
    setToast({ text, kind, key: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  function selectTab(id) {
    setParams(id === 'account' ? {} : { tab: id }, { replace: true });
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className={styles.page}>
      <Header
        variant="plain"
        user={user}
        onAccount={() => selectTab('account')}
        onLogout={handleLogout}
      />

      <main className={styles.main}>
        <ProfileHero user={user} notify={notify} />

        <div className={styles.tabs} role="tablist" style={{ '--i': tabIndex }}>
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={i === tabIndex}
              className={`${styles.tab} ${i === tabIndex ? styles.tabActive : ''}`}
              onClick={() => selectTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
          <span className={styles.tabIndicator} aria-hidden="true" />
        </div>

        <section key={TABS[tabIndex].id} className={styles.section} role="tabpanel">
          <Component user={user} notify={notify} />
        </section>
      </main>

      <Footer />

      {toast && (
        <div
          key={toast.key}
          className={`${styles.toast} ${toast.kind === 'error' ? styles.toastError : ''}`}
          role="status"
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}
