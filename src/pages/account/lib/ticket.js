import {
  formatDuration,
  formatLongDate,
  formatPrice,
  formatTime,
  nightsBetween,
} from './bookings.js';

const W = 1200;
const H = 480;
const STUB = 300; // ширина отрывного корешка справа

const INK = '#0F1D17';
const MUTED = '#7C8A83';
const MINT = '#8FD6B0';
const MINT_PALE = '#EAF7EF';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function label(ctx, text, x, y) {
  ctx.fillStyle = MUTED;
  ctx.font = '500 16px Manrope, system-ui, sans-serif';
  ctx.fillText(text, x, y);
}

function value(ctx, text, x, y, size = 24) {
  ctx.fillStyle = INK;
  ctx.font = `700 ${size}px Sora, Manrope, system-ui, sans-serif`;
  ctx.fillText(text, x, y);
}

/** Псевдо-штрихкод из номера брони — детерминированный, чтобы у билета был «свой» код. */
function barcode(ctx, seed, x, y, w, h) {
  let hash = 0;
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  ctx.fillStyle = INK;
  let cx = x;
  while (cx < x + w) {
    hash = (hash * 1103515245 + 12345) >>> 0;
    const bar = 2 + (hash % 4);
    const gap = 2 + ((hash >> 8) % 3);
    ctx.fillRect(cx, y, Math.min(bar, x + w - cx), h);
    cx += bar + gap;
  }
}

function drawFrame(ctx, title, subtitle, accent) {
  ctx.fillStyle = '#F3F4F2';
  ctx.fillRect(0, 0, W, H);

  // билет с «вырезами» по линии отрыва
  ctx.save();
  roundRect(ctx, 20, 20, W - 40, H - 40, 28);
  ctx.clip();
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = MINT_PALE;
  ctx.fillRect(W - 20 - STUB, 0, STUB, H);
  ctx.fillStyle = accent;
  ctx.fillRect(20, 20, 12, H - 40);
  ctx.restore();

  const cutX = W - 20 - STUB;
  ctx.fillStyle = '#F3F4F2';
  for (const cy of [20, H - 20]) {
    ctx.beginPath();
    ctx.arc(cutX, cy, 18, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = '#C9D3CD';
  ctx.setLineDash([8, 8]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cutX, 48);
  ctx.lineTo(cutX, H - 48);
  ctx.stroke();
  ctx.setLineDash([]);

  // шапка
  value(ctx, 'golobe', 64, 84, 28);
  ctx.fillStyle = MUTED;
  ctx.font = '600 16px Manrope, system-ui, sans-serif';
  ctx.fillText(subtitle, 64, 112);
  ctx.textAlign = 'right';
  value(ctx, title, cutX - 40, 84, 22);
  ctx.textAlign = 'left';

  return cutX;
}

function drawStub(ctx, cutX, booking, user, rows) {
  const x = cutX + 36;
  label(ctx, 'Passenger', x, 84);
  value(ctx, `${user.firstName} ${user.lastName}`.trim(), x, 114, 20);

  let y = 170;
  for (const [l, v] of rows) {
    label(ctx, l, x, y);
    value(ctx, v, x, y + 28, 20);
    y += 70;
  }

  barcode(ctx, booking.ref, x, H - 118, STUB - 72, 56);
  ctx.fillStyle = INK;
  ctx.font = '600 15px Manrope, system-ui, sans-serif';
  ctx.fillText(booking.ref, x, H - 44);
}

function drawFlight(ctx, b, user) {
  const cutX = drawFrame(ctx, 'Boarding pass', `${b.airline.name} · ${b.flightNo}`, b.airline.color);

  // маршрут
  value(ctx, b.from.code, 64, 220, 64);
  value(ctx, b.to.code, cutX - 220, 220, 64);
  label(ctx, `${b.from.city} · ${formatTime(b.departure)}`, 64, 256);
  label(ctx, `${b.to.city} · ${formatTime(b.arrival)}`, cutX - 220, 256);

  ctx.strokeStyle = MINT;
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(260, 196);
  ctx.lineTo(cutX - 250, 196);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.textAlign = 'center';
  label(ctx, formatDuration(b.durationMin), (260 + cutX - 250) / 2, 176);
  ctx.fillStyle = INK;
  ctx.font = '28px system-ui';
  ctx.fillText('✈', (260 + cutX - 250) / 2, 206);
  ctx.textAlign = 'left';

  const cols = [
    ['Date', formatLongDate(b.date)],
    ['Class', b.travelClass],
    ['Price', formatPrice(b.price)],
  ];
  cols.forEach(([l, v], i) => {
    const x = 64 + i * 250;
    label(ctx, l, x, 340);
    value(ctx, v, x, 372, 22);
  });

  drawStub(ctx, cutX, b, user, [
    ['Gate', b.gate],
    ['Seat', b.seat],
  ]);
}

function drawStay(ctx, b, user) {
  const cutX = drawFrame(ctx, 'Hotel voucher', b.hotel.address, '#6FC29A');

  value(ctx, b.hotel.name, 64, 200, 36);
  label(ctx, `${b.roomType} · ${b.guests} guest${b.guests > 1 ? 's' : ''} · ${nightsBetween(b.checkIn, b.checkOut)} night(s)`, 64, 236);

  const cols = [
    ['Check-in', `${formatLongDate(b.checkIn)}, ${formatTime(b.checkInTime)}`],
    ['Check-out', `${formatLongDate(b.checkOut)}, ${formatTime(b.checkOutTime)}`],
  ];
  cols.forEach(([l, v], i) => {
    const x = 64 + i * 400;
    label(ctx, l, x, 320);
    value(ctx, v, x, 352, 20);
  });
  label(ctx, 'Total', 64, 400);
  value(ctx, formatPrice(b.price), 64, 432, 22);

  drawStub(ctx, cutX, b, user, [
    ['Room', b.room],
    ['City', b.hotel.city],
  ]);
}

/** Рисует билет/ваучер и скачивает его PNG-файлом. */
export async function downloadTicket(booking, user) {
  await document.fonts?.ready;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  if (booking.type === 'flight') drawFlight(ctx, booking, user);
  else drawStay(ctx, booking, user);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `globe-${booking.type === 'flight' ? 'ticket' : 'voucher'}-${booking.ref}.png`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
