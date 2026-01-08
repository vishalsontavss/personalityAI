
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ScreeningPage from './pages/ScreeningPage';
import BookingPage from './pages/BookingPage';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import InquiryPage from './pages/InquiryPage';
import { 
  INITIAL_SERVICES, 
  INITIAL_DOCTORS, 
  INITIAL_ARTICLES 
} from './constants';
import { Appointment, Inquiry, Service, Article, Doctor, User, LogEntry } from './types';

const App: React.FC = () => {
  const [view, setView] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Initialize session from local storage
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedDoctors = localStorage.getItem('app_doctors');
    if (savedDoctors) {
      setDoctors(JSON.parse(savedDoctors));
    }

    const savedServices = localStorage.getItem('app_services');
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    }

    const savedArticles = localStorage.getItem('app_articles');
    if (savedArticles) {
      setArticles(JSON.parse(savedArticles));
    }

    const savedAppointments = localStorage.getItem('app_appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }

    const savedLogs = localStorage.getItem('app_logs');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

  // Sync state to local storage when updated
  useEffect(() => {
    localStorage.setItem('app_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('app_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('app_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('app_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('app_logs', JSON.stringify(logs));
  }, [logs]);

  // Smooth scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    setView('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    setView('home');
  };

  const handleBookAppointment = (apt: Appointment) => {
    if (!user) {
      setView('auth');
      return;
    }
    setAppointments([apt, ...appointments]);
    alert("Thank you! Your appointment request has been received. Our team will contact you shortly.");
    setView('home');
  };

  const handleInquirySubmit = (iq: Inquiry) => {
    setInquiries([iq, ...inquiries]);
  };

  const handleAddLog = (log: LogEntry) => {
    setLogs([log, ...logs]);
  };

  const navigateTo = (newView: string) => {
    if ((newView === 'booking' || newView === 'screening') && !user) {
      setView('auth');
    } else if (newView === 'admin' && user?.role !== 'admin') {
      setView('home');
    } else {
      setView(newView);
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'home':
        return (
          <HomePage 
            services={services} 
            doctors={doctors} 
            articles={articles}
            onBook={() => navigateTo('booking')}
            onScreening={() => navigateTo('screening')}
          />
        );
      case 'screening':
        return <ScreeningPage onBook={() => navigateTo('booking')} />;
      case 'booking':
        return <BookingPage user={user} services={services} doctors={doctors} onComplete={handleBookAppointment} />;
      case 'inquiry':
        return <InquiryPage user={user} onSubmit={handleInquirySubmit} />;
      case 'admin':
        return (
          <AdminDashboard 
            currentUser={user}
            appointments={appointments}
            services={services}
            articles={articles}
            inquiries={inquiries}
            doctors={doctors}
            logs={logs}
            onUpdateServices={setServices}
            onUpdateArticles={setArticles}
            onUpdateDoctors={setDoctors}
            onUpdateAppointments={setAppointments}
            onAddLog={handleAddLog}
          />
        );
      case 'auth':
        return <AuthPage onAuth={handleLogin} />;
      default:
        return <HomePage services={services} doctors={doctors} articles={articles} onBook={() => navigateTo('booking')} onScreening={() => navigateTo('screening')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {view !== 'admin' && <Navbar user={user} onNavigate={navigateTo} onLogout={handleLogout} />}
      <main className="flex-grow">
        {renderContent()}
      </main>
      
      {view !== 'admin' && view !== 'auth' && (
        <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="bg-blue-600 p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <span className="text-xl font-bold text-white uppercase tracking-wider">PersonalityAI</span>
              </div>
              <p className="text-slate-500 max-w-sm">
                Leading the way in digital psychiatry through ethically grounded AI assessment tools and world-class clinical care at Dr. Ramakant Gadiwan's center.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6">Patient Resources</h4>
              <ul className="space-y-4 text-sm">
                <li><button onClick={() => navigateTo('screening')} className="hover:text-blue-400 transition">Free Screening Tool</button></li>
                <li><button onClick={() => navigateTo('inquiry')} className="hover:text-blue-400 transition">Contact Specialist</button></li>
                <li><button className="hover:text-blue-400 transition">Patient Portal</button></li>
                <li><button className="hover:text-blue-400 transition">HIPAA Policy</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6">Contact Us</h4>
              <ul className="space-y-4 text-sm">
                <li>Indian Sindi Railway</li>
                <li>vishal.sontakke.vss@gmail.com</li>
                <li>+918380842765</li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-800 text-center text-xs text-slate-600">
            &copy; 2024 Personality Disorders Using AI Health Systems | Dr. Ramakant Gadiwan's Centre. All rights reserved.
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
