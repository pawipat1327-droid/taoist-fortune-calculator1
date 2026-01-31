import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 nav-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
          {/* Left: Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl sm:text-3xl">☯</span>
              </div>
              <div className="absolute inset-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500 blur-md opacity-40 -z-10"></div>
            </div>
            <span className="text-xl sm:text-2xl tracking-widest brush-font text-gradient-amber font-bold hidden sm:block group-hover:text-amber-300 transition-colors">
              天机神算
            </span>
          </Link>

        </div>
      </div>
    </nav>
  );
};

export default NavBar;
