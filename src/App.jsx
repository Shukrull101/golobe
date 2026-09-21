import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/variables.css';
import './App.css';

import { AuthProvider } from './auth/AuthContext.jsx';
import { GuestRoute, ProtectedRoute } from './auth/routes.jsx';
import HomePage from './pages/HomePage.jsx';
import AccountPage from './pages/account/AccountPage.jsx';
import LoginPage from './components/Auth/LoginPage.jsx';
import SignupPage from './components/Auth/SignupPage.jsx';
import ForgotPasswordPage from './components/Auth/ForgotPasswordPage.jsx';
import VerifyCodePage from './components/Auth/VerifyCodePage.jsx';
import SetPasswordPage from './components/Auth/SetPasswordPage.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-code" element={<VerifyCodePage />} />
          <Route path="/set-password" element={<SetPasswordPage />} />
          <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
