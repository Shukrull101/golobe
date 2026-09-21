import { useState } from 'react';
import { FacebookIcon } from '../../icons/icons.jsx';
import Logo from '../Logo/Logo.jsx';
import styles from './Footer.module.css';
import pochta from '../../assets/shukrullo/pochta.png';

const columns = [
  { title: 'Our Destinations', links: ['Canada', 'Alaska', 'France', 'Iceland'] },
  { title: 'Our Activities', links: ['Northern Lights', 'Cruising & sailing', 'Multi-activities', 'Kayaking'] },
  { title: 'Travel Blogs', links: ['Bali Travel Guide', 'Sri Lanka Travel Guide', 'Peru Travel Guide', 'Bali Travel Guide'] },
  { title: 'About Us', links: ['Our Story', 'Work with us'] },
  { title: 'Contact Us', links: ['Our Story', 'Work with us'] },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubscribe(e) {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setTimeout(() => setSent(false), 2400);
    setEmail('');
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.newsletter}>
        <div className={styles.newsletterText}>
          <h3 className={styles.newsletterTitle}>Subscribe<br />Newsletter</h3>
          <p className={styles.newsletterKicker}>The Travel</p>
          <p className={styles.newsletterCopy}>
            Get inspired! Receive travel discounts, tips and behind the scenes stories.
          </p>
          <form className={styles.form} onSubmit={handleSubscribe}>
            <input
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
            <button type="submit" className={styles.subscribeBtn}>
              {sent ? 'Sent ✓' : 'Subscribe'}
            </button>
          </form>
        </div>

        <div className={styles.photoSlot}>
          <img src={pochta} alt="Pochta" className={styles.photoImg} />
        </div>
      </div>

      <div className={styles.linksRow}>
        <div className={styles.brand}>
          <div className={styles.brandLogo}><Logo size={20} /></div>
          <div className={styles.socials}>
            <FacebookIcon />
            <span className={styles.socialLetter}>t</span>
            <span className={styles.socialLetter}>▶</span>
            <span className={styles.socialLetter}>◎</span>
          </div>
        </div>

        {columns.map((col) => (
          <div className={styles.column} key={col.title}>
            <p className={styles.columnTitle}>{col.title}</p>
            {col.links.map((link, i) => (
              <a href="#" className={styles.link} key={link + i}>{link}</a>
            ))}
          </div>
        ))}
      </div>
    </footer>
  );
}