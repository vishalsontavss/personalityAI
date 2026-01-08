
import React, { useState } from 'react';
import { Inquiry, User } from '../types';

interface InquiryPageProps {
  user: User | null;
  onSubmit: (inquiry: Inquiry) => void;
}

const InquiryPage: React.FC<InquiryPageProps> = ({ user, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInquiry: Inquiry = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      message: formData.message,
      date: new Date().toLocaleDateString()
    };
    onSubmit(newInquiry);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="bg-white rounded-3xl shadow-xl p-12 border border-slate-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Inquiry Received</h2>
          <p className="text-slate-600 mb-8">
            Thank you for reaching out. A representative from Dr. Gadiwan's center will review your message and contact you securely via email.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Patient Inquiry Form</h2>
          <p className="text-slate-400">
            Have questions about our AI screening, hypnotherapy, or counseling services? Send us a secure message.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Secure Email</label>
              <input 
                required
                type="email" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Your Message</label>
            <textarea 
              required
              rows={5}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Please describe your inquiry details here..."
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
          </div>

          <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-xl border border-amber-100 mb-6">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-amber-800">
              <b>HIPAA Privacy:</b> This form is encrypted and handled as a confidential medical inquiry. Avoid including highly sensitive clinical details until a secure connection is established.
            </p>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition transform active:scale-95"
          >
            Send Secure Inquiry
          </button>
        </form>
      </div>
    </div>
  );
};

export default InquiryPage;
