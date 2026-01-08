
import React, { useState } from 'react';
import { Appointment, Service, Article, Inquiry, Doctor, User, LogEntry } from '../types';

interface AdminDashboardProps {
  currentUser: User | null;
  appointments: Appointment[];
  services: Service[];
  articles: Article[];
  inquiries: Inquiry[];
  doctors: Doctor[];
  logs: LogEntry[];
  onUpdateServices: (services: Service[]) => void;
  onUpdateArticles: (articles: Article[]) => void;
  onUpdateDoctors: (doctors: Doctor[]) => void;
  onUpdateAppointments: (appointments: Appointment[]) => void;
  onAddLog: (log: LogEntry) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  currentUser, appointments, services, articles, inquiries, doctors, logs,
  onUpdateServices, onUpdateArticles, onUpdateDoctors, onUpdateAppointments, onAddLog
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'appointments' | 'cms' | 'inquiries' | 'settings' | 'logs'>('home');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [logSearchTerm, setLogSearchTerm] = useState('');
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [historyEntryId, setHistoryEntryId] = useState<string | null>(null);
  const [historyText, setHistoryText] = useState('');
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);

  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = statusFilter === 'all' ? true : apt.status === statusFilter;
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          apt.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const aptDate = new Date(apt.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);
    
    const matchesDate = (!start || aptDate >= start) && (!end || aptDate <= end);

    return matchesStatus && matchesSearch && matchesDate;
  });

  const filteredLogs = logs.filter(log => {
    return log.patientName.toLowerCase().includes(logSearchTerm.toLowerCase()) || 
           log.type.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
           log.adminName.toLowerCase().includes(logSearchTerm.toLowerCase());
  });

  const createLog = (aptId: string, type: LogEntry['type'], details: string) => {
    const apt = appointments.find(a => a.id === aptId);
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      appointmentId: aptId,
      patientName: apt?.patientName || 'Unknown Patient',
      type: type,
      timestamp: new Date().toLocaleString(),
      adminName: currentUser?.name || 'System Admin',
      details: details
    };
    onAddLog(newLog);
  };

  const handleStatusChange = (appointmentId: string, newStatus: Appointment['status']) => {
    if (newStatus === 'confirmed') {
      setHistoryEntryId(appointmentId);
      setHistoryText('');
    } else {
      const apt = appointments.find(a => a.id === appointmentId);
      const updatedAppointments = appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      );
      onUpdateAppointments(updatedAppointments);
      createLog(appointmentId, 'Status Change', `Status changed from ${apt?.status} to ${newStatus}`);
    }
  };

  const processConfirmationWithHistory = () => {
    if (!historyEntryId) return;

    const updatedAppointments = appointments.map(apt => {
      if (apt.id === historyEntryId) {
        const updatedApt = { ...apt, status: 'confirmed' as const, clinicalHistory: historyText };
        sendComprehensiveClinicalConfirmation(updatedApt);
        return updatedApt;
      }
      return apt;
    });

    onUpdateAppointments(updatedAppointments);
    createLog(historyEntryId, 'Clinical History Added', `Patient history added and status confirmed.`);
    setHistoryEntryId(null);
    setHistoryText('');
  };

  const sendComprehensiveClinicalConfirmation = (appointment: Appointment) => {
    const service = services.find(s => s.id === appointment.serviceId);
    const doctor = doctors.find(d => d.id === appointment.doctorId);
    
    const clinicalRoadmap = [
      "1) The Challenge of Personality Disorder Diagnosis",
      "2) AI-Powered Detection Framework",
      "3) Digital Phenotyping & Behavioral Data",
      "4) Machine Learning Architectures",
      "5) Cloud Infrastructure & Security",
      "6) Clinical Validation & Performance",
      "7) Regulatory Landscape & Compliance",
      "8) Ethical Considerations & Bias Mitigation",
      "9) Implementation Barriers & Solutions",
      "10) Future Directions & Opportunities"
    ];

    const emailBody = `
Dear ${appointment.patientName},

Your appointment for ${service?.name} with ${doctor?.name} is confirmed for ${appointment.date} at ${appointment.time}.

${appointment.clinicalHistory ? `Note on Clinical Intake: ${appointment.clinicalHistory}\n` : ''}

As part of our AI-Integrated Diagnostic Protocol, your session will follow our advanced clinical roadmap:
${clinicalRoadmap.map(point => `\n• ${point}`).join('')}

Please ensure you have completed the online screening tool prior to your visit. Your data is protected by our Cloud Infrastructure & Security protocols.

Best regards,
The Clinical Team at PersonalityAI
    `.trim();

    console.log("[HIPAA SECURE SMTP - ADVANCED CLINICAL NOTIFICATION]", {
      to: appointment.email,
      subject: `Confirmed: ${service?.name} - Clinical Detection Roadmap Attached`,
      body: emailBody
    });
    
    setNotification({
      message: `Confirmed! 10-point roadmap and history sent to ${appointment.email}`,
      type: 'success'
    });
    setTimeout(() => setNotification(null), 6000);
  };

  const handleEditDoctor = (doc: Doctor) => {
    setEditingDoctor({ ...doc });
  };

  const handleSaveDoctor = () => {
    if (editingDoctor) {
      const updatedDoctors = doctors.map(d => d.id === editingDoctor.id ? editingDoctor : d);
      onUpdateDoctors(updatedDoctors);
      createLog('N/A', 'Doctor Updated', `Updated credentials for ${editingDoctor.name}`);
      setEditingDoctor(null);
      setNotification({ message: 'Doctor profile synchronized to cloud', type: 'info' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const generatePlaceholderImage = () => {
    if (editingDoctor) {
      const seed = encodeURIComponent(editingDoctor.name.toLowerCase().replace(/\s+/g, '-'));
      const newUrl = `https://picsum.photos/seed/${seed}/400/400`;
      setEditingDoctor({ ...editingDoctor, image: newUrl });
    }
  };

  const resetDateFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold">Admin Console</h2>
          <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">Health Manager v2.1</p>
        </div>
        <nav className="mt-6 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('home')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition ${activeTab === 'home' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            <span className="font-semibold">Home</span>
          </button>
          <button 
            onClick={() => setActiveTab('appointments')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition ${activeTab === 'appointments' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <span className="font-semibold">Appointments</span>
          </button>
          <button 
            onClick={() => setActiveTab('cms')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition ${activeTab === 'cms' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            <span className="font-semibold">Content (CMS)</span>
          </button>
          <button 
            onClick={() => setActiveTab('inquiries')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition ${activeTab === 'inquiries' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <span className="font-semibold">Inquiries</span>
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition ${activeTab === 'logs' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="font-semibold">System Logs</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition ${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span className="font-semibold">App Settings</span>
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        {notification && (
          <div className="fixed top-8 right-8 z-[200] animate-bounce-in">
            <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 border-2 ${
              notification.type === 'success' ? 'bg-green-600 text-white border-green-400' : 'bg-blue-600 text-white border-blue-400'
            }`}>
              <div className="bg-white/20 p-1.5 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <div>
                <p className="text-sm font-bold">Action Completed</p>
                <p className="text-xs opacity-90">{notification.message}</p>
              </div>
            </div>
          </div>
        )}

        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 capitalize tracking-tight">{activeTab === 'home' ? 'Operations Overview' : activeTab}</h1>
            <p className="text-slate-500 font-medium mt-1">Operational control for Dr. Gadiwan's center.</p>
          </div>
        </header>

        {activeTab === 'home' && (
          <div className="space-y-12 animate-fade-in">
            {/* Summary Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center space-x-4">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{appointments.length}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Appts</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center space-x-4">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{appointments.filter(a => a.status === 'pending').length}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Confirmation</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center space-x-4">
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{inquiries.length}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inquiries</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center space-x-4">
                <div className="w-14 h-14 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{doctors.length}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Staff</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity Mini-Tab */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">Recent System Activity</h3>
                    <button onClick={() => setActiveTab('logs')} className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">View All Logs</button>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {logs.slice(0, 5).length > 0 ? logs.slice(0, 5).map(log => (
                      <div key={log.id} className="p-6 hover:bg-slate-50 transition-colors flex items-start space-x-4">
                        <div className={`w-2 h-10 rounded-full mt-1 ${
                          log.type === 'Status Change' ? 'bg-blue-400' :
                          log.type === 'Clinical History Added' ? 'bg-green-400' : 'bg-slate-300'
                        }`} />
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <span className="font-bold text-slate-900">{log.patientName}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{log.timestamp}</span>
                          </div>
                          <p className="text-sm text-slate-500 line-clamp-1">{log.details}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="p-16 text-center text-slate-300 font-medium">No activity recorded today.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="space-y-6">
                <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200">
                  <h3 className="text-xl font-black mb-6 tracking-tight">Quick Actions</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setActiveTab('appointments')}
                      className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center px-6 transition group"
                    >
                      <svg className="w-5 h-5 mr-4 group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                      <span className="font-bold text-sm">Review Appts</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('inquiries')}
                      className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center px-6 transition group"
                    >
                      <svg className="w-5 h-5 mr-4 group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      <span className="font-bold text-sm">Respond to Inquiries</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('cms')}
                      className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center px-6 transition group"
                    >
                      <svg className="w-5 h-5 mr-4 group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      <span className="font-bold text-sm">Update Staff Profiles</span>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-200">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                       <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-widest">Platform Status</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Secure & Online</p>
                    </div>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-400">Cloud Sync</span>
                      <span className="text-green-400">Synchronized</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-400">Database</span>
                      <span className="text-green-400">Optimal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex flex-wrap items-center gap-4 flex-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Status:</span>
                  <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                    {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                          statusFilter === status 
                            ? 'bg-white text-blue-600 shadow-sm border border-slate-100' 
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="relative w-full lg:w-96">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search by patient name or email..." 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Date Range Filter Section */}
              <div className="flex flex-col sm:flex-row items-end gap-4 border-t border-slate-50 pt-6">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 pl-1">Start Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 pl-1">End Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                {(startDate || endDate) && (
                  <button 
                    onClick={resetDateFilters}
                    className="px-6 py-3 bg-slate-100 text-slate-500 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition"
                  >
                    Clear Dates
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Patient Details</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Clinical Service</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Schedule</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.length > 0 ? filteredAppointments.map(apt => (
                    <tr key={apt.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{apt.patientName}</div>
                        <div className="text-xs font-medium text-slate-400">{apt.email}</div>
                        {apt.clinicalHistory && (
                           <div className="mt-2 text-[10px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 italic line-clamp-1 border border-slate-200">
                             History: {apt.clinicalHistory}
                           </div>
                        )}
                      </td>
                      <td className="px-6 py-5 text-sm">
                        <div className="font-bold text-slate-700">{services.find(s => s.id === apt.serviceId)?.name || 'Assessment'}</div>
                        <div className="text-[10px] font-bold text-blue-600/70 uppercase tracking-tighter">with {doctors.find(d => d.id === apt.doctorId)?.name.split(' ')[1] || 'Specialist'}</div>
                      </td>
                      <td className="px-6 py-5 text-sm">
                        <div className="font-bold text-slate-700">{apt.date}</div>
                        <div className="text-xs font-medium text-slate-400">{apt.time}</div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border ${
                          apt.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-100' : 
                          apt.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-red-50 text-red-700 border-red-100'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end space-x-2">
                          {apt.status === 'pending' && (
                            <button 
                              onClick={() => handleStatusChange(apt.id, 'confirmed')}
                              className="px-4 py-2 bg-green-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-green-700 transition shadow-lg shadow-green-100 flex items-center"
                            >
                              Confirm
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-slate-400">
                        {searchTerm || startDate || endDate ? 'No matches found for your criteria.' : 'No appointments found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Activity Audit Trail</h3>
                  <p className="text-xs text-slate-400 font-medium">{filteredLogs.length} matching logs found</p>
                </div>
              </div>
              <div className="relative w-full md:w-80">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Search logs by patient or type..." 
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                  value={logSearchTerm}
                  onChange={(e) => setLogSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
                {filteredLogs.length > 0 ? filteredLogs.map(log => (
                  <div key={log.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${
                          log.type === 'Status Change' ? 'bg-blue-100 text-blue-700' :
                          log.type === 'Clinical History Added' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {log.type}
                        </span>
                        <h4 className="font-bold text-slate-900">{log.patientName}</h4>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.timestamp}</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{log.details}</p>
                    <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      Modified by: <span className="text-blue-600 ml-1">{log.adminName}</span>
                    </div>
                  </div>
                )) : (
                  <div className="p-20 text-center text-slate-400 font-medium">
                    {logSearchTerm ? 'No logs match your search criteria.' : 'No activity logged yet.'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CMS Tab Rendering */}
        {activeTab === 'cms' && (
          <div className="space-y-12 animate-fade-in">
            <section>
              <h3 className="text-xl font-bold mb-8 flex items-center text-slate-800">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-sm shadow-blue-50">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                Staff Management
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {doctors.map(doc => (
                  <div key={doc.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:shadow-xl hover:shadow-slate-200/50 transition duration-300 group">
                    <div className="flex items-start space-x-6">
                      <div className="relative">
                        <img src={doc.image} className="w-24 h-24 rounded-3xl object-cover shadow-lg group-hover:scale-105 transition duration-300" alt={doc.name} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xl font-extrabold text-slate-900 leading-tight">{doc.name}</h4>
                            <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mt-1">{doc.specialty}</p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-slate-500 line-clamp-2 my-4 leading-relaxed">{doc.bio}</p>
                        <button 
                          onClick={() => handleEditDoctor(doc)}
                          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition duration-300 flex items-center shadow-lg shadow-slate-200"
                        >
                          <svg className="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                          Update Credentials
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Inquiries Tab Rendering */}
        {activeTab === 'inquiries' && (
          <div className="grid grid-cols-1 gap-6 animate-fade-in">
            {inquiries.length > 0 ? inquiries.map(iq => (
              <div key={iq.id} className="p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:shadow-xl transition-all duration-300 group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="font-black text-slate-900 text-lg">{iq.name}</span>
                    <div className="text-xs font-bold text-slate-400 mt-0.5">{iq.email}</div>
                  </div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{iq.date}</span>
                </div>
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 italic font-medium text-slate-600 leading-relaxed">
                  "{iq.message}"
                </div>
              </div>
            )) : (
              <div className="p-20 text-center text-slate-300 font-medium">No inquiries received yet.</div>
            )}
          </div>
        )}

        {/* Settings Tab Rendering */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl animate-fade-in">
             <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
                <h3 className="text-2xl font-black mb-10 text-slate-900">System Architecture & Branding</h3>
                <div className="space-y-8">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Platform Label</label>
                    <input type="text" defaultValue="Personality Disorders Using AI" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition" />
                  </div>
                  <div className="pt-10 flex justify-end">
                    <button className="bg-slate-900 text-white px-12 py-4 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all duration-300 shadow-2xl shadow-slate-200">
                      Synchronize Cloud State
                    </button>
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* Clinical History Modal */}
        {historyEntryId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="bg-blue-600 p-8 text-white">
                <h3 className="text-2xl font-black tracking-tight">Clinical Intake Entry</h3>
                <p className="text-blue-100 text-sm mt-1">
                  Enter patient history for {appointments.find(a => a.id === historyEntryId)?.patientName}
                </p>
              </div>
              <div className="p-8">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Patient History / Clinical Notes</label>
                <textarea 
                  rows={6}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none leading-relaxed"
                  placeholder="Summarize patient symptoms, previous history, or AI screening observations..."
                  value={historyText}
                  onChange={(e) => setHistoryText(e.target.value)}
                />
              </div>
              <div className="p-8 bg-slate-50 border-t flex justify-end space-x-4">
                <button 
                  onClick={() => setHistoryEntryId(null)}
                  className="px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-slate-600 font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={processConfirmationWithHistory}
                  className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition shadow-xl shadow-blue-200"
                >
                  Confirm & Log
                </button>
              </div>
            </div>
          </div>
        )}

        {editingDoctor && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden">
              <div className="bg-slate-900 p-8 text-white flex justify-between items-center border-b border-white/5">
                <div>
                  <h3 className="text-2xl font-black tracking-tight">Clinical Credential Manager</h3>
                  <p className="text-slate-400 text-sm font-medium mt-1">Updating profile for {editingDoctor.name}</p>
                </div>
                <button onClick={() => setEditingDoctor(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-2xl transition duration-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Professional Name</label>
                    <input 
                      type="text" 
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      value={editingDoctor.name}
                      onChange={(e) => setEditingDoctor({...editingDoctor, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Specialty / Credentials</label>
                    <input 
                      type="text" 
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      value={editingDoctor.specialty}
                      onChange={(e) => setEditingDoctor({...editingDoctor, specialty: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Profile Image (URL)</label>
                  <div className="flex items-center space-x-4">
                    {editingDoctor.image && (
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-blue-100 shadow-md flex-shrink-0">
                        <img 
                          src={editingDoctor.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                          onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100?text=Error')} 
                        />
                      </div>
                    )}
                    <div className="flex-1 flex space-x-2">
                      <input 
                        type="text" 
                        className="flex-1 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        value={editingDoctor.image}
                        onChange={(e) => setEditingDoctor({...editingDoctor, image: e.target.value})}
                        placeholder="Image URL"
                      />
                      <button 
                        type="button"
                        onClick={generatePlaceholderImage}
                        className="px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-blue-600 font-bold hover:bg-slate-50 transition flex items-center shadow-sm"
                        title="Generate Auto Image"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-3">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Medical Biography</label>
                    <span className={`text-[10px] font-black uppercase tracking-wider ${editingDoctor.bio.length > 450 ? 'text-red-500' : 'text-slate-300'}`}>
                      {editingDoctor.bio.length} / 500 characters
                    </span>
                  </div>
                  <textarea 
                    rows={5}
                    maxLength={500}
                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none leading-relaxed"
                    value={editingDoctor.bio}
                    onChange={(e) => setEditingDoctor({...editingDoctor, bio: e.target.value})}
                  />
                </div>
              </div>
              <div className="p-8 bg-slate-50 border-t flex justify-end space-x-4">
                <button 
                  onClick={() => setEditingDoctor(null)}
                  className="px-8 py-3 bg-white border-2 border-slate-100 rounded-2xl text-slate-600 font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition"
                >
                  Dismiss
                </button>
                <button 
                  onClick={handleSaveDoctor}
                  className="px-10 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition shadow-xl shadow-blue-200"
                >
                  Deploy Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
