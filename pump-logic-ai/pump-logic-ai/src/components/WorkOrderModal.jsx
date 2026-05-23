import React from 'react';
import { Printer, X } from 'lucide-react';
import { SYMPTOMS, FAULT_MATRIX_DATA, getMaintenanceGuideUrl } from '../constants';

export default function WorkOrderModal({ workOrderOpen, setWorkOrderOpen, analysisResult, t, lang }) {
  if (!workOrderOpen) return null;

  const isEn = lang === 'en';

  const rootCause = analysisResult?.root_cause || (isEn ? "Rotor Shaft Misalignment" : "축정렬불량 의심 (센서 융합 확진)");
  const riskLevel = analysisResult?.risk_level || "DANGER";
  const riskRationale = analysisResult?.risk_rationale || (
    isEn 
      ? `Analysis complete. Vibration RMS: ${analysisResult?.vibration_rms?.toFixed(2) || 2.15} mm/s, Current Imbalance: ${analysisResult?.current_imbalance?.toFixed(1) || 4.0}%. Maintenance required.`
      : `분석 완료. 진동 RMS: ${analysisResult?.vibration_rms?.toFixed(2) || 2.15} mm/s, 전류 불평형: ${analysisResult?.current_imbalance?.toFixed(1) || 4.0}%. 정비가 요구됩니다.`
  );
  
  const recommendedActions = analysisResult?.recommended_actions || (
    isEn ? [
      "Shaft Alignment Calibration: Use laser alignment systems to calibrate concentricity variance within ±0.03mm.",
      "Bearing Overhaul: Inspect rolling element clearance, grease state, and replenish lubricants under standards.",
      "Baseline Reinforcement: Re-tighten loose baseline anchor bolts with standard torque wrench."
    ] : [
      "축 수평 다이얼 게이지 계측: 레이저 얼라인먼트 툴을 사용해 커플링 간극 및 동심도 편차를 ±0.03mm 이내로 조절하십시오.",
      "베어링 해체 점검: 베어링 하우징 커버를 탈거하고 피로 균열 및 윤활 상태를 점검하여 필요시 전면 교체하십시오.",
      "모터 마운팅 볼트 점검: 풀림 현상이 발견된 베이스 프레임 기초 볼트를 적정 토크 렌치를 사용하여 2차 재조이십시오."
    ]
  );

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

  const printableRows = FAULT_MATRIX_DATA;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-start justify-center overflow-y-auto p-4 md:p-8 print:p-0 print:bg-white print:relative print:z-auto printable-work-order-wrapper animate-in fade-in duration-300">
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col printable-work-order print:shadow-none print:border-none print:w-full print:max-w-none animate-in slide-in-from-bottom-8 duration-500">
        
        <div className="bg-slate-50 px-6 py-4.5 border-b border-slate-200 flex justify-between items-center no-print">
          <div className="flex items-center space-x-2 text-slate-800 font-extrabold text-sm tracking-wide">
            <Printer size={18} className="text-indigo-600" />
            <span>{isEn ? "A4 Maintenance Work Order (Print Preview)" : "A4 규격 정비 작업 지시서 (인쇄 미리보기)"}</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <button 
              onClick={() => window.print()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black px-5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-md shadow-indigo-600/20 transform hover:scale-[1.02]"
            >
              <Printer size={13} />
              <span>{isEn ? "Print Now" : "지금 인쇄하기"}</span>
            </button>
            <button 
              onClick={() => setWorkOrderOpen(false)} 
              className="bg-slate-200 hover:bg-slate-350 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors"
            >
              {isEn ? "Close" : "닫기"}
            </button>
          </div>
        </div>

        <div className="p-10 font-sans print:p-0 bg-white">
          <div className="flex justify-between items-start border-b-4 border-slate-900 pb-6 mb-8">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950">{t.workorder.woTitle}</h1>
              <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-widest leading-relaxed">
                {isEn 
                  ? "PumpLogic AI Predictive Maintenance Intelligent System • Plant Maintenance Dept" 
                  : "PumpLogic AI 예지보전 지능형 시스템 • 공무부 설비 보전실"}
              </p>
            </div>
            <div className="flex items-center space-x-4 shrink-0">
              <div className="flex flex-col items-center">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(getMaintenanceGuideUrl(rootCause))}`} 
                  className="w-14 h-14 border border-slate-300 bg-white p-1" 
                  alt="정비 가이드 QR" 
                />
                <span className="text-[7.5px] text-slate-500 mt-1 font-extrabold uppercase">{t.workorder.standardQr}</span>
              </div>
              <div className="w-14 h-14 border-[3px] border-rose-600 rounded-full flex items-center justify-center text-rose-600 font-black text-[7.5px] rotate-12 relative opacity-85 shrink-0 select-none">
                <span className="text-center leading-2.5 whitespace-pre-line">{t.workorder.sealApproved}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-slate-900 text-[10.5px] mb-8 font-sans">
            <div className="bg-slate-50 p-2.5 font-bold border-r border-b border-slate-900 text-center">{t.workorder.metaId}</div>
            <div className="p-2.5 border-r border-b border-slate-900 font-mono">WO-2026-05-22-001</div>
            <div className="bg-slate-50 p-2.5 font-bold border-r border-b border-slate-900 text-center">{t.workorder.metaDept}</div>
            <div className="p-2.5 border-b border-slate-900 font-semibold">
              {isEn ? "PdM Predictive Tech Institute" : "PdM 예지기술연구소"}
            </div>
            <div className="bg-slate-50 p-2.5 font-bold border-r border-slate-900 text-center">{t.workorder.metaIssued}</div>
            <div className="p-2.5 border-r border-slate-900 font-mono">2026-05-22 16:55 KST</div>
            <div className="bg-slate-50 p-2.5 font-bold border-r border-slate-900 text-center">{t.workorder.metaTeam}</div>
            <div className="p-2.5 font-semibold">
              {isEn ? "Maintenance Team 1" : "공무부 설비 보전 1팀"}
            </div>
          </div>

          <h3 className="text-xs font-black border-l-3 border-indigo-600 pl-2 text-slate-950 mb-2.5 uppercase tracking-wide">{t.workorder.equipTitle}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-slate-300 text-[10px] mb-8">
            <div className="bg-slate-50 p-2.5 font-bold border-r border-b border-slate-300 text-center">{t.workorder.equipName}</div>
            <div className="p-2.5 border-r border-b border-slate-300 font-bold text-slate-800">
              {isEn ? "Centrifugal Pump Alpha-7" : "원심펌프 7호기 (Centrifugal Pump)"}
            </div>
            <div className="bg-slate-50 p-2.5 font-bold border-r border-b border-slate-300 text-center">{t.workorder.equipCode}</div>
            <div className="p-2.5 border-b border-slate-300 font-mono">PMP-A7-001</div>
            <div className="bg-slate-50 p-2.5 font-bold border-r border-slate-300 text-center">{t.workorder.equipRisk}</div>
            <div className="p-2.5 border-r border-slate-300 font-black text-rose-600 uppercase">
              {riskLevel}{isEn ? " (Dual Sensor Fusion Confirmed)" : " (교차 센서 융합 확진)"}
            </div>
            <div className="bg-slate-50 p-2.5 font-bold border-r border-slate-300 text-center">{t.workorder.equipData}</div>
            <div className="p-2.5 font-mono text-[9px] text-slate-600">
              {isEn ? "Vibration Z-axis + 3-Phase MCSA Current Cross-Fusion Complete" : "진동(Vib) 1축 + 전류(Cur) 3상 교차 융합 완료"}
            </div>
          </div>

          <h3 className="text-xs font-black border-l-3 border-indigo-600 pl-2 text-slate-950 mb-2.5 uppercase tracking-wide">{t.workorder.analTitle}</h3>
          <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 text-[10.5px] leading-relaxed mb-8">
            <p className="font-extrabold text-slate-900 text-xs mb-2">
              {isEn ? "[Primary Fault Cause]: " : "[주요 결함 원인]: "}<span className="text-rose-600 font-black underline">{rootCause}</span>
            </p>
            <p className="text-slate-700 leading-relaxed font-sans whitespace-pre-wrap break-keep text-justify">
              {riskRationale}
            </p>
          </div>

          <h3 className="text-xs font-black border-l-3 border-indigo-600 pl-2 text-slate-950 mb-2.5 uppercase tracking-wide">
            {t.workorder.symptomGridTitle}
          </h3>
          <div className="border border-slate-300 rounded-xl p-3.5 bg-white mb-8 overflow-x-auto">
            <table className="w-full text-[8px] text-slate-800 text-center border-collapse border border-slate-200 table-fixed">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-300 font-bold">
                  <th className="border border-slate-200 w-[110px] min-w-[110px] max-w-[110px] relative h-20 bg-slate-50 p-0 font-normal">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-slate-300 to-transparent" style={{ backgroundImage: 'linear-gradient(to top right, transparent 49.5%, #cbd5e1 50%, transparent 50.5%)' }}></div>
                    <div className="absolute top-1.5 right-1.5 text-slate-900 font-black text-[7.5px]">
                      {isEn ? "Symptom ➔" : "현상 ➔"}
                    </div>
                    <div className="absolute bottom-1.5 left-1.5 text-slate-700 font-bold text-[7.5px]">
                      {isEn ? "⬇ Cause" : "⬇ 원인"}
                    </div>
                  </th>
                  {SYMPTOMS.map(s => {
                    const active = isSymptomActive(s);
                    return (
                      <th 
                        key={s.key} 
                        className={`p-0.5 border border-slate-200 leading-tight w-[24px] min-w-[24px] max-w-[24px] [writing-mode:vertical-rl] [text-orientation:mixed] h-20 text-left font-bold ${
                          active ? 'bg-slate-100 text-indigo-900 font-black' : 'text-slate-500'
                        }`}
                      >
                        {isEn ? s.labelEn : s.label}
                      </th>
                    );
                  })}
                  <th className="px-1 py-1 border border-slate-200 text-center w-[75px] min-w-[75px] max-w-[75px] text-[7.5px]">{t.diagnostics.remarks}</th>
                </tr>
              </thead>
              <tbody>
                {printableRows.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="px-4 py-6 text-slate-500 font-mono text-center">
                      {isEn ? "No matching diagnostic fault or symptom matrix data found." : "감지 및 매칭된 고장 또는 이상 징후 매핑 데이터가 없습니다."}
                    </td>
                  </tr>
                ) : (
                  printableRows.map((row, idx) => {
                    const causeActive = isCauseActive(row);
                    return (
                      <tr 
                        key={idx} 
                        className={`border-b border-slate-200 ${
                          causeActive ? 'bg-slate-50/70 font-bold' : ''
                        }`}
                      >
                        <td className={`px-2 py-1.5 border border-slate-200 text-left font-semibold text-[8px] leading-tight w-[110px] min-w-[110px] max-w-[110px] whitespace-normal ${
                          causeActive ? 'text-indigo-950 font-black' : 'text-slate-600'
                        }`}>
                          {causeActive ? '☑ ' : '☐ '}{isEn ? row.causeEn : row.cause}
                        </td>
                        {SYMPTOMS.map(s => {
                          const cellVal = row.cells[s.key];
                          const symptomActive = isSymptomActive(s);
                          const intersectionActive = causeActive && symptomActive && cellVal;
                          
                          return (
                            <td 
                              key={s.key} 
                              className={`p-0.5 border border-slate-200 font-bold w-[24px] min-w-[24px] max-w-[24px] text-center ${
                                intersectionActive 
                                  ? 'bg-emerald-50 text-emerald-800 font-black' 
                                  : 'bg-white'
                              }`}
                            >
                              {intersectionActive ? (
                                <span className="bg-emerald-500 text-white font-extrabold text-[8px] px-1 py-0.5 rounded shadow-sm border border-emerald-400 inline-block w-full">
                                  {cellVal}
                                </span>
                              ) : cellVal ? (
                                <span className="text-slate-450 opacity-40 select-none font-medium text-[8.5px]">
                                  {cellVal}
                                </span>
                              ) : (
                                ""
                              )}
                            </td>
                          );
                        })}
                        <td className="px-1 py-1 border border-slate-200 text-left text-slate-500 text-[7px] leading-tight w-[75px] min-w-[75px] max-w-[75px] whitespace-normal">
                          {isEn ? row.remarksEn : row.remarks}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <div className="mt-2 text-[7.5px] text-slate-500 flex justify-between items-center font-mono flex-wrap gap-1">
              <div>{t.workorder.legendIntersectionActive}</div>
              <div>{t.workorder.standardManual}</div>
            </div>
          </div>

          <h3 className="text-xs font-black border-l-3 border-indigo-600 pl-2 text-slate-950 mb-2.5 uppercase tracking-wide">
            {t.workorder.guidelinesTitle}
          </h3>
          <div className="border border-slate-300 rounded-xl p-5 mb-8 bg-slate-50/50">
            <ul className="space-y-3 text-[10.5px] text-slate-700 list-decimal list-inside leading-relaxed font-sans">
              {recommendedActions.map((act, index) => {
                // If there is a colon, split by first colon to show bold header
                const colonIndex = act.indexOf(":");
                if (colonIndex !== -1) {
                  const title = act.substring(0, colonIndex).trim();
                  let content = act.substring(colonIndex + 1).trim();
                  // Remove any trailing colons from content
                  if (content.endsWith(":")) {
                    content = content.slice(0, -1).trim();
                  }
                  return (
                    <li key={index} className="pl-1 whitespace-pre-wrap break-keep">
                      <strong className="text-slate-900">{title}:</strong>
                      <span> {content}</span>
                    </li>
                  );
                } else {
                  let content = act.trim();
                  if (content.endsWith(":")) {
                    content = content.slice(0, -1).trim();
                  }
                  return (
                    <li key={index} className="pl-1 whitespace-pre-wrap break-keep text-slate-700 font-medium">
                      <span>{content}</span>
                    </li>
                  );
                }
              })}
            </ul>
            <div className="mt-3 text-[9px] text-indigo-900 bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex items-start space-x-2 font-medium">
              <span className="font-extrabold text-indigo-950 shrink-0">
                {isEn ? "📌 Field Note:" : "📌 실무 안내:"}
              </span>
              <span>
                {t.workorder.videoGuide}
              </span>
            </div>
          </div>

          <h3 className="text-xs font-black border-l-3 border-indigo-600 pl-2 text-slate-950 mb-2.5 uppercase tracking-wide">
            {t.workorder.preventiveCareTitle}
          </h3>
          <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 text-[10px] text-slate-600 leading-relaxed mb-12 whitespace-pre-wrap break-keep text-justify">
            {analysisResult?.preventive_maintenance || (
              isEn 
                ? "Perform periodic quantitative inspections of automatic lubrication intervals and motor drive belt tension. In addition, shorten the real-time 3-phase current imbalance monitoring interval to elevate initial anomaly detection sensitivity."
                : "윤활유 자동 공급 주기 점검 및 모터 구동용 벨트 장력 상태를 주기적으로 정량 점검하십시오. 또한 실시간 3상 전류 불평형 모니터링 주기를 단축하여 초기 이상징후 탐지 민감도를 격상하십시오."
            )}
          </div>

          {/* Sign-off Blocks */}
          <div className="grid grid-cols-2 gap-12 text-center text-[10px] mt-12 pt-6 border-t-2 border-slate-300">
            <div>
              <p className="text-slate-500 mb-12 font-bold uppercase tracking-wider">{t.workorder.signOffConfirm}</p>
              <p className="font-extrabold border-b border-slate-400 pb-2 w-48 mx-auto text-slate-700">{t.workorder.signature}</p>
            </div>
            <div>
              <p className="text-slate-500 mb-12 font-bold uppercase tracking-wider">{t.workorder.signOffDirector}</p>
              <p className="font-extrabold border-b border-slate-400 pb-2 w-48 mx-auto text-slate-700">{t.workorder.signatureDirector}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
