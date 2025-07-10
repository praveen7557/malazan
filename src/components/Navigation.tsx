import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Moon,
  Sun,
  Beer,
  Swords,
  Users,
  Quote,
  Map,
  Clock
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Navigation: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const location = useLocation();

  const navItems = [
    { path: '/quiz', label: 'Character Quiz', icon: Users },
    { path: '/draw-cards', label: 'Deck of Dragons', icon: Swords },
    { path: '/quote-match', label: 'Quote Match', icon: Quote },
    { path: '/faction-map', label: 'Faction Map', icon: Map },
    { path: '/timeline', label: 'Timeline', icon: Clock },
    { path: '/duel', label: 'Duel Arena', icon: Swords }
  ];

  return (
    <nav className='bg-white dark:bg-gray-900 shadow-lg transition-colors duration-300'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center'>
            <Link
              to='/quiz'
              className='flex items-center space-x-2 text-2xl font-bold text-gray-900 dark:text-white'
            >
              <Beer className='h-8 w-8 text-purple-600' />
              <span className='bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'>
                The Phoenix Inn
              </span>
            </Link>
          </div>

          <div className='hidden md:flex items-center space-x-6'>
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === path
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className='h-4 w-4' />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          <button
            onClick={toggleDarkMode}
            className='p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200'
          >
            {isDarkMode ? (
              <Sun className='h-5 w-5' />
            ) : (
              <Moon className='h-5 w-5' />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className='md:hidden'>
        <div className='px-2 pt-2 pb-3 space-y-1'>
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                location.pathname === path
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className='h-4 w-4' />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;