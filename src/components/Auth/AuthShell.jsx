import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from '../../icons/icons.jsx';
import ImageSlider from './ImageSlider.jsx';
import styles from './AuthShell.module.css';
import a from './Auth.module.css';


 
export default function AuthShell({
  label,
  mirrored = false,
  images,
  showHomeLink = false,
  children,
}) {
  const navigate = useNavigate();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    setEntered(false);
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [label]);

  return (
    <div className={styles.page}>
      <div className={styles.crumb}>{label}</div>

      <div
        className={`${styles.card} ${entered ? styles.cardEnter : ''} ${mirrored ? styles.mirrored : ''}`}
      >
        <div className={styles.formSide}>
          {showHomeLink && (
            <button type="button" className={a.backLink} onClick={() => navigate('/')}>
              <ChevronLeft /> На главную
            </button>
          )}
          {children}
        </div>

        <div className={styles.imageSide}>
          <ImageSlider images={images} />
        </div>
      </div>
    </div>
  );
}
