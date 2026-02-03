import React from 'react';
import { LoveResult } from '../types';
import { Icons } from '../constants';

interface LoveResultViewProps {
  result: LoveResult;
  onReset: () => void;
}

const LoveResultView: React.FC<LoveResultViewProps> = ({ result, onReset }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-block border-y-4 border-double border-pink-500/50 py-3 px-8">
          <h2 className="text-3xl font-bold text-gradient-amber brush-font">{result.title}</h2>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 p-6 rounded-xl border border-pink-500/20">
        <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-pink-200">
          <span className="text-2xl">💕</span> 命理综述
        </h3>
        <p className="text-pink-100 leading-relaxed text-justify">{result.summary}</p>
      </div>

      {/* 夫妻宫星曜 */}
      <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-6 rounded-xl border border-purple-500/20">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-purple-200">
          <span className="text-2xl">⭐</span> 夫妻宫星曜
        </h3>

        <div className="space-y-4">
          {/* 主星 */}
          {result.spousePalace.majorStars.length > 0 && (
            <div>
              <div className="text-sm text-purple-400 mb-2 font-bold">主星</div>
              <div className="flex flex-wrap gap-2">
                {result.spousePalace.majorStars.map((star: any, i) => (
                  <span key={i} className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-lg text-sm font-bold">
                    {star.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 吉星 */}
          {result.spousePalace.auspiciousStars.length > 0 && (
            <div>
              <div className="text-sm text-green-400 mb-2 font-bold">吉星</div>
              <div className="flex flex-wrap gap-2">
                {result.spousePalace.auspiciousStars.map((star, i) => (
                  <span key={i} className="px-3 py-1.5 bg-green-900/50 border border-green-500/30 text-green-200 rounded-lg text-sm">
                    {star}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 煞星 */}
          {result.spousePalace.omniousStars.length > 0 && (
            <div>
              <div className="text-sm text-red-400 mb-2 font-bold">煞星</div>
              <div className="flex flex-wrap gap-2">
                {result.spousePalace.omniousStars.map((star, i) => (
                  <span key={i} className="px-3 py-1.5 bg-red-900/50 border border-red-500/30 text-red-200 rounded-lg text-sm">
                    {star}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 四化 */}
          {result.spousePalace.transformations.length > 0 && (
            <div>
              <div className="text-sm text-amber-400 mb-2 font-bold">四化</div>
              <div className="flex flex-wrap gap-2">
                {result.spousePalace.transformations.map((trans, i) => (
                  <span key={i} className="px-3 py-1.5 bg-amber-900/50 border border-amber-500/30 text-amber-200 rounded-lg text-sm">
                    {trans}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 流年分析 */}
      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-6 rounded-xl border border-blue-500/20">
        <h3 className="font-bold text-xl mb-3 flex items-center gap-2 text-blue-200">
          <span className="text-2xl">📅</span> {result.yearlyAnalysis.year}年流年
        </h3>
        <div className="text-blue-100 leading-relaxed">
          大限：{result.yearlyAnalysis.decadal || '未知'} （{result.yearlyAnalysis.age || '?'}岁）
        </div>
      </div>

      {/* 大师建议 */}
      <div className="bg-gradient-to-br from-amber-900/40 to-amber-950/90 text-amber-100 p-6 rounded-xl shadow-2xl relative overflow-hidden border border-amber-500/30">
        <div className="absolute top-2 right-2 p-3 opacity-10">
          <Icons.Sparkles />
        </div>
        <h3 className="font-bold text-2xl mb-4 brush-font text-gradient-amber flex items-center gap-2">
          <span>🎯</span> 大师锦囊
        </h3>
        <div className="space-y-3">
          {result.advice.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-amber-500 text-amber-950 rounded-full flex items-center justify-center font-bold text-sm">
                {index + 1}
              </span>
              <p className="text-amber-100 leading-relaxed flex-1">{item}</p>
            </div>
          ))}
        </div>
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

export default LoveResultView;
