import { useEffect, useState } from 'react';
import { CameraIcon } from '../../icons/icons.jsx';
import styles from './AuthShell.module.css';

const AUTO_ADVANCE_MS = 4500;
const PLACEHOLDER_COUNT = 3;

export default function ImageSlider({ images = [] }) {
  const slides = images.length > 0 ? images : Array(PLACEHOLDER_COUNT).fill(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <>
      {slides.map((src, i) => (
        <div key={i} className={`${styles.slide} ${i === index ? styles.slideActive : ''}`}>
          {src ? (
            <img src={src} alt="" className={styles.slideImg} />
          ) : (
            <div className={styles.slidePlaceholder}>
              <CameraIcon />
              <span>Место для фото {i + 1}</span>
            </div>
          )}
        </div>
      ))}

      {slides.length > 1 && (
        <div className={styles.dots}>
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Слайд ${i + 1}`}
              className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </>
  );
}
