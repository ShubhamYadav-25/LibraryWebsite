import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';

const Logo = () => (
  <div  className="flex items-center space-x-3">
    <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
      <BookOpen className="w-5 h-5 text-white" />
    </div>
    <span className="text-xl font-bold text-gray-900">LibraryMS</span>
  </div>
);

const NavigationLink = ({ id, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`text-gray-600 hover:text-teal-600 font-medium transition-colors ${
      isActive ? 'text-teal-600' : ''
    }`}
  >
    {label}
  </button>
);

const AuthButtons = () => (
  <>
    <Link to="/auth?mode=login" className="text-gray-600 hover:text-gray-900 font-medium">
      Sign In
    </Link>
    <Link to="/auth?mode=register" className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
      Get Started
    </Link>
  </>
);

const MobileNavigation = ({ navigationItems, scrollToSection, setIsMenuOpen }) => (
  <div className="md:hidden py-4 border-t border-gray-200">
    <div className="flex flex-col space-y-4">
      {navigationItems.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => {
            scrollToSection(id);
            setIsMenuOpen(false);
          }}
          className="text-gray-600 hover:text-teal-600 font-medium text-left"
        >
          {label}
        </button>
      ))}
      <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
        <AuthButtons />
      </div>
    </div>
  </div>
);

export default function Header({ activeSection, scrollToSection }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Only define nav items if props are passed
  const navigationItems = scrollToSection
    ? [
        { id: 'features', label: 'Features' },
        { id: 'how-it-works', label: 'How It Works' },
        { id: 'pricing', label: 'Pricing' },
        { id: 'testimonials', label: 'Reviews' }
      ]
    : [];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          {/* Desktop Navigation (only show if navigationItems exist) */}
          {navigationItems.length > 0 && (
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map(({ id, label }) => (
                <NavigationLink
                  key={id}
                  id={id}
                  label={label}
                  isActive={activeSection === id}
                  onClick={() => scrollToSection(id)}
                />
              ))}
            </nav>
          )}

          <div className="hidden md:flex items-center space-x-4">
            <AuthButtons />
          </div>

          {/* Mobile menu button */}
          {navigationItems.length > 0 && (
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && navigationItems.length > 0 && (
          <MobileNavigation
            navigationItems={navigationItems}
            scrollToSection={scrollToSection}
            setIsMenuOpen={setIsMenuOpen}
          />
        )}
      </div>
    </header>
  );
}
