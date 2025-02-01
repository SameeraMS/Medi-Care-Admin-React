import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import DoctorsPage from './pages/DoctorsPage';
import HospitalsPage from './pages/HospitalsPage';
import UsersPage from './pages/UsersPage';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = localStorage.getItem('user');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route path="/dashboard" element={
            <RequireAuth>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </RequireAuth>
          } />
          <Route path="/doctors" element={
            <RequireAuth>
              <DashboardLayout>
                <DoctorsPage />
              </DashboardLayout>
            </RequireAuth>
          } />
          <Route path="/hospitals" element={
            <RequireAuth>
              <DashboardLayout>
                <HospitalsPage />
              </DashboardLayout>
            </RequireAuth>
          } />
          <Route path="/users" element={
            <RequireAuth>
              <DashboardLayout>
                <UsersPage />
              </DashboardLayout>
            </RequireAuth>
          } />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;