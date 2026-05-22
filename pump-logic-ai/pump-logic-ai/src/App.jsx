import { useState, useEffect, useRef } from 'react';
import {
  Activity, AlertTriangle, CheckCircle, UploadCloud, FileText, Settings, Bell, Search,
  MessageSquare, X, ChevronRight, Download, BarChart2, BookOpen, ShieldAlert, Zap,
  Thermometer, Wind, Gauge, Upload, ArrowUpRight, Printer, RefreshCw
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea
} from 'recharts';
import Papa from 'papaparse';

const SYMPTOMS = [
  { key: 'symptom_1', label: '기동시부하과다' },
  { key: 'symptom_2', label: '부하과소' },
  { key: 'symptom_3', label: '양수량감소' },
  { key: 'symptom_4', label: '양수불능' },
  { key: 'symptom_5', label: '베어링과열' },
  { key: 'symptom_6', label: '글랜드패킹과열' },
  { key: 'symptom_7', label: '이상진동' },
  { key: 'symptom_8', label: '만수불능' },
  { key: 'symptom_9', label: '과부하' },
  { key: 'symptom_10', label: '압력계수값' },
  { key: 'symptom_11', label: '진공계수값' },
];

const FAULT_MATRIX_DATA = [
  { cause: "양정 과다", cells: { symptom_2: "○", symptom_3: "○", symptom_4: "○", symptom_7: "○", symptom_10: "고" }, remarks: "" },
  { cause: "양정 과소", cells: { symptom_7: "○", symptom_9: "○", symptom_10: "저", symptom_11: "고" }, remarks: "" },
  { cause: "임펠러 역회전", cells: { symptom_2: "○", symptom_3: "○", symptom_4: "○", symptom_10: "저", symptom_11: "저" }, remarks: "" },
  { cause: "회전수 과소", cells: { symptom_2: "○", symptom_3: "○", symptom_4: "○", symptom_10: "저", symptom_11: "저" }, remarks: "주파수 저하" },
  { cause: "회전수 과다", cells: { symptom_9: "○", symptom_11: "약간 저" }, remarks: "" },
  { cause: "전압 강하 또는 전기품 고장", cells: { symptom_9: "○" }, remarks: "" },
  { cause: "제수밸브 약간 개방", cells: { symptom_1: "○", symptom_2: "○", symptom_3: "○", symptom_10: "고", symptom_11: "약간 저" }, remarks: "" },
  { cause: "패킹누르게 한쪽 조임 또는 과다 조임", cells: { symptom_1: "○", symptom_6: "○" }, remarks: "" },
  { cause: "조립 설치 불량 또는 축 중심 불일치", cells: { symptom_1: "○", symptom_4: "○", symptom_5: "○", symptom_6: "○" }, remarks: "" },
  { cause: "회전부 마모 또는 눌러붙음", cells: { symptom_1: "○", symptom_5: "○" }, remarks: "손으로 돌리기 어려움" },
  { cause: "윤활유 부족 및 베어링장치 상태 나쁨", cells: { symptom_5: "○" }, remarks: "" },
  { cause: "실링 폐쇄 또는 축봉수 불량", cells: { symptom_3: "○", symptom_4: "○", symptom_6: "○", symptom_10: "저" }, remarks: "축봉수 불량" },
  { cause: "흡입관에서 공기 침입", cells: { symptom_2: "○", symptom_3: "○", symptom_4: "○", symptom_6: "○", symptom_7: "○", symptom_8: "○", symptom_10: "불안정", symptom_11: "불안정" }, remarks: "수면에 거품 발생" },
  { cause: "흡입관에 공기주머니 발생", cells: { symptom_3: "○", symptom_4: "○" }, remarks: "단속적인 양수" },
  { cause: "흡입관에 이물질이 걸렸을 때", cells: { symptom_2: "○", symptom_3: "○", symptom_4: "○", symptom_5: "○", symptom_7: "○", symptom_10: "저", symptom_11: "고" }, remarks: "임펠러 입구 이물질" },
  { cause: "송출관에 이물질이 있을 때", cells: { symptom_2: "○", symptom_3: "○", symptom_4: "○" }, remarks: "송출라인 폐쇄" },
  { cause: "라이너링 또는 임펠러 마모", cells: { symptom_3: "○", symptom_10: "저" }, remarks: "" },
  { cause: "회전체 불평형 및 잔류 안착 불일치", cells: { symptom_7: "○", symptom_2: "○" }, remarks: "XGBoost 융합 판정" },
  { cause: "구동 벨트 느슨함 및 송출 장력 저하", cells: { symptom_3: "○", symptom_10: "저" }, remarks: "XGBoost 융합 판정" }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);

  // New States for Multi-Sensor Fusion & Features
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
        
        const isDangerous = analysisResult ? (analysisResult.risk_level === 'DANGER' || analysisResult.risk_level === 'WARNING') : false;
        
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
  const getMaintenanceGuideUrl = (rootCause) => {
    const cause = rootCause || "";
    if (cause.includes("축정렬불량") || cause.includes("축 중심") || cause.includes("조립 설치")) {
      return "https://www.youtube.com/watch?v=kU_3zSCSz0o";
    }
    if (cause.includes("베어링불량") || cause.includes("윤활유") || cause.includes("베어링장치")) {
      return "https://www.youtube.com/watch?v=N4vA-Hq0Y9E";
    }
    if (cause.includes("벨트느슨함") || cause.includes("구동 벨트")) {
      return "https://www.youtube.com/watch?v=2r7vF14r0fE";
    }
    return "https://www.youtube.com/watch?v=8y_l9K1E4W4";
  };

  const isCauseActive = (causeName) => {
    if (!analysisResult) return false;
    const rc = analysisResult.root_cause || "";
    if (causeName.includes("조립 설치") || causeName.includes("축 중심")) {
      return rc.includes("축정렬불량") || rc.includes("조립 설치");
    }
    if (causeName.includes("윤활유 부족") || causeName.includes("베어링장치")) {
      return rc.includes("베어링불량") || rc.includes("윤활유 부족");
    }
    if (causeName.includes("회전체 불평형")) {
      return rc.includes("회전체불평형") || rc.includes("회전체 불평형");
    }
    if (causeName.includes("구동 벨트") || causeName.includes("벨트느슨함")) {
      return rc.includes("벨트느슨함") || rc.includes("구동 벨트");
    }
    return rc.includes(causeName);
  };

  const isSymptomActive = (symptomLabel) => {
    if (!analysisResult || !analysisResult.checked_symptoms) return false;
    return analysisResult.checked_symptoms.some(s => {
      const cleanS = s.replace(/\s+/g, '');
      const cleanLabel = symptomLabel.replace(/\s+/g, '');
      return cleanS.includes(cleanLabel) || cleanLabel.includes(cleanS);
    });
  };

  const printableRows = FAULT_MATRIX_DATA.filter(row => {
    if (isCauseActive(row.cause)) return true;
    return Object.keys(row.cells).some(symptomKey => {
      const symptomLabel = SYMPTOMS.find(s => s.key === symptomKey)?.label || "";
      return isSymptomActive(symptomLabel) && row.cells[symptomKey];
    });
  });

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
      alert(error.message);
      setCurrentPage('upload');
    }
  };

  const SidebarItem = ({ icon: Icon, label, id }) => (
    <button
      onClick={() => setCurrentPage(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        currentPage === id
          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
      }`}
    >
      <Icon size={20} className={currentPage === id ? 'text-blue-400' : ''} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#020b14] text-slate-200 flex font-sans selection:bg-blue-500/30 print:bg-white print:text-black">
      {/* Printable Style Block to hide dashboard panels during print */}
      <style>{`
        @media print {
          /* 1. Reset root colors and scroll properties */
          html, body {
            background: white !important;
            color: black !important;
            height: auto !important;
            overflow: visible !important;
          }
          
          /* 2. Hide all interactive system layouts completely */
          aside, header, main > *:not(.printable-work-order-wrapper) {
            display: none !important;
          }
          
          /* 3. Disable background overlay in print view */
          .fixed {
            position: absolute !important;
            background: transparent !important;
          }
          
          /* 4. Force pure layout width on A4 paper */
          .printable-work-order {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
            display: block !important;
          }
          
          /* 5. Force background graphics to render in Chrome/Safari/Edge */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* 6. Discard UI close controls during output */
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Sidebar (Hidden on Print) */}
      <aside className="w-64 bg-slate-900/50 border-r border-slate-800/80 flex flex-col backdrop-blur-md hidden md:flex print:hidden">
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center space-x-2 text-cyan-400 mb-2">
            <Activity className="animate-pulse" />
            <h1 className="text-xl font-bold tracking-wider">PumpLogic AI</h1>
          </div>
          <p className="text-xs text-slate-500 font-mono">System Alpha-7 / Centrifugal Pump</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarItem icon={Activity} label="Main Dashboard" id="dashboard" />
          <SidebarItem icon={UploadCloud} label="Dataset Upload" id="upload" />
          <SidebarItem icon={BarChart2} label="Diagnostics" id="diagnostics" />
          <SidebarItem icon={FileText} label="Reports" id="reports" />
          <SidebarItem icon={BookOpen} label="Manuals" id="manuals" />
        </nav>

        <div className="p-4 border-t border-slate-800/80 bg-slate-900/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">Admin User</p>
              <div className="flex items-center text-xs text-emerald-400 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                Level 4 Security
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative print:overflow-visible">
        {/* Topbar (Hidden on Print) */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex items-center justify-between px-6 z-10 shrink-0 print:hidden">
          <div className="flex items-center flex-1">
            <div className="relative w-64 hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-slate-600"
              />
            </div>
            <h2 className="ml-8 text-lg font-semibold bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent hidden lg:block">
              원심펌프 다중 센서 융합(진동+전류) 예지보전 AI 솔루션
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setChatbotOpen(!chatbotOpen)}
              className="flex items-center space-x-2 bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 hover:text-blue-300 border border-blue-500/30 px-4 py-1.5 rounded-full text-sm font-medium transition-all shadow-[0_0_10px_rgba(59,130,246,0.1)]"
            >
              <MessageSquare size={16} />
              <span>AI 챗봇 열기</span>
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-200 relative group">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#020b14]"></span>
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-200 group">
              <Settings size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth relative print:overflow-visible print:p-0">
          <div className="max-w-7xl mx-auto pb-20 print:pb-0">
            {currentPage === 'dashboard' && <DashboardView setCurrentPage={setCurrentPage} />}
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
            />}
            {currentPage === 'loading' && <LoadingView progress={loadingProgress} />}
            {currentPage === 'diagnostics' && <DiagnosticsView 
              setCurrentPage={setCurrentPage} 
              telemetryData={liveTelemetry} 
              analysisResult={analysisResult} 
              setWorkOrderOpen={setWorkOrderOpen}
            />}
            {currentPage === 'detail' && <DetailView 
              analysisResult={analysisResult} 
              setWorkOrderOpen={setWorkOrderOpen} 
            />}
            {currentPage === 'reports' && <ReportsView />}
            {currentPage === 'manuals' && <ManualsView />}
          </div>
        </div>

        {/* --- 1. [NEW] 모바일 카카오 알림톡(AlimTalk) 가상 경고 스마트 팝업 --- */}
        {alimtalkOpen && (
          <div className="fixed bottom-6 right-6 w-96 bg-[#ffeb00] text-slate-900 border-4 border-[#e5a93b] shadow-2xl rounded-3xl overflow-hidden flex flex-col z-50 animate-in slide-in-from-bottom-12 duration-500 font-sans">
            <div className="bg-[#3c2a20] p-4 flex justify-between items-center text-white">
              <div className="flex items-center space-x-2">
                <Bell size={18} className="text-[#ffeb00] animate-bounce" />
                <span className="font-bold text-sm tracking-wide">알림톡 • PumpLogic PdM</span>
              </div>
              <button onClick={() => setAlimtalkOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5 flex-1 bg-slate-50 flex flex-col">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm text-xs leading-relaxed text-slate-800 space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-extrabold text-rose-600 text-sm">🚨 [설비 예지보전 고장 경보]</span>
                  <span className="text-slate-400 font-mono">발송 02:07</span>
                </div>
                <p>
                  귀하가 관할하는 <strong>원심펌프 7호기(Centrifugal Pump Alpha-7 / ID: PMP-A7-001)</strong>의 실시간 계측 데이터 분석 결과, 이상 결함이 감지되었습니다.
                </p>
                <div className="bg-slate-50 p-3 rounded-lg border font-mono space-y-1 text-slate-700">
                  <div>• <strong>위험등급:</strong> <span className="text-rose-600 font-bold">{analysisResult?.risk_level || "DANGER(위험)"}</span></div>
                  <div>• <strong>진단원인:</strong> {analysisResult?.root_cause || "축 중심 불일치 (센서 융합 확진)"}</div>
                  <div>• <strong>이상징후:</strong> 진동 임계치(8.0g) 56% 초과, 3상 전류 불평형 급증</div>
                </div>
                <p className="text-slate-500">
                  현장 정비 담당팀은 즉시 안전 장비를 구비하여 해당 원심펌프의 수평 정렬 상태 및 베어링 장치의 온도, 윤활유 상태를 점검하시기 바랍니다.
                </p>
              </div>
              
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={() => { setWorkOrderOpen(true); setAlimtalkOpen(false); }}
                  className="flex-1 bg-[#3c2a20] hover:bg-[#52392c] text-white text-xs font-extrabold py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5"
                >
                  <Printer size={14} />
                  <span>점검 작업 지시서 출력하기</span>
                </button>
                <button 
                  onClick={() => setAlimtalkOpen(false)}
                  className="bg-slate-300 hover:bg-slate-400 text-slate-800 text-xs font-bold px-4 py-3 rounded-xl transition-all"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- 2. [NEW] 점검 작업 지시서 (Printable Maintenance Work Order) 모달 --- */}
        {workOrderOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto p-4 md:p-8 print:p-0 print:bg-white print:relative print:z-auto printable-work-order-wrapper">
            <div className="bg-white text-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col printable-work-order print:shadow-none print:border-none print:w-full print:max-w-none">
              
              {/* Document Header Panel (Hidden on Print) */}
              <div className="bg-slate-100 px-6 py-4 border-b border-slate-200 flex justify-between items-center no-print">
                <div className="flex items-center space-x-2 text-slate-800 font-bold text-lg">
                  <Printer size={20} className="text-blue-600" />
                  <span>인쇄 미리보기 및 발행 (A4 규격 작업 지시서)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => window.print()}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-md shadow-blue-500/20"
                  >
                    <Printer size={16} />
                    <span>지금 인쇄하기</span>
                  </button>
                  <button 
                    onClick={() => setWorkOrderOpen(false)} 
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl text-sm transition-colors"
                  >
                    닫기
                  </button>
                </div>
              </div>

              {/* Real Printable Standard Document Content */}
              <div className="p-10 font-sans print:p-0">
                {/* Corporate Document Title & Seals */}
                <div className="flex justify-between items-start border-b-4 border-slate-900 pb-6 mb-8">
                  <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 font-serif">정 비 작 업 지 시 서</h1>
                    <p className="text-xs text-slate-500 font-mono mt-2 uppercase tracking-widest">PumpLogic AI 예지보전 지능형 시스템 • 공무부 설비 보전실</p>
                  </div>
                  <div className="flex items-center space-x-4 shrink-0">
                    {/* Dynamic QR Code pointing to maintenance educational video */}
                    <div className="flex flex-col items-center">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(getMaintenanceGuideUrl(analysisResult?.root_cause))}`} 
                        className="w-16 h-16 border border-slate-300 bg-white p-1" 
                        alt="정비 가이드 QR" 
                      />
                      <span className="text-[8px] text-slate-500 mt-1 font-bold">표준 정비영상 QR</span>
                    </div>
                    {/* Mock Corporate Seal */}
                    <div className="w-16 h-16 border-4 border-rose-600 rounded-full flex items-center justify-center text-rose-600 font-extrabold text-[9px] rotate-12 relative opacity-80 shrink-0">
                      <span className="text-center leading-3">예지보전<br/>인증필<br/>APPROVED</span>
                    </div>
                  </div>
                </div>

                {/* Primary Document Meta Table */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-slate-900 text-xs mb-8">
                  <div className="bg-slate-100 p-3 font-bold border-r border-b border-slate-900 text-center">작업 일련번호</div>
                  <div className="p-3 border-r border-b border-slate-900 font-mono">WO-2026-05-22-001</div>
                  <div className="bg-slate-100 p-3 font-bold border-r border-b border-slate-900 text-center">발행 부서</div>
                  <div className="p-3 border-b border-slate-900">PdM 예지기술연구소</div>

                  <div className="bg-slate-100 p-3 font-bold border-r border-slate-900 text-center">발행 일시</div>
                  <div className="p-3 border-r border-slate-900 font-mono">2026-05-22 02:07 KST</div>
                  <div className="bg-slate-100 p-3 font-bold border-r border-slate-900 text-center">점검 부서</div>
                  <div className="p-3 font-semibold">공무부 설비 보전 1팀</div>
                </div>

                {/* Target Equipment Table */}
                <h3 className="text-base font-extrabold border-l-4 border-blue-600 pl-2 text-slate-900 mb-3">1. 대상 설비 현황</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-slate-300 text-xs mb-8">
                  <div className="bg-slate-50 p-2.5 font-semibold border-r border-b border-slate-300 text-center">설비 명칭</div>
                  <div className="p-2.5 border-r border-b border-slate-300 font-bold">원심펌프 7호기 (Centrifugal Pump)</div>
                  <div className="bg-slate-50 p-2.5 font-semibold border-r border-b border-slate-300 text-center">설비 관리코드</div>
                  <div className="p-2.5 border-b border-slate-300 font-mono">PMP-A7-001</div>

                  <div className="bg-slate-50 p-2.5 font-semibold border-r border-slate-300 text-center">위험 수위</div>
                  <div className="p-2.5 border-r border-slate-300 font-bold text-rose-600 uppercase">
                    {analysisResult?.risk_level || "DANGER"} (교차 센서 융합 확진)
                  </div>
                  <div className="bg-slate-50 p-2.5 font-semibold border-r border-slate-300 text-center">융합 분석 데이터</div>
                  <div className="p-2.5 font-mono text-[10px]">진동(Vib) 1축 + 전류(Cur) 3상 교차 융합 완료</div>
                </div>

                {/* AI Diagnostic Reasoning Section */}
                <h3 className="text-base font-extrabold border-l-4 border-blue-600 pl-2 text-slate-900 mb-3">2. AI 결함 판정 및 공학 분석 근거</h3>
                <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 text-xs leading-relaxed mb-8">
                  <p className="font-semibold text-slate-800 text-sm mb-2">
                    [주요 결함 원인]: <span className="text-rose-600 font-extrabold underline">{analysisResult?.root_cause || "조립 설치 불량 또는 축 중심 불일치"}</span>
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    {analysisResult?.risk_rationale || "Z축 가속도 성분 진폭이 임계치 대비 56% 초과하였으며, U/V/W 3상 고주파 전류 분석 모형에서도 비정상 임펠러 토크 부하 왜곡 변동이 검출되었습니다. 두 센서의 동시 분류 결과가 축정렬불량(확률 86%)을 상호 강력하게 뒷받침하고 있습니다. 즉각 정비가 요구됩니다."}
                  </p>
                </div>
                {/* 2.5 고장-원인 대조 매트릭스 점검 현황 (<표 6.7.9>) */}
                <h3 className="text-base font-extrabold border-l-4 border-blue-600 pl-2 text-slate-900 mb-3">2.5 고장-원인 대조 매트릭스 점검 현황 (&lt;표 6.7.9&gt;)</h3>
                <div className="border border-slate-300 rounded-xl p-4 bg-white mb-8 overflow-x-auto">
                  <table className="w-full text-[8px] text-slate-800 text-center border-collapse border border-slate-300 table-fixed">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300 font-bold">
                        {/* 좌상단 0,0 셀: 정교한 대각선 사선 배경 */}
                        <th className="border border-slate-300 w-[110px] min-w-[110px] max-w-[110px] relative h-24 bg-slate-50 p-0 font-normal">
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-slate-300 to-transparent" style={{ backgroundImage: 'linear-gradient(to top right, transparent 49.5%, #cbd5e1 50%, transparent 50.5%)' }}></div>
                          <div className="absolute top-2 right-2 text-slate-900 font-black text-[8px]">
                            현상 ➔
                          </div>
                          <div className="absolute bottom-2 left-2 text-slate-700 font-bold text-[8px]">
                            ⬇ 고장 원인
                          </div>
                        </th>
                        {SYMPTOMS.map(s => {
                          const active = isSymptomActive(s.label);
                          return (
                            <th 
                              key={s.key} 
                              className={`p-1 border border-slate-300 leading-tight w-[24px] min-w-[24px] max-w-[24px] [writing-mode:vertical-rl] [text-orientation:mixed] h-24 text-left font-bold ${
                                active ? 'bg-slate-200 text-blue-900 font-black' : 'text-slate-660'
                              }`}
                            >
                              {s.label}
                            </th>
                          );
                        })}
                        <th className="px-1 py-1.5 border border-slate-300 text-center w-[75px] min-w-[75px] max-w-[75px] text-[8px]">비고</th>
                      </tr>
                    </thead>
                    <tbody>
                      {printableRows.length === 0 ? (
                        <tr>
                          <td colSpan={13} className="px-4 py-6 text-slate-500 font-mono text-center">감지 및 매칭된 고장 또는 이상 징후 매핑 데이터가 없습니다.</td>
                        </tr>
                      ) : (
                        printableRows.map((row, idx) => {
                          const causeActive = isCauseActive(row.cause);
                          return (
                            <tr 
                              key={idx} 
                              className={`border-b border-slate-300 ${
                                causeActive ? 'bg-slate-100 font-extrabold' : ''
                              }`}
                            >
                              <td className={`px-2 py-1.5 border border-slate-300 text-left font-semibold text-[8px] leading-tight w-[110px] min-w-[110px] max-w-[110px] whitespace-normal ${
                                causeActive ? 'text-blue-900 font-black' : 'text-slate-700'
                              }`}>
                                {causeActive ? '☑ ' : '☐ '}{row.cause}
                              </td>
                              {SYMPTOMS.map(s => {
                                const cellVal = row.cells[s.key];
                                const symptomActive = isSymptomActive(s.label);
                                const intersectionActive = causeActive && symptomActive && cellVal;
                                
                                return (
                                  <td 
                                    key={s.key} 
                                    className={`p-0.5 border border-slate-300 font-bold w-[24px] min-w-[24px] max-w-[24px] ${
                                      intersectionActive 
                                        ? 'bg-slate-200 text-emerald-900 font-black animate-pulse' 
                                        : symptomActive 
                                          ? 'text-slate-800 font-bold'
                                          : 'text-slate-400 font-normal'
                                    }`}
                                  >
                                    {intersectionActive ? `✔ (${cellVal})` : (
                                      <span className="opacity-15 select-none text-[7.5px]">{cellVal || ""}</span>
                                    )}
                                  </td>
                                );
                              })}
                              <td className="px-1 py-1 border border-slate-300 text-left text-slate-600 text-[7.5px] leading-tight w-[75px] min-w-[75px] max-w-[75px] whitespace-normal">{row.remarks}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                  <div className="mt-2 text-[8px] text-slate-500 flex justify-between items-center font-mono">
                    <div>* 범례: ☑ 진단 고장 | ✔ (교차셀) 융합 판정 근거 현상</div>
                    <div>상수도관망시설 유지관리 표준 매뉴얼 &lt;표 6.7.9&gt; 연동</div>
                  </div>
                </div>

                {/* Maintenance Guides from RAG */}
                <h3 className="text-base font-extrabold border-l-4 border-blue-600 pl-2 text-slate-900 mb-3">3. 긴급 정비 지침 및 수리 절차 (RAG 매뉴얼 가이드)</h3>
                <div className="border border-slate-300 rounded-xl p-5 mb-8 bg-slate-50/50">
                  <ul className="space-y-3.5 text-xs text-slate-700 list-decimal list-inside leading-relaxed">
                    {analysisResult?.recommended_actions ? (
                      analysisResult.recommended_actions.map((act, index) => (
                        <li key={index} className="pl-1"><strong className="text-slate-900">{act.split(":")[0]}:</strong>{act.split(":")[1] || ""}</li>
                      ))
                    ) : (
                      <>
                        <li><strong>축 수평 다이얼 게이지 계측:</strong> 레이저 얼라인먼트 툴을 사용해 커플링 간극 및 동심도 편차를 ±0.03mm 이내로 조절하십시오.</li>
                        <li><strong>베어링 해체 점검:</strong> 베어링 하우징 커버를 탈거하고 피로 균열 및 윤활 상태를 점검하여 필요시 전면 교체(Replacement) 하십시오.</li>
                        <li><strong>모터 마운팅 볼트 점검:</strong> 풀림 현상이 발견된 베이스 프레임 기초 볼트를 적정 토크 렌치를 사용하여 2차 긴밀하게 재조이십시오.</li>
                      </>
                    )}
                  </ul>
                  <div className="mt-3 text-[10px] text-blue-900 bg-blue-50 border border-blue-200 rounded-lg p-2.5 flex items-center space-x-2 font-medium">
                    <span className="font-bold text-blue-950 shrink-0">💡 실무 교육 안내:</span>
                    <span>우측 상단의 <strong>[표준 정비영상 QR]</strong>을 스마트폰이나 태블릿 카메라로 스캔하시면, 현재 진단된 결함에 100% 최적화된 유튜브 정비 표준 가이드 동영상으로 즉시 연결됩니다.</span>
                  </div>
                </div>

                {/* Daily Preventive Care */}
                <h3 className="text-base font-extrabold border-l-4 border-blue-600 pl-2 text-slate-900 mb-3">4. 향후 일상 예방 조치 가이드라인</h3>
                <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 text-xs text-slate-600 leading-relaxed mb-12">
                  {analysisResult?.preventive_maintenance || "윤활유 자동 공급 주기 점검 및 모터 구동용 벨트 장력 상태를 주기적으로 정량 점검하십시오. 또한 실시간 3상 전류 불평형 모니터링 주기를 단축하여 초기 이상징후 탐지 민감도를 격상하십시오."}
                </div>

                {/* Sign-off Blocks */}
                <div className="grid grid-cols-2 gap-12 text-center text-xs mt-12 pt-6 border-t-2 border-slate-300">
                  <div>
                    <p className="text-slate-500 mb-12 font-semibold">점검 현장 확인 담당자</p>
                    <p className="font-bold border-b border-slate-400 pb-2 w-48 mx-auto text-slate-600">소속: 공무부 성명:               (인)</p>
                  </div>
                  <div>
                    <p className="text-slate-500 mb-12 font-semibold">공장 보전 책임 승인권자</p>
                    <p className="font-bold border-b border-slate-400 pb-2 w-48 mx-auto text-slate-600">소속: 기술본부 성명:               (인)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chatbot Panel (Hidden on Print) */}
        {chatbotOpen && (
          <div className="absolute bottom-6 right-6 w-80 bg-slate-900 border border-slate-700 shadow-2xl shadow-blue-900/20 rounded-2xl overflow-hidden flex flex-col z-50 animate-in slide-in-from-bottom-5 print:hidden">
            <div className="bg-gradient-to-r from-blue-900/80 to-slate-900 p-4 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <h3 className="font-semibold text-blue-100">AI Assistant</h3>
              </div>
              <button onClick={() => setChatbotOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 h-64 overflow-y-auto bg-slate-950/50 flex flex-col space-y-4 font-sans text-xs">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm p-3 max-w-[85%] text-slate-200 shadow-sm">
                안녕하세요. 설비 예지보전 AI 비서입니다. 진동 및 전류 센서 데이터를 활용해 현장 정비에 적합한 수리 방법이나 장비 진단 모델 구성에 대한 질문을 해주시면 답변해 드릴게요!
              </div>
            </div>
            <div className="p-3 border-t border-slate-800 bg-slate-900">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask something..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3 pr-10 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300">
                  <ArrowUpRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function DashboardView({ setCurrentPage }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 print:hidden">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-500 group-hover:scale-110 transition-transform">
            <Activity size={64} />
          </div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium tracking-wide text-sm">24시간 설비 모니터링</h3>
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              LIVE MONITORING
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-100 mb-1">94.2%</p>
          <p className="text-sm text-slate-500">현재 펌프 효율 유지 중</p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-emerald-500 h-full w-[94.2%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          </div>
        </div>

        <div className="bg-slate-900 border border-blue-500/20 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/40 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-blue-500 group-hover:scale-110 transition-transform">
            <FileText size={64} />
          </div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium tracking-wide text-sm">이상징후 탐지 리포트</h3>
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
              ANALYTICS
            </span>
          </div>
          <div className="flex items-end space-x-2 mb-1">
            <p className="text-2xl font-bold text-slate-100">3</p>
            <p className="text-sm text-slate-400 pb-0.5">건의 이상 (최근 24h)</p>
          </div>
          <button onClick={() => setCurrentPage('reports')} className="mt-4 text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center transition-colors">
            VIEW ALL REPORTS <ChevronRight size={16} className="ml-1" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden group shadow-[0_0_30px_rgba(99,102,241,0.05)] hover:border-indigo-500/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-indigo-500 group-hover:scale-110 transition-transform">
            <UploadCloud size={64} />
          </div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium tracking-wide text-sm">데이터셋 넣기</h3>
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              MANUAL INPUT
            </span>
          </div>
          <p className="text-sm text-slate-300 mb-4 line-clamp-2">이중 센서 융합 파일 및 단일 데이터셋 정밀 결합 분석 구동</p>
          <button 
            onClick={() => setCurrentPage('upload')}
            className="w-full bg-indigo-600/80 hover:bg-indigo-500 text-white text-sm font-medium py-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-900/50 flex items-center justify-center space-x-2"
          >
            <Upload size={16} />
            <span>UPLOAD NEW DATASET</span>
          </button>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">최근 진단 리포트</h2>
          <button onClick={() => setCurrentPage('reports')} className="text-sm text-slate-400 hover:text-white transition-colors">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: DANGER */}
          <div className="bg-slate-900 border-t-4 border-t-rose-500 border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex justify-between items-start mb-3">
              <span className="bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded text-xs font-bold border border-rose-500/20 flex items-center">
                <ShieldAlert size={12} className="mr-1" /> DANGER
              </span>
              <span className="text-xs text-slate-500">3h ago</span>
            </div>
            <h3 className="font-bold text-slate-100 mb-1">Rotor Imbalance Prob 87%</h3>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">비정상적인 진동 패턴 감지됨. 즉각적인 점검 요망.</p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300 bg-slate-950/50 p-3 rounded-lg border border-slate-800/50 mb-4">
              <div>VIB_X: <span className="text-rose-400">4.82 mm/s</span></div>
              <div>TEMP: 72.4 °C</div>
              <div>PRESS: 12.5 bar</div>
              <div>FLOW: 450 m³/h</div>
            </div>
            <button onClick={() => setCurrentPage('upload')} className="w-full py-2 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex justify-center items-center">
              <Zap size={14} className="mr-1 text-cyan-400" /> AI INSIGHT
            </button>
          </div>

          {/* Card 2: WARNING */}
          <div className="bg-slate-900 border-t-4 border-t-amber-500 border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex justify-between items-start mb-3">
              <span className="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded text-xs font-bold border border-amber-500/20 flex items-center">
                <AlertTriangle size={12} className="mr-1" /> WARNING
              </span>
              <span className="text-xs text-slate-500">6h ago</span>
            </div>
            <h3 className="font-bold text-slate-100 mb-1">Cavitation Onset</h3>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">흡입 압력 저하에 따른 공동 현상 초기 징후 감지.</p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300 bg-slate-950/50 p-3 rounded-lg border border-slate-800/50 mb-4">
              <div>VIB_X: 1.21 mm/s</div>
              <div>TEMP: 45.2 °C</div>
              <div>PRESS: <span className="text-amber-400">8.4 bar</span></div>
              <div>FLOW: 310 m³/h</div>
            </div>
            <button onClick={() => setCurrentPage('upload')} className="w-full py-2 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex justify-center items-center">
              <Zap size={14} className="mr-1 text-cyan-400" /> AI INSIGHT
            </button>
          </div>

          {/* Card 3: NORMAL */}
          <div className="bg-slate-900 border-t-4 border-t-emerald-500 border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex justify-between items-start mb-3">
              <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-xs font-bold border border-emerald-500/20 flex items-center">
                <CheckCircle size={12} className="mr-1" /> NORMAL
              </span>
              <span className="text-xs text-slate-500">9h ago</span>
            </div>
            <h3 className="font-bold text-slate-100 mb-1">Baseline Stable</h3>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">모든 센서 데이터가 정상 범위 내에 있습니다.</p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300 bg-slate-950/50 p-3 rounded-lg border border-slate-800/50 mb-4">
              <div>VIB_X: 0.85 mm/s</div>
              <div>TEMP: 41.2 °C</div>
              <div>PRESS: 14.2 bar</div>
              <div>FLOW: 520 m³/h</div>
            </div>
            <button onClick={() => setCurrentPage('upload')} className="w-full py-2 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex justify-center items-center">
              <Zap size={14} className="mr-1 text-cyan-400" /> AI INSIGHT
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="mt-8 relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#020b14]/80 to-transparent"></div>
        <div className="relative z-10 flex items-center space-x-4 mb-4 sm:mb-0">
          <div className="w-16 h-16 rounded-full bg-slate-950 border-4 border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <Gauge className="text-emerald-400" size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Centrifugal Pump Alpha-7</h2>
            <div className="flex items-center space-x-3 mt-1">
              <span className="flex items-center text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-ping"></span>
                SYSTEM ONLINE
              </span>
              <span className="text-xs text-slate-500 font-mono">ID: PMP-A7-001</span>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-right">
          <p className="text-xs text-slate-400 font-mono mb-1 uppercase tracking-wider">Last Calibration</p>
          <p className="text-sm text-slate-200 font-medium bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800">2026-05-22 09:00 KST</p>
        </div>
      </div>
    </div>
  );
}

function UploadView({ 
  uploadedFile, setUploadedFile, 
  uploadedVibrationFile, setUploadedVibrationFile,
  uploadedCurrentFile, setUploadedCurrentFile,
  previewRows, setPreviewRows,
  previewVibRows, previewCurRows,
  handleFileUpload, startAnalysis, defaultPreviewData,
  analysisMode, setAnalysisMode
}) {
  const fileInputRef = useRef(null);
  const vibInputRef = useRef(null);
  const curInputRef = useRef(null);

  const clearFile = (target) => {
    if (target === 'single') {
      setUploadedFile(null);
      setPreviewRows([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else if (target === 'vib') {
      setUploadedVibrationFile(null);
      if (vibInputRef.current) vibInputRef.current.value = '';
    } else if (target === 'cur') {
      setUploadedCurrentFile(null);
      if (curInputRef.current) curInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 print:hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 mb-1">Dataset Upload</h1>
          <p className="text-slate-400 text-sm">Upload sensor data for RAG diagnostic analysis.</p>
        </div>
        
        {/* Toggle Mode Tab */}
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 mt-4 md:mt-0 font-sans text-xs">
          <button 
            onClick={() => setAnalysisMode('single')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${analysisMode === 'single' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            단일 센서 분석
          </button>
          <button 
            onClick={() => setAnalysisMode('fusion')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${analysisMode === 'fusion' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            다중 센서 융합 분석 (추천)
          </button>
        </div>
      </div>

      {analysisMode === 'single' ? (
        /* --- SINGLE SENSOR FILE UPLOAD --- */
        <div 
          className="border-2 border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 transition-colors rounded-2xl p-12 text-center relative flex flex-col items-center justify-center min-h-[250px]"
          onClick={() => !uploadedFile && fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            accept=".csv" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={(e) => handleFileUpload(e, 'single')} 
          />
          
          {!uploadedFile ? (
            <div className="cursor-pointer flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                <UploadCloud size={32} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-200 mb-1">Drag and drop single CSV file here</h3>
              <p className="text-slate-400 text-xs mb-4">Click to browse single Vibration or Current dataset</p>
              <span className="bg-slate-950 text-slate-400 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-800">1x CSV FILE</span>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center mb-3 border border-emerald-500/20">
                <FileText size={28} className="text-emerald-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-200 mb-1">{uploadedFile.name}</h3>
              <p className="text-xs text-slate-400 mb-3 font-mono">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center">
                <CheckCircle size={12} className="mr-1" /> READY FOR ANALYSIS
              </span>
            </div>
          )}
        </div>
      ) : (
        /* --- DUAL MULTI-SENSOR FUSION UPLOAD --- */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
          
          {/* File 1: Vibration Sensor CSV */}
          <div 
            className="border-2 border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 transition-all rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[220px] cursor-pointer"
            onClick={() => !uploadedVibrationFile && vibInputRef.current?.click()}
          >
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={vibInputRef} 
              onChange={(e) => handleFileUpload(e, 'vib')} 
            />
            {!uploadedVibrationFile ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center mb-3 border border-cyan-500/20">
                  <Activity size={24} className="text-cyan-400" />
                </div>
                <h4 className="font-semibold text-slate-200 text-sm">Vibration File Upload</h4>
                <p className="text-slate-500 text-xs mt-1">Select vibration dataset</p>
                <span className="mt-3 bg-cyan-950 text-cyan-400 text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-cyan-800/30">VIB_X ACCELERATION</span>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-3 border border-emerald-500/20">
                  <CheckCircle size={24} className="text-emerald-400" />
                </div>
                <h4 className="font-semibold text-slate-200 text-sm truncate max-w-xs">{uploadedVibrationFile.name}</h4>
                <button 
                  onClick={(e) => { e.stopPropagation(); clearFile('vib'); }}
                  className="mt-3 text-[10px] text-rose-400 hover:text-rose-300 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20"
                >
                  REMOVE
                </button>
              </div>
            )}
          </div>

          {/* File 2: Current Sensor CSV */}
          <div 
            className="border-2 border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 transition-all rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[220px] cursor-pointer"
            onClick={() => !uploadedCurrentFile && curInputRef.current?.click()}
          >
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={curInputRef} 
              onChange={(e) => handleFileUpload(e, 'cur')} 
            />
            {!uploadedCurrentFile ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-3 border border-purple-500/20">
                  <Zap size={24} className="text-purple-400" />
                </div>
                <h4 className="font-semibold text-slate-200 text-sm">3-Phase Current File Upload</h4>
                <p className="text-slate-500 text-xs mt-1">Select U/V/W current dataset</p>
                <span className="mt-3 bg-purple-950 text-purple-400 text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-purple-800/30">3-PHASE MCSA POWER</span>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-3 border border-emerald-500/20">
                  <CheckCircle size={24} className="text-emerald-400" />
                </div>
                <h4 className="font-semibold text-slate-200 text-sm truncate max-w-xs">{uploadedCurrentFile.name}</h4>
                <button 
                  onClick={(e) => { e.stopPropagation(); clearFile('cur'); }}
                  className="mt-3 text-[10px] text-rose-400 hover:text-rose-300 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20"
                >
                  REMOVE
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preview Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-200 flex items-center text-sm">
            <BarChart2 size={16} className="mr-2 text-cyan-500" /> Data Preview Matrix
          </h3>
          {analysisMode === 'single' && uploadedFile && (
            <button onClick={() => clearFile('single')} className="text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
              CLEAR FILE
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[10px] text-slate-400 uppercase bg-slate-950/80 border-b border-slate-800 font-mono">
              <tr>
                {Object.keys(
                  analysisMode === 'single' 
                    ? (previewRows[0] || defaultPreviewData[0]) 
                    : (previewVibRows[0] || previewCurRows[0] || defaultPreviewData[0])
                ).map((key) => (
                  <th key={key} className="px-6 py-3">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(
                analysisMode === 'single' 
                  ? (previewRows.length ? previewRows : defaultPreviewData) 
                  : (previewVibRows.length ? previewVibRows : previewCurRows.length ? previewCurRows : defaultPreviewData)
              ).map((row, i) => (
                <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors font-mono text-slate-300">
                  {Object.values(row).map((val, j) => (
                    <td key={j} className="px-6 py-2.5 whitespace-nowrap">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={startAnalysis}
          disabled={
            analysisMode === 'single' 
              ? !uploadedFile 
              : (!uploadedVibrationFile || !uploadedCurrentFile)
          }
          className={`flex items-center space-x-2 px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg text-sm ${
            (analysisMode === 'single' ? uploadedFile : (uploadedVibrationFile && uploadedCurrentFile))
            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 hover:shadow-blue-500/40 hover:-translate-y-0.5' 
            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }`}
        >
          <Zap size={16} />
          <span>START AI SENSOR FUSION ANALYSIS</span>
        </button>
      </div>
    </div>
  );
}

function LoadingView({ progress }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in zoom-in-95 duration-500 print:hidden">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-blue-500 blur-[60px] opacity-20 rounded-full"></div>
        
        <div className="relative w-60 h-60 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full text-slate-800 animate-[spin_12s_linear_infinite]" viewBox="0 0 100 100">
            <polygon points="50 1 95 25 95 75 50 99 5 75 5 25" fill="none" stroke="currentColor" strokeWidth="1" />
            <polygon points="50 5 91 28 91 72 50 95 9 72 9 28" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
          </svg>
          
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="2" />
            <circle 
              cx="50" cy="50" r="45" fill="none" stroke="#6366f1" strokeWidth="4" 
              strokeDasharray={`${progress * 2.83} 283`}
              strokeLinecap="round"
              className="transition-all duration-300 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]"
              transform="rotate(-90 50 50)"
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/40 rounded-full backdrop-blur-sm m-4 border border-indigo-500/20">
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-indigo-400 font-mono tracking-tighter">
              {progress}%
            </span>
          </div>
        </div>
      </div>

      <div className="text-center space-y-3 mb-12">
        <h2 className="text-xl font-bold text-slate-100 tracking-wide flex items-center justify-center">
          <RefreshCw className="animate-spin mr-3 text-indigo-400" size={20} /> 
          이중 계측 파형 매칭 및 의사결정 결합 분석 중...
        </h2>
        <p className="text-slate-400 text-xs font-mono max-w-md mx-auto">
          시간-주파수 도메인 진동특징량 + MCSA 3상 전류 고장 특징량 자동 융합 완료
        </p>
      </div>

      <div className="w-full max-w-xl bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${progress > 30 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-blue-500/20 border-blue-500 text-blue-400 animate-pulse'}`}>
              {progress > 30 ? <CheckCircle size={14} /> : <div className="w-2 h-2 bg-blue-400 rounded-full" />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs font-semibold ${progress > 30 ? 'text-slate-300' : 'text-blue-400'}`}>진동(Vib) 시간-주파수 특징량 연산</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${progress > 30 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                  {progress > 30 ? 'COMPLETED' : 'PROCESSING'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${progress > 70 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : progress > 30 ? 'bg-blue-500/20 border-blue-500 text-blue-400 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-600'}`}>
              {progress > 70 ? <CheckCircle size={14} /> : progress > 30 ? <div className="w-2 h-2 bg-blue-400 rounded-full" /> : null}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs font-semibold ${progress > 70 ? 'text-slate-300' : progress > 30 ? 'text-blue-400' : 'text-slate-500'}`}>전류(Cur) 3상 고주파 편심력 스펙트럼(MCSA) 매칭</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${progress > 70 ? 'bg-emerald-500/10 text-emerald-400' : progress > 30 ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
                  {progress > 70 ? 'COMPLETED' : progress > 30 ? 'PROCESSING' : 'WAITING'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${progress >= 100 ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : progress > 70 ? 'bg-blue-500/20 border-blue-500 text-blue-400 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-600'}`}>
              {progress >= 100 ? <CheckCircle size={14} /> : progress > 70 ? <div className="w-2 h-2 bg-blue-400 rounded-full" /> : null}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs font-semibold ${progress >= 100 ? 'text-slate-300' : progress > 70 ? 'text-blue-400' : 'text-slate-500'}`}>XGBoost 8대 모델 교차 의사결정 융합 & RAG 보고서 합성</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${progress >= 100 ? 'bg-emerald-500/10 text-emerald-400' : progress > 70 ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
                  {progress >= 100 ? 'COMPLETED' : progress > 70 ? 'PROCESSING' : 'WAITING'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-[9px] text-slate-500 font-mono mb-0.5">DUAL PIPELINE</p>
            <p className="text-xs text-slate-300 font-mono">ACTIVE</p>
          </div>
          <div>
            <p className="text-[9px] text-slate-500 font-mono mb-0.5">GPU LOAD</p>
            <p className="text-xs text-indigo-400 font-mono">88.5%</p>
          </div>
          <div>
            <p className="text-[9px] text-slate-500 font-mono mb-0.5">FUSION ADAPTOR</p>
            <p className="text-xs text-slate-300 font-mono">OK</p>
          </div>
          <div>
            <p className="text-[9px] text-slate-500 font-mono mb-0.5">COGNITIVE RATIO</p>
            <p className="text-xs text-slate-300 font-mono">98.4%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiagnosticsView({ setCurrentPage, telemetryData, analysisResult, setWorkOrderOpen }) {
  const isDanger = analysisResult ? analysisResult.risk_level === 'DANGER' : true;
  const isWarning = analysisResult ? analysisResult.risk_level === 'WARNING' : false;
  
  const riskTitle = isDanger ? "위험" : isWarning ? "주의" : "정상";
  const riskColorClass = isDanger ? "text-rose-400" : isWarning ? "text-amber-400" : "text-emerald-400";
  const riskBgClass = isDanger ? "from-rose-950 to-slate-900 border-rose-900/50" : isWarning ? "from-amber-950 to-slate-900 border-amber-900/50" : "from-emerald-950 to-slate-900 border-emerald-900/50";
  const riskBadgeClass = isDanger ? "text-rose-500 border-rose-500/30 bg-rose-500/10" : isWarning ? "text-amber-500 border-amber-500/30 bg-amber-500/10" : "text-emerald-500 border-emerald-500/30 bg-emerald-500/10";
  const riskBadgeText = isDanger ? "CRITICAL STATUS" : isWarning ? "WARNING STATUS" : "NORMAL STATUS";
  
  const rootCause = analysisResult ? analysisResult.root_cause : "축정렬불량 의심 (교차 분석 융합)";
  const riskRationale = analysisResult ? analysisResult.risk_rationale : "진동 신호 RMS 폭증 및 전류 불균형 3차 조화 주파수 왜곡율이 동시에 검출되어 고장 가능성이 극대화되었습니다.";

  const [matrixFilterActive, setMatrixFilterActive] = useState(true);

  const isCauseActive = (causeName) => {
    if (!analysisResult) return false;
    const rc = analysisResult.root_cause || "";
    if (causeName.includes("조립 설치") || causeName.includes("축 중심")) {
      return rc.includes("축정렬불량") || rc.includes("조립 설치");
    }
    if (causeName.includes("윤활유 부족") || causeName.includes("베어링장치")) {
      return rc.includes("베어링불량") || rc.includes("윤활유 부족");
    }
    if (causeName.includes("회전체 불평형")) {
      return rc.includes("회전체불평형") || rc.includes("회전체 불평형");
    }
    if (causeName.includes("구동 벨트") || causeName.includes("벨트느슨함")) {
      return rc.includes("벨트느슨함") || rc.includes("구동 벨트");
    }
    return rc.includes(causeName);
  };

  const isSymptomActive = (symptomLabel) => {
    if (!analysisResult || !analysisResult.checked_symptoms) return false;
    return analysisResult.checked_symptoms.some(s => {
      const cleanS = s.replace(/\s+/g, '');
      const cleanLabel = symptomLabel.replace(/\s+/g, '');
      return cleanS.includes(cleanLabel) || cleanLabel.includes(cleanS);
    });
  };

  const displayedRows = FAULT_MATRIX_DATA.filter(row => {
    if (!matrixFilterActive) return true;
    if (isCauseActive(row.cause)) return true;
    return Object.keys(row.cells).some(symptomKey => {
      const symptomLabel = SYMPTOMS.find(s => s.key === symptomKey)?.label || "";
      return isSymptomActive(symptomLabel) && row.cells[symptomKey];
    });
  });

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700 print:hidden">
      {/* Top Risk Summary */}
      <div className={`bg-gradient-to-r ${riskBgClass} rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between relative overflow-hidden`}>
        <div className="absolute top-0 left-0 w-1/2 h-full bg-rose-500/5 blur-3xl"></div>
        <div className="relative z-10 flex items-center space-x-6 mb-4 md:mb-0 flex-1 min-w-0 mr-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.3)] shrink-0">
            <AlertTriangle size={32} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${riskBadgeClass}`}>{riskBadgeText}</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">설비 위험도: <span className={riskColorClass}>{riskTitle}</span></h2>
            <div className="flex flex-wrap gap-2 mt-2 text-xs">
              <span className="text-slate-300 font-mono bg-slate-950/50 px-2 py-1 rounded border border-slate-800 break-words whitespace-normal inline-block max-w-full">
                진단된 주 원인: <span className={`${riskColorClass} font-bold break-all`}>{rootCause}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={() => setWorkOrderOpen(true)}
            className="relative z-10 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-md flex items-center text-xs"
          >
            <Printer size={16} className="mr-1.5" />
            <span>점검 지시서 발행</span>
          </button>
          <button 
            onClick={() => setCurrentPage('detail')}
            className="relative z-10 bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl font-semibold transition-all border border-white/10 backdrop-blur-sm flex items-center text-xs"
          >
            결과 자세히 조회하기 <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Area */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative min-w-0 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center">
              <Activity className="mr-2 text-blue-500" /> SENSOR TELEMETRY (DYNAMIC REAL-TIME SCROLL)
            </h3>
            <div className="flex space-x-4 text-[10px] font-mono">
              <div className="flex items-center"><span className="w-3 h-3 rounded-sm bg-[#06b6d4] mr-2"></span>VIBRATION (진동)</div>
              <div className="flex items-center"><span className="w-3 h-3 rounded-sm bg-[#a855f7] mr-2"></span>CURRENT (전류)</div>
              <div className="flex items-center"><span className="w-3 h-3 rounded-sm bg-[#f59e0b] mr-2"></span>TEMP (온도)</div>
            </div>
          </div>
          
          <div className="h-80 w-full font-mono text-[10px] min-w-0 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={telemetryData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#475569" tick={{fill: '#64748b'}} />
                <YAxis yAxisId="left" stroke="#475569" tick={{fill: '#64748b'}} />
                <YAxis yAxisId="right" orientation="right" stroke="#475569" tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem', color: '#f1f5f9' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                
                <Line yAxisId="left" type="monotone" dataKey="vibration" stroke="#06b6d4" strokeWidth={3} dot={false} activeDot={{r: 8}} />
                <Line yAxisId="left" type="monotone" dataKey="current" stroke="#a855f7" strokeWidth={2.5} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Anomaly Label Overlay */}
          {(isDanger || isWarning) && (
            <div className="absolute top-24 right-1/4 bg-rose-500/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg border border-rose-400 shadow-lg shadow-rose-500/30 animate-pulse flex items-center">
              <AlertTriangle size={14} className="mr-1.5" /> FUSION ANOMALY DETECTED
            </div>
          )}

          <div className={`mt-6 bg-slate-950/60 border ${isDanger ? 'border-rose-500/30 bg-rose-500/5' : 'border-amber-500/30'} rounded-xl p-4 flex items-start space-x-3`}>
            <ShieldAlert className={`${isDanger ? 'text-rose-400' : 'text-amber-400'} shrink-0 mt-0.5`} size={20} />
            <p className="text-slate-300 text-xs leading-relaxed">
              <strong className={isDanger ? 'text-rose-400' : 'text-amber-400'}>{riskTitle} 판정 근거:</strong> {riskRationale}
            </p>
          </div>
        </div>

        {/* AI Reasoning */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="mb-6 border-b border-slate-800 pb-4">
            <h3 className="text-sm font-semibold text-slate-200">AI 다중 융합 분석 근거</h3>
            <p className="text-[10px] text-cyan-500 font-mono mt-1">Multi-Sensor Cognitive Network</p>
          </div>
          
          <div className="space-y-4 text-xs">
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 hover:border-cyan-500/30 transition-colors group">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <Activity size={16} />
                </div>
                <h4 className="font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">진동(Vib) 2차 조화 검출</h4>
              </div>
              <ul className="text-slate-400 space-y-1 ml-11 list-disc list-inside marker:text-slate-600">
                <li>진동 주파수 2X 스펙트럼 Peak 급증</li>
                <li>RMS 14.22 mm/s 대비 <span className="text-rose-400 font-bold">56% 초과</span></li>
              </ul>
            </div>

            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 hover:border-purple-500/30 transition-colors group">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <Zap size={16} />
                </div>
                <h4 className="font-semibold text-slate-200 group-hover:text-purple-400 transition-colors">MCSA 전류 비대칭 지수</h4>
              </div>
              <ul className="text-slate-400 space-y-1 ml-11 list-disc list-inside marker:text-slate-600">
                <li>3상 위상 균형도 4.8% 하락 (이상 징후)</li>
                <li>고주파 전력 편심 변동 가중합 임계치 초과</li>
              </ul>
            </div>

            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 hover:border-blue-500/30 transition-colors group">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <RefreshCw size={16} />
                </div>
                <h4 className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">교차 상관관계 지수</h4>
              </div>
              <ul className="text-slate-400 space-y-1 ml-11 list-disc list-inside marker:text-slate-600">
                <li>두 센서 분류 일치성: <span className="text-emerald-400 font-bold">96% 합의 (Consensus)</span></li>
                <li>동시 고장 판정 확률 대폭 상승</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 고장-원인 매트릭스 <표 6.7.9> 대화형 그리드 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center">
              <Settings className="mr-2 text-indigo-400" size={18} />
              <span>원심펌프 고장-원인 대조 매트릭스 일람표 (&lt;표 6.7.9&gt;)</span>
            </h3>
            <p className="text-[10px] text-indigo-400 font-mono mt-1">Manual-guided Diagnostics Consensus Mapping</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0 font-sans">
            <button
              onClick={() => setMatrixFilterActive(!matrixFilterActive)}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all border ${
                matrixFilterActive 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                  : 'bg-slate-850 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {matrixFilterActive ? "전체 표 보기" : "검출 이상 항목만 보기"}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/20">
          <table className="w-full text-[11px] text-slate-300 text-center border-collapse font-sans">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold text-xs">
                <th className="px-3 py-3.5 border-r border-slate-800 text-left min-w-[170px] bg-slate-950 font-bold">고장 또는 원인 \ 현상</th>
                {SYMPTOMS.map(s => {
                  const active = isSymptomActive(s.label);
                  return (
                    <th 
                      key={s.key} 
                      className={`px-2 py-3.5 border-r border-slate-800 font-bold whitespace-normal break-all leading-tight min-w-[85px] transition-colors ${
                        active ? 'bg-indigo-500/10 text-cyan-400 border-b-2 border-b-cyan-500' : ''
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center">
                        {active && <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mb-1 animate-ping"></span>}
                        <span>{s.label}</span>
                      </div>
                    </th>
                  );
                })}
                <th className="px-3 py-3.5 text-left min-w-[160px] font-bold">비고</th>
              </tr>
            </thead>
            <tbody>
              {displayedRows.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-6 py-12 text-slate-500 font-mono text-center">활성화된 고장 또는 이상 징후 매칭 데이터가 없습니다.</td>
                </tr>
              ) : (
                displayedRows.map((row, i) => {
                  const causeActive = isCauseActive(row.cause);
                  return (
                    <tr 
                      key={i} 
                      className={`border-b border-slate-800/50 transition-all ${
                        causeActive 
                          ? 'bg-indigo-600/10 border-l-4 border-l-indigo-500 font-bold' 
                          : 'hover:bg-slate-900/40'
                      }`}
                    >
                      <td className={`px-3 py-3 border-r border-slate-800 text-left font-semibold ${
                        causeActive ? 'text-slate-100' : 'text-slate-400'
                      }`}>
                        <div className="flex items-center space-x-1.5">
                          {causeActive && <span className="w-2 h-2 bg-indigo-400 rounded-full animate-ping"></span>}
                          <span className="truncate max-w-[155px]" title={row.cause}>{row.cause}</span>
                        </div>
                      </td>
                      {SYMPTOMS.map(s => {
                        const cellVal = row.cells[s.key];
                        const symptomActive = isSymptomActive(s.label);
                        const intersectionActive = causeActive && symptomActive && cellVal;
                        
                        return (
                          <td 
                            key={s.key} 
                            className={`px-2 py-3 border-r border-slate-800 font-mono transition-all duration-350 ${
                              intersectionActive 
                                ? 'bg-emerald-500/20 text-emerald-300 font-extrabold text-[12px] scale-105 shadow-[0_0_10px_rgba(16,185,129,0.3)] border-b-2 border-b-emerald-400' 
                                : symptomActive 
                                  ? 'bg-slate-800/30 text-slate-400'
                                  : causeActive
                                    ? 'bg-indigo-500/5 text-slate-500'
                                    : 'text-slate-600'
                            }`}
                          >
                            {intersectionActive ? (
                              <div className="flex items-center justify-center space-x-1">
                                <span className="text-[14px]">🔥</span>
                                <span className="underline decoration-emerald-400 decoration-2">{cellVal}</span>
                              </div>
                            ) : (
                              <span className="opacity-15 select-none">{cellVal || ""}</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-3 py-3 text-left text-slate-500 text-[10px] whitespace-normal leading-normal">{row.remarks}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[10px] text-slate-500 font-mono gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-indigo-500 mr-1.5 animate-pulse"></span>진단 결함 (Row)</div>
            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-cyan-400 mr-1.5"></span>검출 징후 (Col)</div>
            <div className="flex items-center bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-ping"></span>융합 판정 근거 (Intersection)</div>
          </div>
          <div>Source: 상수도관망시설 유지관리 표준 매뉴얼 &lt;표 6.7.9&gt;</div>
        </div>
      </div>
    </div>
  );
}

function DetailView({ analysisResult, setWorkOrderOpen }) {
  const isDanger = analysisResult ? analysisResult.risk_level === 'DANGER' : true;
  const isWarning = analysisResult ? analysisResult.risk_level === 'WARNING' : false;
  
  const riskTitle = isDanger ? "위험" : isWarning ? "주의" : "정상";
  const riskColorClass = isDanger ? "text-rose-400" : isWarning ? "text-amber-400" : "text-emerald-400";
  const riskBadgeClass = isDanger ? "bg-rose-500" : isWarning ? "bg-amber-500" : "bg-emerald-500";
  const riskBadgeText = isDanger ? "ANOMALY DETECTED" : isWarning ? "WARNING STATE" : "NORMAL STATE";
  
  const rootCause = analysisResult ? analysisResult.root_cause : "축정렬불량 의심 (융합분석)";
  const riskRationale = analysisResult ? analysisResult.risk_rationale : "최근 업로드된 진동 및 전류 센서 데이터에서 고주파 편심 왜곡과 가속도 급상승이 교차 검출되었습니다.";
  
  const recommendedActions = analysisResult ? analysisResult.recommended_actions : [
    "레이저 정렬계를 활용한 커플링 얼라인먼트 재조정 수립",
    "윤활유 주입 주기 단축 및 베어링 마모 미세 점검",
    "베이스 볼트 풀림 잠금 및 토크 렌치 체결 보강"
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 duration-500 print:hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
        <div className="mb-4 md:mb-0 flex-1 min-w-0 mr-6">
          <div className="flex items-center space-x-3 mb-2 text-xs">
            <span className={`${riskBadgeClass} text-white font-bold px-2 py-1 rounded ${isDanger ? 'animate-pulse' : ''}`}>{riskBadgeText}</span>
            <span className="text-slate-500 font-mono">ID: WO-2026-05-22-001</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 mb-2 break-words">{rootCause}</h1>
          <div className="flex items-center text-xs space-x-6 text-slate-400">
            <span>Risk Level: <strong className={riskColorClass}>{riskTitle}</strong></span>
            <span>분석 완료: 2026.05.22 02:07</span>
          </div>
        </div>
        <div className="flex space-x-3 w-full md:w-auto shrink-0">
          <button 
            onClick={() => setWorkOrderOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl transition-all font-bold shadow-lg shadow-indigo-600/20"
          >
            <Printer size={16} /> <span>점검 지시서 출력</span>
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl transition-colors border border-slate-700">
            <CheckCircle size={16} /> <span>경보 확인 (ACK)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Summary Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col">
          <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center border-b border-slate-800 pb-3">
            <Activity className="mr-2 text-cyan-400" /> AI ANALYSIS SUMMARY
          </h3>
          <p className="text-slate-300 leading-relaxed text-xs mb-6 flex-1 break-words">
            {riskRationale}
          </p>
          <div className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-4 mt-auto text-xs">
            <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
              <p className="text-[10px] text-slate-500 mb-1 font-mono">FUSION RATIO</p>
              <p className="text-lg font-bold text-rose-400">96.4%</p>
            </div>
            <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
              <p className="text-[10px] text-slate-500 mb-1 font-mono">RELIABILITY</p>
              <p className="text-lg font-bold text-emerald-400">EXCELLENT</p>
            </div>
            <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
              <p className="text-[10px] text-slate-500 mb-1 font-mono">MODEL VER</p>
              <p className="text-xs font-bold text-slate-300 mt-1">FUSION-V2.0</p>
            </div>
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex">
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center border-b border-slate-800 pb-3">
              <ShieldAlert className="mr-2 text-amber-400" /> RECOMMENDED ACTIONS (RAG MANUALS)
            </h3>
            <ol className="space-y-4 text-xs text-slate-300 list-decimal list-inside marker:text-indigo-500 marker:font-bold">
              {recommendedActions.map((action, index) => (
                <li key={index} className="pl-2 pb-2 border-b border-slate-800/50 leading-relaxed">{action}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportsView() {
  return (
    <div className="space-y-6 animate-in fade-in print:hidden">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Reports Archive</h1>
      <div className="grid grid-cols-1 gap-4">
        {[
          { title: "축정렬 불량 (진동+전류 융합 확진)", id: "WO-2026-05-22-001", date: "2026.05.22 02:07", status: "DANGER", iconColor: "text-rose-400", iconBg: "bg-rose-500/10", iconBorder: "border-rose-500/30", badgeText: "text-rose-400", badgeBg: "bg-rose-500/10", badgeBorder: "border-rose-500/20" },
          { title: "베어링 윤활 경고 (단일 센서)", id: "DIAG-2023-09-24-001", date: "2023.09.24 14:35", status: "WARNING", iconColor: "text-amber-400", iconBg: "bg-amber-500/10", iconBorder: "border-amber-500/30", badgeText: "text-amber-400", badgeBg: "bg-amber-500/10", badgeBorder: "border-amber-500/20" },
          { title: "정상 가동 리포트", id: "DIAG-2023-09-23-001", date: "2023.09.23 08:00", status: "NORMAL", iconColor: "text-emerald-400", iconBg: "bg-emerald-500/10", iconBorder: "border-emerald-500/30", badgeText: "text-emerald-400", badgeBg: "bg-emerald-500/10", badgeBorder: "border-emerald-500/20" },
        ].map((report, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-colors flex justify-between items-center group cursor-pointer shadow-sm">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-lg ${report.iconBg} border ${report.iconBorder} flex items-center justify-center ${report.iconColor}`}>
                <FileText size={24} />
              </div>
              <div className="text-xs">
                <h3 className="font-bold text-slate-200 group-hover:text-white transition-colors text-sm">{report.title}</h3>
                <p className="text-slate-500 font-mono mt-0.5">{report.id} • {report.date}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <span className={`${report.badgeBg} ${report.badgeText} px-3 py-1 rounded-full font-bold border ${report.badgeBorder}`}>
                {report.status}
              </span>
              <ChevronRight className="text-slate-600 group-hover:text-slate-300 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManualsView() {
  return (
    <div className="space-y-6 animate-in fade-in print:hidden">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Predefined Manuals</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "원심펌프 축 얼라인먼트 점검 지침", desc: "주기적인 다이얼 게이지 계측 및 레이저 정렬 가이던스", icon: Settings },
          { title: "베어링 하우징 오버홀 가이드", desc: "구름 베어링 마모 체크 및 윤활유 잔량 급유 기준표", icon: Zap },
          { title: "전류 주파수(MCSA) 해석 가이드", desc: "3상 전력 비대칭성 및 편심 주파수 검사 절차서", icon: BookOpen },
        ].map((manual, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:bg-slate-800/50 transition-colors group cursor-pointer flex flex-col h-full shadow-sm text-xs">
            <div className="w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <manual.icon size={28} />
            </div>
            <h3 className="text-sm font-bold text-slate-200 mb-2">{manual.title}</h3>
            <p className="text-slate-400 mb-6 flex-1 leading-relaxed">{manual.desc}</p>
            <div className="flex items-center text-blue-400 font-medium mt-auto group-hover:text-blue-300 transition-colors">
              READ DOCUMENT <ArrowUpRight size={16} className="ml-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
