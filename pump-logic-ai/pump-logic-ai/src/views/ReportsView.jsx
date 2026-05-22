import React from 'react';
import { FileText, ChevronRight } from 'lucide-react';

export default function ReportsView({ t }) {
  const isEn = t.sidebar.dashboard === "Main Dashboard";

  const reportsList = [
    { 
      title: isEn 
        ? "Shaft Misalignment & Coupling Anomaly (Vib+Current Dual Fusion Confirmed)" 
        : "축정렬 불량 및 커플링 편차 (진동+전류 이중 융합 확진)", 
      id: "WO-2026-05-22-001", 
      date: "2026.05.22 16:55 KST", 
      status: isEn ? "DANGER" : "위험 감지", 
      statusType: "DANGER",
      iconColor: "text-rose-400", 
      iconBg: "bg-rose-500/10", 
      iconBorder: "border-rose-500/25", 
      badgeText: "text-rose-400", 
      badgeBg: "bg-rose-500/15", 
      badgeBorder: "border-rose-500/20" 
    },
    { 
      title: isEn 
        ? "Motor Drive Bearing Wear & Grease Replenishment Alert (Single Sensor)" 
        : "모터 구동 베어링 구름 마모 및 그리스 충진 경고 (단일 센서)", 
      id: "DIAG-2023-09-24-001", 
      date: "2023.09.24 14:35 KST", 
      status: isEn ? "WARNING" : "주의 요망", 
      statusType: "WARNING",
      iconColor: "text-amber-400", 
      iconBg: "bg-amber-500/10", 
      iconBorder: "border-amber-500/25", 
      badgeText: "text-amber-400", 
      badgeBg: "bg-amber-500/15", 
      badgeBorder: "border-amber-500/20" 
    },
    { 
      title: isEn 
        ? "Centrifugal Pump Commissioning & Baseline Stability Calibration Report" 
        : "원심펌프 가동 개시 및 베이스 라인 정상 수립 리포트", 
      id: "DIAG-2023-09-23-001", 
      date: "2023.09.23 08:00 KST", 
      status: isEn ? "NORMAL" : "정상 가동", 
      statusType: "NORMAL",
      iconColor: "text-emerald-400", 
      iconBg: "bg-emerald-500/10", 
      iconBorder: "border-emerald-500/25", 
      badgeText: "text-emerald-400", 
      badgeBg: "bg-emerald-500/15", 
      badgeBorder: "border-emerald-500/20" 
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in print:hidden font-sans pb-10">
      <div className="border-b border-slate-900 pb-4">
        <h1 className="text-xl font-black text-slate-100 mb-1 tracking-wide">{t.reports.archiveTitle}</h1>
        <p className="text-slate-500 text-xs leading-relaxed">{t.reports.archiveDesc}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reportsList.map((report, idx) => (
          <div 
            key={idx} 
            className="glass-panel glass-panel-hover rounded-2xl p-5 hover:border-slate-700 transition-all flex justify-between items-center group cursor-pointer shadow-lg h-auto"
          >
            <div className="flex items-center space-x-4 min-w-0">
              <div className={`w-11 h-11 rounded-xl ${report.iconBg} border ${report.iconBorder} flex items-center justify-center ${report.iconColor} shrink-0 group-hover:scale-105 transition-transform`}>
                <FileText size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-slate-200 group-hover:text-slate-100 transition-colors text-[13px] truncate break-words">{report.title}</h3>
                <p className="text-slate-500 font-mono text-[9.5px] mt-1 tracking-wide">{report.id} • {report.date}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 shrink-0 text-xs">
              <span className={`${report.badgeBg} ${report.badgeText} px-2.5 py-0.5 rounded-md font-black text-[9.5px] border ${report.badgeBorder}`}>
                {report.status}
              </span>
              <ChevronRight className="text-slate-600 group-hover:text-slate-300 transition-colors" size={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
