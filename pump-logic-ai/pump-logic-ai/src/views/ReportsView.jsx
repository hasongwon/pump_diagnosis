import React from 'react';
import { FileText, ChevronRight } from 'lucide-react';

export default function ReportsView({ t }) {
  const isEn = t.sidebar.dashboard === "Main Dashboard";

  const generateReports = () => {
    const reports = [];
    const baseDate = new Date(); // 현재 시간 기준
    
    const reportConfigs = [
      {
        titleKo: "축정렬 불량 및 커플링 편차 (진동+전류 이중 융합 확진)",
        titleEn: "Shaft Misalignment & Coupling Anomaly (Vib+Current Dual Fusion Confirmed)",
        statusType: "DANGER",
        statusKo: "위험 감지",
        statusEn: "DANGER",
        dayOffset: 0, // 오늘
        hourOffset: 3, // 3시간 전
        prefix: "WO"
      },
      {
        titleKo: "모터 구동 베어링 구름 마모 및 그리스 충진 경고 (단일 센서)",
        titleEn: "Motor Drive Bearing Wear & Grease Replenishment Alert (Single Sensor)",
        statusType: "WARNING",
        statusKo: "주의 요망",
        statusEn: "WARNING",
        dayOffset: 1, // 어제 (1일 전)
        hourOffset: 6,
        prefix: "DIAG"
      },
      {
        titleKo: "원심펌프 가동 개시 및 베이스 라인 정상 수립 리포트",
        titleEn: "Centrifugal Pump Commissioning & Baseline Stability Calibration Report",
        statusType: "NORMAL",
        statusKo: "정상 가동",
        statusEn: "NORMAL",
        dayOffset: 3, // 3일 전
        hourOffset: 9,
        prefix: "DIAG"
      },
      {
        titleKo: "임펠러 흡입구 공동 현상(Cavitation) 초기 와류 감지 보고서",
        titleEn: "Impeller Inlet Cavitation & Fluid Vortex Early Warning Report",
        statusType: "WARNING",
        statusKo: "주의 요망",
        statusEn: "WARNING",
        dayOffset: 7, // 7일 전
        hourOffset: 12,
        prefix: "DIAG"
      },
      {
        titleKo: "모터 고정자 권선 고온 과열 및 단락 이상 진단서 (MCSA 분석)",
        titleEn: "Motor Stator Winding Overheating & Short Circuit Fault Diagnosis (MCSA)",
        statusType: "DANGER",
        statusKo: "위험 감지",
        statusEn: "DANGER",
        dayOffset: 12, // 12일 전
        hourOffset: 15,
        prefix: "WO"
      },
      {
        titleKo: "자동 그리스 윤활 시스템 주입 장치 정기 점검 필터 교체 보고서",
        titleEn: "Automatic Grease Lubricator Dispatch & Filter Periodic Inspection Report",
        statusType: "NORMAL",
        statusKo: "정상 가동",
        statusEn: "NORMAL",
        dayOffset: 18, // 18일 전
        hourOffset: 18,
        prefix: "DIAG"
      },
      {
        titleKo: "원심펌프 브래킷 마운팅 볼트 느슨함 및 구조 공진 분석 보고서",
        titleEn: "Centrifugal Pump Bracket Mounting Bolt Looseness & Structural Resonance Report",
        statusType: "WARNING",
        statusKo: "주의 요망",
        statusEn: "WARNING",
        dayOffset: 24, // 24일 전
        hourOffset: 21,
        prefix: "DIAG"
      },
      {
        titleKo: "분기별 예방보전 모터 고정 벨트 처짐 계측 및 평행도 정렬 검증서",
        titleEn: "Quarterly PdM Drive Belt Tension Measurement & Pulley Alignment Validation",
        statusType: "NORMAL",
        statusKo: "정상 가동",
        statusEn: "NORMAL",
        dayOffset: 29, // 29일 전
        hourOffset: 24,
        prefix: "DIAG"
      }
    ];

    return reportConfigs.map((config, index) => {
      const targetDate = new Date(baseDate.getTime());
      targetDate.setDate(targetDate.getDate() - config.dayOffset);
      targetDate.setHours(targetDate.getHours() - config.hourOffset);

      const yyyy = targetDate.getFullYear();
      const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
      const dd = String(targetDate.getDate()).padStart(2, '0');
      const hh = String(targetDate.getHours()).padStart(2, '0');
      const min = String(targetDate.getMinutes()).padStart(2, '0');
      const dateStr = `${yyyy}.${mm}.${dd} ${hh}:${min} KST`;
      const idStr = `${config.prefix}-${yyyy}-${mm}-${dd}-00${index + 1}`;

      let iconColor = "text-emerald-400";
      let iconBg = "bg-emerald-500/10";
      let iconBorder = "border-emerald-500/25";
      let badgeText = "text-emerald-400";
      let badgeBg = "bg-emerald-500/15";
      let badgeBorder = "border-emerald-500/20";

      if (config.statusType === "DANGER") {
        iconColor = "text-rose-400";
        iconBg = "bg-rose-500/10";
        iconBorder = "border-rose-500/25";
        badgeText = "text-rose-400";
        badgeBg = "bg-rose-500/15";
        badgeBorder = "border-rose-500/20";
      } else if (config.statusType === "WARNING") {
        iconColor = "text-amber-400";
        iconBg = "bg-amber-500/10";
        iconBorder = "border-amber-500/25";
        badgeText = "text-amber-400";
        badgeBg = "bg-amber-500/15";
        badgeBorder = "border-amber-500/20";
      }

      return {
        title: isEn ? config.titleEn : config.titleKo,
        id: idStr,
        date: dateStr,
        status: isEn ? config.statusEn : config.statusKo,
        statusType: config.statusType,
        iconColor,
        iconBg,
        iconBorder,
        badgeText,
        badgeBg,
        badgeBorder
      };
    });
  };

  const reportsList = generateReports();

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
