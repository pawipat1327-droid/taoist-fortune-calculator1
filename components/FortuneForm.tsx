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
    <div className="space-y-8 px-2">
      
      <div className="text-center pb-4 border-b-2 border-purple-100">
        <h3 className="text-xl font-serif text-purple-800 font-bold">择日 · 趋吉避凶</h3>
        <p className="text-sm text-purple-600 mt-2">
          我们将为您精选 <span className="font-bold text-red-700">5</span> 个黄道吉日<br/>
          (涵盖近期急用与从容筹备之时机)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-purple-900 font-serif font-bold">阁下尊姓 (Name)</label>
          <input
            type="text"
            name="userName"
            value={userData.userName}
            onChange={handleChange}
            className="w-full bg-white border-b-2 border-purple-900/50 text-purple-900 p-2 focus:outline-none focus:border-purple-900 text-lg placeholder-purple-200"
            placeholder="请输入姓名"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-purple-900 font-serif font-bold">生辰八字 (Birth)</label>
          <div className="flex gap-2">
            <input
              type="date"
              name="birthDate"
              value={userData.birthDate}
              onChange={handleChange}
              className="flex-1 bg-white border-b-2 border-purple-900/50 text-purple-900 p-2 focus:outline-none focus:border-purple-900"
            />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-purple-900 font-serif font-bold">出生时辰 (Hour)</label>
          <select
            name="birthHour"
            value={userData.birthHour}
            onChange={handleChange}
            className="w-full bg-white border-b-2 border-purple-900/50 text-purple-900 p-2 focus:outline-none focus:border-purple-900"
          >
            <option value="" disabled>请选择时辰</option>
            {CHINESE_HOURS.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-purple-900 font-serif font-bold">
           欲办何事 (What is your plan?)
        </label>
        <textarea
           name="request"
           value={userData.request}
           onChange={handleChange}
           rows={3}
           className="w-full bg-white border-2 border-purple-900/30 text-purple-900 rounded p-4 focus:outline-none focus:border-purple-800 placeholder-purple-300 resize-none text-lg"
           placeholder="例如：准备在下个月搬家入宅；或者计划在今年内和女友领证结婚；或者打算近期开一家咖啡店..."
        />
        <p className="text-xs text-purple-500/80 text-right">越详细，择日依据越精准</p>
      </div>

      <div className="pt-6 flex justify-center">
        <button
          onClick={handleStart}
          disabled={isLoading}
          className={`relative px-12 py-4 text-2xl font-bold font-serif tracking-widest text-white transition-all transform ${
            isLoading
              ? 'bg-purple-900/70 cursor-wait'
              : isValid 
                ? 'bg-purple-900 hover:bg-purple-800 hover:scale-105 active:scale-95 shadow-xl' 
                : 'bg-gray-500 hover:bg-gray-600 shadow-md'
          }`}
          style={{ 
            clipPath: 'polygon(0 10%, 10% 0, 90% 0, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0 90%)' 
          }}
        >
          {isLoading ? (
             <span className="flex items-center gap-2">
               <span className="animate-spin text-2xl">☯</span> 演卦择吉...
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