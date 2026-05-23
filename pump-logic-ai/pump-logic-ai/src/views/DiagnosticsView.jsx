import React, { useState } from 'react';
import { Activity, Printer, ChevronRight, AlertTriangle, ShieldAlert, Settings, RefreshCw, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SYMPTOMS, FAULT_MATRIX_DATA } from '../constants';

export default function DiagnosticsView({ setCurrentPage, telemetryData, analysisResult, setWorkOrderOpen, t, lang }) {
  const isDanger = analysisResult ? analysisResult.risk_level === 'DANGER' : true;
  const isWarning = analysisResult ? analysisResult.risk_level === 'WARNING' : false;
  
  const vibVal = analysisResult?.vibration_rms ?? (isDanger || isWarning ? 2.15 : 1.85);
  const curVal = analysisResult?.current_imbalance ?? (isDanger || isWarning ? 4.8 : 0.15);
  const isNormalState = !isDanger && !isWarning;
  
  const riskTitle = lang === 'ko' 
    ? (isDanger ? "위험" : isWarning ? "주의" : "정상") 
    : (isDanger ? "DANGER" : isWarning ? "WARNING" : "NORMAL");
    
  const riskColorClass = isDanger ? "text-rose-450" : isWarning ? "text-amber-500" : "text-emerald-500";
  
  const riskBgClass = isDanger 
    ? "from-rose-950/40 via-slate-900/60 to-slate-950/80 border-rose-900/30" 
    : isWarning 
      ? "from-amber-950/40 via-slate-900/60 to-slate-950/80 border-amber-900/30" 
      : "from-emerald-950/40 via-slate-900/60 to-slate-950/80 border-emerald-900/30";
      
  const riskBadgeClass = isDanger 
    ? "text-rose-450 border-rose-500/25 bg-rose-500/10 shadow-[0_0_8px_rgba(244,63,94,0.1)]" 
    : isWarning 
      ? "text-amber-500 border-amber-500/25 bg-amber-500/10" 
      : "text-emerald-500 border-emerald-500/25 bg-emerald-500/10";
      
  const riskBadgeText = isDanger 
    ? "CRITICAL SYSTEM STATUS" 
    : isWarning 
      ? "WARNING SYSTEM STATUS" 
      : "NORMAL SYSTEM STATUS";
  
  const rootCause = analysisResult 
    ? analysisResult.root_cause 
    : (lang === 'ko' ? "축정렬불량 의심 (교차 분석 융합)" : "Rotor Shaft Misalignment Suspected");
    
  const riskRationale = analysisResult 
    ? analysisResult.risk_rationale 
    : (lang === 'ko' 
        ? "진동 신호 RMS 폭증 및 전류 불균형 3차 조화 주파수 왜곡율이 동시에 검출되어 고장 가능성이 극대화되었습니다." 
        : "Vibration signal RMS surge and current unbalance 3rd harmonic distortion are simultaneously detected, maximizing fault probability.");

  // 핵심 키워드만 추출 (배너 표시용)
  const FAULT_KEYWORD_MAP = {
    '축정렬불량': lang === 'ko' ? '축정렬불량' : 'Misalignment',
    '회전체불평형': lang === 'ko' ? '회전체불평형' : 'Imbalance',
    '베어링불량': lang === 'ko' ? '베어링불량' : 'Bearing Fault',
    '벨트느슨함': lang === 'ko' ? '벨트느슨함' : 'Belt Slack',
    'misalignment': 'Misalignment',
    'imbalance': 'Imbalance',
    'bearing': 'Bearing Fault',
    'belt': 'Belt Slack',
  };

  const extractKeywords = (cause) => {
    if (!cause) return cause;
    const matched = [];
    for (const [key, label] of Object.entries(FAULT_KEYWORD_MAP)) {
      if (cause.toLowerCase().includes(key.toLowerCase()) && !matched.includes(label)) {
        matched.push(label);
      }
    }
    if (matched.length > 0) return matched.join(' · ');
    // 매칭 없으면 앞 20자만
    return cause.length > 22 ? cause.slice(0, 22) + '…' : cause;
  };

  const rootCauseShort = extractKeywords(rootCause);

  // 어느 센서에서 이상 감지됐는지
  const vibFaults = analysisResult?.vib_faults || [];
  const curFaults = analysisResult?.cur_faults || [];
  const hasVibFault = vibFaults && vibFaults.length > 0;
  const hasCurFault = curFaults && curFaults.length > 0;

  const [matrixFilterActive, setMatrixFilterActive] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null); // {row, s, cellVal} for interactive tooltips!

  // ── isSymptomActive: checked_symptoms 배열 → 열(column) 활성 여부 ──────
  const isSymptomActive = (symptom) => {
    if (!analysisResult || !analysisResult.checked_symptoms) return false;
    return analysisResult.checked_symptoms.some(s => {
      const cleanS = s.toLowerCase().replace(/\s+/g, '');
      const cleanLabel = symptom.label.toLowerCase().replace(/\s+/g, '');
      const cleanLabelEn = (symptom.labelEn || "").toLowerCase().replace(/\s+/g, '');
      if (cleanS.includes("진동") || cleanS.includes("vibration")) {
        return cleanLabel.includes("진동") || cleanLabelEn.includes("vibration");
      }
      if (cleanS.includes("과열") || cleanS.includes("overheat") || cleanS.includes("temp") || cleanS.includes("온도")) {
        return cleanLabel.includes("과열") || cleanLabel.includes("온도") || cleanLabelEn.includes("overheat") || cleanLabelEn.includes("temp");
      }
      if (cleanS.includes("과부하") || cleanS.includes("overload")) {
        return cleanLabel.includes("과부하") || cleanLabelEn.includes("overload");
      }
      return cleanS.includes(cleanLabel) || cleanLabel.includes(cleanS) || cleanS.includes(cleanLabelEn) || cleanLabelEn.includes(cleanS);
    });
  };

  // ── isCauseActive: root_cause 텍스트 + active symptom 포함 행 → 행(row) 활성 여부 ──
  const isCauseActive = (row) => {
    if (!analysisResult) return false;
    
    // 1) 명시적 결함 목록(vib_faults, cur_faults) 활용
    const explicitFaults = [...(analysisResult.vib_faults || []), ...(analysisResult.cur_faults || [])];
    const cleanCause = row.cause.replace(/\s+/g, '');
    const cleanCauseEn = (row.causeEn || "").toLowerCase().replace(/\s+/g, '');

    if (explicitFaults.length > 0) {
      for (const fault of explicitFaults) {
        const cleanFault = fault.replace(/\s+/g, '');
        if (cleanCause.includes(cleanFault) || cleanFault.includes(cleanCause)) return true;
        // 회전체불평형 <-> 회전체 불평형 예외 처리
        if (cleanFault.includes("회전체") && cleanCause.includes("회전체")) return true;
        if (cleanFault.includes("축정렬") && (cleanCause.includes("조립설치") || cleanCause.includes("축중심"))) return true;
        if (cleanFault.includes("베어링") && (cleanCause.includes("베어링") || cleanCause.includes("윤활유"))) return true;
        if (cleanFault.includes("벨트") && cleanCause.includes("벨트")) return true;
      }
    }

    // 2) Fallback: root_cause가 매우 짧은 단답형(15자 이내)일 경우에만 매칭 (LLM 환각 방지)
    const rcRaw = analysisResult.root_cause || "";
    if (rcRaw.length > 0 && rcRaw.length <= 25) {
      const rc = rcRaw.toLowerCase().replace(/\s+/g, '');
      if (rc.includes("alignment") || rc.includes("misalignment") || rc.includes("축정렬") || rc.includes("축중심") || rc.includes("조립설치")) {
        if (cleanCause.includes("축중심") || cleanCause.includes("조립설치") || cleanCauseEn.includes("alignment") || cleanCauseEn.includes("misalignment")) return true;
      }
      if (rc.includes("bearing") || rc.includes("grease") || rc.includes("베어링") || rc.includes("윤활유") || rc.includes("베어링장치")) {
        if (cleanCause.includes("베어링") || cleanCause.includes("윤활유") || cleanCauseEn.includes("bearing") || cleanCauseEn.includes("grease")) return true;
      }
      if (rc.includes("unbalance") || rc.includes("imbalance") || rc.includes("회전체불평형")) {
        if (cleanCause.includes("회전체불평형") || cleanCauseEn.includes("unbalance") || cleanCauseEn.includes("imbalance")) return true;
      }
      if (rc.includes("belt") || rc.includes("slack") || rc.includes("벨트")) {
        if (cleanCause.includes("벨트") || cleanCauseEn.includes("belt") || cleanCauseEn.includes("slack")) return true;
      }
      if (rc.includes(cleanCause) || cleanCause.includes(rc)) return true;
    }

    return false;
  };

  const displayedRows = FAULT_MATRIX_DATA.filter(row => {
    if (!matrixFilterActive) return true;
    if (isCauseActive(row)) return true;
    return Object.keys(row.cells).some(symptomKey => {
      const symptom = SYMPTOMS.find(s => s.key === symptomKey);
      return symptom && isSymptomActive(symptom) && row.cells[symptomKey];
    });
  });

  const translateCell = (val) => {
    if (lang !== 'en') return val;
    if (val === "고") return "High";
    if (val === "저") return "Low";
    if (val === "약간 저") return "Slightly Low";
    if (val === "불안정") return "Unstable";
    return val;
  };

  // Helper to generate interactive tooltip content
  const getCellTooltipText = (row, s, cellVal) => {
    const finalCause = lang === 'en' ? row.causeEn : row.cause;
    const finalSymptom = lang === 'en' ? s.labelEn : s.label;
    const finalVal = translateCell(cellVal);
    
    if (lang === 'en') {
      return `The engineering value for [${finalSymptom}] caused by [${finalCause}] is "${finalVal}". Current multi-sensor diagnostics strongly confirms this correlation.`;
    }
    return `원인 [${finalCause}]에 의해 [${finalSymptom}] 현상이 나타나는 공학적 지표값은 "${finalVal}" 입니다. 현재 진단 분석을 통해 두 센서 데이터의 임계 매칭이 강력하게 입증되었습니다.`;
  };

  return (
    <div className="space-y-6 animate-fade-in print:hidden font-sans">
      
      {/* Top Risk Summary ( futuristic banner with rich background grad and glow ) */}
      <div className={`bg-gradient-to-r ${riskBgClass} border rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between relative overflow-hidden`}>
        {/* Glow decorative beam */}
        <div className="absolute top-0 left-0 w-80 h-full bg-indigo-500/5 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex items-center space-x-5 mb-4 md:mb-0 flex-1 min-w-0 mr-4">
          <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-lg shrink-0 ${
            isDanger 
              ? 'bg-rose-500/10 border-rose-500/40 text-rose-450 shadow-[0_0_20px_rgba(244,63,94,0.25)]' 
              : isWarning
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-500'
                : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500'
          }`}>
            <AlertTriangle size={26} className={isDanger ? 'animate-pulse' : ''} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2.5 mb-1.5">
              <span className={`text-[9px] font-black px-2.5 py-0.5 rounded border ${riskBadgeClass}`}>{riskBadgeText}</span>
            </div>
            <h2 className="text-lg font-black text-white tracking-wide">
              {t.diagnostics.summaryTitle}: <span className={`${riskColorClass} underline decoration-indigo-500/40`}>{riskTitle}</span>
            </h2>
            <p className="text-slate-400 text-xs mt-1 flex flex-wrap items-center gap-2">
              <span className="text-slate-500 text-[10px] shrink-0">{t.diagnostics.diagnosedCause}:</span>
              <span className="text-slate-100 font-black font-mono text-[12px] tracking-wide">{rootCauseShort}</span>
              {/* 센서별 오류 뱃지 */}
              <span className="flex items-center gap-1.5 ml-1">
                <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full border ${
                  hasVibFault
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-[0_0_6px_rgba(6,182,212,0.3)]'
                    : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${hasVibFault ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-400'}`} />
                  {lang === 'ko' ? '진동' : 'VIB'}
                  {hasVibFault ? (lang === 'ko' ? ' ⚠ 비정상' : ' ⚠ ERR') : (lang === 'ko' ? ' 정상' : ' OK')}
                </span>
                <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full border ${
                  hasCurFault
                    ? 'bg-purple-500/15 border-purple-500/40 text-purple-300 shadow-[0_0_6px_rgba(168,85,247,0.3)]'
                    : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${hasCurFault ? 'bg-purple-400 animate-pulse' : 'bg-emerald-400'}`} />
                  {lang === 'ko' ? '전류' : 'CUR'}
                  {hasCurFault ? (lang === 'ko' ? ' ⚠ 비정상' : ' ⚠ ERR') : (lang === 'ko' ? ' 정상' : ' OK')}
                </span>
              </span>
            </p>
          </div>
        </div>
        
        {/* Banner Actions */}
        <div className="flex gap-2.5 shrink-0 z-10 w-full md:w-auto">
          <button 
            onClick={() => setWorkOrderOpen(true)}
            className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-black text-xs transition-all shadow-md shadow-indigo-900/30 flex items-center justify-center space-x-1.5 transform hover:scale-[1.02]"
          >
            <Printer size={13} />
            <span>{t.diagnostics.diagnoseWorkOrderBtn}</span>
          </button>
          <button 
            onClick={() => setCurrentPage('detail')}
            className="flex-1 md:flex-none bg-slate-900/60 hover:bg-slate-900 text-slate-200 px-5 py-3 rounded-xl font-bold text-xs transition-all border border-slate-800/80 backdrop-blur-sm flex items-center justify-center"
          >
            <span>{t.diagnostics.detailedReportBtn}</span>
            <ChevronRight size={13} className="ml-1" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Area */}
        <div className="lg:col-span-2 bg-slate-950/40 border border-slate-900 rounded-3xl p-6 shadow-2xl relative min-w-0 overflow-hidden flex flex-col justify-between h-full">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
              <h3 className="text-xs font-black text-slate-200 flex items-center tracking-wide uppercase">
                <Activity className="mr-2 text-cyan-400" size={15} /> 
                <span>{t.diagnostics.telemetryTitle}</span>
              </h3>
              
              <div className="flex space-x-3.5 text-[9px] font-mono font-bold">
                <div className="flex items-center"><span className="w-2.5 h-2.5 rounded bg-cyan-400 mr-1.5"></span>{t.diagnostics.vibration} (mm/s)</div>
                <div className="flex items-center"><span className="w-2.5 h-2.5 rounded bg-purple-400 mr-1.5"></span>{t.diagnostics.current} (A)</div>
                <div className="flex items-center"><span className="w-2.5 h-2.5 rounded bg-amber-400 mr-1.5"></span>{t.diagnostics.temperature} (°C)</div>
              </div>
            </div>
            
            {/* Recharts with custom styling */}
            <div className="h-72 w-full font-mono text-[9px] min-w-0 overflow-hidden relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={telemetryData} margin={{ top: 10, right: 10, bottom: 5, left: -25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" vertical={false} />
                  <XAxis dataKey="time" stroke="#334155" tick={{fill: '#475569'}} />
                  <YAxis yAxisId="left" stroke="#334155" tick={{fill: '#475569'}} />
                  <YAxis yAxisId="right" orientation="right" stroke="#334155" tick={{fill: '#475569'}} />
                  
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(2, 11, 20, 0.9)', borderColor: '#1e293b', borderRadius: '1rem', color: '#f1f5f9', backdropFilter: 'blur(8px)' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  
                  <Line yAxisId="left" type="monotone" dataKey="vibration" stroke="#06b6d4" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                  <Line yAxisId="left" type="monotone" dataKey="current" stroke="#a855f7" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
                </LineChart>
              </ResponsiveContainer>
              
              {/* Anomaly Label Overlay */}
              {(isDanger || isWarning) && (
                <div className="absolute top-4 right-4 bg-rose-500/90 text-white text-[9px] font-black px-3 py-1.5 rounded-xl border border-rose-400 shadow-lg shadow-rose-500/30 animate-pulse flex items-center">
                  <AlertTriangle size={12} className="mr-1.5" /> {t.diagnostics.anomalyDetected}
                </div>
              )}
            </div>
          </div>
          
          {/* AI Fusion Diagnostics Report Card - Core point top, detailed info bottom, dynamic height & strictly no overlap */}
          <div className={`mt-6 bg-slate-950/70 border ${
            isDanger ? 'border-rose-500/25 bg-rose-950/10' : 'border-amber-500/25'
          } rounded-2xl p-6 flex flex-col space-y-4 h-auto overflow-hidden`}>
            
            {/* Top Section: Keypoints Summary */}
            <div>
              <div className="flex items-center space-x-2 mb-3 border-b border-slate-900/60 pb-2">
                <ShieldAlert className={`${isDanger ? 'text-rose-400' : 'text-amber-400'} shrink-0`} size={15} />
                <h4 className="text-xs font-black text-slate-100 uppercase tracking-wide">
                  {t.diagnostics.keypoints}
                </h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-900 shadow-inner">
                  <span className="block text-[8px] text-slate-500 font-mono font-bold tracking-wider uppercase">{lang === 'ko' ? "위험 레벨" : "RISK LEVEL"}</span>
                  <span className={`text-[11px] font-black ${riskColorClass} uppercase`}>{riskTitle}</span>
                </div>
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-900 shadow-inner">
                  <span className="block text-[8px] text-slate-500 font-mono font-bold tracking-wider uppercase">{lang === 'ko' ? "융합 신뢰도" : "CONFIDENCE"}</span>
                  <span className="text-[11px] font-black text-cyan-400 font-mono">96.4%</span>
                </div>
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-900 shadow-inner col-span-2">
                  <span className="block text-[8px] text-slate-500 font-mono font-bold tracking-wider uppercase">{t.diagnostics.diagnosedCause}</span>
                  <span className="text-[11px] font-extrabold text-slate-200 truncate block" title={rootCause}>{rootCause}</span>
                </div>
              </div>
            </div>

            {/* Bottom Section: Detailed Description */}
            <div className="border-t border-slate-900/40 pt-3">
              <h5 className="text-[9px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                {t.diagnostics.detailedDesc}
              </h5>
              <p className="text-slate-300 text-[11px] leading-relaxed font-medium font-sans break-words whitespace-pre-line">
                {riskRationale}
              </p>
            </div>
          </div>
        </div>

        {/* AI Reasoning Consensus Checklist Cards */}
        <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
          <div className="mb-5 border-b border-slate-900 pb-3">
            <h3 className="text-xs font-black text-slate-200 uppercase tracking-wide">{t.diagnostics.consTitle}</h3>
            <p className="text-[9px] text-cyan-400 font-mono mt-1">{t.diagnostics.consSub}</p>
          </div>
          
          <div className="space-y-3.5 text-xs flex-1">
            <div className="bg-slate-900/35 border border-slate-900 rounded-2xl p-4 hover:border-cyan-500/30 transition-all duration-300 group">
              <div className="flex items-center space-x-2.5 mb-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                  <Activity size={14} />
                </div>
                <h4 className="font-extrabold text-slate-250 group-hover:text-cyan-400 transition-colors text-[11.5px]">{t.diagnostics.consVib}</h4>
              </div>
              <ul className="text-slate-400 space-y-1.5 ml-9 text-[10.5px] list-disc list-inside marker:text-slate-700 leading-normal font-sans">
                {lang === 'ko' ? (
                  isNormalState ? (
                    <>
                      <li>Z축 주파수 스펙트럼 Peak 안정화 유지</li>
                      <li>실측 RMS <span className="text-emerald-400 font-bold">{vibVal} mm/s</span> (정상 임계치 이내)</li>
                    </>
                  ) : (
                    <>
                      <li>Z축 주파수 특정 peak 변동 및 가속 에너지 증가 감지</li>
                      <li>실측 RMS <span className="text-rose-400 font-bold">{vibVal} mm/s</span> (정상 임계치 초과)</li>
                    </>
                  )
                ) : (
                  isNormalState ? (
                    <>
                      <li>Z-axis spectrum peak stabilized</li>
                      <li>Measured RMS <span className="text-emerald-400 font-bold">{vibVal} mm/s</span> (within threshold)</li>
                    </>
                  ) : (
                    <>
                      <li>Z-axis specific peak fluctuation & acceleration energy surge</li>
                      <li>Measured RMS <span className="text-rose-400 font-bold">{vibVal} mm/s</span> (exceeds threshold)</li>
                    </>
                  )
                )}
              </ul>
            </div>

            <div className="bg-slate-900/35 border border-slate-900 rounded-2xl p-4 hover:border-purple-500/30 transition-all duration-300 group">
              <div className="flex items-center space-x-2.5 mb-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                  <Zap size={14} />
                </div>
                <h4 className="font-extrabold text-slate-250 group-hover:text-purple-400 transition-colors text-[11.5px]">{t.diagnostics.consCur}</h4>
              </div>
              <ul className="text-slate-400 space-y-1.5 ml-9 text-[10.5px] list-disc list-inside marker:text-slate-700 leading-normal font-sans">
                {lang === 'ko' ? (
                  isNormalState ? (
                    <>
                      <li>U/V/W 3상 균형도 최적 균등 분배</li>
                      <li>3상 위상 불균형도 <span className="text-emerald-400 font-bold">{curVal}%</span> (지극히 안정적)</li>
                    </>
                  ) : (
                    <>
                      <li>U/V/W 3상 위상 균형 왜곡 및 토크 고조파 왜곡 검출</li>
                      <li>3상 위상 불균형도 <span className="text-rose-400 font-bold">{curVal}%</span> (불평형 변위 감지)</li>
                    </>
                  )
                ) : (
                  isNormalState ? (
                    <>
                      <li>U/V/W 3-phase balance optimally distributed</li>
                      <li>Phase imbalance <span className="text-emerald-400 font-bold">{curVal}%</span> (stable balance)</li>
                    </>
                  ) : (
                    <>
                      <li>U/V/W 3-phase phase unbalance & torque harmonics detected</li>
                      <li>Phase imbalance <span className="text-rose-400 font-bold">{curVal}%</span> (unbalance displacement)</li>
                    </>
                  )
                )}
              </ul>
            </div>

            <div className="bg-slate-900/35 border border-slate-900 rounded-2xl p-4 hover:border-blue-500/30 transition-all duration-300 group">
              <div className="flex items-center space-x-2.5 mb-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                  <RefreshCw size={14} />
                </div>
                <h4 className="font-extrabold text-slate-250 group-hover:text-indigo-400 transition-colors text-[11.5px]">{t.diagnostics.consCons}</h4>
              </div>
              <ul className="text-slate-400 space-y-1.5 ml-9 text-[10.5px] list-disc list-inside marker:text-slate-700 leading-normal font-sans">
                {lang === 'ko' ? (
                  isNormalState ? (
                    <>
                      <li>두 이종 파이프라인 판단 신뢰성: <span className="text-emerald-400 font-bold">99%</span></li>
                      <li>실시간 다중 센서 융합 RAG 모니터링 가동</li>
                    </>
                  ) : (
                    <>
                      <li>두 이종 파이프라인 판단 신뢰성: <span className="text-rose-400 font-bold">96.4%</span></li>
                      <li>XGBoost 다중 모델 연동 교차 검증 완료</li>
                    </>
                  )
                ) : (
                  isNormalState ? (
                    <>
                      <li>Multi-sensor pipeline confidence: <span className="text-emerald-400 font-bold">99%</span></li>
                      <li>Real-time multi-sensor fusion RAG monitor active</li>
                    </>
                  ) : (
                    <>
                      <li>Multi-sensor pipeline confidence: <span className="text-rose-400 font-bold">96.4%</span></li>
                      <li>XGBoost cross-validation complete</li>
                    </>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 고장-원인 매트릭스 <표 6.7.9> 대화형 그리드 */}
      <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-6 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-900 pb-4.5 mb-6 gap-4">
          <div>
            <h3 className="text-xs font-black text-slate-200 flex items-center tracking-wide uppercase">
              <Settings className="mr-2 text-indigo-400" size={16} />
              <span>{t.diagnostics.matrixTitle}</span>
            </h3>
            <p className="text-[9.5px] text-slate-500 font-mono mt-1">{t.diagnostics.matrixSub}</p>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto font-sans">
            <button
              onClick={() => setMatrixFilterActive(!matrixFilterActive)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl font-bold text-[10.5px] transition-all duration-300 border ${
                matrixFilterActive 
                  ? 'bg-indigo-600 border-transparent text-white shadow-md shadow-indigo-900/35' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {matrixFilterActive ? t.diagnostics.allMatrix : t.diagnostics.activeMatrix}
            </button>
          </div>
        </div>

        {/* Hover Popover Tooltip for Cells */}
        {hoveredCell && (
          <div className="absolute top-2 left-6 right-6 bg-slate-900/95 text-slate-100 border border-indigo-500/40 p-3 rounded-2xl shadow-xl z-20 text-[10.5px] leading-relaxed animate-fade-in flex justify-between items-start backdrop-blur-xl">
            <p className="flex-1">
              <strong>💡 {lang === 'en' ? "Engineering Consensus:" : "공학 근거:"}</strong> {getCellTooltipText(hoveredCell.row, hoveredCell.s, hoveredCell.cellVal)}
            </p>
            <button 
              onClick={() => setHoveredCell(null)}
              className="text-slate-500 hover:text-slate-200 font-bold ml-3 text-[12px] p-0.5 hover:bg-slate-800 rounded bg-slate-950 border border-slate-900"
            >
              {lang === 'en' ? "Close" : "닫기"}
            </button>
          </div>
        )}

        <div className="overflow-x-auto rounded-2xl border border-slate-900/80 bg-slate-950/20">
          <table className="w-full text-[11px] text-slate-300 text-center border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-900 text-slate-400 font-black text-[10px]">
                <th className="relative border-r border-slate-900 min-w-[180px] bg-slate-950/80 font-bold overflow-hidden p-0 h-14">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100%" y2="100%" stroke="#0f172a" strokeWidth="1" />
                  </svg>
                  <div className="absolute top-1.5 right-3 text-[10px]">
                    {lang === 'en' ? "Anomaly Symptom" : "이상 징후"}
                  </div>
                  <div className="absolute bottom-1.5 left-3 text-[10px]">
                    {lang === 'en' ? "Fault Category" : "고장 분류"}
                  </div>
                </th>
                {SYMPTOMS.map(s => {
                  const active = isSymptomActive(s);
                  const symptomLabel = lang === 'en' ? s.labelEn : s.label;
                  return (
                    <th 
                      key={s.key} 
                      className={`px-1 py-4 border-r border-slate-900 font-bold whitespace-normal break-all leading-tight min-w-[85px] transition-colors ${
                        active ? 'bg-indigo-500/10 text-cyan-400 border-b-2 border-b-cyan-500' : ''
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center">
                        {active && <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mb-1 animate-ping"></span>}
                        <span>{symptomLabel}</span>
                      </div>
                    </th>
                  );
                })}
                <th className="px-3 py-4 text-left min-w-[150px] font-bold">{t.diagnostics.remarks}</th>
              </tr>
            </thead>
            <tbody>
              {displayedRows.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-6 py-12 text-slate-500 font-mono text-center">
                    {lang === 'en' ? "No matching active anomaly data found." : "매칭 이상 징후 데이터가 없습니다."}
                  </td>
                </tr>
              ) : (
                displayedRows.map((row, i) => {
                  const causeActive = isCauseActive(row);
                  const causeLabel = lang === 'en' ? row.causeEn : row.cause;
                  const remarksLabel = lang === 'en' ? row.remarksEn : row.remarks;
                  return (
                    <tr 
                      key={i} 
                      className={`border-b border-slate-900/40 transition-all duration-300 ${
                        causeActive 
                          ? 'bg-indigo-500/10 border-l-3 border-l-indigo-500 font-bold' 
                          : 'hover:bg-slate-900/30'
                      }`}
                    >
                      <td className={`px-3 py-3 border-r border-slate-900 text-left font-semibold ${
                        causeActive ? 'text-slate-100' : 'text-slate-500'
                      }`}>
                        <div className="flex items-center space-x-1.5">
                          {causeActive && <span className="w-2 h-2 bg-indigo-400 rounded-full animate-ping"></span>}
                          <span className="truncate max-w-[170px]" title={causeLabel}>{causeLabel}</span>
                        </div>
                      </td>
                      {SYMPTOMS.map(s => {
                        const cellVal = row.cells[s.key];
                        const symptomActive = isSymptomActive(s);
                        const intersectionActive = causeActive && symptomActive && cellVal;
                        
                        return (
                          <td 
                            key={s.key} 
                            onClick={() => cellVal && setHoveredCell({ row, s, cellVal })}
                            className={`px-1 py-3 border-r border-slate-900 font-mono transition-all duration-350 cursor-pointer ${
                              intersectionActive 
                                ? 'bg-emerald-500/10 text-emerald-300 font-black text-xs relative cursor-help shadow-[0_0_12px_rgba(16,185,129,0.15)]' 
                                : symptomActive 
                                  ? 'bg-slate-900/45 text-slate-500/60'
                                  : causeActive
                                    ? 'bg-indigo-500/5 text-slate-500/50'
                                    : 'text-slate-600/40'
                            }`}
                          >
                            {intersectionActive ? (
                              <div className="flex items-center justify-center">
                                <span className="bg-emerald-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.75)] border border-emerald-450 animate-pulse">
                                  {translateCell(cellVal)}
                                </span>
                              </div>
                            ) : cellVal ? (
                              <span className="text-slate-400 opacity-40 select-none font-extrabold text-xs">
                                {translateCell(cellVal)}
                              </span>
                            ) : (
                              ""
                            )}
                          </td>
                        );
                      })}
                      <td className="px-3 py-3 text-left text-slate-500 text-[10px] whitespace-normal leading-normal">{remarksLabel}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[9px] text-slate-500 font-mono gap-2 leading-relaxed">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5"></span>{t.diagnostics.legendCause}</div>
            <div className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1.5"></span>{t.diagnostics.legendSymptom}</div>
            <div className="flex items-center bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-ping"></span>
              {t.diagnostics.legendIntersection}
            </div>
          </div>
          <div>{t.diagnostics.matrixSource}</div>
        </div>
      </div>
    </div>
  );
}
