import React from 'react';
import { DreamResult } from '../types';
import { Icons } from '../constants';

interface DreamResultViewProps {
  result: DreamResult;
  onReset: () => void;
}

const DreamResultView: React.FC<DreamResultViewProps> = ({ result, onReset }) => {
  const auspiciousConfig = {
    auspicious: {
      label: '吉',
      color: 'text-green-400',
      bg: 'bg-green-900/30 border-green-500/30',
      icon: '✨'
    },
    neutral: {
      label: '平',
      color: 'text-amber-400',
      bg: 'bg-amber-900/30 border-amber-500/30',
      icon: '⚖️'
    },
    inauspicious: {
      label: '凶',
      color: 'text-red-400',
      bg: 'bg-red-900/30 border-red-500/30',
      icon: '⚠️'
    }
  };

  const perspectiveLabels = {
    freudian: '弗洛伊德学派（潜意识欲望）',
    jungian: '荣格学派（集体潜意识）',
    integrated: '整合视角（综合分析）'
  };

  const config = auspiciousConfig[result.folkInterpretation.auspiciousLevel];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-block border-y-4 border-double border-indigo-500/50 py-3 px-8">
          <h2 className="text-3xl font-bold text-gradient-amber brush-font">{result.title}</h2>
        </div>
      </div>

      {/* 梦境概要 */}
      <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-6 rounded-xl border border-indigo-500/20">
        <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-indigo-200">
          <span className="text-2xl">🌙</span> 梦境概要
        </h3>
        <p className="text-indigo-100 leading-relaxed">{result.dreamSummary}</p>
      </div>

      {/* 周公解梦 - 民俗层 */}
      <div className="bg-gradient-to-br from-amber-900/40 to-amber-950/90 p-6 rounded-xl border border-amber-500/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xl flex items-center gap-2 text-amber-200">
            <span className="text-2xl">📜</span> 周公解梦
          </h3>
          <div className={`px-4 py-2 rounded-lg border-2 ${config.bg} ${config.color} font-bold text-lg`}>
            {config.icon} {config.label}
          </div>
        </div>

        {/* 关键意象 */}
        <div className="mb-4">
          <div className="text-sm text-amber-400 mb-2 font-bold">梦中意象</div>
          <div className="flex flex-wrap gap-2">
            {result.folkInterpretation.symbols.map((symbol, i) => (
              <span key={i} className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-lg text-sm font-bold">
                {symbol}
              </span>
            ))}
          </div>
        </div>

        {/* 周公解释 */}
        <div className="bg-black/20 rounded-lg p-4">
          <div className="text-sm text-amber-400 mb-2">解梦结果</div>
          <p className="text-amber-100 leading-relaxed">{result.folkInterpretation.prediction}</p>
        </div>
      </div>

      {/* 心理分析 - 科学层 */}
      <div className="bg-gradient-to-br from-blue-900/40 to-blue-950/90 p-6 rounded-xl border border-blue-500/30">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-blue-200">
          <span className="text-2xl">🧠</span> 心理分析
        </h3>

        {/* 分析视角 */}
        <div className="mb-4">
          <div className="text-sm text-blue-400 mb-2">分析视角</div>
          <div className="inline-block px-3 py-1.5 bg-blue-800/50 border border-blue-500/30 text-blue-200 rounded-lg text-sm">
            {perspectiveLabels[result.psychologicalAnalysis.perspective]}
          </div>
        </div>

        {/* 心理分析内容 */}
        <div className="bg-black/20 rounded-lg p-4 mb-4">
          <p className="text-blue-100 leading-relaxed">{result.psychologicalAnalysis.analysis}</p>
        </div>

        {/* 关键洞察 */}
        <div>
          <div className="text-sm text-blue-400 mb-2">关键洞察</div>
          <div className="space-y-2">
            {result.psychologicalAnalysis.keyInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-blue-950 rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
                <p className="text-blue-100 leading-relaxed flex-1 text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 总结启示 */}
      <div className="bg-gradient-to-br from-purple-900/50 to-purple-950/90 p-6 rounded-xl shadow-2xl relative overflow-hidden border border-purple-500/40">
        <div className="absolute top-2 right-2 p-3 opacity-10">
          <Icons.Sparkles />
        </div>
        <h3 className="font-bold text-2xl mb-4 brush-font text-gradient-amber flex items-center gap-2">
          <span>💫</span> 梦境启示
        </h3>
        <div className="bg-gradient-to-r from-purple-800/30 to-amber-800/30 rounded-lg p-5 border border-purple-400/20">
          <p className="text-xl text-purple-100 leading-relaxed text-center font-serif-sc">
            {result.summary}
          </p>
        </div>
      </div>

      {/* 温馨提示 */}
      <div className="bg-indigo-50/30 p-4 rounded-xl border border-indigo-200/30 text-center">
        <p className="text-sm text-indigo-700">
          💡 梦境解析仅供参考，如遇心理困扰请咨询专业心理咨询师
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-center pt-6 border-t border-indigo-500/20">
        <button
          onClick={onReset}
          className="text-indigo-400 hover:text-amber-400 underline decoration-2 underline-offset-4 transition-colors font-medium"
        >
          返回首页
        </button>
      </div>
    </div>
  );
};

export default DreamResultView;
