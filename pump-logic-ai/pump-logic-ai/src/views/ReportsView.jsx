import React, { useState, useMemo } from 'react';
import { FileText, ChevronRight, ChevronDown, Calendar, CalendarDays, ArrowLeft, ArrowRight, X, Zap } from 'lucide-react';
import {
  generateReportsForDay,
  summarizeDay,
  formatDateLabel,
  getWeekStart,
  addWeeks,
  getMonthStart,
  addMonths,
} from '../reportUtils';

// ─── 리포트 상세 모달 ─────────────────────────────────────────────────────────
function ReportDetailModal({ report, isEn, onClose }) {
  if (!report) return null;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl shadow-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto font-sans" onClick={e => e.stopPropagation()}>
        {/* Ambient */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/8 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/8 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-slate-800/80 mb-5">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
              <Zap size={18} className="animate-pulse" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-black text-white leading-snug break-words">{report.title}</h2>
              <p className="text-[9px] text-indigo-400 font-mono tracking-wider mt-0.5 font-bold uppercase">
                {isEn ? '• MULTI-SENSOR AI FUSION ANALYSIS' : '• 다중 센서 AI 교차 예지보전 분석'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0 ml-3">
            <X size={15} />
          </button>
        </div>

        {/* Keypoints grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5 text-[10.5px] font-mono">
          <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-800/60 flex flex-col justify-between">
            <span className="text-[9px] text-slate-500 uppercase font-semibold block">{isEn ? 'Diagnostic State' : '실시간 판정 등급'}</span>
            <span className={`px-2 py-0.5 rounded text-[9.5px] font-black border inline-block mt-2 text-center w-full ${report.tagColor}`}>
              {report.statusLabel}
            </span>
          </div>
          <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-800/60 flex flex-col justify-between">
            <span className="text-[9px] text-slate-500 uppercase font-semibold block">{isEn ? 'Analysis Scope' : '데이터 수집 시간'}</span>
            <span className="text-white font-extrabold text-[10.5px] block mt-2 text-center">{isEn ? '3 Hours Continuous' : '3시간 연속 계측'}</span>
          </div>
          <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-800/60 flex flex-col justify-between">
            <span className="text-[9px] text-slate-500 uppercase font-semibold block">{isEn ? 'Collected At' : '진단 타겟 시점'}</span>
            <span className="text-cyan-400 font-extrabold text-[10.5px] block mt-2 text-center">{report.timelineEnd}</span>
          </div>
          <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-800/60 flex flex-col justify-between">
            <span className="text-[9px] text-slate-500 uppercase font-semibold block">{isEn ? 'AI Consensus' : '알고리즘 합의율'}</span>
            <span className="text-indigo-400 font-extrabold text-[10.5px] block mt-2 text-center">96.4% Agreement</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-slate-950/40 border border-slate-800/50 rounded-2xl p-4 mb-5">
          <span className="text-[9px] text-slate-500 uppercase font-black tracking-wider block mb-3">
            {isEn ? 'Telemetry Acquisition Timeline' : '실시간 계측 데이터 파이프라인 수집 타임라인'}
          </span>
          <div className="relative flex items-center justify-between px-2 pt-2 pb-2 font-mono text-[9px]">
            <div className="absolute left-6 right-6 top-[22px] h-0.5 bg-slate-800">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 w-full shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
            </div>
            {[
              { label: report.timelineStart, sub: isEn ? 'Start Capture' : '수집 시작', color: 'border-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.6)]', dot: 'bg-cyan-400' },
              { label: '1.5h Ingest',        sub: isEn ? 'Streaming Live' : '연속 스트리밍 유입',  color: 'border-indigo-500', dot: 'bg-indigo-500 animate-pulse' },
              { label: report.timelineEnd,   sub: isEn ? 'Verdict Output' : 'AI 모델 진단완료', color: 'border-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]', dot: 'bg-emerald-400 animate-ping' },
            ].map((pt, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full bg-slate-900 border-2 ${pt.color} flex items-center justify-center`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${pt.dot}`} />
                </div>
                <span className="text-slate-300 font-bold mt-1.5">{pt.label}</span>
                <span className="text-[7.5px] text-slate-500 uppercase font-bold tracking-tight mt-0.5">{pt.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Telemetry metrics */}
        <div className="grid grid-cols-4 gap-2 mb-5 font-mono text-[10px]">
          {[['VIB_X', report.metrics.vib, report.statusType === 'DANGER' ? 'text-rose-400' : ''],
            ['TEMP',  report.metrics.temp, ''],
            ['PRESS', report.metrics.press, report.statusType === 'WARNING' ? 'text-amber-400' : ''],
            ['FLOW',  report.metrics.flow, '']].map(([k, v, cls]) => (
            <div key={k} className="bg-slate-950/40 border border-slate-800/50 rounded-xl p-2.5 text-center">
              <div className="text-slate-500 text-[8px] uppercase mb-1">{k}</div>
              <div className={`font-black ${cls || 'text-slate-200'}`}>{v}</div>
            </div>
          ))}
        </div>

        {/* Engineering explanation */}
        <div className="bg-slate-950/40 border border-slate-800/50 rounded-2xl p-4 mb-5 text-[11px] leading-relaxed">
          <div className="flex justify-between items-center mb-2.5 pb-1.5 border-b border-slate-900">
            <h4 className="text-[9.5px] text-slate-500 font-extrabold uppercase tracking-wider">
              {isEn ? 'AI Engineering Verdict Analysis' : 'AI 공학 알고리즘 세부 판정 소견'}
            </h4>
            <span className="text-[9px] text-cyan-400 font-mono font-bold tracking-tight max-w-[50%] text-right">
              {isEn ? 'Anomaly:' : '감지 결함군:'} {report.keyAnomaly}
            </span>
          </div>
          <p className="text-slate-200 text-justify leading-relaxed font-medium">{report.explanation}</p>
        </div>

        {/* Recommended actions */}
        <div className="mb-5 text-[10.5px]">
          <h4 className="text-[9.5px] text-slate-500 font-bold uppercase tracking-wider mb-2">
            {isEn ? 'Recommended Field SOP Countermeasures' : '계측 분석 결과 기반 현장 권장 정비 대책'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {report.actions.map((action, i) => {
              const numColor = report.statusType === 'DANGER' ? 'text-rose-400' : report.statusType === 'WARNING' ? 'text-amber-400' : 'text-emerald-400';
              return (
                <div key={i} className="bg-slate-950/30 border border-slate-800/40 rounded-xl p-2.5 flex items-start space-x-2">
                  <span className={`${numColor} font-black shrink-0`}>{report.statusType === 'NORMAL' ? '✔' : `${i + 1}`}</span>
                  <span className="text-slate-300 font-medium">{action}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Close button */}
        <div className="flex justify-end pt-3 border-t border-slate-800/80">
          <button onClick={onClose} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black px-6 py-2.5 rounded-xl transition-all shadow-md hover:scale-[1.01]">
            {isEn ? 'Confirm Verification' : '진단 확인 완료'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 상태 도트 배지 ───────────────────────────────────────────────────────────
function StatusDots({ sum }) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-bold">
      <span className="flex items-center gap-1 text-rose-400"><span className="w-1.5 h-1.5 rounded-full bg-rose-400" />{sum.danger}</span>
      <span className="flex items-center gap-1 text-amber-400"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />{sum.warning}</span>
      <span className="flex items-center gap-1 text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{sum.normal}</span>
      <span className="text-slate-600 font-mono ml-1 text-[9px]">8개</span>
    </div>
  );
}

// ─── 날짜 행 (접기/펼치기) ───────────────────────────────────────────────────
function DayRow({ date, isToday, isEn, expandedDays, toggleDay }) {
  const dateKey  = date.toDateString();
  const isOpen   = expandedDays.has(dateKey);
  const label    = formatDateLabel(date, isEn);
  const reports  = useMemo(() => generateReportsForDay(date, isEn), [date, isEn]);
  const sum      = useMemo(() => summarizeDay(date), [date]);
  const [selectedReport, setSelectedReport] = useState(null);

  return (
    <div className="rounded-2xl border border-slate-800/60 overflow-hidden shadow-lg">
      <button
        onClick={() => toggleDay(dateKey)}
        className={`w-full flex items-center justify-between px-5 py-4 transition-all duration-200 group ${
          isOpen ? 'bg-indigo-600/10 border-b border-indigo-500/20' : 'bg-slate-900/60 hover:bg-slate-900/90'
        }`}
      >
        <div className="flex items-center gap-3">
          {isOpen
            ? <ChevronDown size={15} className="text-indigo-400 shrink-0" />
            : <ChevronRight size={15} className="text-slate-500 group-hover:text-slate-300 shrink-0" />
          }
          <span className={`font-black text-sm transition-colors ${isOpen ? 'text-indigo-300' : 'text-slate-300 group-hover:text-slate-100'}`}>
            {label}
          </span>
          {isToday && (
            <span className="text-[9px] font-black bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full animate-pulse">TODAY</span>
          )}
        </div>
        <StatusDots sum={sum} />
      </button>

      {isOpen && (
        <div className="divide-y divide-slate-800/50 bg-slate-950/30">
          {reports.map((report, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedReport(report)}
              className="flex justify-between items-center px-5 py-3.5 hover:bg-slate-900/50 transition-colors group cursor-pointer"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className={`w-8 h-8 rounded-lg ${report.iconBg} border ${report.iconBorder} flex items-center justify-center ${report.iconColor} shrink-0 group-hover:scale-105 transition-transform`}>
                  <FileText size={14} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-200 group-hover:text-slate-100 text-[12px] truncate max-w-[380px]" title={report.title}>
                    {report.title}
                  </h3>
                  <p className="text-slate-500 font-mono text-[9px] mt-0.5 tracking-wide">
                    {report.id} • {report.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`${report.badgeCls} px-2.5 py-0.5 rounded-md font-black text-[9.5px] border`}>{report.statusLabel}</span>
                <ChevronRight size={14} className="text-slate-700 group-hover:text-slate-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedReport && (
        <ReportDetailModal report={selectedReport} isEn={isEn} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  );
}

// ─── 월간 달력 뷰 ─────────────────────────────────────────────────────────────
function MonthlyCalendar({ currentMonthStart, today, isEn }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [expandedDays, setExpandedDays]  = useState(() => new Set([today.toDateString()]));

  const toggleDay = (key) => {
    setExpandedDays(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const year  = currentMonthStart.getFullYear();
  const month = currentMonthStart.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // 해당 달 1일의 요일 (월요일 기준으로 조정)
  const firstDow = new Date(year, month, 1).getDay(); // 0=일
  const offsetCells = firstDow === 0 ? 6 : firstDow - 1; // 월요일 시작

  const DOW_LABELS = isEn
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['월', '화', '수', '목', '금', '토', '일'];

  const calCells = [];
  for (let i = 0; i < offsetCells; i++) calCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calCells.push(new Date(year, month, d));

  return (
    <div className="space-y-4">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 text-center text-[10px] font-black text-slate-500 uppercase tracking-wider">
        {DOW_LABELS.map(d => <div key={d}>{d}</div>)}
      </div>

      {/* 달력 그리드 */}
      <div className="grid grid-cols-7 gap-1.5">
        {calCells.map((date, idx) => {
          if (!date) return <div key={`empty-${idx}`} />;
          const isFuture = date > today;
          const isToday  = date.toDateString() === today.toDateString();
          const sum      = isFuture ? { danger: 0, warning: 0, normal: 0 } : summarizeDay(date);
          const dominant = sum.danger > 0 ? 'danger' : sum.warning > 0 ? 'warning' : 'normal';

          return (
            <button
              key={date.toDateString()}
              disabled={isFuture}
              onClick={() => !isFuture && setSelectedDate(selectedDate?.toDateString() === date.toDateString() ? null : date)}
              className={`
                rounded-xl p-2 text-center transition-all duration-200 border relative
                ${isFuture
                  ? 'opacity-25 cursor-not-allowed border-transparent bg-transparent'
                  : selectedDate?.toDateString() === date.toDateString()
                    ? 'bg-indigo-600/20 border-indigo-500/50 shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                    : isToday
                      ? 'bg-cyan-500/10 border-cyan-500/40'
                      : 'bg-slate-900/50 border-slate-800/40 hover:bg-slate-800/60 hover:border-slate-700/60'
                }
              `}
            >
              <div className={`text-[11px] font-black mb-1 ${isToday ? 'text-cyan-400' : 'text-slate-300'}`}>
                {date.getDate()}
              </div>
              {!isFuture && (
                <div className="flex justify-center gap-0.5 flex-wrap">
                  {sum.danger  > 0 && <span className="w-1 h-1 rounded-full bg-rose-400" />}
                  {sum.warning > 0 && <span className="w-1 h-1 rounded-full bg-amber-400" />}
                  {sum.normal  > 0 && <span className="w-1 h-1 rounded-full bg-emerald-400" />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 선택된 날짜 리포트 리스트 */}
      {selectedDate && (
        <div className="mt-4 animate-fade-in">
          <DayRow
            date={selectedDate}
            isToday={selectedDate.toDateString() === today.toDateString()}
            isEn={isEn}
            expandedDays={new Set([selectedDate.toDateString()])}
            toggleDay={() => {}}
          />
        </div>
      )}
    </div>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────
export default function ReportsView({ t }) {
  const isEn = t.sidebar.dashboard === "Main Dashboard";

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [activeTab,   setActiveTab]   = useState('weekly');
  const [weekOffset,  setWeekOffset]  = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);

  const currentWeekStart  = useMemo(() => addWeeks(getWeekStart(today), weekOffset),   [today, weekOffset]);
  const currentMonthStart = useMemo(() => addMonths(getMonthStart(today), monthOffset), [today, monthOffset]);

  const [expandedDays, setExpandedDays] = useState(() => new Set([today.toDateString()]));
  const toggleDay = (key) => setExpandedDays(prev => {
    const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next;
  });

  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeekStart);
      d.setDate(d.getDate() + i);
      if (d > today && weekOffset === 0) break;
      days.push(d);
    }
    return days.reverse();
  }, [currentWeekStart, today, weekOffset]);

  const weekLabel = useMemo(() => {
    const end = new Date(currentWeekStart); end.setDate(end.getDate() + 6);
    const sm = currentWeekStart.getMonth() + 1, sd = currentWeekStart.getDate();
    const em = end.getMonth() + 1,              ed = end.getDate();
    return isEn ? `${sm}/${sd} – ${em}/${ed}` : `${sm}월 ${sd}일 – ${em}월 ${ed}일`;
  }, [currentWeekStart, isEn]);

  const monthLabel = useMemo(() => {
    const m = currentMonthStart.getMonth() + 1, y = currentMonthStart.getFullYear();
    return isEn ? `${y} / ${String(m).padStart(2,'0')}` : `${y}년 ${m}월`;
  }, [currentMonthStart, isEn]);

  return (
    <div className="space-y-6 animate-fade-in print:hidden font-sans pb-10">
      {/* 헤더 */}
      <div className="border-b border-slate-900 pb-5">
        <h1 className="text-xl font-black text-slate-100 mb-1 tracking-wide">{t.reports.archiveTitle}</h1>
        <p className="text-slate-500 text-xs leading-relaxed">{t.reports.archiveDesc}</p>
      </div>

      {/* 탭 + 네비게이션 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center bg-slate-900/60 border border-slate-800/60 rounded-xl p-1 gap-1">
          {[
            { id: 'weekly',  icon: <Calendar size={13} />,     label: isEn ? 'Weekly'  : '주간 보기' },
            { id: 'monthly', icon: <CalendarDays size={13} />, label: isEn ? 'Monthly' : '월간 보기' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs transition-all duration-200 ${
                activeTab === tab.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => activeTab === 'weekly' ? setWeekOffset(w => w - 1) : setMonthOffset(m => m - 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all"
          ><ArrowLeft size={14} /></button>
          <span className="text-xs font-black text-slate-300 min-w-[150px] text-center font-mono">
            {activeTab === 'weekly' ? weekLabel : monthLabel}
          </span>
          <button
            onClick={() => { if (activeTab === 'weekly' && weekOffset < 0) setWeekOffset(w => w + 1); if (activeTab === 'monthly' && monthOffset < 0) setMonthOffset(m => m + 1); }}
            disabled={(activeTab === 'weekly' && weekOffset === 0) || (activeTab === 'monthly' && monthOffset === 0)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          ><ArrowRight size={14} /></button>
        </div>
      </div>

      {/* 콘텐츠 */}
      {activeTab === 'weekly' ? (
        <div className="space-y-3">
          {weekDays.map(date => (
            <DayRow
              key={date.toDateString()}
              date={date}
              isToday={date.toDateString() === today.toDateString()}
              isEn={isEn}
              expandedDays={expandedDays}
              toggleDay={toggleDay}
            />
          ))}
        </div>
      ) : (
        <MonthlyCalendar currentMonthStart={currentMonthStart} today={today} isEn={isEn} />
      )}

      {/* 하단 범례 */}
      <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-900">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400" />{isEn ? 'Danger' : '위험 감지'}</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" />{isEn ? 'Warning' : '주의 요망'}</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" />{isEn ? 'Normal' : '정상 가동'}</span>
        <span className="ml-auto">{isEn ? '8 reports / day · Click report to view AI analysis' : '하루 8건 · 리포트 클릭 시 AI 분석 상세 확인'}</span>
      </div>
    </div>
  );
}
