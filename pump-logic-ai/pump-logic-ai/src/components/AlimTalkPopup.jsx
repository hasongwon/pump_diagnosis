import React from 'react';
import { X, Bell, Printer } from 'lucide-react';

export default function AlimTalkPopup({ alimtalkOpen, setAlimtalkOpen, analysisResult, setWorkOrderOpen, t }) {
  if (!alimtalkOpen) return null;

  // Detect English or Korean based on translation title
  const isEnglish = t.alimtalk.closeBtn === "Close";

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-[#ffeb00] text-slate-900 border-[3px] border-[#e5a93b] shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-3xl overflow-hidden flex flex-col z-50 animate-in slide-in-from-bottom-12 duration-500 font-sans">
      {/* Header */}
      <div className="bg-[#3c2a20] p-4 flex justify-between items-center text-white relative">
        <div className="flex items-center space-x-2.5">
          <div className="w-6 h-6 rounded-full bg-[#ffeb00] flex items-center justify-center text-[#3c2a20] font-black text-xs shadow-md animate-bounce">
            💬
          </div>
          <span className="font-extrabold text-xs tracking-wide">{t.alimtalk.alertHeader}</span>
        </div>
        <button 
          onClick={() => setAlimtalkOpen(false)} 
          className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      
      {/* Body content */}
      <div className="p-5 flex-1 bg-slate-100 flex flex-col">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-xs leading-relaxed text-slate-800 space-y-3">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-black text-rose-600 text-sm tracking-tight flex items-center">
              <span className="w-2 h-2 rounded-full bg-rose-600 mr-1.5 animate-ping"></span>
              {t.alimtalk.alertTitle}
            </span>
            <span className="text-slate-400 font-mono text-[10px]">{isEnglish ? "Sent 16:55" : "발송 16:55"}</span>
          </div>
          
          <p className="text-[11px] leading-relaxed">
            {t.alimtalk.alertDesc}
          </p>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono space-y-1.5 text-slate-700 text-[10.5px]">
            <div>
              • <strong className="text-slate-900">{isEnglish ? "Risk Level:" : "위험등급:"}</strong>{" "}
              <span className="text-rose-600 font-bold underline">{analysisResult?.risk_level || "DANGER"}</span>
            </div>
            <div>
              • <strong className="text-slate-900">{isEnglish ? "Fault Cause:" : "진단원인:"}</strong>{" "}
              <span className="font-semibold text-indigo-700">{analysisResult?.root_cause || "Rotor Shaft Misalignment"}</span>
            </div>
            <div>
              • <strong className="text-slate-900">{isEnglish ? "Anomalies:" : "이상징후:"}</strong>{" "}
              {isEnglish 
                ? "Z-axis RMS amplitude 14.22 mm/s (exceeds 56%), MCSA 3-phase current imbalance correlated confirmation."
                : "Z-축 진폭 14.22 mm/s (임계치 56% 초과), MCSA 3상 전류 불평형 지수 급상승 교차 확진"}
            </div>
          </div>

          <p className="text-[10.5px] text-slate-500 leading-normal">
            {isEnglish 
              ? "Maintenance technicians must immediately inspect shaft alignment concentricity, bearing wear, and oil grease levels."
              : "현장 정비 보전팀은 신속히 현장으로 이동하시어 해당 원심펌프의 수평 얼라인먼트 편차 및 베어링 마모, 윤활유 공급압을 재점검하시기 바랍니다."}
          </p>
        </div>
        
        {/* Buttons */}
        <div className="mt-4 flex gap-2.5 font-sans">
          <button 
            onClick={() => { setWorkOrderOpen(true); setAlimtalkOpen(false); }}
            className="flex-1 bg-[#3c2a20] hover:bg-[#52392c] text-white text-xs font-black py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5 transform hover:scale-[1.02]"
          >
            <Printer size={13} className="text-[#ffeb00]" />
            <span>{t.alimtalk.woPrintBtn}</span>
          </button>
          <button 
            onClick={() => setAlimtalkOpen(false)}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-4 py-3 rounded-xl transition-all"
          >
            {t.alimtalk.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
