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
      ? "Z-axis acceleration amplitude exceeded threshold by 56%, and abnormal impeller torque load distortion was detected in the 3-phase high-frequency current analysis model. Strong agreement rate (86%) of both sensors confirms shaft misalignment. Immediate maintenance required."
      : "Z축 가속도 성분 진폭이 임계치 대비 56% 초과하였으며, U/V/W 3상 고주파 전류 분석 모형에서도 비정상 임펠러 토크 부하 왜곡 변동이 검출되었습니다. 두 센서의 동시 분류 결과가 축정렬불량(확률 86%)을 상호 강력하게 뒷받침하고 있습니다. 즉각 정비가 요구됩니다."
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

  const isCauseActive = (causeName, causeEnName) => {
    const rc = rootCause.replace(/\s+/g, '').toLowerCase();
    const cleanCause = (causeName || "").replace(/\s+/g, '').toLowerCase();
    const cleanCauseEn = (causeEnName || "").replace(/\s+/g, '').toLowerCase();
    
    if (cleanCause.includes("조립설치") || cleanCause.includes("축중심") || cleanCauseEn.includes("misalignment")) {
      if (rc.includes("축정렬불량") || rc.includes("조립설치") || rc.includes("축중심") || rc.includes("misalignment")) {
        return true;
      }
    }
    if (cleanCause.includes("윤활유부족") || cleanCause.includes("베어링장치") || cleanCauseEn.includes("bearing") || cleanCauseEn.includes("grease")) {
      if (rc.includes("베어링불량") || rc.includes("윤활유부족") || rc.includes("베어링장치") || rc.includes("bearing") || rc.includes("grease")) {
        return true;
      }
    }
    if (cleanCause.includes("회전체불평형") || cleanCauseEn.includes("unbalance")) {
      if (rc.includes("회전체불평형") || rc.includes("unbalance")) {
        return true;
      }
    }
    if (cleanCause.includes("구동벨트") || cleanCause.includes("벨트느슨함") || cleanCauseEn.includes("belt")) {
      if (rc.includes("벨트느슨함") || rc.includes("구동벨트") || rc.includes("belt")) {
        return true;
      }
    }
    
    return rc.includes(cleanCause) || cleanCause.includes(rc) || 
           (cleanCauseEn && (rc.includes(cleanCauseEn) || cleanCauseEn.includes(rc)));
  };

  const isSymptomActive = (symptomLabel, symptomLabelEn) => {
    if (!analysisResult || !analysisResult.checked_symptoms) {
      const checkArr = ["이상진동", "베어링과열", "과부하", "abnormal vibration", "bearing overheating", "overload"];
      return checkArr.includes(symptomLabel.toLowerCase()) || checkArr.includes((symptomLabelEn || "").toLowerCase());
    }
    return analysisResult.checked_symptoms.some(s => {
      const cleanS = s.replace(/\s+/g, '').toLowerCase();
      const cleanLabel = symptomLabel.replace(/\s+/g, '').toLowerCase();
      const cleanLabelEn = (symptomLabelEn || "").replace(/\s+/g, '').toLowerCase();
      return cleanS.includes(cleanLabel) || cleanLabel.includes(cleanS) ||
             (cleanLabelEn && (cleanS.includes(cleanLabelEn) || cleanLabelEn.includes(cleanS)));
    });
  };

  const printableRows = FAULT_MATRIX_DATA.filter(row => {
    if (isCauseActive(row.cause, row.causeEn)) return true;
    return Object.keys(row.cells).some(symptomKey => {
      const s = SYMPTOMS.find(s => s.key === symptomKey);
      const symptomLabel = s?.label || "";
      const symptomLabelEn = s?.labelEn || "";
      return isSymptomActive(symptomLabel, symptomLabelEn) && row.cells[symptomKey];
    });
  });

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
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(getMainMaintenanceGuideUrl(rootCause))}`} 
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
            <p className="text-slate-700 leading-relaxed font-sans">
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
                    const active = isSymptomActive(s.label, s.labelEn);
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
                    const causeActive = isCauseActive(row.cause, row.causeEn);
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
                          const symptomActive = isSymptomActive(s.label, s.labelEn);
                          const intersectionActive = causeActive && symptomActive && cellVal;
                          
                          return (
                            <td 
                              key={s.key} 
                              className={`p-0.5 border border-slate-200 font-bold w-[24px] min-w-[24px] max-w-[24px] ${
                                intersectionActive 
                                  ? 'bg-slate-200 text-emerald-900 font-black' 
                                  : symptomActive 
                                    ? 'text-slate-800 font-bold'
                                    : 'text-slate-400 font-normal'
                              }`}
                            >
                              {intersectionActive ? `✔ (${cellVal})` : (
                                <span className="opacity-15 select-none text-[7px]">{cellVal || ""}</span>
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
                const parts = act.split(":");
                return (
                  <li key={index} className="pl-1">
                    <strong className="text-slate-900">{parts[0]}:</strong>
                    <span>{parts[1] || ""}</span>
                  </li>
                );
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
          <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 text-[10px] text-slate-600 leading-relaxed mb-12">
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
