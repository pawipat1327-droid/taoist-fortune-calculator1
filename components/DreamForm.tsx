import React from 'react';
import { DreamUserData } from '../types';

interface DreamFormProps {
  userData: DreamUserData;
  setUserData: (data: DreamUserData) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const DreamForm: React.FC<DreamFormProps> = ({ userData, setUserData, onSubmit, isLoading }) => {
  const isFormValid = userData.userName && userData.dreamDescription?.trim().length >= 10;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* 姓名 */}
        <div>
          <label className="block text-sm font-medium text-indigo-900 mb-2 brush-font text-lg">
            您的姓名
          </label>
          <input
            type="text"
            value={userData.userName}
            onChange={(e) => setUserData({ ...userData, userName: e.target.value })}
            placeholder="请输入姓名"
            className="w-full px-4 py-3 rounded-lg border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white/50"
          />
        </div>

        {/* 梦境描述 */}
        <div>
          <label className="block text-sm font-medium text-indigo-900 mb-2 brush-font text-lg">
            描述您的梦境
          </label>
          <textarea
            value={userData.dreamDescription}
            onChange={(e) => setUserData({ ...userData, dreamDescription: e.target.value })}
            placeholder="请详细描述您梦到了什么...&#10;&#10;例如：我梦见自己在一条漆黑的路上走，突然出现了一条蛇，我害怕得转身就跑，结果掉进了水里..."
            rows={8}
            className="w-full px-4 py-3 rounded-lg border-2 border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white/50 resize-none leading-relaxed"
          />
          <div className="mt-2 text-xs text-indigo-700/70 text-right">
            {userData.dreamDescription?.length || 0} 字 (建议至少10字)
          </div>
        </div>

        {/* 常见梦境提示 */}
        <div className="bg-indigo-50/50 rounded-lg p-4 border border-indigo-200/50">
          <div className="text-sm font-medium text-indigo-900 mb-2">💡 常见梦境意象参考：</div>
          <div className="flex flex-wrap gap-2 text-xs">
            {['蛇', '掉牙', '飞行', '坠落', '被追', '水', '火', '死亡', '考试', '迷路'].map((symbol) => (
              <span
                key={symbol}
                onClick={() => {
                  const currentText = userData.dreamDescription || '';
                  setUserData({
                    ...userData,
                    dreamDescription: currentText ? `${currentText}、${symbol}` : symbol
                  });
                }}
                className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded cursor-pointer hover:bg-indigo-200 transition-colors"
              >
                {symbol}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 提交按钮 */}
      <button
        onClick={onSubmit}
        disabled={!isFormValid || isLoading}
        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg font-bold text-lg hover:from-indigo-500 hover:to-indigo-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg btn-glow"
      >
        {isLoading ? '正在为您解梦...' : '开始解梦'}
      </button>

      {/* 提示信息 */}
      <div className="text-center text-sm text-indigo-700/70 space-y-1">
        <p>🌙 周公解梦（民俗层）+ 心理分析（科学层）</p>
        <p className="text-xs">双重解码，深度解析您的梦境</p>
      </div>
    </div>
  );
};

export default DreamForm;
