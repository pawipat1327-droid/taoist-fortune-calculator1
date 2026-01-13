import React from 'react';
import { FortuneCategory, UserData, PredictionScope, CHINESE_HOURS } from '../types';

interface FortuneFormProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  onSubmit: () => void;
  isLoading: boolean;
}

const FortuneForm: React.FC<FortuneFormProps> = ({ userData, setUserData, onSubmit, isLoading }) => {
  
  const handleCategoryToggle = (category: FortuneCategory) => {
    setUserData(prev => {
      if (prev.categories.includes(category)) {
        return { ...prev, categories: prev.categories.filter(c => c !== category) };
      }
      return { ...prev, categories: [...prev.categories, category] };
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    if (userData.categories.length === 0) {
      alert("请至少选择一项您欲测之事（如财运、事业）。");
      return;
    }
    onSubmit();
  };

  // Helper to render the correct date input based on Scope
  const renderDateInput = () => {
    if (userData.scope === PredictionScope.YEAR) {
      // Just a simple year selector
      const currentYear = new Date().getFullYear();
      const years = Array.from({length: 5}, (_, i) => currentYear + i);
      return (
         <select
            name="targetDate"
            value={userData.targetDate.split('-')[0]} // Hacky way to store year in date string
            onChange={(e) => setUserData(prev => ({ ...prev, targetDate: `${e.target.value}-01-01` }))}
            className="w-full bg-white border-2 border-purple-900/30 text-purple-900 rounded p-3 focus:outline-none focus:border-purple-800"
         >
           {years.map(y => <option key={y} value={y}>{y}年 (流年)</option>)}
         </select>
      );
    }
    
    // For Day and Month, we use Date picker for simplicity, 
    // Logic handles extracting Month/Day in backend
    return (
      <input
        type="date"
        name="targetDate"
        value={userData.targetDate}
        onChange={handleChange}
        className="w-full bg-white border-2 border-purple-900/30 text-purple-900 rounded p-3 focus:outline-none focus:border-purple-800"
      />
    );
  };

  // We remove the strict 'isValid' check for the disabled state to allow user to click and get feedback
  const isValid = userData.userName && userData.birthDate && userData.birthHour && userData.categories.length > 0;

  return (
    <div className="space-y-8 px-2">
      
      {/* Scope Selection - Top Tabs */}
      <div className="flex justify-center space-x-4 border-b-2 border-purple-100 pb-4">
        {Object.values(PredictionScope).map(scope => (
          <button
            key={scope}
            onClick={() => setUserData(prev => ({ ...prev, scope: scope }))}
            className={`text-lg font-bold pb-1 transition-all ${
              userData.scope === scope 
                ? 'text-purple-800 border-b-4 border-purple-800 scale-110' 
                : 'text-purple-300 hover:text-purple-500'
            }`}
          >
            {scope}
          </button>
        ))}
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

        <div className="space-y-2">
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

        <div className="space-y-2">
           <label className="block text-purple-900 font-serif font-bold">
             {userData.scope === PredictionScope.YEAR ? '欲测何年 (Year)' : '欲测何日 (Target)'}
           </label>
           {renderDateInput()}
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-purple-900 font-serif font-bold text-center">所求何事 (Categories)</label>
        <div className="flex flex-wrap justify-center gap-3">
          {Object.values(FortuneCategory).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryToggle(cat)}
              className={`px-6 py-2 rounded-none border-2 text-lg font-serif transition-all transform ${
                userData.categories.includes(cat)
                  ? 'bg-purple-900 text-white border-purple-900 rotate-1'
                  : 'bg-transparent text-purple-900 border-purple-300 hover:border-purple-600'
              }`}
              style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }} // Parallelogram shape
            >
              {cat}
            </button>
          ))}
        </div>
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
                : 'bg-gray-500 hover:bg-gray-600 shadow-md' // Visually distinct but still clickable for feedback
          }`}
          style={{ 
            clipPath: 'polygon(0 10%, 10% 0, 90% 0, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0 90%)' // Octagon-ish
          }}
        >
          {isLoading ? (
             <span className="flex items-center gap-2">
               <span className="animate-spin text-2xl">☯</span> 掐指运算...
             </span>
          ) : (
            '起 卦'
          )}
        </button>
      </div>
    </div>
  );
};

export default FortuneForm;