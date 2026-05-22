import React from 'react';
import { Activity, Printer, CheckCircle, ShieldAlert } from 'lucide-react';

export default function DetailView({ analysisResult, setWorkOrderOpen, t }) {
  const isDanger = analysisResult ? analysisResult.risk_level === 'DANGER' : true;
  const isWarning = analysisResult ? analysisResult.risk_level === 'WARNING' : false;
  
  const riskTitle = isDanger 
    ? (t.dashboard?.dangerStatus || "위험") 
    : isWarning 
      ? (t.dashboard?.warningStatus || "주의") 
      : (t.dashboard?.normalStatus || "정상");
      
  const riskColorClass = isDanger ? "text-rose-400" : isWarning ? "text-amber-400" : "text-emerald-400";
  const riskBadgeClass = isDanger ? "bg-rose-500/20 text-rose-400 border-rose-500/35" : isWarning ? "bg-amber-500/20 text-amber-400 border-amber-500/35" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/35";
  const riskBadgeText = isDanger ? "CRITICAL ANOMALY DETECTED" : isWarning ? "WARNING SYSTEM ACTIVE" : "STABLE SYSTEM STATUS";
  
  const rootCause = analysisResult ? analysisResult.root_cause : "축정렬불량 의심 (융합분석)";
  const riskRationale = analysisResult ? analysisResult.risk_rationale : "최근 업로드된 진동 및 전류 센서 데이터에서 고주파 편심 왜곡과 가속도 급상승이 교차 검출되었습니다.";
  
  const recommendedActions = analysisResult ? analysisResult.recommended_actions : [
    "다이얼 게이지 계측: 레이저 정렬계를 활용해 커플링 얼라인먼트를 ±0.03mm 이내로 조절하십시오.",
    "베어링 상태 검사: 베어링 하우징 오버홀 후 구름 요소 피로 균열 및 윤활 그리스 잔량 검사.",
    "볼트 조임 점검: 베이스 프레임 기초 앵커 볼트의 이완 상태 확인 및 규격 토크 재잠금 보강."
  ];

  const handleAckClick = () => {
    const msg = t.lang === 'en' 
      ? "Alarm acknowledgment (ACK) signature completed. Synchronizing to the maintenance notification network." 
      : "경보 접수(ACK) 서명이 완료되었습니다. 보전팀 알림망에 수신 동기화 처리됩니다.";
    alert(msg);
  };

  return (
    <div className="space-y-6 animate-fade-in print:hidden font-sans pb-10">
      {/* 1. Header Card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-950/40 border border-slate-900 p-6 rounded-3xl shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        <div className="mb-4 md:mb-0 flex-1 min-w-0 mr-6">
          <div className="flex items-center space-x-2.5 mb-2 text-xs flex-wrap gap-y-1">
            <span className={`${riskBadgeClass} border font-black px-2.5 py-0.5 rounded-full text-[9px] ${isDanger ? 'animate-pulse' : ''}`}>
              {riskBadgeText}
            </span>
            <span className="text-slate-500 font-mono">CODE: WO-2026-05-22-001</span>
          </div>
          <h1 className="text-xl font-black text-slate-100 mb-2.5 break-words">{t.detail.detailTitle}</h1>
          <div className="flex flex-wrap items-center text-[10.5px] gap-x-6 gap-y-1 text-slate-400">
            <span>{t.detail.riskLevel}: <strong className={`${riskColorClass} font-extrabold`}>{riskTitle}</strong></span>
            <span className="font-mono">{t.detail.completeAnal}: 2026.05.22 16:55 KST</span>
          </div>
        </div>
        
        {/* Actions Buttons */}
        <div className="flex space-x-3 w-full md:w-auto shrink-0 z-10">
          <button 
            onClick={() => setWorkOrderOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl transition-all font-black text-xs shadow-md shadow-indigo-900/35 transform hover:scale-[1.02]"
          >
            <Printer size={13} /> 
            <span>{t.diagnostics.diagnoseWorkOrderBtn}</span>
          </button>
          <button 
            onClick={handleAckClick}
            className="flex-1 md:flex-none flex items-center justify-center space-x-1.5 bg-slate-900/60 hover:bg-slate-900 text-slate-200 px-4 py-3 rounded-xl transition-colors border border-slate-800/80 font-bold text-xs"
          >
            <CheckCircle size={13} className="text-emerald-400" /> 
            <span>{t.detail.ackBtn}</span>
          </button>
        </div>
      </div>

      {/* 2. Keypoints Summary at the Top */}
      <div className="glass-panel rounded-3xl p-6 shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30"></div>
        <h3 className="text-xs font-black text-slate-200 mb-4 flex items-center border-b border-slate-900 pb-3 uppercase tracking-wide">
          <Activity className="mr-2 text-cyan-400" size={15} /> 
          <span>{t.detail.keypoints}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Keypoint 1: Risk Level */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-900 shadow-inner flex flex-col justify-between h-auto">
            <p className="text-[10px] text-slate-500 font-mono font-bold tracking-wider mb-2">{t.detail.riskLevel}</p>
            <span className={`${riskBadgeClass} border font-black px-2.5 py-1.5 rounded-xl text-center text-[10px] ${isDanger ? 'animate-pulse' : ''} inline-block w-full`}>
              {riskTitle}
            </span>
          </div>
          {/* Keypoint 2: Root Cause */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-900 shadow-inner flex flex-col justify-between h-auto">
            <p className="text-[10px] text-slate-500 font-mono font-bold tracking-wider mb-2">{t.diagnostics.diagnosedCause}</p>
            <p className="text-xs font-extrabold text-slate-100 break-words leading-relaxed">{rootCause}</p>
          </div>
          {/* Keypoint 3: Confidence / Reliability */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-900 shadow-inner flex flex-col justify-between h-auto">
            <p className="text-[10px] text-slate-500 font-mono font-bold tracking-wider mb-2">{t.detail.confidence}</p>
            <div className="flex items-center justify-between">
              <span className="text-base font-black text-rose-400 glow-rose">96.4%</span>
              <span className="text-[10px] font-black text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded bg-emerald-500/10">EXCELLENT</span>
            </div>
          </div>
          {/* Keypoint 4: Model Version & Info */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-900 shadow-inner flex flex-col justify-between h-auto">
            <p className="text-[10px] text-slate-500 font-mono font-bold tracking-wider mb-2">{t.detail.modelVer}</p>
            <div>
              <p className="text-xs font-mono font-black text-slate-300">FUSION-V2.0</p>
              <p className="text-[9px] text-slate-500 mt-1 font-mono">PdM RAG Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detailed Breakdown & Recommended Actions at the Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detailed Explanation */}
        <div className="glass-panel rounded-3xl p-6 shadow-2xl flex flex-col h-auto">
          <h3 className="text-xs font-black text-slate-200 mb-4 flex items-center border-b border-slate-900 pb-3 uppercase tracking-wide">
            <Activity className="mr-2 text-cyan-400" size={15} /> 
            <span>{t.detail.detailedDesc}</span>
          </h3>
          <p className="text-slate-300 leading-relaxed text-xs break-words font-medium h-auto whitespace-pre-line">
            {riskRationale}
          </p>
        </div>

        {/* Recommended Actions */}
        <div className="glass-panel rounded-3xl p-6 shadow-2xl flex flex-col h-auto">
          <h3 className="text-xs font-black text-slate-200 mb-4 flex items-center border-b border-slate-900 pb-3 uppercase tracking-wide">
            <ShieldAlert className="mr-2 text-amber-400" size={15} /> 
            <span>{t.detail.recommendedActionsTitle}</span>
          </h3>
          <ol className="space-y-3.5 text-xs text-slate-350 list-decimal list-inside leading-relaxed font-sans">
            {recommendedActions.map((action, index) => {
              const parts = action.split(":");
              return (
                <li key={index} className="pl-1 pb-3 border-b border-slate-900/50 leading-relaxed font-medium">
                  <strong className="text-slate-100">{parts[0]}:</strong>
                  <span>{parts[1] || ""}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
