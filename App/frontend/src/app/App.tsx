import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { PatientDashboard } from './components/PatientDashboard';
import { HospitalDiscovery } from './components/HospitalDiscovery';
import { VisaGuidance } from './components/VisaGuidance';
import { AppointmentModule } from './components/AppointmentModule';
import { Footer } from './components/Footer';
import { AuthService } from '../services/authService.js';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [language, setLanguage] = useState('en');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const loggedInUser = await AuthService.login(email, password);
      setUser(loggedInUser);
      setCurrentPage('dashboard');
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (userData) => {
    try {
      const newUser = await AuthService.register(userData);
      setUser(newUser);
      setCurrentPage('dashboard');
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} onLogin={handleLogin} />;
      case 'register':
        return <RegisterPage onNavigate={setCurrentPage} onRegister={handleRegister} />;
      case 'dashboard':
        return user ? (
          <PatientDashboard onNavigate={setCurrentPage} user={user} onLogout={handleLogout} />
        ) : (
          <LoginPage onNavigate={setCurrentPage} onLogin={handleLogin} />
        );
      case 'hospitals':
        return <HospitalDiscovery />;
      case 'appointments':
        return <AppointmentModule />;
      case 'visa':
        return <VisaGuidance />;
      case 'services':
        return <HomePage onNavigate={setCurrentPage} />; // Placeholder
      case 'articles':
        return <HomePage onNavigate={setCurrentPage} />; // Placeholder
      case 'contact':
        return <HomePage onNavigate={setCurrentPage} />; // Placeholder
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-teal-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <div className="text-lg font-medium text-gray-900">Loading...</div>
        </div>
      </div>
    );
  }

  // Don't show header and footer on login/register pages
  const hideHeaderFooter = ['login', 'register'].includes(currentPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideHeaderFooter && (
        <Header
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          language={language}
          onLanguageChange={setLanguage}
          user={user}
          onLogout={handleLogout}
        />
      )}
      {renderPage()}
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}