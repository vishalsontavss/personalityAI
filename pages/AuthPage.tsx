
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface AuthPageProps {
  onAuth: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient' as UserRole,
    consent: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: isLogin ? (formData.email.includes('admin') ? 'Admin User' : 'John Patient') : formData.name,
      email: formData.email,
      role: formData.email.includes('admin') ? 'admin' : 'patient',
      avatar: `https://ui-avatars.com/api/?name=${formData.name || 'User'}&background=3b82f6&color=fff`
    };
    onAuth(mockUser);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-24">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-blue-600 p-8 text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">{isLogin ? 'Welcome Back' : 'Create Secure Account'}</h2>
          <p className="text-blue-100 text-sm mt-2">
            {isLogin ? 'Access your health records and AI analysis' : 'Join our HIPAA-aware psychiatric platform'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
            <input
              required
              type="email"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
            <input
              required
              type="password"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {!isLogin && (
            <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-xl">
              <input
                id="consent"
                required
                type="checkbox"
                className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                checked={formData.consent}
                onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
              />
              <label htmlFor="consent" className="text-xs text-slate-600 leading-relaxed">
                I consent to the secure processing of my psychological data in accordance with <b>HIPAA standards</b> and the Privacy Policy.
              </label>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>

          <div className="pt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
