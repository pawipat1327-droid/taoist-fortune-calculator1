import React, { useState } from 'react';
import { MoneyUserData } from '../types';

interface MoneyFormProps {
  userData: MoneyUserData;
  setUserData: (data: MoneyUserData) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const MoneyForm: React.FC<MoneyFormProps> = ({ userData, setUserData, onSubmit, isLoading }) => {
  const wealthTypes = [
    { value: 'investment', label: '投资理财', icon: '📈' },
    { value: 'debt', label: '讨债追款', icon: '💰' },
    { value: 'salary', label: '升职加薪', icon: '💼' },
    { value: 'business', label: '生意经营', icon: '🏪' },
  ] as const;

  const isFormValid = userData.userName && userData.wealthType;

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

        {/* 求财类型 */}
        <div>
          <label className="block text-sm font-medium text-purple-900 mb-2 brush-font text-lg">
            您想求什么财？
          </label>
          <div className="grid grid-cols-2 gap-3">
            {wealthTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setUserData({ ...userData, wealthType: type.value })}
                className={`py-4 px-4 rounded-lg border-2 transition-all ${
                  userData.wealthType === type.value
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 border-amber-500 text-white shadow-lg'
                    : 'bg-white/50 border-purple-200 text-purple-900 hover:border-amber-400 hover:shadow-md'
                }`}
              >
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="font-medium">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 自定义问题（可选） */}
        <div>
          <label className="block text-sm font-medium text-purple-900 mb-2 brush-font text-lg">
            具体问题（可选）
          </label>
          <textarea
            value={userData.customRequest || ''}
            onChange={(e) => setUserData({ ...userData, customRequest: e.target.value })}
            placeholder="例如：想投资股票，什么时候入场合适？"
            rows={3}
            className="w-full px-4 py-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white/50 resize-none"
          />
        </div>
      </div>

      {/* 提交按钮 */}
      <button
        onClick={onSubmit}
        disabled={!isFormValid || isLoading}
        className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-lg font-bold text-lg hover:from-amber-500 hover:to-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg btn-glow"
      >
        {isLoading ? '正在为您起局...' : '开始测算财运'}
      </button>

      {/* 提示信息 */}
      <div className="text-center text-sm text-purple-700/70">
        <p>基于奇门遁甲与当前干支时间，AI 分析您的财运走势</p>
      </div>
    </div>
  );
};

export default MoneyForm;
