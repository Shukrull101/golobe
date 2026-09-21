import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { clearSession, getSessionUser, loginUser, registerUser } from './authStorage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSessionUser());

  const register = useCallback(async (data) => {
    const u = await registerUser(data);
    setUser(u);
    return u;
  }, []);

  const login = useCallback(async (data) => {
    const u = await loginUser(data);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, register, login, logout }), [user, register, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth должен использоваться внутри <AuthProvider>');
  return ctx;
}
