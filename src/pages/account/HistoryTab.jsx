import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../../auth/AuthContext.jsx';
import {
  PlaneIcon,
  StaysIcon,
  ChevronDown,
  ChevronRight,
  CalendarIcon,
  ClockIcon,
  DoorIcon,
  SeatIcon,
} from '../../icons/icons.jsx';
import {
  bookingEndDate,
  bookingStartDate,
  formatDuration,
  formatPrice,
  formatShortDate,
  formatTime,
  formatWeekdayDate,
  nightsBetween,
  seedBookings,
  todayISO,
} from './lib/bookings.js';
import { downloadTicket } from './lib/ticket.js';
import page from './AccountPage.module.css';
import styles from './HistoryTab.module.css';

const FILTERS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past' },
  { id: 'all', label: 'All' },
];

const KINDS = [
  { id: 'flight', label: 'Flights', Icon: PlaneIcon },
  { id: 'stay', label: 'Stays', Icon: StaysIcon },
];

export default function HistoryTab({ user, notify }) {
  const { ensureBookings } = useAuth();
  const [kind, setKind] = useState('flight');
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    if (!user.bookings) ensureBookings(seedBookings).catch((err) => notify(err.message, 'error'));
  }, [user.bookings, ensureBookings, notify]);

  const list = useMemo(() => {
    const today = todayISO();
    const items = (user.bookings ?? []).filter((b) => {
      if (b.type !== kind) return false;
      if (filter === 'upcoming') return bookingEndDate(b) >= today;
      if (filter === 'past') return bookingEndDate(b) < today;
      return true;
    });
    const dir = filter === 'past' ? -1 : 1;
    return items.sort((a, b) => dir * bookingStartDate(a).localeCompare(bookingStartDate(b)));
  }, [user.bookings, kind, filter]);

  const kindIndex = KINDS.findIndex((k) => k.id === kind);

  return (
    <>
      <div className={styles.head}>
        <h2 className={page.sectionTitle}>Tickets/Bookings</h2>
        <FilterSelect value={filter} onChange={setFilter} />
      </div>

      <div className={`${page.panel} ${styles.kinds}`} role="tablist" style={{ '--i': kindIndex }}>
        {KINDS.map(({ id, label, Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={kind === id}
            className={`${styles.kind} ${kind === id ? styles.kindActive : ''}`}
            onClick={() => setKind(id)}
          >
            <Icon /> {label}
          </button>
        ))}
        <span className={styles.kindIndicator} aria-hidden="true" />
      </div>

      <div className={styles.list} key={`${kind}-${filter}`}>
        {list.length === 0 ? (
          <div className={`${page.panel} ${styles.empty}`}>
            <p className={styles.emptyTitle}>
              {filter === 'past' ? 'Здесь пока пусто' : 'Нет предстоящих поездок'}
            </p>
            <p className={styles.emptyText}>
              {kind === 'flight'
                ? 'Забронированные авиабилеты появятся здесь.'
                : 'Забронированные отели появятся здесь.'}
            </p>
          </div>
        ) : (
          list.map((b, i) => (
            <BookingCard key={b.id} booking={b} user={user} notify={notify} index={i} />
          ))
        )}
      </div>
    </>
  );
}

function FilterSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = FILTERS.find((f) => f.id === value);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className={styles.filter} ref={ref}>
      <button
        type="button"
        className={styles.filterBtn}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {current.label} <ChevronDown className={open ? styles.chevronUp : ''} />
      </button>
      {open && (
        <ul className={styles.filterMenu} role="listbox">
          {FILTERS.map((f) => (
            <li key={f.id}>
              <button
                type="button"
                role="option"
                aria-selected={f.id === value}
                className={`${styles.filterOption} ${f.id === value ? styles.filterOptionActive : ''}`}
                onClick={() => {
                  onChange(f.id);
                  setOpen(false);
                }}
              >
                {f.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function InfoTile({ Icon, label, value }) {
  return (
    <div className={styles.tile}>
      <span className={styles.tileIcon}><Icon /></span>
      <div>
        <p className={styles.tileLabel}>{label}</p>
        <p className={styles.tileValue}>{value}</p>
      </div>
    </div>
  );
}

function BookingCard({ booking: b, user, notify, index }) {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const isFlight = b.type === 'flight';
  const isPast = bookingEndDate(b) < todayISO();

  async function handleDownload() {
    setDownloading(true);
    try {
      await downloadTicket(b, user);
      notify(isFlight ? 'Билет скачан' : 'Ваучер скачан');
    } catch {
      notify('Не удалось сформировать билет', 'error');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <article
      className={`${page.panel} ${styles.card} ${open ? styles.cardOpen : ''}`}
      style={{ '--delay': `${index * 60}ms` }}
    >
      <div className={styles.cardRow}>
        <div className={styles.logo}>
          {isFlight ? (
            <span className={styles.airline} style={{ color: b.airline.color }}>{b.airline.name}</span>
          ) : (
            <span className={styles.hotelMark}>{b.hotel.initials}</span>
          )}
        </div>

        <div className={styles.route}>
          <div>
            <p className={styles.routeLabel}>
              {isFlight ? `${b.from.city}(${b.from.code})` : 'Check-In'}
            </p>
            <p className={styles.routeValue}>
              {isFlight ? formatTime(b.departure) : formatWeekdayDate(b.checkIn)}
            </p>
          </div>
          <span className={styles.routeDash} aria-hidden="true" />
          <div>
            <p className={styles.routeLabel}>
              {isFlight ? `${b.to.city}(${b.to.code})` : 'Check Out'}
            </p>
            <p className={styles.routeValue}>
              {isFlight ? formatTime(b.arrival) : formatWeekdayDate(b.checkOut)}
            </p>
          </div>
        </div>

        <span className={styles.divider} aria-hidden="true" />

        <div className={styles.tiles}>
          {isFlight ? (
            <>
              <InfoTile Icon={CalendarIcon} label="Date" value={formatShortDate(b.date)} />
              <InfoTile Icon={DoorIcon} label="Gate" value={b.gate} />
              <InfoTile Icon={ClockIcon} label="Flight time" value={formatDuration(b.durationMin)} />
              <InfoTile Icon={SeatIcon} label="Seat no." value={b.seat} />
            </>
          ) : (
            <>
              <InfoTile Icon={ClockIcon} label="Check-In time" value={formatTime(b.checkInTime)} />
              <InfoTile Icon={DoorIcon} label="Room no." value={b.room} />
              <InfoTile Icon={ClockIcon} label="Check-Out time" value={formatTime(b.checkOutTime)} />
            </>
          )}
        </div>

        <div className={styles.cardActions}>
          {isPast && <span className={styles.pastBadge}>Completed</span>}
          <button
            type="button"
            className={styles.downloadBtn}
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? 'Preparing…' : 'Download Ticket'}
          </button>
          <button
            type="button"
            className={`${styles.moreBtn} ${open ? styles.moreBtnOpen : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Подробнее"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className={styles.details} aria-hidden={!open}>
        <div className={styles.detailsInner}>
          {isFlight ? (
            <dl className={styles.detailsGrid}>
              <Detail term="Booking ref." value={b.ref} />
              <Detail term="Flight" value={`${b.airline.name} · ${b.flightNo}`} />
              <Detail term="Route" value={`${b.from.city} → ${b.to.city}`} />
              <Detail term="Class" value={b.travelClass} />
              <Detail term="Passengers" value={b.passengers} />
              <Detail term="Total paid" value={formatPrice(b.price)} />
            </dl>
          ) : (
            <dl className={styles.detailsGrid}>
              <Detail term="Booking ref." value={b.ref} />
              <Detail term="Hotel" value={b.hotel.name} />
              <Detail term="Address" value={b.hotel.address} />
              <Detail term="Room type" value={b.roomType} />
              <Detail
                term="Stay"
                value={`${nightsBetween(b.checkIn, b.checkOut)} night(s) · ${b.guests} guest(s)`}
              />
              <Detail term="Total paid" value={formatPrice(b.price)} />
            </dl>
          )}
        </div>
      </div>
    </article>
  );
}

function Detail({ term, value }) {
  return (
    <div className={styles.detail}>
      <dt>{term}</dt>
      <dd>{value}</dd>
    </div>
  );
}
