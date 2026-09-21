/**
 * Бронирования пользователя.
 *
 * Страниц покупки билетов/отелей пока нет, поэтому новому пользователю
 * при первом входе в кабинет создаются демо-бронирования (seedBookings).
 * Когда появятся страницы Flights/Stays — они будут вызывать useAuth().addBooking(...)
 * с объектами такого же вида.
 */

const DAY = 24 * 60 * 60 * 1000;

function isoDate(offsetDays, from = new Date()) {
  const d = new Date(from.getTime() + offsetDays * DAY);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function ref(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

const AIRLINES = {
  emirates: { name: 'Emirates', code: 'EK', color: '#D71921' },
  turkish: { name: 'Turkish Airlines', code: 'TK', color: '#C8102E' },
  qatar: { name: 'Qatar Airways', code: 'QR', color: '#5C0632' },
  flydubai: { name: 'flydubai', code: 'FZ', color: '#1E4B8F' },
};

function flight(offset, airline, from, to, dep, arr, durationMin, gate, seat, cls, price) {
  return {
    id: crypto.randomUUID(),
    type: 'flight',
    ref: ref('GLF'),
    airline: AIRLINES[airline],
    flightNo: `${AIRLINES[airline].code} ${100 + Math.floor(Math.random() * 800)}`,
    from,
    to,
    date: isoDate(offset),
    departure: dep,
    arrival: arr,
    durationMin,
    gate,
    seat,
    travelClass: cls,
    passengers: 1,
    price,
  };
}

function stay(offset, nights, hotel, room, guests, price) {
  return {
    id: crypto.randomUUID(),
    type: 'stay',
    ref: ref('GLS'),
    hotel,
    checkIn: isoDate(offset),
    checkOut: isoDate(offset + nights),
    checkInTime: '12:00',
    checkOutTime: '11:30',
    room,
    roomType: guests > 1 ? 'Deluxe Double' : 'Superior Single',
    guests,
    price,
  };
}

const EWR = { city: 'Newark', code: 'EWR' };
const DXB = { city: 'Dubai', code: 'DXB' };
const IST = { city: 'Istanbul', code: 'IST' };
const DOH = { city: 'Doha', code: 'DOH' };
const TAS = { city: 'Tashkent', code: 'TAS' };

const CVK = { name: 'CVK Park Bosphorus Hotel', city: 'Istanbul', address: 'Gümüşsuyu Mah. İnönü Cad. No:8, Istanbul 34437', initials: 'CVK' };
const ATL = { name: 'Atlantis The Palm', city: 'Dubai', address: 'Crescent Rd, The Palm Jumeirah, Dubai', initials: 'ATL' };
const HYT = { name: 'Hyatt Regency Tashkent', city: 'Tashkent', address: '1A Navoi Street, Tashkent 100017', initials: 'HYT' };

export function seedBookings() {
  return [
    flight(6, 'emirates', EWR, DXB, '12:00', '18:00', 12 * 60 + 5, 'A12', '12B', 'Economy', 1240),
    flight(21, 'turkish', DXB, IST, '09:40', '13:55', 4 * 60 + 15, 'C4', '21A', 'Economy', 410),
    flight(45, 'qatar', IST, DOH, '22:10', '03:35', 4 * 60 + 25, 'F7', '3K', 'Business', 1890),
    flight(-34, 'flydubai', TAS, DXB, '07:15', '10:05', 3 * 60 + 50, 'B2', '14C', 'Economy', 320),
    flight(-120, 'emirates', DXB, EWR, '08:30', '14:20', 13 * 60 + 50, 'A3', '44D', 'Economy', 1170),
    stay(21, 3, CVK, 'On arrival', 2, 540),
    stay(6, 5, ATL, 'On arrival', 2, 2300),
    stay(60, 2, HYT, 'On arrival', 1, 260),
    stay(-35, 4, HYT, '512', 1, 480),
  ];
}

/** Дата окончания поездки — по ней делим брони на Upcoming / Past. */
export function bookingEndDate(b) {
  return b.type === 'flight' ? b.date : b.checkOut;
}

export function bookingStartDate(b) {
  return b.type === 'flight' ? b.date : b.checkIn;
}

export function todayISO() {
  return isoDate(0);
}

/* ---------- форматирование ---------- */

function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** "12:00" → "12:00 pm" */
export function formatTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

/** "2026-11-12" → "12-11-26" (как в макете) */
export function formatShortDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y.slice(2)}`;
}

/** "2026-12-08" → "Tue, Dec 8" */
export function formatWeekdayDate(iso) {
  return parseISO(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

/** "2026-12-08" → "December 8, 2026" */
export function formatLongDate(iso) {
  return parseISO(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function formatDuration(min) {
  return `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, '0')}m`;
}

export function formatPrice(value) {
  return `$${value.toLocaleString('en-US')}`;
}

export function nightsBetween(checkIn, checkOut) {
  return Math.round((parseISO(checkOut) - parseISO(checkIn)) / DAY);
}
