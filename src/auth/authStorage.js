/**
 * authStorage — локальное «хранилище аккаунтов» без бэкенда.
 *
 * users    → localStorage['globe.users']   — массив аккаунтов
 * session  → localStorage/sessionStorage['globe.session'] — id вошедшего пользователя
 *            (localStorage, если отмечено «Remember me», иначе sessionStorage —
 *            тогда сессия живёт до закрытия вкладки)
 * reset    → sessionStorage['globe.reset'] — данные восстановления пароля
 *
 * Пароли не хранятся в открытом виде: сохраняется SHA-256(salt + password).
 */

const USERS_KEY = 'globe.users';
const SESSION_KEY = 'globe.session';
const RESET_KEY = 'globe.reset';

export const MIN_PASSWORD_LENGTH = 8;
const RESET_CODE_TTL_MS = 10 * 60 * 1000;

function readJSON(storage, key, fallback) {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(storage, key, value) {
  storage.setItem(key, JSON.stringify(value));
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function randomHex(bytes) {
  const arr = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(salt + password);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

function getUsers() {
  return readJSON(localStorage, USERS_KEY, []);
}

function saveUsers(users) {
  try {
    writeJSON(localStorage, USERS_KEY, users);
  } catch {
    // localStorage переполнен (обычно из-за слишком больших картинок)
    throw new AuthError('Не хватает места в хранилище браузера. Попробуйте изображение поменьше.');
  }
}

/** Занят ли email каким-либо аккаунтом (основным или дополнительным адресом). */
function isEmailTaken(users, email, exceptId) {
  return users.some(
    (u) => u.id !== exceptId && (u.email === email || (u.extraEmails ?? []).includes(email)),
  );
}

function assertEmail(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AuthError('Некорректный email');
}

/** Телефон необязателен, но если указан — только цифры, пробелы, скобки, дефисы и «+». */
export function isValidPhone(phone) {
  return !phone.trim() || /^\+?[\d\s()-]{6,20}$/.test(phone.trim());
}

function assertPassword(password) {
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new AuthError(`Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов`);
  }
}

/** Публичные данные пользователя — без хэша и соли. */
function toPublic(user) {
  if (!user) return null;
  const { passwordHash: _h, salt: _s, ...rest } = user;
  return rest;
}

export class AuthError extends Error {}

/* ---------- сессия ---------- */

export function getSessionUser() {
  const id = sessionStorage.getItem(SESSION_KEY) ?? localStorage.getItem(SESSION_KEY);
  if (!id) return null;
  const user = getUsers().find((u) => u.id === id);
  if (!user) {
    clearSession();
    return null;
  }
  return toPublic(user);
}

function setSession(id, remember) {
  clearSession();
  (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, id);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

/* ---------- регистрация / вход ---------- */

export async function registerUser({ firstName, lastName, email, phone, password }) {
  const normalized = normalizeEmail(email);
  const users = getUsers();

  assertEmail(normalized);
  if (isEmailTaken(users, normalized)) {
    throw new AuthError('Аккаунт с таким email уже существует');
  }
  if (!firstName.trim()) throw new AuthError('Укажите имя');
  if (!isValidPhone(phone)) throw new AuthError('Некорректный номер телефона');
  assertPassword(password);

  const salt = randomHex(16);
  const user = {
    id: crypto.randomUUID(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalized,
    phone: phone.trim(),
    extraEmails: [],
    address: '',
    birthDate: '',
    avatar: null,
    cover: null,
    cards: [],
    salt,
    passwordHash: await hashPassword(password, salt),
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, user]);
  setSession(user.id, true);
  return toPublic(user);
}

export async function loginUser({ email, password, remember }) {
  const user = getUsers().find((u) => u.email === normalizeEmail(email));
  // одно и то же сообщение, чтобы не подсказывать, какие email зарегистрированы
  if (!user || (await hashPassword(password, user.salt)) !== user.passwordHash) {
    throw new AuthError('Неверный email или пароль');
  }
  setSession(user.id, remember);
  return toPublic(user);
}

/* ---------- восстановление пароля ---------- */

/**
 * Генерирует код восстановления. Настоящей отправки письма нет,
 * поэтому код выводится в консоль браузера.
 */
export function requestPasswordReset(email) {
  const normalized = normalizeEmail(email);
  if (!getUsers().some((u) => u.email === normalized)) {
    throw new AuthError('Аккаунт с таким email не найден');
  }
  const code = randomHex(4).toUpperCase();
  writeJSON(sessionStorage, RESET_KEY, {
    email: normalized,
    code,
    expiresAt: Date.now() + RESET_CODE_TTL_MS,
    verified: false,
  });
  console.info(`[Globe] Код восстановления для ${normalized}: ${code}`);
  return code;
}

export function getPendingReset() {
  const reset = readJSON(sessionStorage, RESET_KEY, null);
  if (!reset || reset.expiresAt < Date.now()) return null;
  return reset;
}

export function resendPasswordReset() {
  const reset = getPendingReset() ?? readJSON(sessionStorage, RESET_KEY, null);
  if (!reset) throw new AuthError('Сначала укажите email для восстановления');
  return requestPasswordReset(reset.email);
}

export function verifyResetCode(code) {
  const reset = getPendingReset();
  if (!reset) throw new AuthError('Код истёк, запросите новый');
  if (reset.code !== code.trim().toUpperCase()) throw new AuthError('Неверный код');
  writeJSON(sessionStorage, RESET_KEY, { ...reset, verified: true });
}

export async function resetPassword(password) {
  const reset = getPendingReset();
  if (!reset?.verified) throw new AuthError('Сначала подтвердите код восстановления');
  assertPassword(password);

  const salt = randomHex(16);
  const passwordHash = await hashPassword(password, salt);
  saveUsers(getUsers().map((u) => (u.email === reset.email ? { ...u, salt, passwordHash } : u)));
  sessionStorage.removeItem(RESET_KEY);
}

/* ---------- личный кабинет ---------- */

/**
 * Применяет изменение к пользователю и сохраняет его.
 * mutate(user, users) возвращает объект с изменёнными полями.
 */
async function mutateUser(id, mutate) {
  const users = getUsers();
  const user = users.find((u) => u.id === id);
  if (!user) throw new AuthError('Пользователь не найден');
  const updated = { ...user, ...(await mutate(user, users)) };
  saveUsers(users.map((u) => (u.id === id ? updated : u)));
  return toPublic(updated);
}

const PROFILE_FIELDS = ['firstName', 'lastName', 'phone', 'address', 'birthDate', 'avatar', 'cover'];

/** Обновляет «простые» поля профиля: имя, телефон, адрес, дату рождения, аватар, обложку. */
export function updateProfile(id, patch) {
  return mutateUser(id, () => {
    const clean = {};
    for (const key of PROFILE_FIELDS) {
      if (key in patch) clean[key] = typeof patch[key] === 'string' ? patch[key].trim() : patch[key];
    }
    if ('firstName' in clean && !clean.firstName) throw new AuthError('Имя не может быть пустым');
    if ('phone' in clean && !isValidPhone(clean.phone)) throw new AuthError('Некорректный номер телефона');
    return clean;
  });
}

export function changeEmail(id, email) {
  const normalized = normalizeEmail(email);
  assertEmail(normalized);
  return mutateUser(id, (user, users) => {
    if (normalized === user.email) return {};
    if (isEmailTaken(users, normalized, id) || (user.extraEmails ?? []).includes(normalized)) {
      throw new AuthError('Этот email уже используется');
    }
    return { email: normalized };
  });
}

export function addExtraEmail(id, email) {
  const normalized = normalizeEmail(email);
  assertEmail(normalized);
  return mutateUser(id, (user, users) => {
    const extra = user.extraEmails ?? [];
    if (normalized === user.email || extra.includes(normalized) || isEmailTaken(users, normalized, id)) {
      throw new AuthError('Этот email уже используется');
    }
    return { extraEmails: [...extra, normalized] };
  });
}

export function removeExtraEmail(id, email) {
  return mutateUser(id, (user) => ({
    extraEmails: (user.extraEmails ?? []).filter((e) => e !== email),
  }));
}

/** Делает дополнительный адрес основным (для входа), а старый основной — дополнительным. */
export function makePrimaryEmail(id, email) {
  return mutateUser(id, (user) => {
    const extra = user.extraEmails ?? [];
    if (!extra.includes(email)) return {};
    return { email, extraEmails: [...extra.filter((e) => e !== email), user.email] };
  });
}

export function changePassword(id, currentPassword, newPassword) {
  return mutateUser(id, async (user) => {
    if ((await hashPassword(currentPassword, user.salt)) !== user.passwordHash) {
      throw new AuthError('Текущий пароль указан неверно');
    }
    assertPassword(newPassword);
    const salt = randomHex(16);
    return { salt, passwordHash: await hashPassword(newPassword, salt) };
  });
}

/**
 * Сохраняет карту. Полный номер и CVC не храним — только последние 4 цифры,
 * платёжную систему, срок действия и имя владельца.
 */
export function addCard(id, { number, brand, expiry, holder, country, saveForCheckout }) {
  return mutateUser(id, (user) => {
    const cards = user.cards ?? [];
    const last4 = number.slice(-4);
    if (cards.some((c) => c.last4 === last4 && c.expiry === expiry && c.brand === brand)) {
      throw new AuthError('Эта карта уже добавлена');
    }
    const card = {
      id: crypto.randomUUID(),
      last4,
      brand,
      expiry,
      holder: holder.trim(),
      country,
      saveForCheckout: Boolean(saveForCheckout),
      addedAt: new Date().toISOString(),
    };
    return { cards: [...cards, card] };
  });
}

export function removeCard(id, cardId) {
  return mutateUser(id, (user) => ({ cards: (user.cards ?? []).filter((c) => c.id !== cardId) }));
}

/** Добавляет бронирование (рейс или отель). Пригодится страницам Flights/Stays. */
export function addBooking(id, booking) {
  return mutateUser(id, (user) => ({
    bookings: [...(user.bookings ?? []), { id: crypto.randomUUID(), ...booking }],
  }));
}

/** Если у пользователя ещё нет поля bookings — заполняет его данными из seed(). */
export function ensureBookings(id, seed) {
  return mutateUser(id, (user) => (user.bookings ? {} : { bookings: seed() }));
}
