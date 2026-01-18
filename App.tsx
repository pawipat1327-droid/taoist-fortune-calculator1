import React, { useState } from 'react';
import { Icons } from './constants';
import { UserData, FortuneResult } from './types';
import FortuneForm from './components/FortuneForm';
import FortuneResultView from './components/FortuneResultView';
import SettingsModal from './components/SettingsModal';
import PaymentModal from './components/PaymentModal';
import { generateFortune } from './services/geminiService';
import { logToGoogleSheet } from './services/loggingService';

const App: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    userName: '',
    birthDate: '',
    birthHour: '',
    request: '', // Changed from targetDate/Scope to generic request
  });

  const [result, setResult] = useState<FortuneResult | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Modal States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  
  const [gasUrl, setGasUrl] = useState(() => localStorage.getItem('gas_app_url') || '');
  const [loggedStatus, setLoggedStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSettingsSave = (url: string) => {
    setGasUrl(url);
    localStorage.setItem('gas_app_url', url);
  };

  const handleReset = () => {
    setResult(null);
    setLoggedStatus('idle');
  };

  // Step 1: User clicks "Start" -> Show Payment Modal
  const handleFormSubmit = () => {
    setIsPaymentOpen(true);
  };

  // Step 2: Payment Success -> Actually Call API
  const handlePaymentSuccess = async () => {
    setIsPaymentOpen(false); // Close modal
    setLoading(true);
    setLoggedStatus('idle');

    try {
      const fortune = await generateFortune(userData);
      setResult(fortune);

      if (gasUrl) {
        const payload = {
            timestamp: new Date().toISOString(),
            userName: userData.userName,
            birthDate: `${userData.birthDate} ${userData.birthHour}`,
            request: userData.request,
            resultSummary: fortune.summary
        };
        const success = await logToGoogleSheet(gasUrl, payload);
        setLoggedStatus(success ? 'success' : 'error');
      }

    } catch (error) {
      alert("云深不知处 (Error: " + (error as Error).message + ")");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      
      {/* Decorative Corners */}
      <div className="fixed top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-purple-900 pointer-events-none opacity-50"></div>
      <div className="fixed top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-purple-900 pointer-events-none opacity-50"></div>
      <div className="fixed bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-purple-900 pointer-events-none opacity-50"></div>
      <div className="fixed bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-purple-900 pointer-events-none opacity-50"></div>

      {/* Navbar */}
      <nav className="relative z-10 p-6 flex justify-between items-center max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="text-purple-900">
            <Icons.Sparkles />
          </div>
          <h1 className="text-3xl font-bold text-purple-900 tracking-wider brush-font">天机神算 · 择日</h1>
        </div>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 text-purple-400 hover:text-purple-900 transition-colors border border-purple-200 rounded-full hover:bg-purple-50"
          title="系统设置"
        >
          <Icons.Settings />
        </button>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Paper Container */}
          <div className="ink-box p-8 md:p-12 shadow-2xl relative corner-decoration">
            
            {!result ? (
              <div className="animate-fade-in">
                <div className="mb-10 text-center space-y-2">
                  <h2 className="text-2xl font-bold text-purple-900">请施主赐教八字与祈愿</h2>
                  <div className="w-16 h-1 bg-purple-900 mx-auto rounded-full opacity-20"></div>
                </div>
                <FortuneForm 
                  userData={userData} 
                  setUserData={setUserData} 
                  onSubmit={handleFormSubmit}
                  isLoading={loading}
                />
              </div>
            ) : (
              <FortuneResultView 
                result={result} 
                onReset={handleReset}
                loggedStatus={loggedStatus}
              />
            )}
          </div>
        </div>
      </main>

      <footer className="relative z-10 p-6 text-center text-purple-900/40 text-xs font-mono">
        <p>Lunar AI Oracle • React • Google Apps Script</p>
      </footer>

      {/* Modals */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        gasUrl={gasUrl}
        onSave={handleSettingsSave}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        amount={1.00}
      />
    </div>
  );
};

export default App;