import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext.jsx';
import { PlusCircleIcon, TrashIcon } from '../../icons/icons.jsx';
import AddCardModal from './AddCardModal.jsx';
import BrandBadge from './BrandBadge.jsx';
import page from './AccountPage.module.css';
import styles from './PaymentTab.module.css';

export default function PaymentTab({ user, notify }) {
  const { removeCard } = useAuth();
  const [adding, setAdding] = useState(false);
  const cards = user.cards ?? [];

  async function handleRemove(card) {
    try {
      await removeCard(card.id);
      notify(`Карта •••• ${card.last4} удалена`);
    } catch (err) {
      notify(err.message, 'error');
    }
  }

  return (
    <>
      <h2 className={page.sectionTitle}>Payment methods</h2>

      <div className={`${page.panel} ${styles.grid}`}>
        {cards.map((card) => (
          <PaymentCard key={card.id} card={card} onRemove={() => handleRemove(card)} />
        ))}

        <button type="button" className={styles.addTile} onClick={() => setAdding(true)}>
          <PlusCircleIcon width="36" height="36" />
          <span>Add a new card</span>
        </button>
      </div>

      {adding && (
        <AddCardModal
          user={user}
          onClose={() => setAdding(false)}
          onAdded={(card) => {
            setAdding(false);
            notify(`Карта •••• ${card.last4} добавлена`);
          }}
        />
      )}
    </>
  );
}

function PaymentCard({ card, onRemove }) {
  const [confirming, setConfirming] = useState(false);

  // подтверждение удаления само сбрасывается через пару секунд
  useEffect(() => {
    if (!confirming) return;
    const id = setTimeout(() => setConfirming(false), 3000);
    return () => clearTimeout(id);
  }, [confirming]);

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div>
          <p className={styles.mask}>**** **** ****</p>
          <p className={styles.last4}>{card.last4}</p>
        </div>
        {confirming ? (
          <button type="button" className={styles.confirmBtn} onClick={onRemove}>
            Delete?
          </button>
        ) : (
          <button
            type="button"
            className={styles.trashBtn}
            onClick={() => setConfirming(true)}
            aria-label={`Удалить карту ${card.last4}`}
          >
            <TrashIcon />
          </button>
        )}
      </div>

      <div className={styles.cardBottom}>
        <div>
          <p className={styles.validLabel}>Valid Thru</p>
          <p className={styles.validValue}>{card.expiry}</p>
        </div>
        <BrandBadge brand={card.brand} />
      </div>
    </div>
  );
}
