import styles from './Logo.module.css';

/**
 * Logo — единый логотип "g⊘lobe" для Header и Footer.
 * Внутри буквы "o" — вращающаяся планета (полосы конус-градиента дают
 * эффект вращения сферы) с кольцом и маленькой луной, летающей по орбите.
 * Цвет текста наследуется от родителя (color: inherit) — поэтому один
 * и тот же компонент нормально смотрится и на тёмной шапке, и на светлом футере.
 */
export default function Logo({ size = 22 }) {
  return (
    <span className={styles.logo} style={{ '--logo-size': `${size}px` }}>
      <span>g</span>
      <span className={styles.planetWrap}>
        <span className={styles.ring} />
        <span className={styles.planet} />
        <span className={styles.moon} />
      </span>
      <span>lobe</span>
    </span>
  );
}
