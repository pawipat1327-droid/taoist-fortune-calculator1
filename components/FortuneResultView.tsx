import React from 'react';
import { FortuneResult, RecommendedDate } from '../types';
import { Icons } from '../constants';

interface FortuneResultViewProps {
  result: FortuneResult;
  onReset: () => void;
  loggedStatus: 'idle' | 'success' | 'error';
}

const DateCard: React.FC<{ date: RecommendedDate; label?: string; highlight?: boolean }> = ({ date, label, highlight }) => (
  <div className={`relative border-2 ${highlight ? 'border-red-500/80 bg-red-900/20' : 'border-purple-500/30 bg-purple-900/20'} p-4 sm:p-5 rounded-xl mb-4 transition-all hover:scale-[1.02] hover:shadow-lg`}>
    {label && (
      <div className="absolute -top-3 left-4 bg-gradient-to-r from-purple-600 to-amber-500 text-white text-xs px-3 py-1 rounded-full shadow-lg">
        {label}
      </div>
    )}
    <div className="flex justify-between items-start mb-3 mt-2 gap-3">
      <div className="flex-1">
        <div className="text-xl sm:text-2xl font-bold text-amber-200 font-mono leading-tight">
          {date.date} <span className="text-base sm:text-lg text-purple-300/80 ml-2">({date.weekDay})</span>
        </div>
        <div className="text-sm text-purple-300 font-serif mt-1">农历 {date.lunarDate}</div>
      </div>
      <div className="flex flex-col items-end">
         <div className={`text-2xl font-bold ${highlight ? 'text-red-400' : 'text-amber-400'}`}>{date.energyScore}分</div>
         <div className="flex gap-1 mt-2 flex-wrap justify-end">
           {date.tags.map((t, i) => (
             <span key={i} className="text-[10px] sm:text-xs border border-purple-500/40 text-purple-200 px-2 py-0.5 rounded bg-purple-900/40">
               {t}
             </span>
           ))}
         </div>
      </div>
    </div>
    <div className="text-sm text-purple-200/90 leading-relaxed border-t border-purple-500/20 pt-3 mt-2">
       <span className="font-bold text-amber-300">大师批语：</span>{date.reason}
    </div>
  </div>
);

const FortuneResultView: React.FC<FortuneResultViewProps> = ({ result, onReset, loggedStatus }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-block border-y-4 border-double border-purple-500/50 py-3 px-6 sm:px-8">
           <h2 className="text-3xl sm:text-4xl font-bold text-gradient-amber brush-font">{result.title}</h2>
        </div>
        <div className="mt-4 sm:mt-6 p-4 sm:p-5 bg-purple-900/30 rounded-xl text-purple-200 text-sm sm:text-base leading-relaxed text-justify border border-purple-500/20">
           <span className="font-bold text-amber-300">命理综述：</span>{result.summary}
        </div>
      </div>

      {/* Immediate Date (The "Best" immediate option) */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-amber-200 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> 近期急用 (7日内)
        </h3>
        {result.dates.immediate.map((d, i) => <DateCard key={i} date={d} highlight={true} label="救急首选" />)}
      </div>

      {/* Short Term */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-purple-200 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-purple-500 rounded-full"></span> 短期规划 (1个月内)
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {result.dates.shortTerm.map((d, i) => <DateCard key={i} date={d} />)}
        </div>
      </div>

      {/* Long Term */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-indigo-500 rounded-full"></span> 从容筹备 (半年内)
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {result.dates.longTerm.map((d, i) => <DateCard key={i} date={d} />)}
        </div>
      </div>

      {/* Advice */}
      <div className="bg-gradient-to-br from-purple-900/80 to-purple-950/90 text-purple-100 p-5 sm:p-6 rounded-xl shadow-2xl relative overflow-hidden border border-purple-500/30">
        <div className="absolute top-2 right-2 p-3 opacity-10">
          <Icons.Sparkles />
        </div>
        <h3 className="font-bold text-xl sm:text-2xl mb-3 sm:mb-4 brush-font text-gradient-amber">道长锦囊</h3>
        <p className="text-sm sm:text-base leading-7 opacity-90 text-justify text-purple-200">{result.advice}</p>
      </div>

      {/* Footer / Status */}
      <div className="flex flex-col items-center gap-4 pt-6 border-t border-purple-500/20">
        {loggedStatus !== 'idle' && (
          <div className={`px-4 py-2 rounded-lg text-sm font-bold ${
            loggedStatus === 'success'
              ? 'bg-green-900/40 text-green-300 border border-green-500/30'
              : 'bg-red-900/40 text-red-300 border border-red-500/30'
          }`}>
            {loggedStatus === 'success' ? '天机已录入档案' : '记录失败'}
          </div>
        )}

        <button
          onClick={onReset}
          className="text-purple-400 hover:text-amber-400 underline decoration-2 underline-offset-4 transition-colors font-medium"
        >
          重算其他事务
        </button>
      </div>

    </div>
  );
};

export default FortuneResultView;
