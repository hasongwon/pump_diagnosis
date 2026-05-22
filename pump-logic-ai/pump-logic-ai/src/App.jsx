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
        
        const baseVib = isDangerous ? 12.0 : 2.0;
        const baseCur = isDangerous ? 16.0 : 4.0;
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

    if (target === 'single') {
      setUploadedFile(file);
      Papa.parse(file, {
        header: true,
        preview: 5,
        complete: (res) => setPreviewRows(res.data.length ? res.data : defaultPreviewData),
        error: () => setPreviewRows(defaultPreviewData)
      });
    } else if (target === 'vib') {
      setUploadedVibrationFile(file);
      Papa.parse(file, {
        header: true,
        preview: 5,
        complete: (res) => setPreviewVibRows(res.data.length ? res.data : defaultPreviewData),
        error: () => setPreviewVibRows(defaultPreviewData)
      });
    } else if (target === 'cur') {
      setUploadedCurrentFile(file);
      Papa.parse(file, {
        header: true,
        preview: 5,
        complete: (res) => setPreviewCurRows(res.data.length ? res.data : defaultPreviewData),
        error: () => setPreviewCurRows(defaultPreviewData)
      });
    }
  };

  const startAnalysis = async () => {
    if (analysisMode === 'single' && !uploadedFile) return;
    if (analysisMode === 'fusion' && (!uploadedVibrationFile || !uploadedCurrentFile)) return;

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
        // If dangerous, trigger AlimTalk and Audio Alarm Beep!
        if (data.risk_level === 'DANGER' || data.risk_level === 'WARNING') {
          playAlertBeep();
          setTimeout(() => setAlimtalkOpen(true), 1500);
        }
      }, 500);
      
    } catch (error) {
      clearInterval(interval);
      console.warn("Backend server not running. Falling back to mockup diagnostic results for demonstration.", error);
      
      // FALLBACK MOCKUP DATA IN CASE BACKEND IS SHUT DOWN
      const fallbackResult = {
        risk_level: "DANGER",
        root_cause: lang === 'ko' ? "조립 설치 불량 또는 축 중심 불일치" : "Rotor Shaft Misalignment",
        risk_rationale: lang === 'ko' 
          ? "가속도 진동 RMS 임계값 초과 및 3상 위상 균형도 왜곡율 상승에 따라 수평 얼라인먼트의 유의미한 축 어긋남 결함이 도출되었습니다."
          : "Significant rotor shaft misalignment has been identified due to vibration acceleration RMS threshold breach and 3-phase current phase balance imbalance.",
        checked_symptoms: ["이상진동", "베어링과열", "과부하"],
        preventive_maintenance: lang === 'ko'
          ? "레이저 조준계를 정밀 장착하여 기동 중심 축 수평 상태를 ±0.03mm 공차 이내로 영점 교정하십시오. 또한 3상 전력 케이블 절연과 베어링 부근 기초 앵커 강성을 계측하십시오."
          : "Precisely mount a laser alignment system to calibrate the rotor shaft center within ±0.03mm tolerance. Additionally, measure stator winding insulation and anchor bolt torque.",
        recommended_actions: lang === 'ko' ? [
          "축 수평 얼라인먼트 재조정: 레이저 정렬 툴을 사용해 동심도 편차를 초정밀 수정 조절합니다.",
          "구동부 베어링 하우징 보수: 베어링 유격 변위를 해체 점검하고 전면 급유를 보완 수행합니다.",
          "마운팅 앵커 보강 체결: 진동 에너지 댐핑을 감소시키도록 기초 고정 볼트를 이중 잠금합니다."
        ] : [
          "Rotor Shaft Alignment: Calibrate the coupling concentricity using precise laser alignment systems.",
          "Bearing Overhaul: Inspect rolling element clearance and replenish grease under guidelines.",
          "Anchor Reinforcement: Tighten baseline bolts to design specifications to minimize vibration energy."
        ]
      };
      
      setAnalysisResult(fallbackResult);
      setLoadingProgress(100);
      
      setTimeout(() => {
        setCurrentPage('diagnostics');
        playAlertBeep();
        setTimeout(() => setAlimtalkOpen(true), 1500);
      }, 500);
    }
  };

  return (
    <div className={`min-h-screen bg-[#020b14] text-slate-200 flex font-sans selection:bg-blue-500/30 print:bg-white print:text-black relative overflow-hidden ${theme === 'light' ? 'light-theme' : ''}`}>
      
      {/* Decorative Background Beams */}
      <div className="ambient-glow-indigo top-[-100px] left-[-100px]"></div>
      <div className="ambient-glow-cyan bottom-[-50px] right-[-50px]"></div>

      {/* Sidebar (Hidden on Print) */}
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} t={t} />

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
              previewCurRows={previewCurRows}
              handleFileUpload={handleFileUpload}
              startAnalysis={startAnalysis}
              defaultPreviewData={defaultPreviewData}
              analysisMode={analysisMode}
              setAnalysisMode={setAnalysisMode}
              t={t}
            />}
            {currentPage === 'loading' && <LoadingView progress={loadingProgress} />}
            {currentPage === 'diagnostics' && <DiagnosticsView 
              setCurrentPage={setCurrentPage} 
              telemetryData={liveTelemetry} 
              analysisResult={analysisResult} 
              setWorkOrderOpen={setWorkOrderOpen}
              t={t}
              lang={lang}
            />}
            {currentPage === 'detail' && <DetailView 
              analysisResult={analysisResult} 
              setWorkOrderOpen={setWorkOrderOpen} 
              t={t}
            />}
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
        {chatbotOpen && <Chatbot chatbotOpen={chatbotOpen} setChatbotOpen={setChatbotOpen} t={t} />}
        
      </main>
    </div>
  );
}
