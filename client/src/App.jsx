import { Navigate, Route, Routes } from 'react-router';
import AuthGate from './auth/AuthGate.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import VerifyEmailPage from './pages/VerifyEmailPage.jsx';

// Which page shows for which URL, and who may see it
export default function App() {
  return (
    <Routes>
      {/* Logged out */}
      <Route element={<AuthGate allow="guest" />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Logged in, but email not verified yet */}
      <Route element={<AuthGate allow="unverified" />}>
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Route>

      {/* Logged in and verified */}
      <Route element={<AuthGate allow="verified" />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Unknown URL -> home (AuthGate then picks the right page) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
