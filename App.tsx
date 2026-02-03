import React, { useState } from 'react';
import { Icons } from './constants';
import {
  UserData, FortuneResult,
  LoveUserData, LoveResult,
  MoneyUserData, MoneyResult,
  DreamUserData, DreamResult
} from './types';
import FortuneForm from './components/FortuneForm';
import FortuneResultView from './components/FortuneResultView';
import LoveForm from './components/LoveForm';
import LoveResultView from './components/LoveResultView';
import MoneyForm from './components/MoneyForm';
import MoneyResultView from './components/MoneyResultView';
import DreamForm from './components/DreamForm';
import DreamResultView from './components/DreamResultView';
import SettingsModal from './components/SettingsModal';
import PaymentModal from './components/PaymentModal';
import { generateFortune } from './services/deepseekService';
import { generateLoveFortune } from './services/loveService';
import { generateMoneyFortune } from './services/moneyService';
import { generateDreamFortune } from './services/dreamService';
import { logToGoogleSheet } from './services/loggingService';

type AppMode = 'date' | 'love' | 'money' | 'dream';

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>('date');

  // Date Selection Mode State
  const [userData, setUserData] = useState<UserData>({
    userName: '',
    birthDate: '',
    birthHour: '',
    request: '',
  });

  // Love Mode State
  const [loveUserData, setLoveUserData] = useState<LoveUserData>({
    userName: '',
    birthDate: '',
    birthHour: 0,
    gender: 'male',
  });

  // Money Mode State
  const [moneyUserData, setMoneyUserData] = useState<MoneyUserData>({
    userName: '',
    wealthType: 'investment',
    customRequest: '',
  });

  // Dream Mode State
  const [dreamUserData, setDreamUserData] = useState<DreamUserData>({
    userName: '',
    dreamDescription: '',
  });

  // Results State
  const [dateResult, setDateResult] = useState<FortuneResult | null>(null);
  const [loveResult, setLoveResult] = useState<LoveResult | null>(null);
  const [moneyResult, setMoneyResult] = useState<MoneyResult | null>(null);
  const [dreamResult, setDreamResult] = useState<DreamResult | null>(null);
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
    setDateResult(null);
    setLoveResult(null);
    setMoneyResult(null);
    setDreamResult(null);
    setLoggedStatus('idle');
  };

  const handleModeChange = (mode: AppMode) => {
    setCurrentMode(mode);
    handleReset();
  };

  // Date Selection Handlers
  const handleDateFormSubmit = () => {
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = async () => {
    setIsPaymentOpen(false);
    setLoading(true);
    setLoggedStatus('idle');

    try {
      const fortune = await generateFortune(userData);
      setDateResult(fortune);

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

  // Love Fortune Handlers
  const handleLoveFormSubmit = async () => {
    setLoading(true);
    try {
      const result = await generateLoveFortune(loveUserData);
      setLoveResult(result);
    } catch (error) {
      alert("测算失败 (Error: " + (error as Error).message + ")");
    } finally {
      setLoading(false);
    }
  };

  // Money Fortune Handlers
  const handleMoneyFormSubmit = async () => {
    setLoading(true);
    try {
      const result = await generateMoneyFortune(moneyUserData);
      setMoneyResult(result);
    } catch (error) {
      alert("测算失败 (Error: " + (error as Error).message + ")");
    } finally {
      setLoading(false);
    }
  };

  // Dream Interpretation Handlers
  const handleDreamFormSubmit = async () => {
    setLoading(true);
    try {
      const result = await generateDreamFortune(dreamUserData);
      setDreamResult(result);
    } catch (error) {
      alert("解梦失败 (Error: " + (error as Error).message + ")");
    } finally {
      setLoading(false);
    }
  };

  // Mode Config
  const modeConfig = {
    date: { title: '天机神算 · 择日', icon: '📅', color: 'purple' },
    love: { title: '天机神算 · 姻缘', icon: '💕', color: 'pink' },
    money: { title: '天机神算 · 财运', icon: '💰', color: 'amber' },
    dream: { title: '天机神算 · 解梦', icon: '🌙', color: 'indigo' },
  };

  const currentConfig = modeConfig[currentMode];

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
          <h1 className="text-xl sm:text-3xl font-bold text-purple-900 tracking-wider brush-font">
            {currentConfig.title}
          </h1>
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 text-purple-400 hover:text-purple-900 transition-colors border border-purple-200 rounded-full hover:bg-purple-50"
          title="系统设置"
        >
          <Icons.Settings />
        </button>
      </nav>

      {/* Mode Navigation */}
      <div className="relative z-10 px-6 mb-6">
        <div className="max-w-lg mx-auto flex gap-2 p-1 bg-white/50 rounded-xl border-2 border-purple-200 flex-wrap">
          <button
            onClick={() => handleModeChange('date')}
            className={`flex-1 min-w-[60px] py-2 px-3 rounded-lg font-medium text-sm transition-all ${
              currentMode === 'date'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-purple-900 hover:bg-purple-100'
            }`}
          >
            择日
          </button>
          <button
            onClick={() => handleModeChange('love')}
            className={`flex-1 min-w-[60px] py-2 px-3 rounded-lg font-medium text-sm transition-all ${
              currentMode === 'love'
                ? 'bg-pink-600 text-white shadow-lg'
                : 'text-purple-900 hover:bg-pink-50'
            }`}
          >
            姻缘
          </button>
          <button
            onClick={() => handleModeChange('money')}
            className={`flex-1 min-w-[60px] py-2 px-3 rounded-lg font-medium text-sm transition-all ${
              currentMode === 'money'
                ? 'bg-amber-600 text-white shadow-lg'
                : 'text-purple-900 hover:bg-amber-50'
            }`}
          >
            财运
          </button>
          <button
            onClick={() => handleModeChange('dream')}
            className={`flex-1 min-w-[60px] py-2 px-3 rounded-lg font-medium text-sm transition-all ${
              currentMode === 'dream'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-purple-900 hover:bg-indigo-50'
            }`}
          >
            解梦
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Paper Container */}
          <div className="ink-box p-8 md:p-12 shadow-2xl relative corner-decoration">

            {/* Date Selection Mode */}
            {currentMode === 'date' && (
              !dateResult ? (
                <div className="animate-fade-in">
                  <div className="mb-10 text-center space-y-2">
                    <h2 className="text-2xl font-bold text-purple-900">请施主赐教八字与祈愿</h2>
                    <div className="w-16 h-1 bg-purple-900 mx-auto rounded-full opacity-20"></div>
                  </div>
                  <FortuneForm
                    userData={userData}
                    setUserData={setUserData}
                    onSubmit={handleDateFormSubmit}
                    isLoading={loading}
                  />
                </div>
              ) : (
                <FortuneResultView
                  result={dateResult}
                  userData={userData}
                  onReset={handleReset}
                  loggedStatus={loggedStatus}
                />
              )
            )}

            {/* Love Mode */}
            {currentMode === 'love' && (
              !loveResult ? (
                <div className="animate-fade-in">
                  <div className="mb-10 text-center space-y-2">
                    <h2 className="text-2xl font-bold text-pink-900">请输入您的生辰信息</h2>
                    <div className="w-16 h-1 bg-pink-900 mx-auto rounded-full opacity-20"></div>
                  </div>
                  <LoveForm
                    userData={loveUserData}
                    setUserData={setLoveUserData}
                    onSubmit={handleLoveFormSubmit}
                    isLoading={loading}
                  />
                </div>
              ) : (
                <LoveResultView
                  result={loveResult}
                  onReset={handleReset}
                />
              )
            )}

            {/* Money Mode */}
            {currentMode === 'money' && (
              !moneyResult ? (
                <div className="animate-fade-in">
                  <div className="mb-10 text-center space-y-2">
                    <h2 className="text-2xl font-bold text-amber-900">请选择您的求财类型</h2>
                    <div className="w-16 h-1 bg-amber-900 mx-auto rounded-full opacity-20"></div>
                  </div>
                  <MoneyForm
                    userData={moneyUserData}
                    setUserData={setMoneyUserData}
                    onSubmit={handleMoneyFormSubmit}
                    isLoading={loading}
                  />
                </div>
              ) : (
                <MoneyResultView
                  result={moneyResult}
                  onReset={handleReset}
                />
              )
            )}

            {/* Dream Mode */}
            {currentMode === 'dream' && (
              !dreamResult ? (
                <div className="animate-fade-in">
                  <div className="mb-10 text-center space-y-2">
                    <h2 className="text-2xl font-bold text-indigo-900">请描述您的梦境</h2>
                    <div className="w-16 h-1 bg-indigo-900 mx-auto rounded-full opacity-20"></div>
                  </div>
                  <DreamForm
                    userData={dreamUserData}
                    setUserData={setDreamUserData}
                    onSubmit={handleDreamFormSubmit}
                    isLoading={loading}
                  />
                </div>
              ) : (
                <DreamResultView
                  result={dreamResult}
                  onReset={handleReset}
                />
              )
            )}

          </div>
        </div>
      </main>

      <footer className="relative z-10 p-6 text-center text-purple-900/40 text-xs font-mono">
        <p>Lunar AI Oracle • React • iztro • DeepSeek</p>
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
