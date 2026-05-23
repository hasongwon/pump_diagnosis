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
  const [analysisError, setAnalysisError] = useState(null);

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

  // 업로드 CSV 원본 데이터 (텔레메트리 그래프용)
  const [vibrationRawData, setVibrationRawData] = useState([]);
  const [currentRawData, setCurrentRawData] = useState([]);

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
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line && /^-?\d+(\.\d+)?,/.test(line)) {
          startIndex = i;
          break;
        }
      }
      if (startIndex === 0 && lines.length > 7) {
        startIndex = 7;
      }
      const dataLines = lines.slice(startIndex);
      const csvText = dataLines.join("\n");

      // ── 전체 CSV → 텔레메트리 그래프용 raw 저장 ─────────────────────
      Papa.parse(csvText, {
        header: false,
        skipEmptyLines: true,
        complete: (fullRes) => {
          if (fullRes.data && fullRes.data.length > 0) {
            const fullRows = fullRes.data
              .map(row => row.map(v => parseFloat(String(v).trim())))
              .filter(row => row.length >= 2 && !row.some(isNaN));
            if (target === 'vib') {
              setVibrationRawData(fullRows);
            } else if (target === 'cur') {
              setCurrentRawData(fullRows);
            } else if (target === 'single') {
              const cols = fullRows[0]?.length ?? 0;
              if (cols === 2) { setVibrationRawData(fullRows); setCurrentRawData([]); }
              else if (cols >= 4) { setCurrentRawData(fullRows); setVibrationRawData([]); }
            }
          }
        }
      });

      // ── 미리보기 5행 파싱 (화면 표시용) ─────────────────────────────────
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

  // ── 실제 CSV 데이터 → 텔레메트리 포인트 배열 변환 ──────────────────────
  const buildRealTelemetry = (vibRows, curRows, fallbackVib, fallbackCur, isDanger) => {
    const N = 50;
    const sample = (arr, n) => {
      if (!arr || arr.length === 0) return [];
      if (arr.length <= n) return [...arr];
      return Array.from({ length: n }, (_, i) => arr[Math.floor(i * arr.length / n)]);
    };

    const vibSampled = sample(vibRows, N);
    const curSampled = sample(curRows, N);
    const len = Math.max(vibSampled.length, curSampled.length);
    if (len === 0) return [];

    const formatTime = (t) => {
      const abs = Math.abs(t);
      if (abs < 0.01)  return `${(abs * 1000).toFixed(1)}ms`;
      if (abs < 60)    return `${abs.toFixed(3)}s`;
      return `${(abs / 60).toFixed(1)}m`;
    };

    return Array.from({ length: len }, (_, i) => {
      const vibRow = vibSampled[i];
      const curRow = curSampled[i];
      const timeRef = vibRow ?? curRow;

      // 진동: 백엔드와 동일한 ×3.8 스케일
      const vibVal = vibRow
        ? parseFloat((Math.abs(vibRow[1] ?? 0) * 3.8).toFixed(2))
        : fallbackVib;

      // 전류: U/V/W 3상 절대값 평균
      const curVal = curRow && curRow.length >= 4
        ? parseFloat(((Math.abs(curRow[1] ?? 0) + Math.abs(curRow[2] ?? 0) + Math.abs(curRow[3] ?? 0)) / 3).toFixed(2))
        : fallbackCur;

      return {
        time: formatTime(timeRef?.[0] ?? i),
        vibration: vibVal,
        current: curVal,
        temp: isDanger
          ? parseFloat((78 + Math.random() * 6).toFixed(1))
          : parseFloat((43 + Math.random() * 2).toFixed(1)),
        pressure: isDanger
          ? parseFloat((95 + Math.random() * 5).toFixed(1))
          : parseFloat((119 + Math.random() * 3).toFixed(1)),
      };
    });
  };

  const startAnalysis = async () => {
    if (analysisMode === 'single' && !uploadedFile) return;
    if (analysisMode === 'fusion' && (!uploadedVibrationFile || !uploadedCurrentFile)) return;

    // 이전 에러/결과 초기화
    setAnalysisError(null);
    setAnalysisResult(null);
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
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

      console.log(`[AI 분석] 백엔드 API 호출 중: ${API_URL}`);

      if (analysisMode === 'single') {
        formData.append("file", uploadedFile);
        response = await fetch(`${API_URL}/api/diagnose`, {
          method: "POST",
          body: formData
        });
      } else {
        formData.append("vibration_file", uploadedVibrationFile);
        formData.append("current_file", uploadedCurrentFile);
        response = await fetch(`${API_URL}/api/diagnose/fusion`, {
          method: "POST",
          body: formData
        });
      }

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(`서버 오류 (HTTP ${response.status}): ${errText || response.statusText}`);
      }

      const data = await response.json();

      // 텔레메트리 업데이트: 실제 업로드 CSV 데이터 우선, 없으면 시나리오 폴백
      const isDanger = data.risk_level === 'DANGER' || data.risk_level === 'WARNING';
      const vib = data.vibration_rms ?? 2.0;
      const cur = data.current_imbalance ?? 4.0;

      const realTelemetry = buildRealTelemetry(
        vibrationRawData, currentRawData, vib, cur, isDanger
      );

      if (realTelemetry.length > 0) {
        setLiveTelemetry(realTelemetry);
      } else {
        // 실제 데이터 없을 때 기존 시나리오 폴백
        setLiveTelemetry(isDanger ? [
          { time: '08:00', vibration: 2.1, current: 4.5, temp: 45, pressure: 120 },
          { time: '09:00', vibration: 2.4, current: 4.6, temp: 46, pressure: 119 },
          { time: '10:00', vibration: 1.8, current: 4.2, temp: 44, pressure: 121 },
          { time: '11:00', vibration: 2.2, current: 4.4, temp: 46, pressure: 120 },
          { time: '12:00', vibration: 7.8, current: 12.8, temp: 58, pressure: 112 },
          { time: '13:00', vibration: 12.5, current: 15.2, temp: 76, pressure: 104 },
          { time: 'NOW', vibration: parseFloat(vib.toFixed(2)), current: parseFloat(cur.toFixed(2)), temp: 82.4, pressure: 98 },
        ] : [
          { time: '12:00', vibration: 1.8, current: 4.1, temp: 43.5, pressure: 121.2 },
          { time: '13:00', vibration: 2.2, current: 4.4, temp: 44.1, pressure: 120.5 },
          { time: '14:00', vibration: 1.9, current: 4.2, temp: 43.8, pressure: 121.0 },
          { time: '15:00', vibration: 2.3, current: 4.5, temp: 44.5, pressure: 119.8 },
          { time: '16:00', vibration: 2.0, current: 4.3, temp: 44.0, pressure: 120.4 },
          { time: '17:00', vibration: 2.4, current: 4.6, temp: 44.8, pressure: 119.5 },
          { time: 'NOW', vibration: parseFloat(vib.toFixed(2)), current: parseFloat(cur.toFixed(2)), temp: 44.2, pressure: 120.1 },
        ]);
      }

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
      console.error('[AI 분석 실패]', error);
      setAnalysisError(error.message || '알 수 없는 오류가 발생했습니다.');
      setLoadingProgress(0);
      setCurrentPage('upload');
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
            {currentPage === 'upload' && (
              <>
                {/* 백엔드 에러 배너 */}
                {analysisError && (
                  <div className="mb-5 bg-rose-950/60 border border-rose-500/40 rounded-2xl p-4 flex items-start gap-3 animate-fade-in">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-rose-300 mb-1">
                        {lang === 'ko' ? '⚠️ AI 백엔드 분석 실패 — 서버 오류' : '⚠️ AI Backend Analysis Failed — Server Error'}
                      </p>
                      <p className="text-[11px] text-rose-400/80 font-mono break-all leading-relaxed">{analysisError}</p>
                      <p className="text-[10px] text-rose-500/60 mt-1.5">
                        {lang === 'ko'
                          ? '파일을 다시 선택하거나 잠시 후 재시도해 주세요. 문제가 지속되면 관리자에게 문의하세요.'
                          : 'Please re-select your files or try again in a moment. Contact the administrator if the issue persists.'}
                      </p>
                    </div>
                    <button
                      onClick={() => setAnalysisError(null)}
                      className="text-rose-500/60 hover:text-rose-300 transition-colors shrink-0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                )}
                <UploadView
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
                  lang={lang}
                />
              </>
            )}
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
