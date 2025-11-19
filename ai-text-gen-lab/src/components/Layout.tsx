import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Beaker, Dna, HelpCircle, Home } from 'lucide-react';
import { clsx } from 'clsx';

const NavLink = ({ to, icon: Icon, children }: { to: string; icon: any; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={clsx(
        "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "bg-indigo-100 text-indigo-700"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      )}
    >
      <Icon className="w-4 h-4 mr-2" />
      {children}
    </Link>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-indigo-600">AI Lab</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8 items-center">
                <NavLink to="/" icon={Home}>Home</NavLink>
                <NavLink to="/ngram" icon={Beaker}>N-Gram Lab</NavLink>
                <NavLink to="/genetic" icon={Dna}>Genetic Lab</NavLink>
                <NavLink to="/mystery" icon={HelpCircle}>Mystery Lab</NavLink>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Designed for educational purposes. Explore the history of text generation.
          </p>
        </div>
      </footer>
    </div>
  );
};
