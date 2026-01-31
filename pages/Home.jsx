import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen relative">
      {/* Ambient Background Effect */}
      <div className="ambient-glow" />

      {/* Content Container */}
      <div className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12 lg:mb-16 animate-fade-in">
          <div className="relative inline-block">
            <div className="text-6xl sm:text-7xl lg:text-8xl mb-6 opacity-90">☯</div>
            <div className="absolute inset-0 text-6xl sm:text-7xl lg:text-8xl text-purple-500 blur-2xl opacity-30">☯</div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 brush-font text-gradient-amber">
            天机神算
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-purple-200/70 max-w-2xl mx-auto leading-relaxed">
            智能运势分析 · 择吉日 · 解命理
          </p>
        </div>

        {/* Feature Cards */}
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-5">
          {/* Date Selection */}
          <Link
            to="/date"
            className="block group animate-fade-in animate-delay-100"
          >
            <div className="card-hover h-full">
              <div className="bg-white/10 backdrop-blur-md border border-purple-500/20 rounded-xl p-4 sm:p-6 shadow-md hover:scale-[1.02] hover:shadow-lg transition-all">
                <div className="flex items-center justify-between gap-4">
                  {/* Left: Icon + Title + Description */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0 text-3xl sm:text-4xl lg:text-5xl group-hover:scale-110 transition-transform duration-300">
                      📅
                    </div>
                    <div className="flex flex-col justify-center">
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-200 mb-1 sm:mb-2 brush-font">
                        择吉日
                      </h2>
                      <p className="text-purple-200/70 text-xs sm:text-sm leading-relaxed line-clamp-2">
                        根据您的八字和所需办理的事务，AI 大师为您精选最佳黄道吉日
                      </p>
                    </div>
                  </div>

                  {/* Right: Arrow */}
                  <svg className="w-6 h-6 text-purple-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Love Fortune */}
          <Link
            to="/love"
            className="block group animate-fade-in animate-delay-200"
          >
            <div className="card-hover h-full">
              <div className="bg-pink-500/10 backdrop-blur-md border border-pink-500/20 rounded-xl p-4 sm:p-6 shadow-md hover:scale-[1.02] hover:shadow-lg transition-all">
                <div className="flex items-center justify-between gap-4">
                  {/* Left: Icon + Title + Description */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0 text-3xl sm:text-4xl lg:text-5xl group-hover:scale-110 transition-transform duration-300">
                      💕
                    </div>
                    <div className="flex flex-col justify-center">
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-pink-200 mb-1 sm:mb-2 brush-font">
                        桃花运
                      </h2>
                      <p className="text-pink-200/70 text-xs sm:text-sm leading-relaxed line-clamp-2">
                        分析您的感情运势，把握桃花时机，提升爱情能量
                      </p>
                    </div>
                  </div>

                  {/* Right: Arrow */}
                  <svg className="w-6 h-6 text-pink-400 group-hover:text-pink-300 group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Wealth Fortune */}
          <Link
            to="/money"
            className="block group animate-fade-in animate-delay-300"
          >
            <div className="card-hover h-full">
              <div className="bg-amber-500/10 backdrop-blur-md border border-amber-500/20 rounded-xl p-4 sm:p-6 shadow-md hover:scale-[1.02] hover:shadow-lg transition-all">
                <div className="flex items-center justify-between gap-4">
                  {/* Left: Icon + Title + Description */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0 text-3xl sm:text-4xl lg:text-5xl group-hover:scale-110 transition-transform duration-300">
                      💰
                    </div>
                    <div className="flex flex-col justify-center">
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-200 mb-1 sm:mb-2 brush-font">
                        财富运
                      </h2>
                      <p className="text-amber-200/70 text-xs sm:text-sm leading-relaxed line-clamp-2">
                        探索您的财富密码，把握投资时机，事业运势分析
                      </p>
                    </div>
                  </div>

                  {/* Right: Arrow */}
                  <svg className="w-6 h-6 text-amber-400 group-hover:text-amber-300 group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Dream Interpretation */}
          <Link
            to="/dream"
            className="block group animate-fade-in animate-delay-400"
          >
            <div className="card-hover h-full">
              <div className="bg-cyan-500/10 backdrop-blur-md border border-cyan-500/20 rounded-xl p-4 sm:p-6 shadow-md hover:scale-[1.02] hover:shadow-lg transition-all">
                <div className="flex items-center justify-between gap-4">
                  {/* Left: Icon + Title + Description */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0 text-3xl sm:text-4xl lg:text-5xl group-hover:scale-110 transition-transform duration-300">
                      🌙
                    </div>
                    <div className="flex flex-col justify-center">
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-cyan-200 mb-1 sm:mb-2 brush-font">
                        解梦境
                      </h2>
                      <p className="text-cyan-200/70 text-xs sm:text-sm leading-relaxed line-clamp-2">
                        解读您的梦境含义，探索潜意识的神秘信息
                      </p>
                    </div>
                  </div>

                  {/* Right: Arrow */}
                  <svg className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <p className="text-purple-300/40 text-sm">AI 驱动的传统命理分析</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
