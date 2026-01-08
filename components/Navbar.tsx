
import React from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onNavigate, onLogout }) => {
  const isAdmin = user?.role === 'admin';

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => onNavigate('home')}
          >
            <div className="bg-blue-600 p-2 rounded-lg mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block">
              PersonalityAI <span className="text-blue-600">Health</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            {!isAdmin && (
              <>
                <button onClick={() => onNavigate('screening')} className="hidden lg:block text-slate-600 hover:text-blue-600 font-medium px-3 py-2 transition">AI Screening</button>
                <button onClick={() => onNavigate('inquiry')} className="hidden sm:block text-slate-600 hover:text-blue-600 font-medium px-3 py-2 transition">Contact</button>
                <button onClick={() => onNavigate('booking')} className="bg-blue-600 text-white px-4 md:px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200 text-sm md:text-base">
                  Book Appointment
                </button>
              </>
            )}

            {user ? (
              <div className="flex items-center space-x-3 pl-4 border-l border-slate-100">
                <div className="hidden md:block text-right">
                  <div className="text-sm font-bold text-slate-900 leading-none">{user.name}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-tighter font-bold">{user.role}</div>
                </div>
                <div className="relative group">
                  <img 
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} 
                    className="w-9 h-9 rounded-xl border-2 border-blue-100 cursor-pointer" 
                    alt="Profile" 
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {isAdmin && (
                      <button 
                        onClick={() => onNavigate('admin')} 
                        className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-t-xl flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
                        <span>Admin Panel</span>
                      </button>
                    )}
                    <button 
                      onClick={onLogout} 
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-b-xl flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => onNavigate('auth')} 
                className="text-slate-600 hover:text-blue-600 font-bold text-sm px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
