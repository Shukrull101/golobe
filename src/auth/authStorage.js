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
  writeJSON(localStorage, USERS_KEY, users);
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

  if (users.some((u) => u.email === normalized)) {
    throw new AuthError('Аккаунт с таким email уже существует');
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new AuthError(`Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов`);
  }

  const salt = randomHex(16);
  const user = {
    id: crypto.randomUUID(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalized,
    phone: phone.trim(),
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
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new AuthError(`Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов`);
  }

  const salt = randomHex(16);
  const passwordHash = await hashPassword(password, salt);
  saveUsers(getUsers().map((u) => (u.email === reset.email ? { ...u, salt, passwordHash } : u)));
  sessionStorage.removeItem(RESET_KEY);
}
