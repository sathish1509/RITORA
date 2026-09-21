import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import CyclePage from './pages/CyclePage';
import SymptomsPage from './pages/SymptomsPage';
import LifestylePage from './pages/LifestylePage';
import InsightsPage from './pages/InsightsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Authenticated Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/cycle" element={<CyclePage />} />
          <Route path="/symptoms" element={<SymptomsPage />} />
          <Route path="/lifestyle" element={<LifestylePage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/assistant" element={<InsightsPage />} />
          <Route path="/reports" element={<InsightsPage />} />
          <Route path="/settings" element={<InsightsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

