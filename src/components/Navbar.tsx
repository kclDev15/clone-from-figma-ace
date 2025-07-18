import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Menu } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Show hamburger menu always for mobile responsiveness

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-purple-600 text-white'
        : 'text-gray-700 hover:bg-purple-100 hover:text-purple-600'
    }`;

  return (
    <nav className="bg-white shadow-md border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink to="/" className="text-2xl font-bold text-purple-600">
              Harmony Hotel
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/home" className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/rooms" className={navLinkClass}>
                Rooms
              </NavLink>
              {isAuthenticated && (
                <>
                  <NavLink to="/book" className={navLinkClass}>
                    Book
                  </NavLink>
                  <NavLink to="/reservations" className={navLinkClass}>
                    My Reservations
                  </NavLink>
                </>
              )}
              {!isAuthenticated ? (
                <>
                  <NavLink to="/auth" className={navLinkClass}>
                    Login
                  </NavLink>
                  <NavLink to="/auth" className={navLinkClass}>
                    Register
                  </NavLink>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Hello, {user?.username}</span>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button - always visible on mobile */}
          <div className="md:hidden">
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              variant="ghost"
              size="sm"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation - always available */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-purple-100 z-50">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLink
                to="/home"
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/rooms"
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Rooms
              </NavLink>
              {isAuthenticated && (
                <>
                  <NavLink
                    to="/book"
                    className={navLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Book
                  </NavLink>
                  <NavLink
                    to="/reservations"
                    className={navLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Reservations
                  </NavLink>
                </>
              )}
              {!isAuthenticated ? (
                <>
                  <NavLink
                    to="/auth"
                    className={navLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/auth"
                    className={navLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </NavLink>
                </>
              ) : (
                <div className="pt-4 pb-3 border-t border-purple-100">
                  <div className="flex items-center px-5">
                    <div className="text-base font-medium text-gray-700">
                      Hello, {user?.username}
                    </div>
                  </div>
                  <div className="mt-3 px-2">
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;