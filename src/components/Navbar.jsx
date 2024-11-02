import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu } from '@headlessui/react';
import { Menu as MenuIcon, X } from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#1a1b3b]/90 backdrop-blur-lg shadow-lg'
        : 'bg-[#1a1b3b]'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent" aria-label="Home">
            Campus Connect
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-300 hover:bg-white/5"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>

          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <>
                <Link
                  to="/task-feed"
                  className="text-gray-300 hover:text-blue-400 transition duration-200"
                >
                  Task Feed
                </Link>
                <Link
                  to="/create-task"
                  className="bg-blue-600/80 hover:bg-blue-500/80 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition duration-200"
                >
                  Create Task
                </Link>

                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center gap-2 focus:outline-none">
                    <div className="w-8 h-8 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center text-blue-400">
                      {currentUser.displayName?.charAt(0).toUpperCase()}
                    </div>
                  </Menu.Button>

                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-[#1a1b3b] backdrop-blur-md rounded-lg shadow-lg py-1 z-10 border border-white/10">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to={`/profile/${currentUser.uid}`}
                          className={`block px-4 py-2 text-sm text-gray-300 ${
                            active ? 'bg-white/5' : ''
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
                          className={`block px-4 py-2 text-sm text-gray-300 ${
                            active ? 'bg-white/5' : ''
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
                          className={`block w-full text-left px-4 py-2 text-sm text-gray-300 ${
                            active ? 'bg-white/5' : ''
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
                  className="text-gray-300 hover:text-blue-400 transition duration-200"
                >
                  Task Feed
                </Link>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-blue-400 transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="py-4 space-y-4">
            {currentUser ? (
              <>
                <Link
                  to="/task-feed"
                  className="block text-gray-300 hover:text-blue-400 transition duration-200"
                >
                  Task Feed
                </Link>
                <Link
                  to="/create-task"
                  className="block bg-blue-600/80 hover:bg-blue-500/80 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition duration-200 text-center"
                >
                  Create Task
                </Link>
                <Link
                  to={`/profile/${currentUser.uid}`}
                  className="block text-gray-300 hover:text-blue-400 transition duration-200"
                >
                  Profile
                </Link>
                <Link
                  to="/dashboard"
                  className="block text-gray-300 hover:text-blue-400 transition duration-200"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-gray-300 hover:text-blue-400 transition duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/task-feed"
                  className="block text-gray-300 hover:text-blue-400 transition duration-200"
                >
                  Task Feed
                </Link>
                <Link
                  to="/login"
                  className="block text-gray-300 hover:text-blue-400 transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block bg-blue-600/80 hover:bg-blue-500/80 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition duration-200 text-center"
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