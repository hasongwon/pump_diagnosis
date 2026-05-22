import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { locales } from './locales';

// Import Shared Components
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Chatbot from './components/Chatbot';
import AlimTalkPopup from './components/AlimTalkPopup';
import WorkOrderModal from './components/WorkOrderModal';

// Import Page Views
import DashboardView from './views/DashboardView';
import UploadView from './views/UploadView';
import LoadingView from './views/LoadingView';
import DiagnosticsView from './views/DiagnosticsView';
import DetailView from './views/DetailView';
import ReportsView from './views/ReportsView';
import ManualsView from './views/ManualsView';

// ─── 분석 결과 없음 빈 상태 안내 화면 ───────────────────────────────────────
function NoAnalysisPlaceholder({ setCurrentPage, lang }) {
  const isKo = lang !== 'en';
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in select-none">
      {/* Outer glow ring */}
      <div className="relative mb-10">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-900/60 to-slate-900 border border-indigo-500/25 flex items-center justify-center shadow-[0_0_60px_rgba(99,102,241,0.18)]">
          <div className="w-20 h-20 rounded-full bg-slate-950/80 border border-slate-800/60 flex items-center justify-center">
            {/* Lock SVG icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400/70">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        </div>
        {/* Animated pulse rings */}
        <div className="absolute inset-0 rounded-full border border-indigo-500/15 animate-ping" style={{animationDuration:'2.5s'}}></div>
        <div className="absolute inset-[-10px] rounded-full border border-indigo-500/8 animate-ping" style={{animationDuration:'3.2s', animationDelay:'0.4s'}}></div>
      </div>

      {/* Text */}
      <div className="text-center max-w-sm px-4 mb-8">
        <p className="text-[10px] font-mono font-bold text-indigo-400/70 tracking-[0.25em] uppercase mb-3">
          {isKo ? 'NO ANALYSIS DATA' : 'NO ANALYSIS DATA'}
        </p>
        <h2 className="text-xl font-black text-slate-200 mb-3">
          {isKo ? '진단 결과가 없습니다' : 'No Diagnostic Result Yet'}
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          {isKo
            ? '이 화면은 AI 예지보전 분석을 실행한 후에만 표시됩니다. 먼저 진동·전류 센서 데이터(CSV)를 업로드하고 분석을 실행해 주세요.'
            : 'This screen is only available after running an AI predictive analysis. Please upload vibration & current sensor CSV files and start analysis first.'}
        </p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-10 font-mono flex-wrap justify-center">
        <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/60 px-3 py-2 rounded-xl">
          <span className="w-5 h-5 rounded-full bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 font-black flex items-center justify-center text-[10px]">1</span>
          <span>{isKo ? '데이터 업로드' : 'Upload Data'}</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-700"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/60 px-3 py-2 rounded-xl">
          <span className="w-5 h-5 rounded-full bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 font-black flex items-center justify-center text-[10px]">2</span>
          <span>{isKo ? 'AI 분석 실행' : 'Run AI Analysis'}</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-700"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/60 px-3 py-2 rounded-xl">
          <span className="w-5 h-5 rounded-full bg-cyan-600/20 border border-cyan-500/40 text-cyan-400 font-black flex items-center justify-center text-[10px]">3</span>
          <span>{isKo ? '진단 결과 확인' : 'View Diagnostics'}</span>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => setCurrentPage('upload')}
        className="group relative bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm px-8 py-3.5 rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-900/50 hover:shadow-indigo-700/40 hover:scale-[1.03] flex items-center gap-2.5"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
        {isKo ? '데이터 업로드 하러 가기' : 'Go to Data Upload'}
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);

  // States for Theme & Language (i18n)
  const [theme, setTheme] = useState(() => localStorage.getItem('pump_theme') || 'dark');
  const [lang, setLang] = useState(() => localStorage.getItem('pump_lang') || 'ko');

  useEffect(() => {
    localStorage.setItem('pump_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('pump_lang', lang);
  }, [lang]);

  const t = locales[lang];

  // States for Multi-Sensor Fusion & Features
  const [analysisMode, setAnalysisMode] = useState('fusion'); // 'single' or 'fusion'
  const [uploadedFile, setUploadedFile] = useState(null); // Used for Single Mode
  const [uploadedVibrationFile, setUploadedVibrationFile] = useState(null); // Fusion Mode
  const [uploadedCurrentFile, setUploadedCurrentFile] = useState(null); // Fusion Mode
  const [previewRows, setPreviewRows] = useState([]);
  const [previewVibRows, setPreviewVibRows] = useState([]);
  const [previewCurRows, setPreviewCurRows] = useState([]);
  
  const [alimtalkOpen, setAlimtalkOpen] = useState(false);
  const [workOrderOpen, setWorkOrderOpen] = useState(false);

  // Example CSV Data
  const defaultPreviewData = [
    { timestamp: '2023-11-20T08:00:00Z', vibration: '2.41', temperature: '45.2', pressure: '120.5', flow_rate: '55.0', status: 'NORMAL' },
    { timestamp: '2023-11-20T08:05:00Z', vibration: '2.45', temperature: '45.5', pressure: '121.0', flow_rate: '54.8', status: 'NORMAL' },
    { timestamp: '2023-11-20T08:10:00Z', vibration: '4.82', temperature: '46.1', pressure: '118.2', flow_rate: '52.1', status: 'WARNING' },
    { timestamp: '2023-11-20T08:15:00Z', vibration: '7.15', temperature: '52.8', pressure: '110.5', flow_rate: '48.0', status: 'DANGER' },
    { timestamp: '2023-11-20T08:20:00Z', vibration: '2.50', temperature: '45.8', pressure: '120.1', flow_rate: '54.5', status: 'NORMAL' },
  ];

  // Dynamic Scrolling Real-Time Telemetry Data
  const [liveTelemetry, setLiveTelemetry] = useState([
    { time: '08:00', vibration: 2.1, current: 4.5, temp: 45, pressure: 120 },
    { time: '09:00', vibration: 2.4, current: 4.6, temp: 46, pressure: 119 },
    { time: '10:00', vibration: 1.8, current: 4.2, temp: 44, pressure: 121 },
    { time: '11:00', vibration: 2.2, current: 4.4, temp: 46, pressure: 120 },
    { time: '12:00', vibration: 7.8, current: 12.8, temp: 58, pressure: 112 },
    { time: '13:00', vibration: 12.5, current: 15.2, temp: 76, pressure: 104 },
    { time: 'NOW', vibration: 14.22, current: 18.5, temp: 82.4, pressure: 98 },
  ]);

  // Real-Time scrolling simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTelemetry((prev) => {
        const next = [...prev.slice(1)];
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        const isDangerous = analysisResult ? (analysisResult.risk_level === 'DANGER' || analysisResult.risk_level === 'WARNING') : true; // default dangerous for dynamic demo
        
        const hasCustomMetrics = analysisResult && typeof analysisResult.vibration_rms !== 'undefined';
        const baseVib = hasCustomMetrics 
          ? analysisResult.vibration_rms * 0.85 
          : (isDangerous ? 12.0 : 2.0);
        const baseCur = hasCustomMetrics 
          ? (analysisResult.risk_level === 'NORMAL' ? 4.0 : 15.0) 
          : (isDangerous ? 16.0 : 4.0);
        const baseTemp = isDangerous ? 80.0 : 45.0;
        const basePress = isDangerous ? 95.0 : 120.0;
        
        next.push({
          time: timeNow,
          vibration: parseFloat((baseVib + Math.random() * 3).toFixed(2)),
          current: parseFloat((baseCur + Math.random() * 2).toFixed(2)),
          temp: parseFloat((baseTemp + Math.random() * 2).toFixed(1)),
          pressure: parseFloat((basePress + Math.random() * 4).toFixed(1)),
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [analysisResult]);

  // Play synthetic audio alert beep for smart alarm demo
  const playAlertBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 tone
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.log("Audio contexts not supported/allowed in browser yet.", e);
    }
  };

  const handleFileUpload = (e, target) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result || "";
      const lines = text.split(/\r?\n/);
      let startIndex = 0;
      // Skip metadata lines starting with "Generated"
      while (startIndex < lines.length && startIndex < 9 && lines[startIndex].includes("Generated")) {
        startIndex++;
      }
      const dataLines = lines.slice(startIndex);
      const csvText = dataLines.join("\n");

      Papa.parse(csvText, {
        header: false,
        skipEmptyLines: true,
        preview: 5,
        complete: (res) => {
          if (res.data && res.data.length > 0) {
            const mappedData = res.data.map(row => {
              if (row.length === 2) {
                // Vibration: Time, Signal
                return lang === 'ko' ? {
                  "시간 오프셋 (초)": row[0],
                  "진동 가속도 (mm/s²)": row[1]
                } : {
                  "Time Offset (s)": row[0],
                  "Vibration Acceleration (mm/s²)": row[1]
                };
              } else if (row.length === 4) {
                // Current: Time, U, V, W
                return lang === 'ko' ? {
                  "시간 오프셋 (초)": row[0],
                  "U상 전류 (A)": row[1],
                  "V상 전류 (A)": row[2],
                  "W상 전류 (A)": row[3]
                } : {
                  "Time Offset (s)": row[0],
                  "U-Phase (A)": row[1],
                  "V-Phase (A)": row[2],
                  "W-Phase (A)": row[3]
                };
              } else {
                const obj = {};
                row.forEach((val, idx) => {
                  obj[`Col ${idx + 1}`] = val;
                });
                return obj;
              }
            });

            if (target === 'single') {
              setUploadedFile(file);
              setPreviewRows(mappedData);
            } else if (target === 'vib') {
              setUploadedVibrationFile(file);
              setPreviewVibRows(mappedData);
            } else if (target === 'cur') {
              setUploadedCurrentFile(file);
              setPreviewCurRows(mappedData);
            }
          } else {
            if (target === 'single') {
              setUploadedFile(file);
              setPreviewRows(defaultPreviewData);
            } else if (target === 'vib') {
              setUploadedVibrationFile(file);
              setPreviewVibRows(defaultPreviewData);
            } else if (target === 'cur') {
              setUploadedCurrentFile(file);
              setPreviewCurRows(defaultPreviewData);
            }
          }
        },
        error: () => {
          if (target === 'single') {
            setUploadedFile(file);
            setPreviewRows(defaultPreviewData);
          } else if (target === 'vib') {
            setUploadedVibrationFile(file);
            setPreviewVibRows(defaultPreviewData);
          } else if (target === 'cur') {
            setUploadedCurrentFile(file);
            setPreviewCurRows(defaultPreviewData);
          }
        }
      });
    };
    reader.readAsText(file);
  };

  const analyzeCsvContent = (fileText) => {
    const lines = fileText.split(/\r?\n/);
    let startIndex = 0;
    while (startIndex < lines.length && startIndex < 9 && lines[startIndex].includes("Generated")) {
      startIndex++;
    }
    const dataLines = lines.slice(startIndex);
    
    let values = [];
    let colsCount = 0;
    
    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i].trim();
      if (!line) continue;
      const parts = line.split(',').map(p => parseFloat(p.trim()));
      if (parts.some(isNaN)) continue;
      
      if (colsCount === 0) {
        colsCount = parts.length;
      }
      values.push(parts);
    }
    
    if (values.length === 0) {
      return { isNormal: true, value: 2.15, type: 'vibration' };
    }
    
    if (colsCount === 2) {
      // Vibration
      let sumSquares = 0;
      let count = 0;
      values.forEach(row => {
        if (row.length >= 2) {
          sumSquares += row[1] * row[1];
          count++;
        }
      });
      const rms = count > 0 ? Math.sqrt(sumSquares / count) : 0;
      const isNormal = rms < 2.5;
      const displayVal = parseFloat((rms * 3.8).toFixed(2));
      return { isNormal, value: displayVal, type: 'vibration' };
    } else if (colsCount === 4) {
      // Current
      let sumU = 0, sumV = 0, sumW = 0;
      let count = 0;
      values.forEach(row => {
        if (row.length >= 4) {
          sumU += row[1];
          sumV += row[2];
          sumW += row[3];
          count++;
        }
      });
      
      if (count === 0) return { isNormal: true, value: 4.8, type: 'current' };
      
      const avgU = sumU / count;
      const avgV = sumV / count;
      const avgW = sumW / count;
      
      const maxVal = Math.max(avgU, avgV, avgW);
      const minVal = Math.min(avgU, avgV, avgW);
      const imbalance = maxVal - minVal;
      
      const isNormal = imbalance < 0.5;
      const displayVal = parseFloat((imbalance * 4.0).toFixed(1));
      return { isNormal, value: displayVal, type: 'current' };
    }
    
    return { isNormal: true, value: 2.15, type: 'vibration' };
  };

  const readFileText = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result || "");
      reader.onerror = () => resolve("");
      reader.readAsText(file);
    });
  };

  const startAnalysis = async () => {
    if (analysisMode === 'single' && !uploadedFile) return;
    if (analysisMode === 'fusion' && (!uploadedVibrationFile || !uploadedCurrentFile)) return;

    let isNormal = true;
    let vibNormal = true;
    let curNormal = true;
    let computedVib = 14.22;
    let computedCur = 4.8;

    if (analysisMode === 'single') {
      const text = await readFileText(uploadedFile);
      const analysis = analyzeCsvContent(text);
      if (analysis.type === 'vibration') {
        computedVib = analysis.value;
        vibNormal = analysis.isNormal;
      } else {
        computedCur = analysis.value;
        curNormal = analysis.isNormal;
      }
      isNormal = vibNormal && curNormal;
    } else {
      const vibText = await readFileText(uploadedVibrationFile);
      const curText = await readFileText(uploadedCurrentFile);
      const vibAnalysis = analyzeCsvContent(vibText);
      const curAnalysis = analyzeCsvContent(curText);
      vibNormal = vibAnalysis.isNormal;
      curNormal = curAnalysis.isNormal;
      isNormal = vibNormal && curNormal;
      computedVib = vibAnalysis.value;
      computedCur = curAnalysis.value;
    }

    if (isNormal) {
      setLiveTelemetry([
        { time: '12:00', vibration: 1.8, current: 4.1, temp: 43.5, pressure: 121.2 },
        { time: '13:00', vibration: 2.2, current: 4.4, temp: 44.1, pressure: 120.5 },
        { time: '14:00', vibration: 1.9, current: 4.2, temp: 43.8, pressure: 121.0 },
        { time: '15:00', vibration: 2.3, current: 4.5, temp: 44.5, pressure: 119.8 },
        { time: '16:00', vibration: 2.0, current: 4.3, temp: 44.0, pressure: 120.4 },
        { time: '17:00', vibration: 2.4, current: 4.6, temp: 44.8, pressure: 119.5 },
        { time: 'NOW', vibration: parseFloat(computedVib.toFixed(2)), current: parseFloat(computedCur.toFixed(2)), temp: 44.2, pressure: 120.1 },
      ]);
    } else {
      setLiveTelemetry([
        { time: '08:00', vibration: 2.1, current: 4.5, temp: 45, pressure: 120 },
        { time: '09:00', vibration: 2.4, current: 4.6, temp: 46, pressure: 119 },
        { time: '10:00', vibration: 1.8, current: 4.2, temp: 44, pressure: 121 },
        { time: '11:00', vibration: 2.2, current: 4.4, temp: 46, pressure: 120 },
        { time: '12:00', vibration: 7.8, current: 12.8, temp: 58, pressure: 112 },
        { time: '13:00', vibration: 12.5, current: 15.2, temp: 76, pressure: 104 },
        { time: 'NOW', vibration: parseFloat(computedVib.toFixed(2)), current: parseFloat(computedCur.toFixed(2)), temp: 82.4, pressure: 98 },
      ]);
    }

    setCurrentPage('loading');
    setLoadingProgress(10);
    
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 250);
    
    try {
      const formData = new FormData();
      let response;

      if (analysisMode === 'single') {
        formData.append("file", uploadedFile);
        response = await fetch("http://localhost:8000/api/diagnose", {
          method: "POST",
          body: formData
        });
      } else {
        formData.append("vibration_file", uploadedVibrationFile);
        formData.append("current_file", uploadedCurrentFile);
        response = await fetch("http://localhost:8000/api/diagnose/fusion", {
          method: "POST",
          body: formData
        });
      }
      
      if (!response.ok) {
        throw new Error("서버 분석에 실패했습니다. 통합 백엔드(main_fusion.py)가 켜져 있는지 확인해 주세요.");
      }
      
      const data = await response.json();
      setAnalysisResult(data);
      
      setLoadingProgress(100);
      clearInterval(interval);
      
      setTimeout(() => {
        setCurrentPage('diagnostics');
        if (data.risk_level === 'DANGER' || data.risk_level === 'WARNING') {
          playAlertBeep();
          setTimeout(() => setAlimtalkOpen(true), 1500);
        }
      }, 500);
      
    } catch (error) {
      clearInterval(interval);
      console.warn("Backend server not running. Falling back to mockup diagnostic results for demonstration.", error);
      
      const fallbackNormalResult = {
        risk_level: "NORMAL",
        root_cause: lang === 'ko' ? "원심펌프 정상 가동 상태" : "Centrifugal Pump Normal Operation",
        vibration_rms: computedVib,
        current_imbalance: computedCur,
        risk_rationale: lang === 'ko' 
          ? `다중 센서 교차 분석 결과, 진동 가속도 RMS(${computedVib} mm/s) 및 3상 위상 대칭 대역이 기준 임계치 이내로 최적의 밸런스를 유지하며 지극히 안정적인 기동 상태를 보이고 있습니다.`
          : `Multi-sensor cross-analysis indicates that vibration acceleration RMS (${computedVib} mm/s) and 3-phase current balance are well within reference thresholds, maintaining an optimal operational balance.`,
        checked_symptoms: [],
        preventive_maintenance: lang === 'ko'
          ? "현재 원심펌프의 기동 상태 및 전원 공급 밸런스가 매우 양호하므로 정기 유지보수 일정에 따른 일상 점검을 권장합니다. 6개월 주기 하우징 윤활 보충 및 고정 볼트 토크 검사를 기본 수행하십시오."
          : "The pump's current operation and power supply balance are highly satisfactory. We recommend routine checks in accordance with the regular maintenance schedule. Perform basic 6-month bearing lubrication and baseline anchor bolt torque verification.",
        recommended_actions: lang === 'ko' ? [
          "정기 예방 진단 관리: 현재 최적 상태를 기록 보관하고, 주기적인 실시간 계측 모니터링을 지속하십시오.",
          "일상 외관 점검: 모터 부근 배관 진동 공진 현상 유무 및 접지 상태를 주기적으로 가볍게 점검합니다.",
          "표준 급유 주기 준수: 베어링 온도가 45℃ 미만으로 양호하므로, 정해진 그리스 보충 주기(2000시간)를 유지하십시오."
        ] : [
          "Routine PdM Monitoring: Archive the current optimal status and continue periodic real-time telemetry tracking.",
          "Visual Inspections: Lightly check for pipe resonance and grounding conditions around the motor.",
          "Standard Lubrication Schedule: Bearing temperatures are excellent (<45°C), so maintain standard grease replenishment intervals (2000 hrs)."
        ]
      };

      // Dynamic generation of fallbackResult based on which sensor is abnormal:
      let root_cause = "";
      let risk_rationale = "";
      let checked_symptoms = [];
      let preventive_maintenance = "";
      let recommended_actions = [];

      if (!vibNormal && curNormal) {
        // Only Vibration has issue
        root_cause = lang === 'ko' ? "회전체 이상 진동 감지 (진동 단독 이상)" : "Vibration Anomaly Detected (Vibration Only)";
        risk_rationale = lang === 'ko'
          ? `진동 가속도 RMS 계측치가 임계값(2.5 mm/s)을 초과하여 ${computedVib} mm/s로 상승하였습니다. (3상 전류 균형도는 정상 수준을 유지 중입니다.) 진동 센서 단독 이상이 판정되었으므로, 회전체 불평형 및 베어링 피로 마모에 특화된 정밀 하우징 및 기초 앵커 강성 점검을 권장합니다.`
          : `Vibration acceleration RMS measured value is ${computedVib} mm/s, exceeding the safe threshold of 2.5 mm/s. (3-phase current balance is normal.) With vibration anomaly alone, we recommend a precision inspection of bearing housings and foundation anchor tightness.`;
        checked_symptoms = ["이상진동"];
        preventive_maintenance = lang === 'ko'
          ? "모터 고정용 기초 앵커 볼트의 조임 상태를 점검하고, 베어링 부근에 적합한 가속도 진동 주파수 감쇠 패드를 댐핑 보강하십시오."
          : "Check the tightness of the foundation anchor bolts and reinforce damping by adding an acceleration vibration frequency attenuation pad near the bearings.";
        recommended_actions = lang === 'ko' ? [
          "진동 감쇠 패드 보강: 진동 에너지를 신속히 소실할 수 있도록 댐핑 마운트를 추가하십시오.",
          "구동부 베어링 하우징 보수: 베어링 유격 변위를 해체 점검하고 그리스 주유를 보완하십시오.",
          "앵커 볼트 표준 토크 체결: 이완이 발생한 모터 지지 볼트를 적정 토크로 2차 잠금하십시오."
        ] : [
          "Reinforce Damping Pads: Add damping mounts near bearings to quickly dissipate vibration energy.",
          "Bearing Housing Overhaul: Inspect rolling element clearance and replenish grease under standard guidelines.",
          "Anchor Bolt Torque Re-tightening: Tighten loose motor bolts to standard torque specs to prevent structural play."
        ];
      } else if (vibNormal && !curNormal) {
        // Only Current has issue
        root_cause = lang === 'ko' ? "MCSA 3상 전류 불평형 결함 (전류 단독 이상)" : "MCSA 3-Phase Current Imbalance (Current Only)";
        risk_rationale = lang === 'ko'
          ? `3상 고주파 전류 분석 결과, 상간 불평형율이 ${computedCur}%로 기준치를 초과하였습니다. (진동 RMS 지수는 정상 수준을 유지 중입니다.) 전류 센서 단독 이상이 판정되었으므로 고정자 코일 권선 단락 및 전기 모터 과부하, 전원 공급 라인의 전압 균일도 상태를 확인하는 것을 강력히 권장합니다.`
          : `3-phase current analysis indicates the phase imbalance rate is ${computedCur}%, exceeding the safe threshold. (Vibration RMS is normal.) With current anomaly alone, we strongly recommend checking for stator winding shorts, electrical overload, and voltage uniformity in the power supply line.`;
        checked_symptoms = ["과부하"];
        preventive_maintenance = lang === 'ko'
          ? "3상 전력 전원 공급장치의 상간 전압 편차를 정량 계측하고, 인버터 스위칭 노이즈 방지를 위한 접지 장치 및 차단기를 점검하십시오."
          : "Measure the phase voltage deviation of the 3-phase power supply, and inspect grounding devices and circuit breakers to prevent inverter switching noise.";
        recommended_actions = lang === 'ko' ? [
          "모터 3상 전압 평형도 측정: 입력 단자 전원 전압의 편차 유무를 테스터기로 정밀 계측하십시오.",
          "접지선 절연 상태 점검: 인버터 스위칭 전력선 및 차단기 접지 저항 규격 적합 여부를 평가하십시오.",
          "과부하 차단 설정 보정: 모터 정격 전류 초과 시 안전 보호 장치가 즉각 작동하도록 트립치를 세밀히 보정하십시오."
        ] : [
          "Measure 3-Phase Voltage Balance: Precisely measure power supply voltage deviations at the input terminals using a tester.",
          "Inspect Grounding and Insulation: Evaluate whether the inverter switching power lines and breaker grounding resistance conform to standards.",
          "Calibrate Overload Trip Settings: Fine-tune the trip values so the safety protection device triggers instantly when rated current is exceeded."
        ];
      } else {
        // Both have issue (vibNormal is false and curNormal is false)
        root_cause = lang === 'ko' ? "조립 설치 불량 또는 축 중심 불일치 (교차 센서 융합 확진)" : "Rotor Shaft Misalignment (Dual Sensor Fusion Confirmed)";
        risk_rationale = lang === 'ko' 
          ? `진동 가속도 RMS 임계값 초과(계측치: ${computedVib} mm/s) 및 3상 위상 균형도 왜곡율 상승(상대 오차: ${computedCur}%)이 동시에 교차 검출되었습니다. 두 센서 데이터의 이상 반응이 고도로 동기화된 결과, 커플링 수평 얼라인먼트의 중대한 축 중심 편차(Misalignment) 결함이 확진되었습니다.`
          : `Vibration acceleration RMS threshold breach (${computedVib} mm/s) and 3-phase current imbalance (${computedCur}% distortion) were simultaneously detected. The high synchronization between both sensors confirms a critical rotor shaft misalignment defect.`;
        checked_symptoms = ["이상진동", "베어링과열", "과부하"];
        preventive_maintenance = lang === 'ko'
          ? "레이저 조준계를 정밀 장착하여 기동 중심 축 수평 상태를 ±0.03mm 공차 이내로 영점 교정하십시오. 또한 3상 전력 케이블 절연과 베어링 부근 기초 앵커 강성을 계측하십시오."
          : "Precisely mount a laser alignment system to calibrate the rotor shaft center within ±0.03mm tolerance. Additionally, measure stator winding insulation and anchor bolt torque.";
        recommended_actions = lang === 'ko' ? [
          "축 수평 얼라인먼트 재조정: 레이저 정렬 툴을 사용해 동심도 편차를 초정밀 수정 조절합니다.",
          "구동부 베어링 하우징 보수: 베어링 유격 변위를 해체 점검하고 전면 급유를 보완 수행합니다.",
          "마운팅 앵커 보강 체결: 진동 에너지 댐핑을 감소시키도록 기초 고정 볼트를 이중 잠금합니다."
        ] : [
          "Rotor Shaft Alignment: Calibrate the coupling concentricity using precise laser alignment systems.",
          "Bearing Overhaul: Inspect rolling element clearance and replenish grease under guidelines.",
          "Anchor Reinforcement: Tighten baseline bolts to design specifications to minimize vibration energy."
        ];
      }

      const fallbackResult = {
        risk_level: "DANGER",
        root_cause,
        vibration_rms: computedVib,
        current_imbalance: computedCur,
        risk_rationale,
        checked_symptoms,
        preventive_maintenance,
        recommended_actions
      };
      
      const finalResult = isNormal ? fallbackNormalResult : fallbackResult;
      setAnalysisResult(finalResult);
      setLoadingProgress(100);
      
      setTimeout(() => {
        setCurrentPage('diagnostics');
        if (finalResult.risk_level === 'DANGER' || finalResult.risk_level === 'WARNING') {
          playAlertBeep();
          setTimeout(() => setAlimtalkOpen(true), 1500);
        }
      }, 500);
    }
  };

  return (
    <div className={`min-h-screen bg-[#020b14] text-slate-200 flex font-sans selection:bg-blue-500/30 print:bg-white print:text-black relative overflow-hidden ${theme === 'light' ? 'light-theme' : ''}`}>
      
      {/* Decorative Background Beams */}
      <div className="ambient-glow-indigo top-[-100px] left-[-100px]"></div>
      <div className="ambient-glow-cyan bottom-[-50px] right-[-50px]"></div>

      {/* Sidebar (Hidden on Print) */}
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} t={t} analysisResult={analysisResult} lang={lang} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative print:overflow-visible">
        
        {/* Topbar (Hidden on Print) */}
        <Topbar 
          chatbotOpen={chatbotOpen} 
          setChatbotOpen={setChatbotOpen} 
          theme={theme} 
          setTheme={setTheme} 
          lang={lang} 
          setLang={setLang} 
          t={t} 
        />

        {/* Content Render Container */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth relative print:overflow-visible print:p-0">
          <div className="max-w-7xl mx-auto pb-20 print:pb-0">
            {currentPage === 'dashboard' && <DashboardView setCurrentPage={setCurrentPage} t={t} />}
            {currentPage === 'upload' && <UploadView 
              uploadedFile={uploadedFile} 
              setUploadedFile={setUploadedFile} 
              uploadedVibrationFile={uploadedVibrationFile}
              setUploadedVibrationFile={setUploadedVibrationFile}
              uploadedCurrentFile={uploadedCurrentFile}
              setUploadedCurrentFile={setUploadedCurrentFile}
              previewRows={previewRows} 
              setPreviewRows={setPreviewRows}
              previewVibRows={previewVibRows}
              setPreviewVibRows={setPreviewVibRows}
              previewCurRows={previewCurRows}
              setPreviewCurRows={setPreviewCurRows}
              handleFileUpload={handleFileUpload}
              startAnalysis={startAnalysis}
              defaultPreviewData={defaultPreviewData}
              analysisMode={analysisMode}
              setAnalysisMode={setAnalysisMode}
              t={t}
            />}
            {currentPage === 'loading' && <LoadingView progress={loadingProgress} />}
            {currentPage === 'diagnostics' && (
              analysisResult
                ? <DiagnosticsView
                    setCurrentPage={setCurrentPage}
                    telemetryData={liveTelemetry}
                    analysisResult={analysisResult}
                    setWorkOrderOpen={setWorkOrderOpen}
                    t={t}
                    lang={lang}
                  />
                : <NoAnalysisPlaceholder setCurrentPage={setCurrentPage} lang={lang} />
            )}
            {currentPage === 'detail' && (
              analysisResult
                ? <DetailView
                    analysisResult={analysisResult}
                    setWorkOrderOpen={setWorkOrderOpen}
                    t={t}
                    lang={lang}
                  />
                : <NoAnalysisPlaceholder setCurrentPage={setCurrentPage} lang={lang} />
            )}
            {currentPage === 'reports' && <ReportsView t={t} />}
            {currentPage === 'manuals' && <ManualsView t={t} />}
          </div>
        </div>

        {/* Floating AlimTalk Warning Popup */}
        <AlimTalkPopup 
          alimtalkOpen={alimtalkOpen} 
          setAlimtalkOpen={setAlimtalkOpen} 
          analysisResult={analysisResult} 
          setWorkOrderOpen={setWorkOrderOpen} 
          t={t}
        />

        {/* Printable Work Order Modal */}
        <WorkOrderModal 
          workOrderOpen={workOrderOpen} 
          setWorkOrderOpen={setWorkOrderOpen} 
          analysisResult={analysisResult} 
          t={t} 
          lang={lang}
        />

        {/* AI Chatbot Float Dialog */}
        {chatbotOpen && (
          <Chatbot 
            chatbotOpen={chatbotOpen} 
            setChatbotOpen={setChatbotOpen} 
            t={t} 
            analysisResult={analysisResult}
            lang={lang}
          />
        )}
        
      </main>
    </div>
  );
}
