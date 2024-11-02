import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu } from '@headlessui/react';
import { Sun, Moon, Menu as MenuIcon, X } from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 shadow-lg transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400" aria-label="Home">
            Campus Taskboard
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {currentUser ? (
              <>
                <Link
                  to="/task-feed"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-200"
                >
                  Task Feed
                </Link>
                <Link
                  to="/create-task"
                  className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-200"
                >
                  Create Task
                </Link>

                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center gap-2 focus:outline-none">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                      {currentUser.displayName?.charAt(0).toUpperCase()}
                    </div>
                  </Menu.Button>

                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to={`/profile/${currentUser.uid}`}
                          className={`block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 ${
                            active ? 'bg-gray-100 dark:bg-gray-700' : ''
                          }`}
                        >
                          Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/dashboard"
                          className={`block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 ${
                            active ? 'bg-gray-100 dark:bg-gray-700' : ''
                          }`}
                        >
                          Dashboard
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 ${
                            active ? 'bg-gray-100 dark:bg-gray-700' : ''
                          }`}
                        >
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </>
            ) : (
              <>
                <Link
                  to="/task-feed"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-200"
                >
                  Task Feed
                </Link>
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="py-4 space-y-4">
            <button
              onClick={toggleTheme}
              className="w-full p-2 text-left text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {currentUser ? (
              <>
                <Link
                  to="/task-feed"
                  className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-200"
                >
                  Task Feed
                </Link>
                <Link
                  to="/create-task"
                  className="block bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-200 text-center"
                >
                  Create Task
                </Link>
                <Link
                  to={`/profile/${currentUser.uid}`}
                  className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-200"
                >
                  Profile
                </Link>
                <Link
                  to="/dashboard"
                  className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-200"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/task-feed"
                  className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-200"
                >
                  Task Feed
                </Link>
                <Link
                  to="/login"
                  className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-200 text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;