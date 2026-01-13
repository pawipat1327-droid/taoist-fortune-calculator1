import React from 'react';
import { FortuneResult } from '../types';
import { Icons } from '../constants';

interface FortuneResultViewProps {
  result: FortuneResult;
  onReset: () => void;
  loggedStatus: 'idle' | 'success' | 'error';
}

const FortuneResultView: React.FC<FortuneResultViewProps> = ({ result, onReset, loggedStatus }) => {
  return (
    <div className="animate-ink-flow space-y-6">
      
      {/* Title Header */}
      <div className="text-center mb-8 relative">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-16 h-16 bg-red-800/10 rounded-full blur-xl"></div>
        <div className="inline-block border-y-4 border-double border-purple-900 py-2 px-8">
           <h2 className="text-4xl font-bold text-purple-900 brush-font">{result.title}</h2>
        </div>
        <p className="mt-4 text-purple-700 italic font-serif text-lg">“ {result.summary} ”</p>
      </div>

      {/* Scores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {result.scores.map((s, idx) => (
          <div key={idx} className="border border-purple-200 bg-white/50 p-4 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-8xl text-purple-100 opacity-50 brush-font pointer-events-none select-none">
              {s.score >= 80 ? '吉' : s.score >= 50 ? '平' : '凶'}
            </div>
            <div className="flex justify-between items-center border-b border-purple-100 pb-2 mb-2">
              <span className="font-bold text-xl text-purple-900">{s.category}</span>
              <span className={`font-mono font-bold text-lg ${s.score > 80 ? 'text-red-700' : 'text-purple-700'}`}>
                {s.score}分
              </span>
            </div>
            <p className="text-purple-800/80 text-sm leading-relaxed">{s.comment}</p>
          </div>
        ))}
      </div>

      {/* Lucky Guide Strip */}
      <div className="bg-purple-900 text-purple-50 p-4 rounded-sm flex flex-col md:flex-row justify-around items-center gap-4 shadow-lg">
        <div className="flex flex-col items-center">
          <span className="text-xs opacity-75 uppercase tracking-widest">Lucky Color</span>
          <span className="font-bold text-xl brush-font">{result.luckyGuide.color}</span>
        </div>
        <div className="w-px h-8 bg-purple-700 hidden md:block"></div>
        <div className="flex flex-col items-center">
          <span className="text-xs opacity-75 uppercase tracking-widest">Direction</span>
          <span className="font-bold text-xl brush-font">{result.luckyGuide.direction}</span>
        </div>
        <div className="w-px h-8 bg-purple-700 hidden md:block"></div>
        <div className="flex flex-col items-center">
          <span className="text-xs opacity-75 uppercase tracking-widest">Number</span>
          <span className="font-bold text-xl font-mono">{result.luckyGuide.number}</span>
        </div>
      </div>

      {/* Master's Advice */}
      <div className="border-l-4 border-purple-900 pl-4 py-2 bg-gradient-to-r from-purple-50 to-transparent">
        <h3 className="text-purple-900 font-bold mb-2 flex items-center gap-2">
          <Icons.Moon /> 
          <span>道长寄语</span>
        </h3>
        <p className="text-purple-900 leading-8 text-lg text-justify font-serif">
          {result.advice}
        </p>
      </div>

      {/* Footer / Status */}
      <div className="flex flex-col items-center gap-4 pt-6 border-t border-purple-200 border-dashed">
        {loggedStatus !== 'idle' && (
          <div className={`px-4 py-1 rounded text-sm ${loggedStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {loggedStatus === 'success' ? '天机已录入档案 (Success)' : '天机难测，记录失败 (Error)'}
          </div>
        )}

        <button
          onClick={onReset}
          className="text-purple-500 hover:text-purple-900 underline decoration-wavy underline-offset-4 transition-colors"
        >
          再算一卦 (Reset)
        </button>
      </div>

    </div>
  );
};

export default FortuneResultView;