import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import PublisherDashboard from './components/PublisherDashboard';
import UserDashboard from './components/UserDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute: React.FC<{ element: React.ReactElement, role?: string }> = ({ element, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return element;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/publisher" element={
              <ProtectedRoute element={<PublisherDashboard />} role="publisher" />
            } />
            <Route path="/user" element={
              <ProtectedRoute element={<UserDashboard />} role="user" />
            } />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;