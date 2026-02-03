import React from 'react';
import { LoveUserData, CHINESE_HOURS } from '../types';

interface LoveFormProps {
  userData: LoveUserData;
  setUserData: (data: LoveUserData) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const LoveForm: React.FC<LoveFormProps> = ({ userData, setUserData, onSubmit, isLoading }) => {
  const isFormValid = userData.userName && userData.birthDate && userData.birthHour >= 0 && userData.gender;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* 姓名 */}
        <div>
          <label className="block text-sm font-medium text-purple-900 mb-2 brush-font text-lg">
            您的姓名
          </label>
          <input
            type="text"
            value={userData.userName}
            onChange={(e) => setUserData({ ...userData, userName: e.target.value })}
            placeholder="请输入姓名"
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white/50"
          />
        </div>

        {/* 性别 */}
        <div>
          <label className="block text-sm font-medium text-purple-900 mb-2 brush-font text-lg">
            您的性别
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setUserData({ ...userData, gender: 'male' })}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                userData.gender === 'male'
                  ? 'bg-purple-600 border-purple-600 text-white'
                  : 'bg-white/50 border-purple-200 text-purple-900 hover:border-purple-400'
              }`}
            >
              男
            </button>
            <button
              type="button"
              onClick={() => setUserData({ ...userData, gender: 'female' })}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                userData.gender === 'female'
                  ? 'bg-purple-600 border-purple-600 text-white'
                  : 'bg-white/50 border-purple-200 text-purple-900 hover:border-purple-400'
              }`}
            >
              女
            </button>
          </div>
        </div>

        {/* 出生日期 */}
        <div>
          <label className="block text-sm font-medium text-purple-900 mb-2 brush-font text-lg">
            出生日期（公历）
          </label>
          <input
            type="date"
            value={userData.birthDate}
            onChange={(e) => setUserData({ ...userData, birthDate: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white/50"
          />
        </div>

        {/* 出生时辰 */}
        <div>
          <label className="block text-sm font-medium text-purple-900 mb-2 brush-font text-lg">
            出生时辰
          </label>
          <div className="grid grid-cols-3 gap-2">
            {CHINESE_HOURS.map((hour, index) => (
              <button
                key={hour}
                type="button"
                onClick={() => setUserData({ ...userData, birthHour: index })}
                className={`py-2 px-2 text-xs rounded-lg border-2 transition-all ${
                  userData.birthHour === index
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'bg-white/50 border-purple-200 text-purple-900 hover:border-purple-400'
                }`}
              >
                {hour.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 提交按钮 */}
      <button
        onClick={onSubmit}
        disabled={!isFormValid || isLoading}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg font-bold text-lg hover:from-purple-500 hover:to-purple-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg btn-glow"
      >
        {isLoading ? '正在为您排盘...' : '开始测算姻缘'}
      </button>

      {/* 提示信息 */}
      <div className="text-center text-sm text-purple-700/70">
        <p>基于紫微斗数排盘，AI 分析您的夫妻宫运势</p>
      </div>
    </div>
  );
};

export default LoveForm;
