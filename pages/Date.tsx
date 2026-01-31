import React, { useState } from 'react';
import FortuneForm from '../components/FortuneForm';
import FortuneResultView from '../components/FortuneResultView';
import { UserData, FortuneResult } from '../types';
import { generateFortune } from '../services/deepseekService';
import { logToGoogleSheet } from '../services/loggingService';

const DatePage: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    userName: '',
    birthDate: '',
    birthHour: '',
    request: '',
    dateRange: '1m', // 默认选中"未来一个月"
  });

  const [result, setResult] = useState<FortuneResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loggedStatus, setLoggedStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const gasUrl = localStorage.getItem('gas_app_url') || '';

  const handleReset = () => {
    setResult(null);
    setLoggedStatus('idle');
    setUserData({
      userName: '',
      birthDate: '',
      birthHour: '',
      request: '',
      dateRange: '1m', // 重置为默认值
    });
  };

  const handleFormSubmit = async () => {
    if (!userData.userName.trim()) {
      alert("请阁下赐下尊姓大名。");
      return;
    }
    if (!userData.birthDate) {
      alert("请选择您的出生日期（公历）。");
      return;
    }
    if (!userData.birthHour) {
      alert("请选择您的出生时辰。若不清楚，可选子时或大致时间。");
      return;
    }
    if (!userData.request.trim()) {
      alert("请描述您欲择吉日办理的事务（如：搬家、领证、开业）。");
      return;
    }

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
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="ink-box p-8 sm:p-10 md:p-12 relative corner-decoration">
          {!result ? (
            <div className="animate-fade-in">
              <div className="mb-10 text-center space-y-3">
                <h2 className="text-2xl sm:text-3xl font-bold brush-font text-gradient-amber">
                  请施主赐教八字与祈愿
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto"></div>
              </div>
              <FortuneForm
                userData={userData}
                setUserData={setUserData}
                onSubmit={handleFormSubmit}
                isLoading={loading}
              />
            </div>
          ) : (
            <div className="animate-fade-in">
              <FortuneResultView
                result={result}
                onReset={handleReset}
                loggedStatus={loggedStatus}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatePage;
