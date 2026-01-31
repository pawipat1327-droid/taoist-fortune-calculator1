import React, { useState } from 'react';

const Dream = () => {
  const [formData, setFormData] = useState({
    dreamDescription: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.dreamDescription.trim()) {
      alert('请描述您的梦境');
      return;
    }
    setLoading(true);
    // TODO: 调用 AI 服务
    setTimeout(() => {
      setLoading(false);
      setResult({ message: '解梦功能开发中...' });
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-cyan-900/60 to-blue-900/60 border-2 border-cyan-500/30 p-6 sm:p-10 rounded-2xl shadow-2xl relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-4 right-4 text-6xl sm:text-8xl">🌙</div>
            <div className="absolute bottom-4 left-4 w-24 h-24 bg-cyan-500/20 rounded-full blur-2xl"></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-cyan-200 mb-8 text-center brush-font">🌙 解梦</h2>

            {!result ? (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <label className="block text-cyan-200 font-bold text-sm sm:text-base mb-2">描述您的梦境</label>
                  <textarea
                    name="dreamDescription"
                    value={formData.dreamDescription}
                    onChange={handleChange}
                    rows={6}
                    className="w-full bg-cyan-900/40 border-2 border-cyan-500/30 rounded-xl p-4 text-cyan-100 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                    placeholder="请详细描述您的梦境内容，包括场景、人物、颜色等细节..."
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-cyan-700/50 disabled:to-blue-700/50 text-white font-bold rounded-xl transition-all btn-glow"
                >
                  {loading ? '正在解梦...' : '开始解梦'}
                </button>
              </div>
            ) : (
              <div className="text-center py-12 animate-fade-in">
                <div className="text-6xl sm:text-7xl mb-6">✨</div>
                <p className="text-cyan-200 text-lg sm:text-xl leading-relaxed">{result.message}</p>
                <button
                  onClick={() => setResult(null)}
                  className="mt-8 px-8 py-3 bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 rounded-xl transition-all border border-cyan-500/30"
                >
                  重新解梦
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dream;
