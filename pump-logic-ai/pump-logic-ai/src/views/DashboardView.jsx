import React, { useState } from 'react';
import { Activity, FileText, UploadCloud, ChevronRight, Upload, ShieldAlert, AlertTriangle, CheckCircle, Zap, Gauge, X, Clock } from 'lucide-react';

export default function DashboardView({ setCurrentPage, t }) {
  const [selectedInsight, setSelectedInsight] = useState(null);
  const isEn = t.sidebar.dashboard === "Main Dashboard";
  
  const reportCards = [
    {
      type: "DANGER",
      title: isEn ? "Rotor Imbalance" : "Rotor Imbalance (회전체 불평형)",
      desc: isEn 
        ? "Abnormal acceleration vibration amplitude threshold shock detected. Urgent inspection required."
        : "비정상 가속도 진동 진폭 임계 충격 검출. 긴급 점검 필요.",
      time: isEn ? "3h ago" : "3시간 전",
      metrics: { vib: "14.22 mm/s", temp: "72.4 °C", press: "12.5 bar", flow: "450 m³/h" }
    },
    {
      type: "WARNING",
      title: isEn ? "Cavitation Onset" : "Cavitation Onset (공동 현상)",
      desc: isEn
        ? "Suction pressure drop and impeller inlet fluid flow distortion detected at early stage."
        : "흡입 압력 강하 및 임펠러 입구 유체 유동 왜곡 초기 단계 검출.",
      time: isEn ? "6h ago" : "6시간 전",
      metrics: { vib: "1.21 mm/s", temp: "45.2 °C", press: "8.4 bar", flow: "310 m³/h" }
    },
    {
      type: "NORMAL",
      title: isEn ? "Stable State" : "Stable State (운전 안정화)",
      desc: isEn
        ? "Confirmed all spectrum peak energy levels are within stable baseline thresholds."
        : "모든 스펙트럼 Peak 에너지가 안정 임계값 내 분포 확인 완료.",
      time: isEn ? "9h ago" : "9시간 전",
      metrics: { vib: "0.85 mm/s", temp: "41.2 °C", press: "14.2 bar", flow: "520 m³/h" }
    }
  ];

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
          <p className="text-3xl font-black text-slate-100 mb-1 tracking-tight glow-cyan">94.2%</p>
          <p className="text-[11px] text-slate-400 font-medium break-words">{t.dashboard.normalEff}</p>
          <div className="w-full bg-slate-950/60 h-2 rounded-full mt-4.5 overflow-hidden border border-slate-800/80 p-0.5">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-500" 
              style={{ width: '94.2%' }}
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
            const isDanger = card.type === "DANGER";
            const isWarning = card.type === "WARNING";
            
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

            const badgeText = isDanger 
              ? t.dashboard.dangerStatus 
              : isWarning 
                ? t.dashboard.warningStatus 
                : t.dashboard.normalStatus;

            return (
              <div key={idx} className={`glass-panel rounded-3xl border-t-4 ${borderClass} p-5 shadow-lg relative overflow-hidden group transition-all h-auto flex flex-col justify-between`}>
                <div>
                  <div className="flex justify-between items-center mb-3 flex-wrap gap-1">
                    <span className={`${badgeClass} px-2 py-0.5 rounded text-[9px] font-black border flex items-center shadow-inner`}>
                      {isDanger && <ShieldAlert size={10} className="mr-1 animate-pulse" />}
                      {isWarning && <AlertTriangle size={10} className="mr-1" />}
                      {card.type}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{card.time}</span>
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
      <div className="mt-8 relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900/60 to-slate-950 p-6 flex flex-col sm:flex-row items-center justify-between shadow-2xl gap-y-4">
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

/* Beautiful AI Engine Cross Analysis Modal Component */
function AiInsightModal({ insight, onClose, isEn, t }) {
  if (!insight) return null;
  
  let timeRange = "";
  let duration = isEn 
    ? "3 hours of continuous real-time telemetry data stream" 
    : "3시간 동안 수집된 연속 실시간 계측 데이터 스트림";
  let explanation = "";
  let tagColor = "";
  let tagText = insight.type;
  let timelineStart = "";
  let timelineEnd = "";
  let keyAnomaly = "";
  
  if (insight.type === "DANGER") {
    tagColor = "bg-rose-500/15 text-rose-400 border border-rose-500/30";
    timeRange = isEn 
      ? "3 hours ago (collected between 11:00 and 14:00 KST)" 
      : "3시간 전 (11:00 ~ 14:00 KST 수집)";
    timelineStart = "11:00 KST";
    timelineEnd = "14:00 KST";
    keyAnomaly = isEn ? "Rotor Imbalance (2X Vibration Peak Anomaly)" : "회전체 불평형 (진동 가속도 2X 주파수 이상 변위)";
    explanation = isEn
      ? "AI Engine Cross-Fusion Analysis Verdict: A severe mass imbalance in the rotary shaft assembly has been diagnosed. Analyzing the 3-hour continuous real-time data stream collected 3 hours ago shows a sharp spike in the 2X vibration acceleration harmonic peak (14.22 mm/s, exceeding stable limit by 216%), highly synchronized with stator current phase asymmetry distortion (4.8%). Motor alignment error correction and shaft balancing are urgently required to prevent catastrophic failure."
      : "AI 엔진 교차 융합 진단 소견: 회전 기동부 질량 불균형(회전체 불평형)이 최종 감지되었습니다. 3시간 전에 수집된 3시간 동안의 연속 실시간 진동 가속도 데이터를 분석한 결과, 운전 주파수 2배 성분(2X)인 14.22 mm/s의 이상 충격 진폭이 3상 MCSA 고주파 전류의 비대칭 변위 왜곡(4.8%)과 고집적 동기화되어 확진되었습니다. 모터 풀림 및 커플링 바란싱 오차 수리 보정이 즉각적으로 필요합니다.";
  } else if (insight.type === "WARNING") {
    tagColor = "bg-amber-500/15 text-amber-400 border border-amber-500/30";
    timeRange = isEn 
      ? "6 hours ago (collected between 08:00 and 11:00 KST)" 
      : "6시간 전 (08:00 ~ 11:00 KST 수집)";
    timelineStart = "08:00 KST";
    timelineEnd = "11:00 KST";
    keyAnomaly = isEn ? "Impeller Cavitation (Pressure & Flow Distortion)" : "공동 현상 (압력 저하 및 유체 와류 초기 감지)";
    explanation = isEn
      ? "AI Engine Cross-Fusion Analysis Verdict: Early-stage Cavitation has been diagnosed inside the impeller chamber. Real-time telemetry analysis of the 3-hour period collected 6 hours ago indicates a steady suction pressure drop (8.4 bar) coupled with micro-amplitude current fluctuations, reflecting fluid bubble implosions. Checking the inlet valve opening and clearing suction strainer screens is recommended to restore laminar flow."
      : "AI 엔진 교차 융합 진단 소견: 임펠러 내부 기포 터짐 및 와류(공동 현상)가 초기 단계로 감지되었습니다. 6시간 전에 수집된 3시간 동안의 연속 실시간 흡입 측 진공 압력 저하(8.4 bar) 신호와 급격한 유량 유동 변동치가 융합 매트릭스에 기록되었습니다. 날개 표면 피로 부식을 예방하기 위해 흡입 파이프라인 이물질 청소 및 흡입구 밸브 전면 개방을 권장합니다.";
  } else {
    tagColor = "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
    timeRange = isEn 
      ? "9 hours ago (collected between 05:00 and 08:00 KST)" 
      : "9시간 전 (05:00 ~ 08:00 KST 수집)";
    timelineStart = "05:00 KST";
    timelineEnd = "08:00 KST";
    keyAnomaly = isEn ? "Normal Stable State (Perfect Phase Symmetry)" : "운전 안정화 (정상 기동 및 균등 주파수 대역)";
    explanation = isEn
      ? "AI Engine Cross-Fusion Analysis Verdict: The pump system is operating in a perfectly stable zone. Continuous real-time telemetry monitoring over the 3-hour period collected 9 hours ago confirms all spectral peaks, vibration RMS amplitudes (0.85 mm/s), and bearing stator currents are safely distributed well within standard baseline limits. No action is required."
      : "AI 엔진 교차 융합 진단 소견: 현재 펌프 예지보전 시스템은 최고 최적 효율 및 전원 공급 위상 균형 상태를 공학적으로 증명하고 있습니다. 9시간 전에 수집된 3시간 동안의 실시간 주파수 Peak 스펙트럼과 물리 신호를 전수 검증한 결과, 진동 진폭(0.85 mm/s) 및 권선 발열(41.2 °C) 분포도가 기초 설계 한계선 아래로 매우 균등하게 안착되었습니다. 특이사항이 없어 지속 운전이 가능합니다.";
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl shadow-2xl w-full max-w-2xl p-6.5 relative max-h-[90vh] overflow-y-auto font-sans animate-in slide-in-from-bottom-6 duration-300 light-theme-modal">
        {/* Decorative ambient spots */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-800/80 mb-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center text-cyan-400 shadow-inner">
              <Zap size={18} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight text-white leading-tight">
                {isEn ? "Real-Time 3-Hour Fusion Diagnosis Analyzer" : "실시간 3시간 융합 진단결과 분석기"}
              </h2>
              <p className="text-[9.5px] text-indigo-400 font-mono tracking-wider mt-0.5 font-bold uppercase">
                {isEn ? "• ACTIVE MULTI-SENSOR PREDICTIVE ANALYSIS" : "• 다중 센서 인공지능 교차 예지보전 연산 판정"}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-950/80 border border-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* 1. KEYPOINTS HIGHLIGHT BLOCK (Placed prominently at the top!) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-5 font-mono text-[10.5px]">
          <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-850/60 flex flex-col justify-between">
            <span className="text-[9px] text-slate-500 uppercase block font-semibold">{isEn ? "Diagnostic State" : "실시간 판정 등급"}</span>
            <span className={`px-2 py-0.5 rounded text-[9.5px] font-black border inline-block mt-2 text-center w-full ${tagColor}`}>
              {tagText}
            </span>
          </div>
          <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-850/60 flex flex-col justify-between">
            <span className="text-[9px] text-slate-500 uppercase block font-semibold">{isEn ? "Analysis Scope" : "데이터 수집 시간"}</span>
            <span className="text-white font-extrabold text-[10.5px] leading-tight block mt-2 text-center">
              {isEn ? "3 Hours Continuous" : "3시간 연속 계측"}
            </span>
          </div>
          <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-850/60 flex flex-col justify-between">
            <span className="text-[9px] text-slate-500 uppercase block font-semibold">{isEn ? "Analysis Window" : "진단 타겟 시점"}</span>
            <span className="text-white font-extrabold text-[10.5px] leading-tight block mt-2 text-center text-cyan-400">
              {insight.time} {isEn ? "Ago" : "전 수집"}
            </span>
          </div>
          <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-850/60 flex flex-col justify-between">
            <span className="text-[9px] text-slate-500 uppercase block font-semibold">{isEn ? "AI Consensus Rate" : "알고리즘 합의율"}</span>
            <span className="text-white font-extrabold text-[10.5px] leading-tight block mt-2 text-center text-indigo-400">
              96.4% Agreement
            </span>
          </div>
        </div>

        {/* 2. REAL-TIME DATA PIPELINE INTERACTIVE TIMELINE (Proves the 3 hours stream logic) */}
        <div className="bg-slate-950/40 border border-slate-850/50 rounded-2xl p-4 mb-5 font-sans">
          <span className="text-[9px] text-slate-500 uppercase font-black tracking-wider block mb-3">
            {isEn ? "Telemetry Acquisition Timeline" : "실시간 계측 데이터 파이프라인 수집 타임라인"}
          </span>
          <div className="relative flex items-center justify-between px-2 pt-2.5 pb-2 font-mono text-[9px]">
            {/* Timeline Line */}
            <div className="absolute left-6 right-6 top-[22px] h-0.5 bg-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-1000 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                style={{ width: '100%' }}
              ></div>
            </div>

            {/* Point 1 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_6px_rgba(6,182,212,0.6)]">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
              </div>
              <span className="text-slate-300 font-bold mt-1.5">{timelineStart}</span>
              <span className="text-[7.5px] text-slate-500 uppercase font-bold tracking-tight mt-0.5">{isEn ? "Start Capture" : "수집 시작"}</span>
            </div>

            {/* Point 2 (Streaming) */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center animate-pulse">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
              </div>
              <span className="text-slate-400 mt-1.5">1.5h Ingest</span>
              <span className="text-[7.5px] text-slate-500 uppercase font-bold tracking-tight mt-0.5">{isEn ? "Streaming Live" : "연속 스트리밍 유입"}</span>
            </div>

            {/* Point 3 */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-slate-900 border-2 border-emerald-400 flex items-center justify-center shadow-[0_0_6px_rgba(16,185,129,0.6)]">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
              </div>
              <span className="text-slate-300 font-bold mt-1.5">{timelineEnd}</span>
              <span className="text-[7.5px] text-slate-500 uppercase font-bold tracking-tight mt-0.5">{isEn ? "Verdict Output" : "AI 모델 진단완료"}</span>
            </div>
          </div>
        </div>

        {/* 3. TELEMETRY WAVEFORM PREVIEW */}
        <div className="bg-slate-950/70 border border-slate-850/80 rounded-2xl p-4 mb-5 overflow-hidden relative">
          <div className="absolute top-2.5 right-3 px-1.5 py-0.5 rounded text-[7.5px] font-black tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono uppercase">
            {isEn ? "Live Telemetry Waveform Preview" : "실시간 수집 계측 파형 동기화 프리뷰"}
          </div>
          <div className="text-[9.5px] font-bold text-slate-400 mb-3 flex items-center space-x-4">
            <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1.5 animate-ping"></span>{isEn ? "Vib Acceleration (Z-Axis)" : "Z축 진동 가속도 주파수"}</span>
            <span className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5"></span>{isEn ? "MCSA Phase Current (U/V/W)" : "MCSA 3상 전류 상변위"}</span>
          </div>
          
          <div className="h-20 w-full flex items-end justify-between relative overflow-hidden select-none mt-2">
            <svg viewBox="0 0 400 80" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Reference Grid */}
              <line x1="0" y1="15" x2="400" y2="15" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="0" y1="40" x2="400" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="0" y1="65" x2="400" y2="65" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />
              
              {/* Stator current wave (indigo) */}
              <path 
                d={insight.type === "DANGER" 
                  ? "M 0 40 Q 25 25, 50 40 T 100 40 T 150 40 T 200 35 T 250 45 T 300 25 T 350 55 T 400 40"
                  : "M 0 40 Q 25 30, 50 40 T 100 40 T 150 40 T 200 40 T 250 40 T 300 40 T 350 40 T 400 40"}
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="1.5" 
                strokeLinecap="round"
                className="opacity-70"
              />
              
              {/* Vibration wave (cyan) - showing 2x peak if danger */}
              <path 
                d={insight.type === "DANGER" 
                  ? "M 0 55 C 50 55, 75 10, 100 55 C 125 55, 150 5, 175 55 C 200 55, 225 3, 250 55 C 275 55, 300 0, 325 55 C 350 55, 375 60, 400 55" 
                  : "M 0 55 C 50 55, 75 40, 100 55 C 125 55, 150 45, 175 55 C 200 55, 225 43, 250 55 C 275 55, 300 40, 325 55 C 350 55, 375 50, 400 55"} 
                fill="none" 
                stroke="#06b6d4" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* 4. DETAILED ENGINEERING EXPLANATION (Placed at the bottom!) */}
        <div className="bg-slate-950/40 border border-slate-850/50 rounded-2xl p-4.5 mb-5 text-[11px] leading-relaxed font-sans">
          <div className="flex justify-between items-center mb-2.5 pb-1.5 border-b border-slate-900">
            <h4 className="text-[9.5px] text-slate-500 font-extrabold uppercase tracking-wider">
              {isEn ? "AI Engineering Verdict Analysis" : "AI 공학 알고리즘 세부 판정 소견"}
            </h4>
            <span className="text-[9px] text-cyan-400 font-mono font-bold tracking-tight">
              {isEn ? "Target Anomaly:" : "감지 결함군:"} {keyAnomaly}
            </span>
          </div>
          <p className="text-slate-200 text-justify leading-relaxed font-medium">
            {explanation}
          </p>
        </div>

        {/* Recommended Actions */}
        <div className="mb-5.5 text-[10.5px]">
          <h4 className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider mb-2">
            {isEn ? "Recommended Field SOP Countermeasures" : "계측 분석 결과 기반 현장 권장 정비 대책 (RAG SOP)"}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {insight.type === "DANGER" ? (
              <>
                <div className="bg-slate-950/30 border border-slate-850/40 rounded-xl p-2.5 flex items-start space-x-2">
                  <span className="text-rose-500 font-black">①</span>
                  <span className="text-slate-300 font-medium">{isEn ? "Calibrate dial-gauge concentricity within ±0.03mm." : "커플링 오차 다이얼게이지 기준 ±0.03mm 미세 얼라인먼트 보정."}</span>
                </div>
                <div className="bg-slate-950/30 border border-slate-850/40 rounded-xl p-2.5 flex items-start space-x-2">
                  <span className="text-rose-500 font-black">②</span>
                  <span className="text-slate-300 font-medium">{isEn ? "Re-tighten motor foundation anchorage torque." : "모터 베이스 플레이트 마운팅 앵커 볼트 규정 토크 재잠금."}</span>
                </div>
              </>
            ) : insight.type === "WARNING" ? (
              <>
                <div className="bg-slate-950/30 border border-slate-850/40 rounded-xl p-2.5 flex items-start space-x-2">
                  <span className="text-amber-500 font-black">①</span>
                  <span className="text-slate-300 font-medium">{isEn ? "Flush inlet pipe strainer screen of foreign particles." : "흡입 파이프 스크린 필터 내 오물 역세척 유체 정화 실시."}</span>
                </div>
                <div className="bg-slate-950/30 border border-slate-850/40 rounded-xl p-2.5 flex items-start space-x-2">
                  <span className="text-amber-500 font-black">②</span>
                  <span className="text-slate-300 font-medium">{isEn ? "Verify vacuum pressure limit gauge reliability." : "흡입 측 진공 게이지 지시값 한계 한도 교정 점검."}</span>
                </div>
              </>
            ) : (
              <>
                <div className="bg-slate-950/30 border border-slate-850/40 rounded-xl p-2.5 flex items-start space-x-2 col-span-2">
                  <span className="text-emerald-500 font-black">✔</span>
                  <span className="text-slate-300 font-medium">{isEn ? "Maintain automatic grease schedule and 24h PdM monitoring." : "현재 수립된 24시간 실시간 교차 PdM 연산 및 자동 그리스 일정을 정상 유지."}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-3 border-t border-slate-800/80">
          <button 
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black px-6 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:scale-[1.01]"
          >
            {isEn ? "Confirm Verification" : "실시간 진단 확인 완료"}
          </button>
        </div>
      </div>
    </div>
  );
}
