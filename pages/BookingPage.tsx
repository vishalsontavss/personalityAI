
import React, { useState, useEffect } from 'react';
import { Service, Doctor, Appointment, User } from '../types';

interface BookingPageProps {
  user: User | null;
  services: Service[];
  doctors: Doctor[];
  onComplete: (appointment: Appointment) => void;
}

const BookingPage: React.FC<BookingPageProps> = ({ user, services, doctors, onComplete }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    serviceId: services[0]?.id || '',
    doctorId: doctors[0]?.id || '',
    date: '',
    time: ''
  });

  // Sync if user updates or finishes loading
  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      patientName: formData.name,
      email: formData.email,
      serviceId: formData.serviceId,
      doctorId: formData.doctorId,
      date: formData.date,
      time: formData.time,
      status: 'pending'
    };
    onComplete(newAppointment);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Book Appointment</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
              <input 
                required
                disabled={!!user}
                type="text" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-75 disabled:cursor-not-allowed"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
              <input 
                required
                disabled={!!user}
                type="email" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition disabled:opacity-75 disabled:cursor-not-allowed"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Select Service</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={formData.serviceId}
                onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
              >
                {services.map(s => <option key={s.id} value={s.id}>{s.name} - {s.price}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Select Doctor</label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={formData.doctorId}
                onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
              >
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Preferred Date</label>
              <input 
                required
                type="date" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Preferred Time</label>
              <input 
                required
                type="time" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition transform active:scale-95"
          >
            Confirm Appointment Request
          </button>
          
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex space-x-3 items-start">
             <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             <p className="text-[11px] text-blue-700 leading-relaxed">
              <b>Secure Booking:</b> Your session is protected by HIPAA standards. Our clinic will contact you to confirm the final slot and complete clinical intake.
             </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
