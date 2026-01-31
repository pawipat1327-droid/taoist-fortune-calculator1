import React from 'react';
import { UserData, CHINESE_HOURS } from '../types';

interface FortuneFormProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  onSubmit: () => void;
  isLoading: boolean;
}

const FortuneForm: React.FC<FortuneFormProps> = ({ userData, setUserData, onSubmit, isLoading }) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleStart = () => {
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
    onSubmit();
  };

  const isValid = userData.userName && userData.birthDate && userData.birthHour && userData.request;

  return (
    <div className="space-y-6 sm:space-y-8 px-2">
      <div className="text-center pb-6 border-b border-purple-500/30">
        <h3 className="text-xl sm:text-2xl font-bold text-amber-200 mb-3">择日 · 趋吉避凶</h3>
        <p className="text-sm sm:text-base text-purple-200/70 leading-relaxed">
          我们将为您精选 <span className="font-bold text-amber-400">5</span> 个黄道吉日<br />
          (涵盖近期急用与从容筹备之时机)
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        <div className="space-y-2">
          <label className="block text-purple-200 font-bold text-sm sm:text-base">阁下尊姓 (Name)</label>
          <input
            type="text"
            name="userName"
            value={userData.userName}
            onChange={handleChange}
            className="w-full bg-purple-900/40 border-2 border-purple-500/30 text-amber-100 p-3 focus:outline-none focus:border-amber-500 rounded-lg text-lg placeholder-purple-400/50 transition-colors"
            placeholder="请输入姓名"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-purple-200 font-bold text-sm sm:text-base">生辰八字 (Birth)</label>
          <input
            type="date"
            name="birthDate"
            value={userData.birthDate}
            onChange={handleChange}
            className="w-full bg-purple-900/40 border-2 border-purple-500/30 text-amber-100 p-3 focus:outline-none focus:border-amber-500 rounded-lg transition-colors"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="block text-purple-200 font-bold text-sm sm:text-base">出生时辰 (Hour)</label>
          <select
            name="birthHour"
            value={userData.birthHour}
            onChange={handleChange}
            className="w-full bg-purple-900/40 border-2 border-purple-500/30 text-amber-100 p-3 focus:outline-none focus:border-amber-500 rounded-lg transition-colors"
          >
            <option value="" className="bg-purple-900">请选择时辰</option>
            {CHINESE_HOURS.map(h => (
              <option key={h} value={h} className="bg-purple-900">{h}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-purple-200 font-bold text-sm sm:text-base">
          欲办何事 (What is your plan?)
        </label>
        <textarea
           name="request"
           value={userData.request}
           onChange={handleChange}
           rows={3}
           className="w-full bg-purple-900/40 border-2 border-purple-500/30 text-amber-100 rounded-xl p-4 focus:outline-none focus:border-amber-500 placeholder-purple-400/50 resize-none text-lg transition-colors"
           placeholder="例如：准备在下个月搬家入宅；或者计划在今年内和女友领证结婚；或者打算近期开一家咖啡店..."
        />
        <p className="text-xs text-purple-300/60 text-right">越详细，择日依据越精准</p>
      </div>

      <div className="pt-6 sm:pt-8 flex justify-center">
        <button
          onClick={handleStart}
          disabled={isLoading}
          className={`relative px-10 sm:px-12 py-4 sm:py-5 text-xl sm:text-2xl font-bold tracking-widest text-white transition-all btn-glow ${
            isLoading
              ? 'bg-purple-700/50 cursor-wait'
              : isValid
                ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 active:scale-95 shadow-xl shadow-purple-500/30'
                : 'bg-gray-700/50 hover:bg-gray-600/50 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
             <span className="flex items-center gap-2 sm:gap-3">
               <span className="animate-spin text-xl sm:text-2xl">☯</span> 演卦择吉...
             </span>
          ) : (
            '寻 龙 择 日'
          )}
        </button>
      </div>
    </div>
  );
};

export default FortuneForm;
