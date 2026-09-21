import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

/** Пускает только вошедших пользователей, иначе — на /login. */
export function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

/** Страницы входа/регистрации: вошедшего пользователя отправляет в личный кабинет. */
export function GuestRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/account" replace />;
  return children;
}
