import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DashboardLayout } from './components/DashboardLayout';
import { ChatBot } from './components/ChatBot';
import { LandingPage } from './pages/LandingPage';
import { ListingsPage } from './pages/ListingsPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AgentProfilePage } from './pages/AgentProfilePage';
import { OwnerDashboard } from './pages/owner/OwnerDashboard';
import { OwnerProperties } from './pages/owner/OwnerProperties';
import { OwnerApplications } from './pages/owner/OwnerApplications';
import { OwnerProfile } from './pages/owner/OwnerProfile';
import { AgentDashboard } from './pages/agent/AgentDashboard';
import { AgentApplications } from './pages/agent/AgentApplications';
import { AgentProperties } from './pages/agent/AgentProperties';
import { AgentVerification } from './pages/agent/AgentVerification';
import { AgentProfile } from './pages/agent/AgentProfile';
import { useAppSelector } from './store';
function PublicLayout({ children }: {children: React.ReactNode;}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <ChatBot />
    </div>);

}
function ProtectedRoute({
  children,
  role



}: {children: React.ReactNode;role?: 'owner' | 'agent';}) {
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  if (!currentUser) return <Navigate to="/login" replace />;
  if (role && currentUser.role !== role) {
    return (
      <Navigate
        to={
        currentUser.role === 'owner' ? '/owner/dashboard' : '/agent/dashboard'
        }
        replace />);


  }
  return <>{children}</>;
}
export function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
          <PublicLayout>
              <LandingPage />
            </PublicLayout>
          } />

        <Route
          path="/listings"
          element={
          <PublicLayout>
              <ListingsPage />
            </PublicLayout>
          } />

        <Route
          path="/property/:id"
          element={
          <PublicLayout>
              <PropertyDetailPage />
            </PublicLayout>
          } />

        <Route
          path="/agent/:id"
          element={
          <PublicLayout>
              <AgentProfilePage />
            </PublicLayout>
          } />

        <Route
          path="/login"
          element={
          <PublicLayout>
              <LoginPage />
            </PublicLayout>
          } />

        <Route
          path="/register"
          element={
          <PublicLayout>
              <RegisterPage />
            </PublicLayout>
          } />


        {/* Owner dashboard routes */}
        <Route
          path="/owner/dashboard"
          element={
          <ProtectedRoute role="owner">
              <DashboardLayout>
                <OwnerDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />

        <Route
          path="/owner/properties"
          element={
          <ProtectedRoute role="owner">
              <DashboardLayout>
                <OwnerProperties />
              </DashboardLayout>
            </ProtectedRoute>
          } />

        <Route
          path="/owner/applications"
          element={
          <ProtectedRoute role="owner">
              <DashboardLayout>
                <OwnerApplications />
              </DashboardLayout>
            </ProtectedRoute>
          } />

        <Route
          path="/owner/profile"
          element={
          <ProtectedRoute role="owner">
              <DashboardLayout>
                <OwnerProfile />
              </DashboardLayout>
            </ProtectedRoute>
          } />


        {/* Agent dashboard routes */}
        <Route
          path="/agent/dashboard"
          element={
          <ProtectedRoute role="agent">
              <DashboardLayout>
                <AgentDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />

        <Route
          path="/agent/applications"
          element={
          <ProtectedRoute role="agent">
              <DashboardLayout>
                <AgentApplications />
              </DashboardLayout>
            </ProtectedRoute>
          } />

        <Route
          path="/agent/properties"
          element={
          <ProtectedRoute role="agent">
              <DashboardLayout>
                <AgentProperties />
              </DashboardLayout>
            </ProtectedRoute>
          } />

        <Route
          path="/agent/verification"
          element={
          <ProtectedRoute role="agent">
              <DashboardLayout>
                <AgentVerification />
              </DashboardLayout>
            </ProtectedRoute>
          } />

        <Route
          path="/agent/profile"
          element={
          <ProtectedRoute role="agent">
              <DashboardLayout>
                <AgentProfile />
              </DashboardLayout>
            </ProtectedRoute>
          } />


        {/* 404 */}
        <Route
          path="*"
          element={
          <PublicLayout>
              <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="text-center">
                  <div className="text-6xl font-bold text-[#E5E7EB] mb-4">
                    404
                  </div>
                  <h2 className="text-xl font-bold text-[#111827] mb-2">
                    Page not found
                  </h2>
                  <a href="/" className="btn-primary mt-4 inline-flex">
                    Go Home
                  </a>
                </div>
              </div>
            </PublicLayout>
          } />

      </Routes>
    </>);

}