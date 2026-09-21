import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';

/**
 * Личный кабинет — пока заглушка без вёрстки.
 * Данные пользователя: useAuth().user, выход: useAuth().logout().
 */
export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div>
      <p>{user.firstName} {user.lastName} ({user.email})</p>
      <button type="button" onClick={handleLogout}>Logout</button>
    </div>
  );
}
