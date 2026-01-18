import React from 'react';
import { FortuneResult, RecommendedDate } from '../types';
import { Icons } from '../constants';

interface FortuneResultViewProps {
  result: FortuneResult;
  onReset: () => void;
  loggedStatus: 'idle' | 'success' | 'error';
}

const DateCard: React.FC<{ date: RecommendedDate; label?: string; highlight?: boolean }> = ({ date, label, highlight }) => (
  <div className={`relative border-2 ${highlight ? 'border-red-800 bg-red-50' : 'border-purple-200 bg-white/60'} p-4 rounded-lg mb-4 break-inside-avoid shadow-sm hover:shadow-md transition-shadow`}>
    {label && (
      <div className="absolute -top-3 left-4 bg-purple-900 text-white text-xs px-2 py-1 rounded shadow-sm">
        {label}
      </div>
    )}
    <div className="flex justify-between items-start mb-2 mt-2">
      <div>
        <div className="text-2xl font-bold text-purple-900 font-mono">
          {date.date} <span className="text-lg font-serif opacity-75">({date.weekDay})</span>
        </div>
        <div className="text-sm text-purple-700 font-serif">农历 {date.lunarDate}</div>
      </div>
      <div className="flex flex-col items-end">
         <div className="text-xl font-bold text-red-700">{date.energyScore}分</div>
         <div className="flex gap-1 mt-1 flex-wrap justify-end">
           {date.tags.map((t, i) => (
             <span key={i} className="text-[10px] border border-red-300 text-red-800 px-1 rounded bg-white">
               {t}
             </span>
           ))}
         </div>
      </div>
    </div>
    <div className="text-sm text-gray-700 leading-relaxed border-t border-purple-100 pt-2 mt-2">
       <span className="font-bold text-purple-900">大师批语：</span>{date.reason}
    </div>
  </div>
);

const FortuneResultView: React.FC<FortuneResultViewProps> = ({ result, onReset, loggedStatus }) => {
  return (
    <div className="animate-ink-flow space-y-6">
      
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-block border-y-4 border-double border-purple-900 py-2 px-8">
           <h2 className="text-3xl font-bold text-purple-900 brush-font">{result.title}</h2>
        </div>
        <div className="mt-4 p-4 bg-purple-100/50 rounded-lg text-purple-900 text-sm leading-relaxed text-justify border border-purple-200">
           <span className="font-bold">命理综述：</span>{result.summary}
        </div>
      </div>

      {/* Immediate Date (The "Best" immediate option) */}
      <div>
        <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-600 rounded-full"></span> 近期急用 (7日内)
        </h3>
        {result.dates.immediate.map((d, i) => <DateCard key={i} date={d} highlight={true} label="救急首选" />)}
      </div>

      {/* Short Term */}
      <div>
        <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-purple-600 rounded-full"></span> 短期规划 (1个月内)
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {result.dates.shortTerm.map((d, i) => <DateCard key={i} date={d} />)}
        </div>
      </div>

      {/* Long Term */}
      <div>
        <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-indigo-600 rounded-full"></span> 从容筹备 (半年内)
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {result.dates.longTerm.map((d, i) => <DateCard key={i} date={d} />)}
        </div>
      </div>

      {/* Advice */}
      <div className="bg-purple-900 text-purple-50 p-6 rounded-lg shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Icons.Sparkles />
        </div>
        <h3 className="font-bold text-xl mb-2 brush-font">道长锦囊</h3>
        <p className="text-sm leading-7 opacity-90 text-justify">{result.advice}</p>
      </div>

      {/* Footer / Status */}
      <div className="flex flex-col items-center gap-4 pt-6 border-t border-purple-200 border-dashed">
        {loggedStatus !== 'idle' && (
          <div className={`px-4 py-1 rounded text-sm ${loggedStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {loggedStatus === 'success' ? '天机已录入档案' : '记录失败'}
          </div>
        )}

        <button
          onClick={onReset}
          className="text-purple-500 hover:text-purple-900 underline decoration-wavy underline-offset-4 transition-colors"
        >
          重算其他事务
        </button>
      </div>

    </div>
  );
};

export default FortuneResultView;