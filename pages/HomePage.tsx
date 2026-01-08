
import React from 'react';
import { Service, Doctor, Article } from '../types';

interface HomePageProps {
  services: Service[];
  doctors: Doctor[];
  articles: Article[];
  onBook: () => void;
  onScreening: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ services, doctors, articles, onBook, onScreening }) => {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative bg-white pt-16 lg:pt-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6">
                Next-Gen Psychiatric Care
              </span>
              <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
                <span className="block">Detection of Personality</span>
                <span className="block text-blue-600">Disorders Using AI</span>
              </h1>
              <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Empowering patients and families with advanced AI screening tools and expert clinical care. 
                Secure, HIPAA-compliant, and results-driven mental health support.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={onBook}
                  className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-xl shadow-blue-200 hover:bg-blue-700 transform transition hover:-translate-y-1"
                >
                  Book Specialist Appointment
                </button>
                <button 
                  onClick={onScreening}
                  className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition"
                >
                  Try AI Screening
                </button>
              </div>
              <div className="mt-6 flex items-center space-x-2 text-sm text-slate-400">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>HIPAA Compliant Data Handling</span>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-3xl shadow-2xl overflow-hidden aspect-video">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://picsum.photos/seed/medical/800/600" 
                  alt="Modern clinical office"
                />
                <div className="absolute inset-0 bg-blue-900/10 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl max-w-xs text-center">
                    <div className="flex justify-center -space-x-2 mb-3">
                      <img className="w-10 h-10 rounded-full border-2 border-white" src="https://picsum.photos/seed/1/100" />
                      <img className="w-10 h-10 rounded-full border-2 border-white" src="https://picsum.photos/seed/2/100" />
                      <img className="w-10 h-10 rounded-full border-2 border-white" src="https://picsum.photos/seed/3/100" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">500+ Patients Analyzed Weekly</p>
                    <p className="text-xs text-slate-500">Using our proprietary AI diagnostics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-white">98%</div>
            <div className="text-blue-400 text-sm">Diagnostic Accuracy</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">15+</div>
            <div className="text-blue-400 text-sm">Specialist Doctors</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">10k+</div>
            <div className="text-blue-400 text-sm">Success Stories</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">24/7</div>
            <div className="text-blue-400 text-sm">AI Support Available</div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Comprehensive Services</h2>
          <p className="mt-4 text-lg text-slate-500">Tailored treatment plans powered by clinical expertise.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map(service => (
            <div key={service.id} className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition group">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{service.name}</h3>
              <p className="text-slate-500 mb-6">{service.description}</p>
              <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                <span className="font-bold text-slate-900">{service.price}</span>
                <button 
                  onClick={onBook}
                  className="text-blue-600 font-semibold hover:text-blue-800"
                >
                  Learn More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Doctors Section */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Meet Our Specialists</h2>
              <p className="mt-4 text-lg text-slate-500">Board-certified experts at the intersection of technology and empathy.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
            {doctors.map(doctor => (
              <div key={doctor.id} className="flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="w-full md:w-48 h-64 md:h-auto">
                  <img src={doctor.image} className="w-full h-full object-cover" alt={doctor.name} />
                </div>
                <div className="p-8 flex-1">
                  <div className="text-sm font-semibold text-blue-600 mb-1">{doctor.specialty}</div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{doctor.name}</h3>
                  <p className="text-slate-500 mb-6">{doctor.bio}</p>
                  <button onClick={onBook} className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition">
                    Book with {doctor.name.split(' ')[1]}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Insights & Updates</h2>
          <p className="mt-4 text-lg text-slate-500">Stay informed about the latest in personality disorder research.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map(article => (
            <div key={article.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-3xl aspect-video mb-6">
                <img src={article.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={article.title} />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold text-slate-800 uppercase tracking-widest">{article.category}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition">{article.title}</h3>
              <p className="text-slate-500 line-clamp-2">{article.excerpt}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
