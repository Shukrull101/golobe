import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/variables.css';

import HomePage from './pages/HomePage.jsx';
import LoginPage from './components/Auth/LoginPage.jsx';
import SignupPage from './components/Auth/SignupPage.jsx';
import ForgotPasswordPage from './components/Auth/ForgotPasswordPage.jsx';
import VerifyCodePage from './components/Auth/VerifyCodePage.jsx';
import SetPasswordPage from './components/Auth/SetPasswordPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-code" element={<VerifyCodePage />} />
        <Route path="/set-password" element={<SetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}