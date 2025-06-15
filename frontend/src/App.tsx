import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasbeh from './pages/Tasbeh';
import PrayerTimes from './pages/PrayerTimes';
import Quran from './pages/Quran';
import Hadith from './pages/Hadith';
import Azkar from './pages/Azkar';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import './App.css';

// Define ProtectedRoute component for cleaner route protection
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  return auth.isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// App Routes configuration with authentication checks
const AppRoutes = () => {
  const auth = useAuth();

  return (
    <div className="App">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!auth.isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!auth.isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/tasbeh" element={<ProtectedRoute><Tasbeh /></ProtectedRoute>} />
          <Route path="/prayer-times" element={<ProtectedRoute><PrayerTimes /></ProtectedRoute>} />
          <Route path="/quran" element={<ProtectedRoute><Quran /></ProtectedRoute>} />
          <Route path="/hadith" element={<ProtectedRoute><Hadith /></ProtectedRoute>} />
          <Route path="/azkar" element={<ProtectedRoute><Azkar /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
};

// Main App component with providers
function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
