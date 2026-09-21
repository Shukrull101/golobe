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
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import Flights from './pages/flight/Flight.jsx';
import Stays from './pages/stays/stays.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-code" element={<VerifyCodePage />} />
          <Route path="/set-password" element={<SetPasswordPage />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/stay" element={<Stays />} />
          <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
