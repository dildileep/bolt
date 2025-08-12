import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { LoginForm } from './components/Auth/LoginForm';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Skills } from './pages/Skills';
import { Employees } from './pages/Employees';
import { Training } from './pages/Training';
import { Certifications } from './pages/Certifications';
import { SkillMatrix } from './components/SkillMatrix/SkillMatrix';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/dashboard" />;
}

function AppRoutes() {
  const { user } = useAuth();
  
  if (!user) {
    return <LoginForm />;
  }
  
  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/training" element={<Training />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/notifications" element={
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Notifications</h2>
            <p className="text-gray-600">Detailed notifications page coming soon...</p>
          </div>
        } />
        
        {/* Admin only routes */}
        <Route
          path="/employees"
          element={
            <AdminRoute>
              <Employees />
            </AdminRoute>
          }
        />
        <Route
          path="/skill-matrix"
          element={
            <AdminRoute>
              <SkillMatrix />
            </AdminRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <AdminRoute>
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h2>
                <p className="text-gray-600">Advanced analytics coming soon...</p>
              </div>
            </AdminRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <AdminRoute>
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Settings</h2>
                <p className="text-gray-600">Admin settings coming soon...</p>
              </div>
            </AdminRoute>
          }
        />
        
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <AppRoutes />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </Router>
        </NotificationProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;