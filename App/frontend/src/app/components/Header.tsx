import { Menu, X, Globe, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
}

export function Header({ currentPage, onNavigate, language, onLanguageChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'sw', name: 'Swahili', flag: '🇰🇪' }
  ];

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'hospitals', label: 'Find Hospitals' },
    { id: 'dashboard', label: 'My Dashboard' },
    { id: 'visa', label: 'Visa Guide' }
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div className="ml-3 hidden sm:block">
              <h1 className="font-bold text-gray-900">MediConnect Africa</h1>
              <p className="text-xs text-gray-500">India-Africa Healthcare Bridge</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-sm transition-colors ${
                  currentPage === item.id 
                    ? 'text-blue-600 font-semibold' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="gap-2"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {languages.find(l => l.code === language)?.flag}
                </span>
              </Button>
              
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 ${
                        language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* WhatsApp Support */}
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 gap-2 hidden sm:flex"
            >
              <Phone className="w-4 h-4" />
              WhatsApp
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col gap-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-2 text-left rounded-lg transition-colors ${
                    currentPage === item.id 
                      ? 'bg-blue-50 text-blue-600 font-semibold' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 gap-2 mt-2"
              >
                <Phone className="w-4 h-4" />
                WhatsApp Support
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
