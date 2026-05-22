import React from 'react';
import { RefreshCw, CheckCircle } from 'lucide-react';

export default function LoadingView({ progress }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in print:hidden relative">
      
      {/* ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 blur-[90px] rounded-full pointer-events-none"></div>

      <div className="relative mb-12">
        {/* Hologram Circle Ring */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          
          {/* Outer rotating polygon */}
          <svg className="absolute inset-0 w-full h-full text-slate-800 animate-[spin_18s_linear_infinite]" viewBox="0 0 100 100">
            <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <polygon points="50 5 91 28 91 72 50 95 9 72 9 28" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
          </svg>
          
          {/* Progress Circular Arc */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(15, 23, 42, 0.6)" strokeWidth="3" />
            <circle 
              cx="50" cy="50" r="44" fill="none" 
              stroke="url(#progressGradient)" strokeWidth="5.5" 
              strokeDasharray={`${progress * 2.764} 276.4`}
              strokeLinecap="round"
              className="transition-all duration-300 drop-shadow-[0_0_10px_rgba(99,102,241,0.85)]"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Floating Percent Glass Badge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 rounded-full backdrop-blur-xl m-6 border border-slate-900 shadow-inner">
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-300 font-mono tracking-tighter">
              {progress}%
            </span>
            <span className="text-[8px] text-slate-500 font-mono font-bold tracking-widest mt-1 uppercase">ANALYZING</span>
          </div>
        </div>
      </div>

      <div className="text-center space-y-2 mb-10">
        <h2 className="text-base font-extrabold text-slate-100 tracking-wide flex items-center justify-center font-sans">
          <RefreshCw className="animate-spin mr-2.5 text-indigo-400" size={16} /> 
          <span>이중 계측 파형 매칭 및 의사결정 결합 분석 중...</span>
        </h2>
        <p className="text-slate-500 text-[10.5px] font-mono max-w-md mx-auto">
          시간-주파수 도메인 진동 특징량 + MCSA 3상 전류 고장 특징량 자동 융합 완료
        </p>
      </div>

      <div className="w-full max-w-xl bg-slate-950/70 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
        <div className="space-y-4">
          
          {/* Step 1 */}
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-300 ${
              progress > 30 
                ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400' 
                : 'bg-indigo-500/5 border-indigo-500/25 text-indigo-400 animate-pulse'
            }`}>
              {progress > 30 ? <CheckCircle size={14} /> : <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs font-bold ${progress > 30 ? 'text-slate-350 font-semibold' : 'text-indigo-400 font-extrabold'}`}>
                  진동(Vibration) 시간-주파수 도메인 특징량 연산
                </span>
                <span className={`text-[8.5px] font-mono font-black px-2 py-0.5 rounded ${
                  progress > 30 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-400'
                }`}>
                  {progress > 30 ? 'COMPLETED' : 'PROCESSING'}
                </span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-300 ${
              progress > 70 
                ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400' 
                : progress > 30 
                  ? 'bg-indigo-500/5 border-indigo-500/25 text-indigo-400 animate-pulse' 
                  : 'bg-slate-900/35 border-slate-900 text-slate-600'
            }`}>
              {progress > 70 ? <CheckCircle size={14} /> : (progress > 30 ? <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" /> : null)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs font-bold ${
                  progress > 70 ? 'text-slate-350 font-semibold' : progress > 30 ? 'text-indigo-400 font-extrabold' : 'text-slate-500'
                }`}>
                  전류(Current) 3상 고주파 편심력 스펙트럼(MCSA) 매칭
                </span>
                <span className={`text-[8.5px] font-mono font-black px-2 py-0.5 rounded ${
                  progress > 70 ? 'bg-emerald-500/10 text-emerald-400' : progress > 30 ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-900/40 text-slate-500'
                }`}>
                  {progress > 70 ? 'COMPLETED' : progress > 30 ? 'PROCESSING' : 'WAITING'}
                </span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-300 ${
              progress >= 100 
                ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400' 
                : progress > 70 
                  ? 'bg-indigo-500/5 border-indigo-500/25 text-indigo-400 animate-pulse' 
                  : 'bg-slate-900/35 border-slate-900 text-slate-600'
            }`}>
              {progress >= 100 ? <CheckCircle size={14} /> : (progress > 70 ? <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" /> : null)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs font-bold ${
                  progress >= 100 ? 'text-slate-350 font-semibold' : progress > 70 ? 'text-indigo-400 font-extrabold' : 'text-slate-500'
                }`}>
                  XGBoost 8대 모델 교차 의사결정 융합 & RAG 보고서 합성
                </span>
                <span className={`text-[8.5px] font-mono font-black px-2 py-0.5 rounded ${
                  progress >= 100 ? 'bg-emerald-500/10 text-emerald-400' : progress > 70 ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-900/40 text-slate-500'
                }`}>
                  {progress >= 100 ? 'COMPLETED' : progress > 70 ? 'PROCESSING' : 'WAITING'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic Metrics Grid */}
        <div className="mt-6 pt-5 border-t border-slate-900 grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-[8px] text-slate-500 font-mono mb-1 font-bold uppercase tracking-wider">DUAL PIPELINE</p>
            <p className="text-[11px] text-slate-300 font-mono font-extrabold">ACTIVE</p>
          </div>
          <div>
            <p className="text-[8px] text-slate-500 font-mono mb-1 font-bold uppercase tracking-wider">GPU LOAD</p>
            <p className="text-[11px] text-indigo-400 font-mono font-extrabold animate-pulse">88.5%</p>
          </div>
          <div>
            <p className="text-[8px] text-slate-500 font-mono mb-1 font-bold uppercase tracking-wider">FUSION ADAPTOR</p>
            <p className="text-[11px] text-slate-300 font-mono font-extrabold">OK</p>
          </div>
          <div>
            <p className="text-[8px] text-slate-500 font-mono mb-1 font-bold uppercase tracking-wider">COGNITIVE RATIO</p>
            <p className="text-[11px] text-cyan-400 font-mono font-extrabold">98.4%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
