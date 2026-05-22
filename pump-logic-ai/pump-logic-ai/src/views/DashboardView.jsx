import React, { useState, useMemo, useEffect } from 'react';
import { Activity, FileText, UploadCloud, ChevronRight, Upload, ShieldAlert, AlertTriangle, CheckCircle, Zap, Gauge, X, Clock } from 'lucide-react';
import { generateReportsForDay } from '../reportUtils';

export default function DashboardView({ setCurrentPage, t }) {
  const [selectedInsight, setSelectedInsight] = useState(null);
  const isEn = t.sidebar.dashboard === "Main Dashboard";

  // 실시간으로 미세하게 변동하는 효율값 상태 (93.80% ~ 94.60% 사이 소수점 두 자리 변동)
  const [efficiency, setEfficiency] = useState(94.25);

  useEffect(() => {
    const interval = setInterval(() => {
      setEfficiency(prev => {
        const delta = (Math.random() - 0.5) * 0.08; // -0.04% ~ +0.04% 미세 흔들림
        let next = prev + delta;
        if (next < 93.80) next = 93.80;
        if (next > 94.60) next = 94.60;
        return parseFloat(next.toFixed(2)); // 소수점 두 자리로 정밀 표기
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // 오늘의 8개 리포트 중 처음 3개를 대시보드 카드로 표시
  const reportCards = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return generateReportsForDay(today, isEn).slice(0, 3);
  }, [isEn]);

  return (
    <div className="space-y-6 animate-fade-in print:hidden">
      {/* Top Stats - Futuristic glass dashboard cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        
        {/* Card 1: 24h Monitoring with Neon Glow */}
        <div className="glass-panel glass-panel-hover rounded-3xl p-6 relative overflow-hidden group h-auto">
          {/* Animated decorative glow behind */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
          
          <div className="absolute top-4 right-4 opacity-10 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
            <Activity size={56} />
          </div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-slate-400 font-bold tracking-wide text-xs uppercase">{t.dashboard.efficiency24h}</h3>
            <span className="px-2 py-0.5 text-[9px] font-black tracking-wider rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shadow-[0_0_8px_rgba(16,185,129,0.15)] flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-ping"></span>
              {t.dashboard.live}
            </span>
          </div>
          <p className="text-3xl font-black text-slate-100 mb-1 tracking-tight glow-cyan">{efficiency.toFixed(2)}%</p>
          <p className="text-[11px] text-slate-400 font-medium break-words">{t.dashboard.normalEff}</p>
          <div className="w-full bg-slate-950/60 h-2 rounded-full mt-4.5 overflow-hidden border border-slate-800/80 p-0.5">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-500" 
              style={{ width: `${efficiency}%` }}
            ></div>
          </div>
        </div>

        {/* Card 2: Diagnostics Archive */}
        <div className="glass-panel glass-panel-hover rounded-3xl p-6 relative overflow-hidden group h-auto">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
          
          <div className="absolute top-4 right-4 opacity-10 text-blue-400 group-hover:scale-110 transition-transform duration-300">
            <FileText size={56} />
          </div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="text-slate-400 font-bold tracking-wide text-xs uppercase">{t.dashboard.anomalyReports}</h3>
            <span className="px-2 py-0.5 text-[9px] font-black tracking-wider rounded bg-blue-500/15 text-blue-400 border border-blue-500/25">
              ANALYTICS
            </span>
          </div>
          <div className="flex items-baseline space-x-1.5 mb-1 flex-wrap">
            <p className="text-3xl font-black text-slate-100 tracking-tight glow-indigo">3</p>
            <p className="text-[11px] text-slate-400 font-medium break-words">
              {isEn ? "alerts detected (last 24h)" : "건의 감지 경보 (최근 24h)"}
            </p>
          </div>
          <button 
            onClick={() => setCurrentPage('reports')} 
            className="mt-4 text-xs text-cyan-400 hover:text-cyan-300 font-black flex items-center transition-colors tracking-wider group/btn"
          >
            {t.dashboard.viewAllReports} 
            <ChevronRight size={14} className="ml-0.5 transform group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Card 3: Indigo Gradient Banner Action */}
        <div className="glass-panel rounded-3xl p-6 relative overflow-hidden group border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.06)] hover:border-indigo-500/40 transition-colors h-auto">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl"></div>
          
          <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
            <h3 className="text-slate-400 font-bold tracking-wide text-xs uppercase">{t.dashboard.fusionModule}</h3>
            <span className="px-2 py-0.5 text-[9px] font-black tracking-wider rounded bg-indigo-500/25 text-indigo-300 border border-indigo-500/30">
              DUAL FUSION
            </span>
          </div>
          <p className="text-[11px] text-slate-350 mb-4.5 font-sans leading-relaxed break-words">
            {t.dashboard.fusionDesc}
          </p>
          <button 
            onClick={() => setCurrentPage('upload')}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-black py-2.5 rounded-xl transition-all duration-300 shadow-md shadow-indigo-900/40 flex items-center justify-center space-x-1.5 transform hover:scale-[1.02]"
          >
            <Upload size={13} />
            <span>{t.dashboard.uploadNewDataset}</span>
          </button>
        </div>
      </div>

      {/* Recent Reports Section */}
      <div className="pt-4 font-sans">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-base font-extrabold text-slate-100 tracking-wide flex items-center">
            <FileText className="mr-2 text-indigo-400" size={18} />
            <span>{t.dashboard.recentReports}</span>
          </h2>
          <button 
            onClick={() => setCurrentPage('reports')} 
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors font-bold"
          >
            {t.dashboard.viewAllArchive}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reportCards.map((card, idx) => {
            const isDanger  = card.statusType === "DANGER";
            const isWarning = card.statusType === "WARNING";

            const borderClass = isDanger
              ? "border-t-rose-500 hover:border-rose-500/30"
              : isWarning
                ? "border-t-amber-500 hover:border-amber-500/30"
                : "border-t-emerald-500 hover:border-emerald-500/30";

            const badgeClass = isDanger
              ? "bg-rose-500/15 text-rose-400 border-rose-500/25"
              : isWarning
                ? "bg-amber-500/15 text-amber-400 border-amber-500/25"
                : "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";

            const glowClass = isDanger
              ? "group-hover:text-rose-400"
              : isWarning
                ? "group-hover:text-amber-400"
                : "group-hover:text-emerald-400";

            const colorClass = isDanger
              ? "text-rose-400 font-bold"
              : isWarning
                ? "text-amber-400 font-bold"
                : "text-emerald-400 font-bold";

            return (
              <div key={idx} className={`glass-panel rounded-3xl border-t-4 ${borderClass} p-5 shadow-lg relative overflow-hidden group transition-all h-auto flex flex-col justify-between`}>
                <div>
                  <div className="flex justify-between items-center mb-3 flex-wrap gap-1">
                    <span className={`${badgeClass} px-2 py-0.5 rounded text-[9px] font-black border flex items-center shadow-inner`}>
                      {isDanger  && <ShieldAlert size={10} className="mr-1 animate-pulse" />}
                      {isWarning && <AlertTriangle size={10} className="mr-1" />}
                      {card.statusLabel}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{card.date}</span>
                  </div>
                  <h3 className={`font-extrabold text-slate-100 text-sm mb-1 ${glowClass} transition-colors break-words`}>
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-450 mb-4 leading-relaxed break-words font-medium">
                    {card.desc}
                  </p>
                </div>

                <div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-350 bg-slate-950/40 p-3 rounded-xl border border-slate-900 mb-4 leading-normal">
                    <div>VIB_X: <span className={isDanger ? colorClass : ""}>{card.metrics.vib}</span></div>
                    <div>TEMP: {card.metrics.temp}</div>
                    <div>PRESS: <span className={isWarning ? colorClass : ""}>{card.metrics.press}</span></div>
                    <div>FLOW: {card.metrics.flow}</div>
                  </div>
                  <button
                    onClick={() => setSelectedInsight(card)}
                    className="w-full py-2 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-850 hover:text-white transition-colors flex justify-center items-center space-x-1"
                  >
                    <Zap size={12} className="text-cyan-400 animate-pulse" />
                    <span>{t.dashboard.aiInsight}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Equipment Profile Banner */}
      <div className="mt-8 relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900/60 to-slate-950 p-6 flex flex-col sm:flex-row items-center justify-between shadow-2xl gap-y-4 keep-dark">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.04] mix-blend-overlay"></div>
        
        <div className="relative z-10 flex items-center space-x-4.5 font-sans">
          <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <Gauge className="text-cyan-400 animate-spin [animation-duration:15s]" size={24} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white tracking-wide">
              {isEn ? "Centrifugal Pump Alpha-7 Profile" : "원심펌프 Alpha-7 설비 프로필"}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              <span className="flex items-center text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5 animate-ping"></span>
                {t.dashboard.systemOnline}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">CODE: PMP-A7-001</span>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-left sm:text-right font-sans">
          <p className="text-[9px] text-slate-500 font-mono mb-1.5 uppercase tracking-widest">{t.dashboard.lastMaintenance}</p>
          <p className="text-xs text-slate-200 font-bold bg-slate-950/60 px-4 py-2 rounded-xl border border-slate-900/80 shadow-inner">
            2026-05-22 09:00 KST
          </p>
        </div>
      </div>

      {/* AI Cross-Fusion Insight Modal */}
      {selectedInsight && (
        <AiInsightModal 
          insight={selectedInsight} 
          onClose={() => setSelectedInsight(null)} 
          isEn={isEn} 
          t={t}
        />
      )}
    </div>
  );
}

/* AI Engine Cross Analysis Modal — reads data from the report object */
function AiInsightModal({ insight, onClose, isEn, t }) {
  if (!insight) return null;

  const isDanger  = insight.statusType === 'DANGER';
  const isWarning = insight.statusType === 'WARNING';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl shadow-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto font-sans animate-in slide-in-from-bottom-6 duration-300 light-theme-modal" onClick={e => e.stopPropagation()}>
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-slate-800/80 mb-5">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center text-cyan-400 shadow-inner shrink-0">
              <Zap size={18} className="animate-pulse" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-black tracking-tight text-white leading-snug break-words">{insight.title}</h2>
              <p className="text-[9.5px] text-indigo-400 font-mono tracking-wider mt-0.5 font-bold uppercase">
                {isEn ? '• ACTIVE MULTI-SENSOR PREDICTIVE ANALYSIS' : '• 다중 센서 인공지능 교차 예지보전 연산 판정'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-950/80 border border-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0 ml-3">
            <X size={15} />
          </button>
        </div>

        {/* Keypoints */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-5 font-mono text-[10.5px]">
          <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-850/60 flex flex-col justify-between">
            <span className="text-[9px] text-slate-500 uppercase block font-semibold">{isEn ? 'Diagnostic State' : '실시간 판정 등급'}</span>
            <span className={`px-2 py-0.5 rounded text-[9.5px] font-black border inline-block mt-2 text-center w-full ${insight.tagColor}`}>
              {insight.statusLabel}
            </span>
          </div>
          <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-850/60 flex flex-col justify-between">
            <span className="text-[9px] text-slate-500 uppercase block font-semibold">{isEn ? 'Analysis Scope' : '데이터 수집 시간'}</span>
            <span className="text-white font-extrabold text-[10.5px] leading-tight block mt-2 text-center">{isEn ? '3 Hours Continuous' : '3시간 연속 계측'}</span>
          </div>
          <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-850/60 flex flex-col justify-between">
            <span className="text-[9px] text-slate-500 uppercase block font-semibold">{isEn ? 'Collected At' : '진단 타겟 시점'}</span>
            <span className="text-white font-extrabold text-[10.5px] leading-tight block mt-2 text-center text-cyan-400">{insight.timelineEnd}</span>
          </div>
          <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-850/60 flex flex-col justify-between">
            <span className="text-[9px] text-slate-500 uppercase block font-semibold">{isEn ? 'AI Consensus Rate' : '알고리즘 합의율'}</span>
            <span className="text-white font-extrabold text-[10.5px] leading-tight block mt-2 text-center text-indigo-400">96.4% Agreement</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-slate-950/40 border border-slate-850/50 rounded-2xl p-4 mb-5 font-sans">
          <span className="text-[9px] text-slate-500 uppercase font-black tracking-wider block mb-3">{isEn ? 'Telemetry Acquisition Timeline' : '실시간 계측 데이터 파이프라인 수집 타임라인'}</span>
          <div className="relative flex items-center justify-between px-2 pt-2.5 pb-2 font-mono text-[9px]">
            <div className="absolute left-6 right-6 top-[22px] h-0.5 bg-slate-800">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 w-full shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
            </div>
            {[
              { label: insight.timelineStart, sub: isEn ? 'Start Capture' : '수집 시작', cls: 'border-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.6)]', dot: 'bg-cyan-400' },
              { label: '1.5h Ingest', sub: isEn ? 'Streaming Live' : '연속 스트리밍 유입', cls: 'border-indigo-500', dot: 'bg-indigo-500 animate-pulse' },
              { label: insight.timelineEnd, sub: isEn ? 'Verdict Output' : 'AI 모델 진단완료', cls: 'border-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]', dot: 'bg-emerald-400 animate-ping' },
            ].map((pt, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full bg-slate-900 border-2 ${pt.cls} flex items-center justify-center`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${pt.dot}`} />
                </div>
                <span className="text-slate-300 font-bold mt-1.5">{pt.label}</span>
                <span className="text-[7.5px] text-slate-500 uppercase font-bold tracking-tight mt-0.5">{pt.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Waveform preview */}
        <div className="bg-slate-950/70 border border-slate-850/80 rounded-2xl p-4 mb-5 overflow-hidden relative">
          <div className="absolute top-2.5 right-3 px-1.5 py-0.5 rounded text-[7.5px] font-black tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono uppercase">
            {isEn ? 'Live Telemetry Waveform Preview' : '실시간 수집 계측 파형 동기화 프리뷰'}
          </div>
          <div className="text-[9.5px] font-bold text-slate-400 mb-3 flex items-center space-x-4">
            <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1.5 animate-ping" />{isEn ? 'Vib Acceleration (Z-Axis)' : 'Z축 진동 가속도 주파수'}</span>
            <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5" />{isEn ? 'MCSA Phase Current (U/V/W)' : 'MCSA 3상 전류 상변위'}</span>
          </div>
          <div className="h-20 w-full relative overflow-hidden">
            <svg viewBox="0 0 400 80" className="w-full h-full overflow-visible">
              <path d={isDanger ? "M 0 40 Q 25 25, 50 40 T 100 40 T 150 40 T 200 35 T 250 45 T 300 25 T 350 55 T 400 40" : "M 0 40 Q 25 30, 50 40 T 100 40 T 150 40 T 200 40 T 250 40 T 300 40 T 350 40 T 400 40"} fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" className="opacity-70" />
              <path d={isDanger ? "M 0 55 C 50 55, 75 10, 100 55 C 125 55, 150 5, 175 55 C 200 55, 225 3, 250 55 C 275 55, 300 0, 325 55 C 350 55, 375 60, 400 55" : isWarning ? "M 0 55 C 50 55, 75 28, 100 55 C 125 55, 150 32, 175 55 C 200 55, 225 30, 250 55 C 275 55, 300 28, 325 55 C 350 55, 375 42, 400 55" : "M 0 55 C 50 55, 75 40, 100 55 C 125 55, 150 45, 175 55 C 200 55, 225 43, 250 55 C 275 55, 300 40, 325 55 C 350 55, 375 50, 400 55"} fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Engineering explanation */}
        <div className="bg-slate-950/40 border border-slate-850/50 rounded-2xl p-4.5 mb-5 text-[11px] leading-relaxed font-sans">
          <div className="flex justify-between items-center mb-2.5 pb-1.5 border-b border-slate-900 gap-3">
            <h4 className="text-[9.5px] text-slate-500 font-extrabold uppercase tracking-wider shrink-0">{isEn ? 'AI Engineering Verdict Analysis' : 'AI 공학 알고리즘 세부 판정 소견'}</h4>
            <span className="text-[9px] text-cyan-400 font-mono font-bold tracking-tight text-right">{isEn ? 'Anomaly:' : '감지 결함군:'} {insight.keyAnomaly}</span>
          </div>
          <p className="text-slate-200 text-justify leading-relaxed font-medium">{insight.explanation}</p>
        </div>

        {/* Recommended actions */}
        <div className="mb-5.5 text-[10.5px]">
          <h4 className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider mb-2">{isEn ? 'Recommended Field SOP Countermeasures' : '계측 분석 결과 기반 현장 권장 정비 대책 (RAG SOP)'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {(insight.actions || []).map((action, i) => {
              const numColor = isDanger ? 'text-rose-500' : isWarning ? 'text-amber-500' : 'text-emerald-500';
              return (
                <div key={i} className="bg-slate-950/30 border border-slate-850/40 rounded-xl p-2.5 flex items-start space-x-2">
                  <span className={`${numColor} font-black shrink-0`}>{insight.statusType === 'NORMAL' ? '✔' : `${i + 1}`}</span>
                  <span className="text-slate-300 font-medium">{action}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800/80">
          <button onClick={onClose} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black px-6 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:scale-[1.01]">
            {isEn ? 'Confirm Verification' : '실시간 진단 확인 완료'}
          </button>
        </div>
      </div>
    </div>
  );
}

