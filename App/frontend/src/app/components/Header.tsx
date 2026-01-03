import { Menu, X, User, ChevronDown, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  user?: any;
  onLogout?: () => void;
}

export function Header({ currentPage, onNavigate, language, onLanguageChange, user, onLogout }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'articles', label: 'Articles' },
    { id: 'contact', label: 'Contact Us' }
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div className="ml-3">
              <h1 className="font-bold text-gray-900 text-lg">MediConnect</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Africa Healthcare Bridge</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-sm font-medium transition-all duration-200 relative group ${
                  currentPage === item.id 
                    ? 'text-teal-600' 
                    : 'text-gray-700 hover:text-teal-600'
                }`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-200 group-hover:w-full ${
                  currentPage === item.id ? 'w-full' : ''
                }`}></span>
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              /* Authenticated User Menu */
              <div className="relative hidden sm:block">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="gap-2 text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                >
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-teal-600 font-medium text-sm">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                  </div>
                  <span className="font-medium">{user.firstName}</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        onNavigate('dashboard');
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600"
                    >
                      My Dashboard
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600"
                    >
                      Profile Settings
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={() => {
                        onLogout?.();
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Guest User Menu */
              <div className="relative hidden sm:block">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="gap-2 text-gray-700 hover:text-teal-600 hover:bg-teal-50"
                >
                  <User className="w-4 h-4" />
                  <span>Account</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      onClick={() => {
                        onNavigate('login');
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('register');
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600"
                    >
                      Create Account
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Get Started Button */}
            <Button
              size="sm"
              onClick={() => onNavigate(user ? 'dashboard' : 'register')}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
            >
              {user ? 'Dashboard' : 'Get Started'}
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col gap-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 text-left rounded-lg transition-colors font-medium ${
                    currentPage === item.id 
                      ? 'bg-teal-50 text-teal-600' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-teal-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              <hr className="my-2" />
              
              {user ? (
                <>
                  <div className="px-4 py-2">
                    <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      onNavigate('dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 text-left rounded-lg text-gray-700 hover:bg-gray-50 hover:text-teal-600 font-medium"
                  >
                    My Dashboard
                  </button>
                  <button
                    onClick={() => {
                      onLogout?.();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 text-left rounded-lg text-red-600 hover:bg-red-50 font-medium flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onNavigate('login');
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 text-left rounded-lg text-gray-700 hover:bg-gray-50 hover:text-teal-600 font-medium"
                  >
                    Login
                  </button>
                  
                  <button
                    onClick={() => {
                      onNavigate('register');
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 text-left rounded-lg text-gray-700 hover:bg-gray-50 hover:text-teal-600 font-medium"
                  >
                    Create Account
                  </button>
                </>
              )}
              
              <Button
                size="sm"
                onClick={() => {
                  onNavigate(user ? 'dashboard' : 'register');
                  setMobileMenuOpen(false);
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white mt-3 mx-4"
              >
                {user ? 'Dashboard' : 'Get Started'}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
