import { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { PatientDashboard } from './components/PatientDashboard';
import { HospitalDiscovery } from './components/HospitalDiscovery';
import { VisaGuidance } from './components/VisaGuidance';
import { AppointmentModule } from './components/AppointmentModule';
import { Footer } from './components/Footer';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [language, setLanguage] = useState('en');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <PatientDashboard onNavigate={setCurrentPage} />;
      case 'hospitals':
        return <HospitalDiscovery />;
      case 'appointments':
        return <AppointmentModule />;
      case 'visa':
        return <VisaGuidance />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        language={language}
        onLanguageChange={setLanguage}
      />
      {renderPage()}
      <Footer />
    </div>
  );
}