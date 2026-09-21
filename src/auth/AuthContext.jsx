import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as storage from './authStorage.js';

const AuthContext = createContext(null);

// Методы кабинета: storage.fn(userId, ...args) → обновлённый пользователь
const ACCOUNT_ACTIONS = [
  'updateProfile',
  'changeEmail',
  'addExtraEmail',
  'removeExtraEmail',
  'makePrimaryEmail',
  'changePassword',
  'addCard',
  'removeCard',
  'addBooking',
  'ensureBookings',
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getSessionUser());
  const userId = user?.id;

  const register = useCallback(async (data) => {
    const u = await storage.registerUser(data);
    setUser(u);
    return u;
  }, []);

  const login = useCallback(async (data) => {
    const u = await storage.loginUser(data);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    storage.clearSession();
    setUser(null);
  }, []);

  const actions = useMemo(() => {
    const result = {};
    for (const name of ACCOUNT_ACTIONS) {
      result[name] = async (...args) => {
        if (!userId) throw new storage.AuthError('Вы не вошли в аккаунт');
        const u = await storage[name](userId, ...args);
        setUser(u);
        return u;
      };
    }
    return result;
  }, [userId]);

  const value = useMemo(
    () => ({ user, register, login, logout, ...actions }),
    [user, register, login, logout, actions],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth должен использоваться внутри <AuthProvider>');
  return ctx;
}
