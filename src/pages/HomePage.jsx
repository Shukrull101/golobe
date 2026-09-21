import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer/Footer.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import styles from './HomePage.module.css';

/**
 * Демонстрационная главная страница — только чтобы показать
 * Header и Footer "в деле". Реальный контент главной делает
 * другой участник команды.
 */
export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div>
      <div className={styles.hero}>
       
        <div className={styles.heroBody}>
          <h1>Explore the world,<br />one trip at a time.</h1>
          <p>Найдите рейсы и отели дешевле, чем у остальных команд ;)</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
