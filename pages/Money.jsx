import React, { useState } from 'react';

const Money = () => {
  const [formData, setFormData] = useState({
    userName: '',
    birthDate: '',
    birthHour: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.userName.trim()) {
      alert('请输入您的姓名');
      return;
    }
    setLoading(true);
    // TODO: 调用 AI 服务
    setTimeout(() => {
      setLoading(false);
      setResult({ message: '财富运势分析功能开发中...' });
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-amber-900/60 to-yellow-900/60 border-2 border-amber-500/30 p-6 sm:p-10 rounded-2xl shadow-2xl relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-4 right-4 text-6xl sm:text-8xl">💰</div>
            <div className="absolute bottom-4 left-4 w-24 h-24 bg-amber-500/20 rounded-full blur-2xl"></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-amber-200 mb-8 text-center brush-font">💰 财富运势分析</h2>

            {!result ? (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label className="block text-amber-200 font-bold text-sm sm:text-base mb-2">您的姓名</label>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    className="w-full bg-amber-900/40 border-2 border-amber-500/30 rounded-lg p-3 text-amber-100 focus:outline-none focus:border-amber-400 transition-colors"
                    placeholder="请输入姓名"
                  />
                </div>

                <div>
                  <label className="block text-amber-200 font-bold text-sm sm:text-base mb-2">出生日期</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="w-full bg-amber-900/40 border-2 border-amber-500/30 rounded-lg p-3 text-amber-100 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-amber-200 font-bold text-sm sm:text-base mb-2">出生时辰</label>
                  <select
                    name="birthHour"
                    value={formData.birthHour}
                    onChange={handleChange}
                    className="w-full bg-amber-900/40 border-2 border-amber-500/30 rounded-lg p-3 text-amber-100 focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    <option value="" className="bg-amber-900">请选择时辰</option>
                    <option value="子时">子时 (23:00-01:00)</option>
                    <option value="丑时">丑时 (01:00-03:00)</option>
                    <option value="寅时">寅时 (03:00-05:00)</option>
                    <option value="卯时">卯时 (05:00-07:00)</option>
                    <option value="辰时">辰时 (07:00-09:00)</option>
                    <option value="巳时">巳时 (09:00-11:00)</option>
                    <option value="午时">午时 (11:00-13:00)</option>
                    <option value="未时">未时 (13:00-15:00)</option>
                    <option value="申时">申时 (15:00-17:00)</option>
                    <option value="酉时">酉时 (17:00-19:00)</option>
                    <option value="戌时">戌时 (19:00-21:00)</option>
                    <option value="亥时">亥时 (21:00-23:00)</option>
                  </select>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 disabled:from-amber-700/50 disabled:to-yellow-700/50 text-white font-bold rounded-xl transition-all btn-glow"
                >
                  {loading ? '正在分析...' : '开始分析'}
                </button>
              </div>
            ) : (
              <div className="text-center py-12 animate-fade-in">
                <div className="text-6xl sm:text-7xl mb-6">💎</div>
                <p className="text-amber-200 text-lg sm:text-xl leading-relaxed">{result.message}</p>
                <button
                  onClick={() => setResult(null)}
                  className="mt-8 px-8 py-3 bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 rounded-xl transition-all border border-amber-500/30"
                >
                  重新分析
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Money;
