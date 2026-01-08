
import React, { useState } from 'react';
import { analyzeScreening } from '../geminiService';

interface ScreeningHistory {
  userInput: string;
  analysis: any;
  timestamp: string;
}

const ScreeningPage: React.FC<{ onBook: () => void }> = ({ onBook }) => {
  const [step, setStep] = useState(1);
  const [userInput, setUserInput] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ScreeningHistory[]>([]);

  const handleAnalyze = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    const result = await analyzeScreening(userInput);
    setAnalysis(result);
    
    if (result) {
      const newEntry: ScreeningHistory = {
        userInput,
        analysis: result,
        timestamp: new Date().toLocaleString()
      };
      setHistory([newEntry, ...history]);
    }
    
    setLoading(false);
    setStep(3);
  };

  const loadFromHistory = (item: ScreeningHistory) => {
    setUserInput(item.userInput);
    setAnalysis(item.analysis);
    setStep(3);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 transition-all duration-300">
        <div className="bg-blue-600 p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">AI Diagnostic Screening</h2>
          <p className="text-blue-100">Preliminary assessment powered by Gemini 3-Flash-Lite</p>
        </div>

        <div className="p-8 md:p-12">
          {step === 1 && (
            <div className="space-y-6 text-center">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Confidential AI Analysis</h3>
              <p className="text-slate-500 max-w-lg mx-auto">
                This tool uses advanced clinical reasoning to identify markers for Clusters A, B, and C personality disorders. Your input is analyzed through a secure cloud framework.
              </p>
              <div className="bg-amber-50 p-4 rounded-xl text-amber-800 text-sm flex items-start space-x-3 text-left">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg>
                <span>HIPAA Notice: All behavioral data is processed securely to aid in your clinical validation with Dr. Gadiwan.</span>
              </div>
              <button 
                onClick={() => setStep(2)}
                className="mt-8 px-12 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-200"
              >
                Start New Assessment
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <label className="block text-lg font-bold text-slate-800">
                Describe the symptoms or personality patterns you've observed (in yourself or a loved one):
              </label>
              <textarea 
                className="w-full h-64 p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-slate-700 leading-relaxed"
                placeholder="Example: Frequent mood swings (splitting), extreme fear of abandonment, grandiosity, social inhibition, or preoccupation with perfectionism..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              <div className="flex justify-between items-center">
                <button onClick={() => setStep(1)} className="text-slate-500 font-bold hover:text-slate-700 transition">Back</button>
                <button 
                  disabled={loading || !userInput.trim()}
                  onClick={handleAnalyze}
                  className={`px-10 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg transition transform active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      AI Processing...
                    </span>
                  ) : 'Analyze Behavioral Markers'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && analysis && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-green-800">Assessment Summary</h4>
                  <span className="text-[10px] font-bold text-green-600 bg-white px-2 py-0.5 rounded-full border border-green-200 uppercase tracking-widest">Confirmed Result</span>
                </div>
                <p className="text-green-700 leading-relaxed">{analysis.summary}</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  Clinical Clusters for Follow-Up
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.potentialCategories && analysis.potentialCategories.map((cat: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-white text-blue-700 text-xs font-bold rounded-full border border-blue-200 shadow-sm">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center mr-3 text-sm font-bold">1</span>
                    Observed Behavioral Markers
                  </h4>
                  <ul className="space-y-3">
                    {analysis.observedPatterns.map((p: string, i: number) => (
                      <li key={i} className="flex items-start text-slate-600 text-sm leading-relaxed">
                        <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center mr-3 text-sm font-bold">2</span>
                    Clinical Validation Steps
                  </h4>
                  <ul className="space-y-3">
                    {analysis.recommendations.map((r: string, i: number) => (
                      <li key={i} className="flex items-start text-slate-600 text-sm leading-relaxed">
                        <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t pt-8 text-center space-y-4">
                <p className="text-slate-400 italic text-[11px] leading-relaxed max-w-2xl mx-auto px-4 uppercase tracking-tighter">{analysis.disclaimer}</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                  <button 
                    onClick={onBook}
                    className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-xl shadow-blue-200 transform hover:-translate-y-1"
                  >
                    Clinical Review with Dr. Gadiwan
                  </button>
                  <button 
                    onClick={() => {setStep(2); setUserInput(''); setAnalysis(null);}}
                    className="px-8 py-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition border border-slate-200"
                  >
                    Another Assessment
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12 animate-fade-in">
          <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center">
              <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Assessment History
            </h3>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{history.length} Saved Analysis</span>
          </div>
          <div className="space-y-4">
            {history.map((item, index) => (
              <div key={index} className="group p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-blue-200 transition-all duration-300 cursor-pointer flex items-center justify-between" onClick={() => loadFromHistory(item)}>
                <div className="flex-1">
                  <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">{item.timestamp}</p>
                  <p className="text-sm font-bold text-slate-700 line-clamp-1 italic">"{item.userInput}"</p>
                </div>
                <div className="ml-6 flex items-center space-x-2">
                  <div className="flex -space-x-1">
                    {item.analysis.potentialCategories?.slice(0, 2).map((c: string, i: number) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-blue-400 border border-white"></div>
                    ))}
                  </div>
                  <svg className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreeningPage;
