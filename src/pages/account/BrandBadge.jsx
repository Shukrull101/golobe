import { CARD_BRANDS } from './lib/cards.js';
import styles from './PaymentTab.module.css';

/** Значок платёжной системы (VISA, Mastercard и т.д.). */
export default function BrandBadge({ brand, small = false }) {
  if (!brand) return null;

  if (brand === 'mastercard') {
    return (
      <span className={`${styles.brand} ${styles.brandMc} ${small ? styles.brandSmall : ''}`} title="Mastercard">
        <span /><span />
      </span>
    );
  }

  return (
    <span className={`${styles.brand} ${styles[`brand_${brand}`] ?? ''} ${small ? styles.brandSmall : ''}`}>
      {CARD_BRANDS[brand]?.label ?? brand}
    </span>
  );
}
