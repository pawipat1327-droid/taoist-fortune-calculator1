import React from 'react';
import { MoneyResult } from '../types';
import { Icons } from '../constants';

interface MoneyResultViewProps {
  result: MoneyResult;
  onReset: () => void;
}

const MoneyResultView: React.FC<MoneyResultViewProps> = ({ result, onReset }) => {
  const riskColors = {
    low: 'text-green-400 bg-green-900/30 border-green-500/30',
    medium: 'text-amber-400 bg-amber-900/30 border-amber-500/30',
    high: 'text-red-400 bg-red-900/30 border-red-500/30'
  };

  const riskLabels = {
    low: '低风险',
    medium: '中等风险',
    high: '高风险'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-block border-y-4 border-double border-amber-500/50 py-3 px-8">
          <h2 className="text-3xl font-bold text-gradient-amber brush-font">{result.title}</h2>
        </div>
      </div>

      {/* 当前时间干支 */}
      <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-6 rounded-xl border border-indigo-500/20">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-indigo-200">
          <span className="text-2xl">⏰</span> 当前时间干支
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/20 rounded-lg p-3 text-center">
            <div className="text-xs text-indigo-400 mb-1">年柱</div>
            <div className="text-lg font-bold text-indigo-100">{result.currentGanzhi.year}</div>
          </div>
          <div className="bg-black/20 rounded-lg p-3 text-center">
            <div className="text-xs text-indigo-400 mb-1">月柱</div>
            <div className="text-lg font-bold text-indigo-100">{result.currentGanzhi.month}</div>
          </div>
          <div className="bg-black/20 rounded-lg p-3 text-center">
            <div className="text-xs text-indigo-400 mb-1">日柱</div>
            <div className="text-lg font-bold text-indigo-100">{result.currentGanzhi.day}</div>
          </div>
          <div className="bg-black/20 rounded-lg p-3 text-center">
            <div className="text-xs text-indigo-400 mb-1">时柱</div>
            <div className="text-lg font-bold text-indigo-100">{result.currentGanzhi.hour}</div>
          </div>
        </div>
      </div>

      {/* 风险等级 */}
      <div className={`px-6 py-4 rounded-xl border-2 text-center ${riskColors[result.riskLevel]}`}>
        <div className="text-sm opacity-80 mb-1">风险等级</div>
        <div className="text-2xl font-bold">{riskLabels[result.riskLevel]}</div>
      </div>

      {/* 三明治分析 */}
      <div className="space-y-4">
        {/* 肯定 */}
        <div className="bg-gradient-to-br from-green-900/30 to-green-950/30 p-6 rounded-xl border border-green-500/20">
          <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-green-200">
            <span className="text-2xl">✅</span> 肯定：有利因素
          </h3>
          <p className="text-green-100 leading-relaxed text-justify">{result.analysis.positive}</p>
        </div>

        {/* 真话 */}
        <div className="bg-gradient-to-br from-red-900/30 to-red-950/30 p-6 rounded-xl border border-red-500/20">
          <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-red-200">
            <span className="text-2xl">⚠️</span> 真话：风险因素
          </h3>
          <p className="text-red-100 leading-relaxed text-justify">{result.analysis.negative}</p>
        </div>

        {/* 建议 */}
        <div className="bg-gradient-to-br from-amber-900/30 to-amber-950/30 p-6 rounded-xl border border-amber-500/20">
          <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-amber-200">
            <span className="text-2xl">🎯</span> 建议：行动指南
          </h3>
          <p className="text-amber-100 leading-relaxed text-justify">{result.analysis.advice}</p>
        </div>
      </div>

      {/* 吉方吉时 */}
      {(result.auspiciousDirection || result.auspiciousTime) && (
        <div className="bg-gradient-to-br from-purple-900/40 to-purple-950/90 p-6 rounded-xl border border-purple-500/30">
          <h3 className="font-bold text-xl mb-4 brush-font text-gradient-amber flex items-center gap-2">
            <span>🧭</span> 吉方吉时
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {result.auspiciousDirection && (
              <div className="text-center">
                <div className="text-sm text-purple-400 mb-2">吉方</div>
                <div className="text-2xl font-bold text-amber-300">{result.auspiciousDirection}</div>
              </div>
            )}
            {result.auspiciousTime && (
              <div className="text-center">
                <div className="text-sm text-purple-400 mb-2">吉时</div>
                <div className="text-2xl font-bold text-amber-300">{result.auspiciousTime}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 底部提示 */}
      <div className="bg-gradient-to-br from-purple-900/20 to-purple-950/40 p-4 rounded-xl border border-purple-500/10 text-center">
        <p className="text-sm text-purple-300">
          💡 命理仅供参考，实际决策请结合实际情况
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-center pt-6 border-t border-purple-500/20">
        <button
          onClick={onReset}
          className="text-purple-400 hover:text-amber-400 underline decoration-2 underline-offset-4 transition-colors font-medium"
        >
          返回首页
        </button>
      </div>
    </div>
  );
};

export default MoneyResultView;
