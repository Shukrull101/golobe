// length — сколько цифр в номере карты, cvc — сколько цифр в CVC/CVV
export const CARD_BRANDS = {
  visa: { label: 'VISA', pattern: /^4/, length: 16, cvc: 3 },
  mastercard: { label: 'Mastercard', pattern: /^(5[1-5]|2[2-7])/, length: 16, cvc: 3 },
  amex: { label: 'AMEX', pattern: /^3[47]/, length: 15, cvc: 4 },
  mir: { label: 'МИР', pattern: /^220[0-4]/, length: 16, cvc: 3 },
  unionpay: { label: 'UnionPay', pattern: /^62/, length: 16, cvc: 3 },
  discover: { label: 'Discover', pattern: /^6(011|5)/, length: 16, cvc: 3 },
};

const DEFAULT_LENGTH = 16;
const DEFAULT_CVC = 3;

export function cardLength(brand) {
  return CARD_BRANDS[brand]?.length ?? DEFAULT_LENGTH;
}

export function cvcLength(brand) {
  return CARD_BRANDS[brand]?.cvc ?? DEFAULT_CVC;
}

export const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Spain', 'Italy',
  'Turkey', 'United Arab Emirates', 'Uzbekistan', 'Kazakhstan', 'Russia', 'India', 'Japan',
  'Australia',
];

export function digitsOnly(value) {
  return value.replace(/\D/g, '');
}

export function detectBrand(number) {
  const digits = digitsOnly(number);
  // МИР проверяем раньше Mastercard: диапазоны 2200–2204 и 22xx пересекаются
  if (CARD_BRANDS.mir.pattern.test(digits)) return 'mir';
  for (const [key, brand] of Object.entries(CARD_BRANDS)) {
    if (brand.pattern.test(digits)) return key;
  }
  return null;
}

/**
 * 4321432143214321 → "4321 4321 4321 4321" (для AMEX — 4-6-5).
 * Лишние цифры сверх длины номера для этой платёжной системы отбрасываются.
 */
export function formatCardNumber(value) {
  const raw = digitsOnly(value);
  const digits = raw.slice(0, cardLength(detectBrand(raw)));
  if (detectBrand(digits) === 'amex') {
    return [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)].filter(Boolean).join(' ');
  }
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

/** "0227" → "02/27" */
export function formatExpiry(value) {
  const digits = digitsOnly(value).slice(0, 4);
  if (digits.length === 1 && Number(digits) > 1) return `0${digits}/`;
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

/** Контрольная сумма номера карты (алгоритм Луна). */
export function luhnValid(number) {
  const digits = digitsOnly(number);
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return digits.length > 0 && sum % 10 === 0;
}

/** Возвращает объект { field: 'сообщение' } с ошибками формы карты. */
export function validateCard({ number, expiry, cvc, holder }, now = new Date()) {
  const errors = {};
  const digits = digitsOnly(number);
  const brand = detectBrand(digits);

  if (digits.length === 0) errors.number = 'Введите номер карты';
  else if (!brand) errors.number = 'Карта этой платёжной системы не поддерживается';
  else if (digits.length !== cardLength(brand)) {
    errors.number = `Номер карты должен содержать ${cardLength(brand)} цифр`;
  } else if (!luhnValid(digits)) {
    errors.number = 'Такого номера карты не существует — проверьте цифры';
  }

  const match = /^(\d{2})\/(\d{2})$/.exec(expiry);
  const month = match ? Number(match[1]) : 0;
  if (!match || month < 1 || month > 12) errors.expiry = 'Формат ММ/ГГ';
  else {
    const year = 2000 + Number(match[2]);
    const endOfMonth = new Date(year, month, 1);
    if (endOfMonth <= now) errors.expiry = 'Срок действия истёк';
  }

  const needCvc = cvcLength(brand);
  if (digitsOnly(cvc).length !== needCvc) errors.cvc = `CVC должен содержать ${needCvc} цифры`;

  if (holder.trim().length < 2) errors.holder = 'Укажите имя владельца';

  return errors;
}
