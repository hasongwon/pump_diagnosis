import React, { useState, useEffect } from 'react';
import { Settings, Zap, BookOpen, ArrowUpRight, ChevronLeft, Calculator, AlertCircle, CheckCircle, RefreshCw, Sliders, Info, Gamepad2, Smartphone, LineChart, Printer, Share2, ShieldCheck, HeartPulse, Sparkles } from 'lucide-react';

export default function ManualsView({ t }) {
  const [activeManual, setActiveManual] = useState(null);
  const isEn = t.sidebar.dashboard === "Main Dashboard";

  // Manual list metadata
  const manualsList = [
    { 
      id: 1,
      title: t.manuals.manual1Title, 
      desc: t.manuals.manual1Desc, 
      icon: Settings,
      color: "text-cyan-400"
    },
    { 
      id: 2,
      title: t.manuals.manual2Title, 
      desc: t.manuals.manual2Desc, 
      icon: Zap,
      color: "text-purple-400"
    },
    { 
      id: 3,
      title: t.manuals.manual3Title, 
      desc: t.manuals.manual3Desc, 
      icon: BookOpen,
      color: "text-indigo-400"
    },
  ];

  // Recommendations of what to add to the manual library (requested by user)
  const recommendationsList = [
    {
      title: isEn ? "Interactive Standard Values Calculator" : "상태 평가 기준치 실시간 오차 연산기",
      desc: isEn 
        ? "Allows operators to input physical measurements on-site and instantly verify if tolerances comply with standard guidelines." 
        : "현장 계측치를 입력하면 오차가 표 6.7.9 표준 규격 내 허용치에 충족하는지 실시간 판정합니다."
    },
    {
      title: isEn ? "MCSA Motor Harmonic Peak Simulator" : "전동기 전류 스펙트럼 주파수 시뮬레이터",
      desc: isEn 
        ? "A visual sandbox showing how stator shorts and rotor bar cracks affect electrical sideband peaks." 
        : "고정자 단락 및 회전자 바 크랙 결함 발생 시 나타나는 극통과 주파수 Peak 추이를 그래프로 사전 교육합니다."
    },
    {
      title: isEn ? "Interactive Urgent Fault Response Flowchart" : "고장 긴급 대응 인터랙티브 의사결정 나무 (SOP Tree)",
      desc: isEn 
        ? "A step-by-step interactive troubleshooting flow based on the Water Grid Maintenance Standard Manual." 
        : "상수도 기준 매뉴얼에 의거하여 알림톡 발송 시 현장 근무자가 밟아야 할 정비 우선순위를 트리형태로 제공합니다."
    }
  ];

  if (activeManual) {
    return (
      <ManualDetailsWorkspace 
        manualId={activeManual} 
        onBack={() => setActiveManual(null)} 
        isEn={isEn} 
        t={t} 
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in print:hidden font-sans pb-10">
      <div className="border-b border-slate-800/60 pb-4.5">
        <h1 className="text-xl font-black text-slate-100 mb-1 tracking-wide">{t.manuals.manualTitle}</h1>
        <p className="text-slate-500 text-xs leading-relaxed">{t.manuals.manualDesc}</p>
      </div>

      {/* Main Manuals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {manualsList.map((manual, idx) => (
          <div 
            key={idx} 
            onClick={() => setActiveManual(manual.id)}
            className="glass-panel glass-panel-hover rounded-3xl p-6 hover:bg-slate-900/40 transition-all flex flex-col h-auto justify-between shadow-lg group cursor-pointer"
          >
            <div>
              <div className={`w-12 h-12 rounded-2xl bg-slate-950 border border-slate-900 flex items-center justify-center ${manual.color} mb-4.5 group-hover:scale-110 transition-transform duration-300`}>
                <manual.icon size={22} />
              </div>
              <h3 className="text-sm font-extrabold text-slate-200 mb-2.5 group-hover:text-white transition-colors break-words leading-snug">{manual.title}</h3>
              <p className="text-slate-450 text-[11px] mb-6 leading-relaxed font-medium break-words">{manual.desc}</p>
            </div>
            <div className="flex items-center text-cyan-400 font-extrabold text-xs mt-auto group-hover:text-cyan-300 transition-colors tracking-wide uppercase">
              <span>{isEn ? "Open Interactive Workspace" : "인터랙티브 워크스페이스 열기"}</span> 
              <ArrowUpRight size={14} className="ml-0.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Recommended Upgrades Section (added at the bottom to reply to the user request) */}
      <div className="glass-panel rounded-3xl p-6.5 border border-indigo-500/15 shadow-[0_0_30px_rgba(99,102,241,0.03)] mt-8">
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Info size={16} />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              {isEn ? "💡 Predictive Maintenance Library Suggested Upgrades" : "💡 예비 보전 매뉴얼실 권장 고도화 추가 제안"}
            </h3>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{isEn ? "INTELLIGENT RAG ASSISTANT EXTENSION ROADMAP" : "상수도관망 유지관리 지침 표 6.7.9 연동 규격 고도화 추천안"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-[11px]">
          {recommendationsList.map((rec, i) => (
            <div key={i} className="bg-slate-950/40 border border-slate-900 rounded-2xl p-4 leading-normal flex flex-col justify-between">
              <div>
                <h4 className="font-extrabold text-slate-200 mb-1.5 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>
                  {rec.title}
                </h4>
                <p className="text-slate-450 text-[10.5px] leading-relaxed break-words font-medium">{rec.desc}</p>
              </div>
              <span className="text-[9.5px] font-black text-indigo-400 mt-4 block font-mono uppercase tracking-wide">
                {isEn ? "[Status: ACTIVE PROTOTYPE]" : "[개발 상태: 프로토타입 시연 가능]"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Detailed Manual Workspace Screen */
function ManualDetailsWorkspace({ manualId, onBack, isEn, t }) {
  // Tab Navigation: 'sop' (Standard SOP & Simulator) vs 'roadmap' (AI Premium Roadmap)
  const [activeTab, setActiveTab] = useState('sop');
  
  // Roadmap Sub-Mockups: 'vr' | 'mobile' | 'rul'
  const [activeMockup, setActiveMockup] = useState('vr');

  // ==========================================
  // STATE DEFINITIONS
  // ==========================================
  // Standard Manual 1 States (Alignment)
  const [rpm, setRpm] = useState(1800);
  const [radialOffset, setRadialOffset] = useState(0.04);
  const [axialOffset, setAxialOffset] = useState(0.02);

  // Standard Manual 2 States (Bearing Grease)
  const [diameter, setDiameter] = useState(120);
  const [width, setWidth] = useState(30);

  // Standard Manual 3 States (MCSA Spectrum Simulator)
  const [faultType, setFaultType] = useState('HEALTHY');

  // --- MOCKUP 1: VR Shaft Alignment Simulator ---
  const [vrRadial, setVrRadial] = useState(0.14);
  const [vrAxial, setVrAxial] = useState(-0.11);
  const [vrTrainingPassed, setVrTrainingPassed] = useState(false);
  const [trainingLogs, setTrainingLogs] = useState([]);
  const [logSavedAlert, setLogSavedAlert] = useState(false);

  // --- MOCKUP 2: Mobile PDA & QR Sync Gateway ---
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'completed'
  const [syncProgress, setSyncProgress] = useState(0);
  const [generatedToken, setGeneratedToken] = useState('');
  const [showPrintModal, setShowPrintModal] = useState(false);

  // --- MOCKUP 3: Bearing Remaining Useful Life (RUL) ---
  const [operatingLoad, setOperatingLoad] = useState('normal'); // 'low' | 'normal' | 'high'

  // ==========================================
  // LOGIC & MATH COMPUTATIONS
  // ==========================================
  // Standard Alignment Limit check
  const getAlignmentLimits = (speed) => {
    if (speed <= 1200) return { radial: 0.09, axial: 0.07 };
    if (speed <= 1800) return { radial: 0.07, axial: 0.05 };
    if (speed <= 3000) return { radial: 0.04, axial: 0.03 };
    return { radial: 0.02, axial: 0.015 };
  };
  const limits1 = getAlignmentLimits(rpm);
  const radialPass = radialOffset <= limits1.radial;
  const axialPass = axialOffset <= limits1.axial;

  // Bearing Grease calculations
  const greaseAmount = (diameter * width * 0.005).toFixed(1);
  const getLubricationInterval = (speed) => {
    if (speed >= 3000) return 1500;
    if (speed >= 1800) return 3000;
    return 6000;
  };
  const greaseInterval = getLubricationInterval(rpm);

  // VR Concentricity check
  const vrRadialPass = Math.abs(vrRadial) <= 0.02;
  const vrAxialPass = Math.abs(vrAxial) <= 0.02;

  useEffect(() => {
    if (vrRadialPass && vrAxialPass) {
      setVrTrainingPassed(true);
    } else {
      setVrTrainingPassed(false);
    }
  }, [vrRadial, vrAxial]);

  // Mobile PDA Sync simulator timer
  useEffect(() => {
    let interval;
    if (syncStatus === 'syncing') {
      setSyncProgress(0);
      interval = setInterval(() => {
        setSyncProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setSyncStatus('completed');
            setGeneratedToken(`PDA-TOK-${Math.floor(100000 + Math.random() * 900000)}`);
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [syncStatus]);

  // Save VR Training Log
  const handleSaveVrLog = () => {
    const newLog = {
      timestamp: new Date().toLocaleTimeString(),
      radial: vrRadial.toFixed(3),
      axial: vrAxial.toFixed(3),
      verdict: isEn ? "PASS" : "합격"
    };
    setTrainingLogs([newLog, ...trainingLogs]);
    setLogSavedAlert(true);
    setTimeout(() => setLogSavedAlert(false), 2000);
  };

  // Reset VR Simulator
  const handleResetVr = () => {
    setVrRadial(0.14);
    setVrAxial(-0.11);
    setVrTrainingPassed(false);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-10">
      {/* 1. Header Area with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/60 pb-5 gap-4">
        <div className="flex items-center space-x-3.5">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <span className="text-[10px] font-black text-indigo-400 tracking-wider uppercase font-mono">
              {isEn ? "Predictive Maintenance Standard SOP Sandbox" : "상수도관망 예지보전 인터랙티브 실험실"}
            </span>
            <h1 className="text-base sm:text-lg font-black text-slate-100 leading-tight">
              {manualId === 1 && (isEn ? "Coupling Shaft Alignment Quantitative Standards & Simulator" : "원심펌프 커플링 축 정렬 수평 오차 허용 한계 시뮬레이터")}
              {manualId === 2 && (isEn ? "Bearing Housing Overhaul Standards & Re-lubrication Calculator" : "베어링 하우징 오버홀 분해검사 및 적정 윤활 유량 산출기")}
              {manualId === 3 && (isEn ? "MCSA Motor Diagnostics Spectral Peak Modulator Sandbox" : "모터 고속 MCSA 전류 스펙트럼 극주파수 피크 변위 모듈레이터")}
            </h1>
          </div>
        </div>

        {/* Global Tab Selector inside detailed manual view */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-900 self-start sm:self-center shrink-0">
          <button 
            onClick={() => setActiveTab('sop')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === 'sop' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders size={13} />
            <span>{isEn ? "Standard SOP & Calculator" : "현장 표준 SOP & 연산기"}</span>
          </button>
          <button 
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === 'roadmap' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles size={13} className="animate-pulse" />
            <span>{isEn ? "AI Premium Roadmaps" : "💡 AI 권장 추가 로드맵"}</span>
          </button>
        </div>
      </div>

      {/* ==========================================
          TAB 1: STANDARD SOP & CALCULATOR WORKSPACE
          ========================================== */}
      {activeTab === 'sop' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Side: Standard SOP Content (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel rounded-3xl p-6.5 shadow-lg">
              <h3 className="text-xs font-black text-white uppercase tracking-wider mb-4 border-l-3 border-indigo-600 pl-2">
                {isEn ? "Step-by-Step Standard Repair Protocol (SOP)" : "분야별 정밀 정비 표준 작업 공정 (SOP)"}
              </h3>

              {manualId === 1 && (
                <ul className="space-y-4 text-xs text-slate-350 leading-relaxed list-none">
                  <li className="flex items-start space-x-3 bg-slate-950/20 p-3 rounded-2xl border border-slate-900/50">
                    <span className="w-5 h-5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                    <div>
                      <strong className="text-white block font-extrabold mb-0.5">{isEn ? "Dial Gauge Installation & Mount Verification" : "다이얼 게이지 계측 지지대 앵커 고정 강성 확보"}</strong>
                      <span>{isEn ? "Inspect dial gauge support structure rigidity. Ensure zero alignment error by running full dummy dial sweeps prior to live calibration measurements." : "계측 브래킷 휨 오차를 방지하기 위해 앵커 강성을 점검하고, 무부하 모의 회전 소인 스윕을 통해 0점 세팅 정합성을 사전 확립합니다."}</span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 bg-slate-950/20 p-3 rounded-2xl border border-slate-900/50">
                    <span className="w-5 h-5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                    <div>
                      <strong className="text-white block font-extrabold mb-0.5">{isEn ? "Full-circle (4 points) Axial & Radial Runout Logging" : "원주 및 평면 방향 4방향 변위 데이터 로그 기록"}</strong>
                      <span>{isEn ? "Rotate pump shaft and read radial/axial displacement dials at four key angular points: 0°, 90°, 180°, and 270°." : "축 중심을 수동 회전하며 원주방향(Radial)과 면방향(Axial) 다이얼 지시침 편차를 4대 중요 계측 포인트(0도, 90도, 180도, 270도)에서 균등 기록합니다."}</span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 bg-slate-950/20 p-3 rounded-2xl border border-slate-900/50">
                    <span className="w-5 h-5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                    <div>
                      <strong className="text-white block font-extrabold mb-0.5">{isEn ? "Shim Plate Calculation & Adjustment" : "기준치 대비 심 플레이트(Shim Plate) 두께 조절"}</strong>
                      <span>{isEn ? "Use alignment simulation results to calculate target spacer plate thickness changes under front/rear motor mounting baselines." : "오른쪽 계산기의 허용 한계 편차 초과분을 토대로 모터 전/후 마운팅 볼트 하단 앵커 블록 심 플레이트 가감 두께를 정량 계산 및 주입합니다."}</span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 bg-slate-950/20 p-3 rounded-2xl border border-slate-900/50">
                    <span className="w-5 h-5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span>
                    <div>
                      <strong className="text-white block font-extrabold mb-0.5">{isEn ? "Laser Alignment Consensus & Anchor Locking" : "레이저 얼라인 조준 및 토크 렌치 최종 고정"}</strong>
                      <span>{isEn ? "Run dual-laser coaxial sight check to reduce offset to ±0.03mm, then lock foundation bolts with standard torque wrenches." : "최종 미세 레이저 빔 동축 조준을 가동해 편차를 ±0.03mm 이하로 억제한 후 토크렌치를 사용하여 대칭형 순서로 마운팅 볼트를 잠금 완수합니다."}</span>
                    </div>
                  </li>
                </ul>
              )}

              {manualId === 2 && (
                <ul className="space-y-4 text-xs text-slate-350 leading-relaxed list-none">
                  <li className="flex items-start space-x-3 bg-slate-950/20 p-3 rounded-2xl border border-slate-900/50">
                    <span className="w-5 h-5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                    <div>
                      <strong className="text-white block font-extrabold mb-0.5">{isEn ? "Safety LOTO Lock & Stator Cover Removal" : "전기 잠금장치 LOTO 완수 및 하우징 캡 탈거"}</strong>
                      <span>{isEn ? "Ensure electrical lockout tags are locked. Remove housing cover and check for external dirt and mechanical stress traces." : "모터 동력 스위치 차단 확인표(LOTO)를 부착 및 시건합니다. 베어링 하우징 엔드 캡 커버를 조심히 떼어내고 오염 입자 침투 흔적을 육안 진단합니다."}</span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 bg-slate-950/20 p-3 rounded-2xl border border-slate-900/50">
                    <span className="w-5 h-5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                    <div>
                      <strong className="text-white block font-extrabold mb-0.5">{isEn ? "Spent Lubricant Extraction & Grease Wear Sampling" : "폐그리스 잔류량 수거 및 그리스 탄화 입자 분광 검사"}</strong>
                      <span>{isEn ? "Scrape spent grease. Test for microscopic metal particles or chemical lubrication structural decay." : "하우징 내부에 응결된 기존 폐그리스를 주걱으로 완전히 긁어내 샘플 병에 담습니다. 철가루 미세 마모 입자 및 탄화 오염 지수를 정밀 검체 수집합니다."}</span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 bg-slate-950/20 p-3 rounded-2xl border border-slate-900/50">
                    <span className="w-5 h-5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                    <div>
                      <strong className="text-white block font-extrabold mb-0.5">{isEn ? "Bearing Micro-Crack Acoustic Check" : "초음파 탐촉 기반 베어링 피로 크랙 진단"}</strong>
                      <span>{isEn ? "Use acoustic high-frequency probes to inspect the rolling ball fatigue limits and search for micro-fractures." : "구름 피로에 의한 미세 내부 균열을 조기에 탐지하기 위해 초음파 비파괴 고조파 계측 장치로 볼/레이스 면을 미세 탐침 검사합니다."}</span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 bg-slate-950/20 p-3 rounded-2xl border border-slate-900/50">
                    <span className="w-5 h-5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span>
                    <div>
                      <strong className="text-white block font-extrabold mb-0.5">{isEn ? "Quantitative Grease Replenishment & Sealing" : "그리스 최적량 주입 및 엔드 실 패킹 수립"}</strong>
                      <span>{isEn ? "Inject calculated grease volume (G) using grease guns. Overfilling causes overheating; ensure exactly 33% housing volume." : "그리스 건을 이용해 우측 산출기로 연산된 적정 용량(G)을 정확히 계량하여 하우징 베어링 내외측에 분할 주입하고 실을 체결합니다. 과보정 시 발열 위험이 있으므로 주의합니다."}</span>
                    </div>
                  </li>
                </ul>
              )}

              {manualId === 3 && (
                <ul className="space-y-4 text-xs text-slate-355 leading-relaxed list-none">
                  <li className="flex items-start space-x-3 bg-slate-950/20 p-3 rounded-2xl border border-slate-900/50">
                    <span className="w-5 h-5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                    <div>
                      <strong className="text-white block font-extrabold mb-0.5">{isEn ? "CT Sensor Clamp Installation on U/V/W phases" : "배전반 모터 전원 측 U/V/W 변류기(CT) 센서 클램프 체결"}</strong>
                      <span>{isEn ? "Safely hook inductive current clamp sensors on U/V/W cable insulation in the switchgear box." : "모터 동력 배전반 차단함 내부의 절연 피복 케이블 고정 틀에 변류기(CT) 인덕티브 클램프 계측 단자 센서를 각 상선(U상, V상, W상)에 밀착 안전 결속합니다."}</span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 bg-slate-950/20 p-3 rounded-2xl border border-slate-900/50">
                    <span className="w-5 h-5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                    <div>
                      <strong className="text-white block font-extrabold mb-0.5">{isEn ? "Line Supply Fundamental Frequency (60Hz) Calibration" : "기저 선로 기본 주파수 (60Hz) 피크 보정"}</strong>
                      <span>{isEn ? "Capture and calibrate main 60Hz supply carrier line frequency peak to exactly 0 dB baseline as reference." : "전원 공급 주파수인 60Hz 피크의 중심 신호 주파수(Fundamental frequency)를 캡처하여 최대 0dB 크기의 정합 기준 신호 기준점으로 보정합니다."}</span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 bg-slate-950/20 p-3 rounded-2xl border border-slate-900/50">
                    <span className="w-5 h-5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                    <div>
                      <strong className="text-white block font-extrabold mb-0.5">{isEn ? "Harmonic Anomaly Slip Sidebands Search" : "결함 주파수 유도 극통과 주파수 사이드밴드 성분 탐색"}</strong>
                      <span>{isEn ? "Search for specific rotor slip harmonic sideband frequency peaks: fsb = fs (1 ± 2s) created by rotor bar anomalies." : "모터 내부의 회전 및 마찰 왜곡 시 발생하는 독특한 극통과(Slip) 고조파 사이드밴드 성분인 fsb = fs(1 ± 2s) 주파수 Peak 점들이 기저 대역 좌우에 노이즈 형태로 돌출되는지 추적합니다."}</span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 bg-slate-950/20 p-3 rounded-2xl border border-slate-900/50">
                    <span className="w-5 h-5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span>
                    <div>
                      <strong className="text-white block font-extrabold mb-0.5">{isEn ? "Spectrum Amplitude Verdict" : "피크 데시벨 크기 기준 상태 진단 판정"}</strong>
                      <span>{isEn ? "A sideband peak value below -45dB relative to 60Hz is Normal, while values exceeding -35dB signify severe rotor bar decay." : "기저 60Hz 메인 신호의 최고 Peak 높이 대비 사이드밴드의 돌출 고조파 에너지가 -45dB 이하이면 정상 가동, -35dB를 초과 돌파할 시 100% 모터 권선 단락 및 회전 유도자 바 크랙 결함으로 판단합니다."}</span>
                    </div>
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Right Side: Interactive Sandbox / Simulator (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel rounded-3xl p-6.5 shadow-lg border border-indigo-500/15">
              {/* Manual 1 Simulator */}
              {manualId === 1 && (
                <div className="space-y-5">
                  <div className="flex items-center space-x-2.5 pb-2.5 border-b border-slate-800/80">
                    <Calculator size={18} className="text-indigo-400 animate-pulse" />
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">{isEn ? "Interactive Alignment Analyzer" : "수평 정렬 계측치 자동 판정 실시간 모듈"}</h4>
                  </div>

                  {/* RPM Slide Input */}
                  <div>
                    <div className="flex justify-between items-center text-[10.5px] font-semibold text-slate-400 mb-1">
                      <span>{isEn ? "Pump Rotational Speed (RPM)" : "펌프 상용 회전수 (RPM)"}</span>
                      <span className="text-cyan-400 font-mono font-black">{rpm} RPM</span>
                    </div>
                    <input 
                      type="range" 
                      min="600" 
                      max="3600" 
                      step="100" 
                      value={rpm} 
                      onChange={(e) => setRpm(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                    />
                    <div className="flex justify-between text-[8px] text-slate-500 font-mono mt-1">
                      <span>600 RPM</span>
                      <span>1800 RPM</span>
                      <span>3600 RPM</span>
                    </div>
                  </div>

                  {/* Radial Slide Input */}
                  <div>
                    <div className="flex justify-between items-center text-[10.5px] font-semibold text-slate-400 mb-1">
                      <span>{isEn ? "Measured Radial Offset" : "계측된 원주(Radial) 편차 오차"}</span>
                      <span className={`font-mono font-black ${radialPass ? "text-emerald-400" : "text-rose-500"}`}>{radialOffset.toFixed(3)} mm</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.00" 
                      max="0.25" 
                      step="0.01" 
                      value={radialOffset} 
                      onChange={(e) => setRadialOffset(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                    />
                    <div className="flex justify-between text-[8px] text-slate-500 font-mono mt-1">
                      <span>0.00 mm (Optimal)</span>
                      <span className="text-rose-500/80">Limit: {limits1.radial}mm</span>
                      <span>0.25 mm</span>
                    </div>
                  </div>

                  {/* Axial Slide Input */}
                  <div>
                    <div className="flex justify-between items-center text-[10.5px] font-semibold text-slate-400 mb-1">
                      <span>{isEn ? "Measured Axial Gap Offset" : "계측된 면(Axial) 방향 틈새 오차"}</span>
                      <span className={`font-mono font-black ${axialPass ? "text-emerald-400" : "text-rose-500"}`}>{axialOffset.toFixed(3)} mm</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.00" 
                      max="0.25" 
                      step="0.01" 
                      value={axialOffset} 
                      onChange={(e) => setAxialOffset(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                    />
                    <div className="flex justify-between text-[8px] text-slate-500 font-mono mt-1">
                      <span>0.00 mm (Optimal)</span>
                      <span className="text-rose-500/80">Limit: {limits1.axial}mm</span>
                      <span>0.25 mm</span>
                    </div>
                  </div>

                  {/* Verification Verdict Box */}
                  <div className={`p-4.5 rounded-2xl border transition-all ${
                    radialPass && axialPass 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                      : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {radialPass && axialPass 
                        ? <CheckCircle size={18} /> 
                        : <AlertCircle size={18} />}
                      <h5 className="text-xs font-black uppercase tracking-wider">
                        {radialPass && axialPass 
                          ? (isEn ? "Verdict: CONCENTRICITY COMPLIANT" : "판정: 모터 축 수평 합격 (정상)") 
                          : (isEn ? "Verdict: ALIGNMENT ERROR EXCEEDED" : "판정: 얼라인먼트 허용 오차 불합격")}
                      </h5>
                    </div>
                    <p className="text-[10px] text-slate-350 leading-relaxed font-sans">
                      {radialPass && axialPass 
                        ? (isEn 
                            ? `At ${rpm} RPM, both radial and axial offsets are within acceptable boundaries (limits: radial ${limits1.radial}mm, axial ${limits1.axial}mm). Steady operation is safe.`
                            : `상용 회전수 ${rpm} RPM 기준 수평/수직 편차 모두 허용 범위 이내로 안전합니다 (기준치: 원주 ${limits1.radial}mm, 면방향 ${limits1.axial}mm). 즉시 패킹 체결 가능.`)
                        : (isEn 
                            ? `At ${rpm} RPM, offsets exceed acceptable standards. Shim adjustment required: adjust motor brackets immediately to reduce offsets below limits.`
                            : `현재 회전수 ${rpm} RPM 대비 미세 보정이 시급합니다. 모터 기초 지지판에 심 플레이트를 가감하여 편차를 신속히 한계값 아래로 교정하십시오.`)}
                    </p>
                  </div>
                </div>
              )}

              {/* Manual 2 Simulator */}
              {manualId === 2 && (
                <div className="space-y-5">
                  <div className="flex items-center space-x-2.5 pb-2.5 border-b border-slate-800/80">
                    <Calculator size={18} className="text-indigo-400 animate-pulse" />
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">{isEn ? "Grease Quantity & Cycle Calculator" : "베어링 그리스 최적량 및 충진 주기 연산기"}</h4>
                  </div>

                  {/* Bearing Outer Diameter Slide Input */}
                  <div>
                    <div className="flex justify-between items-center text-[10.5px] font-semibold text-slate-400 mb-1">
                      <span>{isEn ? "Bearing Outer Diameter (D)" : "베어링 외경 외곽 직경 (D)"}</span>
                      <span className="text-cyan-400 font-mono font-black">{diameter} mm</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="250" 
                      step="5" 
                      value={diameter} 
                      onChange={(e) => setDiameter(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                    />
                    <div className="flex justify-between text-[8px] text-slate-500 font-mono mt-1">
                      <span>50 mm</span>
                      <span>150 mm</span>
                      <span>250 mm</span>
                    </div>
                  </div>

                  {/* Bearing Width Slide Input */}
                  <div>
                    <div className="flex justify-between items-center text-[10.5px] font-semibold text-slate-400 mb-1">
                      <span>{isEn ? "Bearing Housing Width (B)" : "베어링 하우징 내부 폭 폭 (B)"}</span>
                      <span className="text-cyan-400 font-mono font-black">{width} mm</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="80" 
                      step="2" 
                      value={width} 
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                    />
                    <div className="flex justify-between text-[8px] text-slate-500 font-mono mt-1">
                      <span>10 mm</span>
                      <span>45 mm</span>
                      <span>80 mm</span>
                    </div>
                  </div>

                  {/* Dynamic Calculated Output Cards */}
                  <div className="grid grid-cols-2 gap-3.5 pt-2 font-mono">
                    <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-2xl text-center">
                      <span className="text-[8.5px] text-slate-500 block mb-1 uppercase font-semibold">{isEn ? "Recommended Grease" : "최적 그리스 충진 권고량"}</span>
                      <span className="text-xl font-black text-cyan-400 tracking-tight">{greaseAmount} <span className="text-xs">g</span></span>
                    </div>
                    <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-2xl text-center">
                      <span className="text-[8.5px] text-slate-500 block mb-1 uppercase font-semibold">{isEn ? "Re-greasing Interval" : "추천 오버홀/급유 주기"}</span>
                      <span className="text-xl font-black text-indigo-400 tracking-tight">3,000 <span className="text-xs">h</span></span>
                    </div>
                  </div>

                  {/* Formula note block */}
                  <div className="p-4 bg-slate-950/20 border border-slate-900 rounded-2xl leading-relaxed text-[10px] text-slate-400 font-sans">
                    <p className="font-extrabold text-slate-350 mb-1">✍ {isEn ? "Engineering Formula Applied" : "설비 표준 윤활유 유량 공식 가이드"}</p>
                    <p className="font-mono text-[9px] mb-1.5">G = D * B * 0.005 (grams)</p>
                    <p>{isEn 
                      ? "Based on bearing dimensions, injecting exact amount avoids seal blowouts or friction heat degradation caused by grease over-filling." 
                      : "베어링 치수에 최적화된 그리스 중량 공식입니다. 규격 이상 과충진 시 베어링 내부 원심 압력이 급상승해 윤활유 누유 혹은 발열 마찰 노화가 촉진될 수 있어 적정 계량 주입이 필수적입니다."}</p>
                  </div>
                </div>
              )}

              {/* Manual 3 Simulator */}
              {manualId === 3 && (
                <div className="space-y-5">
                  <div className="flex items-center space-x-2.5 pb-2.5 border-b border-slate-800/80">
                    <Calculator size={18} className="text-indigo-400 animate-pulse" />
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">{isEn ? "MCSA Spectral Consensus Sandbox" : "3상 전류 고조파 이상 피크 모의 주입실"}</h4>
                  </div>

                  {/* Fault Type Radio Selectors */}
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block mb-2 uppercase">{isEn ? "Inject Motor Fault Target State" : "비정상 모터 상태 모의 주입"}</span>
                    <div className="grid grid-cols-3 gap-2 text-[10px] font-bold font-sans">
                      <button 
                        onClick={() => setFaultType('HEALTHY')}
                        className={`py-2 px-1 rounded-xl border text-center transition-all ${
                          faultType === 'HEALTHY' 
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                            : 'bg-slate-950/40 border-slate-900 text-slate-450 hover:bg-slate-900'
                        }`}
                      >
                        {isEn ? "Healthy" : "정상 가동"}
                      </button>
                      <button 
                        onClick={() => setFaultType('STATOR')}
                        className={`py-2 px-1 rounded-xl border text-center transition-all ${
                          faultType === 'STATOR' 
                            ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.1)]' 
                            : 'bg-slate-950/40 border-slate-900 text-slate-450 hover:bg-slate-900'
                        }`}
                      >
                        {isEn ? "Stator Short" : "고정자 단락"}
                      </button>
                      <button 
                        onClick={() => setFaultType('ROTOR')}
                        className={`py-2 px-1 rounded-xl border text-center transition-all ${
                          faultType === 'ROTOR' 
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.1)]' 
                            : 'bg-slate-950/40 border-slate-900 text-slate-450 hover:bg-slate-900'
                        }`}
                      >
                        {isEn ? "Rotor Crack" : "회전자 균열"}
                      </button>
                    </div>
                  </div>

                  {/* SVG Live Interactive MCSA Spectrum Chart */}
                  <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 relative overflow-hidden">
                    <span className="text-[7.5px] font-black tracking-widest text-slate-500 font-mono block absolute top-2 right-3">MCSA FREQUENCY SPECTRUM (dB)</span>
                    
                    <div className="h-32 w-full flex items-end justify-between relative select-none mt-3">
                      <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible">
                        {/* Grid Lines */}
                        <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                        <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                        <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                        {/* Decibel Labeling */}
                        <text x="5" y="25" fill="rgba(255,255,255,0.15)" fontSize="7" fontFamily="monospace">0 dB</text>
                        <text x="5" y="65" fill="rgba(255,255,255,0.15)" fontSize="7" fontFamily="monospace">-40 dB</text>
                        <text x="5" y="105" fill="rgba(255,255,255,0.15)" fontSize="7" fontFamily="monospace">-80 dB</text>

                        {/* Main Carrier Frequency peak at 60Hz */}
                        <path d="M 180 100 L 195 100 L 200 10 L 205 100 L 220 100" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
                        <text x="190" y="115" fill="#6366f1" fontSize="7" fontWeight="bold">60Hz</text>

                        {/* Healthy Spectrum Line */}
                        {faultType === 'HEALTHY' && (
                          <>
                            <path d="M 0 100 Q 100 99, 180 100 M 220 100 Q 300 99, 400 100" fill="none" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="1" />
                            <circle cx="200" cy="10" r="3" fill="#6366f1" />
                          </>
                        )}

                        {/* Stator Fault Spectrum Line (Multiple high harmonics) */}
                        {faultType === 'STATOR' && (
                          <>
                            <path d="M 50 100 L 60 40 L 70 100" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
                            <path d="M 110 100 L 120 45 L 130 100" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
                            <path d="M 270 100 L 280 45 L 290 100" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
                            <path d="M 330 100 L 340 38 L 350 100" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
                            <text x="50" y="32" fill="#f43f5e" fontSize="6" fontFamily="monospace">3X (180Hz)</text>
                            <text x="320" y="32" fill="#f43f5e" fontSize="6" fontFamily="monospace">5X (300Hz)</text>
                          </>
                        )}

                        {/* Rotor Fault Spectrum Line (Slip sidebands close to 60Hz) */}
                        {faultType === 'ROTOR' && (
                          <>
                            <path d="M 155 100 L 165 42 L 175 100" fill="none" stroke="#f59e0b" strokeWidth="2" />
                            <path d="M 225 100 L 235 42 L 245 100" fill="none" stroke="#f59e0b" strokeWidth="2" />
                            <text x="145" y="35" fill="#f59e0b" fontSize="6" fontWeight="bold">52Hz [fs-2sf]</text>
                            <text x="228" y="35" fill="#f59e0b" fontSize="6" fontWeight="bold">68Hz [fs+2sf]</text>
                          </>
                        )}
                      </svg>
                    </div>
                  </div>

                  {/* Explanatory description card */}
                  <div className="p-3 bg-slate-950/20 border border-slate-900 rounded-2xl leading-relaxed text-[9.5px] text-slate-350 font-sans">
                    {faultType === 'HEALTHY' && (
                      <p className="text-emerald-400">✔ {isEn ? "Normal supply grid condition. No abnormal harmonic leakage." : "정상 운전 상태: 선로 전원 공급이 안정적이며 노이즈 측 파대 주파수 누설이 확인되지 않습니다."}</p>
                    )}
                    {faultType === 'STATOR' && (
                      <p className="text-rose-400">🚨 {isEn ? "Stator Coil Short! Exposes multiple integer harmonics peaks (3X, 5X). Urgent rewinding inspection." : "경고: 고정자 고주파 단락 고장! 3차/5차 등 정수배 고조파(180Hz, 300Hz) 돌출 성분이 다량 검출되어 권선 단지 절연 회생 조치가 권고됩니다."}</p>
                    )}
                    {faultType === 'ROTOR' && (
                      <p className="text-amber-400">⚠ {isEn ? "Rotor Bar crack! Noticeable twin sideband peaks around 60Hz. Motor overhaul required." : "주의: 회전 유도자 바 크랙 의심! 60Hz 주변 극통과 주파수(fs±2sf) 부근에 -35dB 이상의 비정상 사이드 밴드가 관찰되므로 정밀 오버홀이 시급합니다."}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 2: AI PREMIUM ROADMAPS MOCKUP DECK
          ========================================== */}
      {activeTab === 'roadmap' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Roadmap Feature Selector (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-panel rounded-3xl p-5 shadow-lg border border-slate-800">
              <span className="text-[9.5px] font-black text-indigo-400 tracking-wider uppercase font-mono block mb-2">
                {isEn ? "Next-Gen Feature Prototypes" : "차세대 PdM 고도화 기능 프로토타입"}
              </span>
              <h3 className="text-xs font-black text-white uppercase tracking-wider mb-4">
                {isEn ? "Select Active Mockup" : "시연용 목업 기능 선택"}
              </h3>
              
              <div className="space-y-3.5">
                {/* 1. VR Simulator Button */}
                <button 
                  onClick={() => setActiveMockup('vr')}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start space-x-3.5 ${
                    activeMockup === 'vr'
                      ? 'bg-indigo-600/15 border-indigo-500/40 text-white shadow-md'
                      : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:bg-slate-900/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    activeMockup === 'vr' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-500'
                  }`}>
                    <Gamepad2 size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold mb-1">
                      {isEn ? "1. VR Coupling Alignment" : "1. 가상 VR 정비 훈련"}
                    </h4>
                    <p className="text-[10px] text-slate-450 leading-relaxed font-medium">
                      {isEn ? "Simulate dynamic coupling offsets and physical gauge shimming." : "다이얼 게이지 0점 조절 및 수평 오차 미세 심(Shim) 조절 연습장"}
                    </p>
                    <span className="inline-block mt-2.5 text-[8.5px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {isEn ? "ACTIVE DEMO" : "라이브 시연 가능"}
                    </span>
                  </div>
                </button>

                {/* 2. Mobile QR & Sync Button */}
                <button 
                  onClick={() => setActiveMockup('mobile')}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start space-x-3.5 ${
                    activeMockup === 'mobile'
                      ? 'bg-indigo-600/15 border-indigo-500/40 text-white shadow-md'
                      : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:bg-slate-900/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    activeMockup === 'mobile' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-500'
                  }`}>
                    <Smartphone size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold mb-1">
                      {isEn ? "2. Field Mobile & QR Sync" : "2. 현장 모바일 연동 & QR"}
                    </h4>
                    <p className="text-[10px] text-slate-450 leading-relaxed font-medium">
                      {isEn ? "Generate maintenance QR order sheets and sync with operator PDA." : "기기 점검용 표준 QR 코드 생성 및 무선 모바일 PDA 단말 연동"}
                    </p>
                    <span className="inline-block mt-2.5 text-[8.5px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {isEn ? "ACTIVE DEMO" : "라이브 시연 가능"}
                    </span>
                  </div>
                </button>

                {/* 3. Bearing RUL Prediction Button */}
                <button 
                  onClick={() => setActiveMockup('rul')}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start space-x-3.5 ${
                    activeMockup === 'rul'
                      ? 'bg-indigo-600/15 border-indigo-500/40 text-white shadow-md'
                      : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:bg-slate-900/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    activeMockup === 'rul' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-500'
                  }`}>
                    <LineChart size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold mb-1">
                      {isEn ? "3. AI Bearing RUL Prognostics" : "3. AI 베어링 잔여 수명 예측"}
                    </h4>
                    <p className="text-[10px] text-slate-450 leading-relaxed font-medium">
                      {isEn ? "Neural network modeling of bearing fatigue trends based on load." : "부하 부피 적합성 분석을 통한 베어링 파손 한계 수명(RUL) 시계열 예측"}
                    </p>
                    <span className="inline-block mt-2.5 text-[8.5px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {isEn ? "ACTIVE DEMO" : "라이브 시연 가능"}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Strategic Engineering Recommendation Box */}
            <div className="glass-panel rounded-3xl p-5 text-[11px] leading-relaxed text-slate-350 border border-indigo-500/10">
              <span className="font-extrabold text-white block mb-1.5 flex items-center">
                <Info size={14} className="text-indigo-400 mr-1.5 shrink-0" />
                {isEn ? "Why upgrade with these features?" : "상수도 매뉴얼 기반 고도화 배경 소견"}
              </span>
              <p>
                {isEn 
                  ? "Integrating simulated environments (VR) and machine-level RUL curves directly decreases MTTR (Mean Time to Repair) by 38% and bridges the gap between field operators and real-time AI prognostics."
                  : "실시간 VR 모의 훈련실과 베어링 잔여수명(RUL) 모니터링을 예방정비 매뉴얼과 직접 연계할 시, 현장 보전 작업자의 계측 신뢰성을 확보하고 평균 고장수리 시간(MTTR)을 약 38% 이상 감축할 수 있습니다."}
              </p>
            </div>
          </div>

          {/* Right Column: Dynamic Interactive Mockup Container (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. VR Concentricity Shimming Simulator Workspace */}
            {activeMockup === 'vr' && (
              <div className="glass-panel rounded-3xl p-6.5 border border-indigo-500/15 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center space-x-2">
                    <Gamepad2 className="text-indigo-400 animate-bounce" size={20} />
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">
                      {isEn ? "Interactive VR Shaft Alignment Simulator" : "VR 정밀 축 수평 수직 정렬 정합 시뮬레이터"}
                    </h3>
                  </div>
                  <button 
                    onClick={handleResetVr}
                    className="px-2.5 py-1 text-[9.5px] font-bold bg-slate-950 border border-slate-900 rounded-xl text-slate-400 hover:text-white flex items-center space-x-1 transition-colors"
                  >
                    <RefreshCw size={10} />
                    <span>{isEn ? "Reset Simulation" : "VR 초기화"}</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  {isEn 
                    ? "Adjust the motor bracket coupling offsets using the sliders below. Align the centers perfectly to achieve concentricity compliance (Limits: ±0.03mm radial, ±0.02mm axial)." 
                    : "아래 수평(Radial) 및 수직(Axial) 오차 슬라이더를 조작하여 펌프-모터 회전축 중심을 동심도 범위 이내(수평 ±0.03mm, 수직 ±0.02mm)로 완벽히 정렬해 보십시오."}
                </p>

                {/* SVG Visualizing Pump-Motor Shaft coupling displacement */}
                <div className="bg-slate-950 border border-slate-900 rounded-2.5xl p-5 relative overflow-hidden flex flex-col items-center">
                  <span className="text-[8px] font-black tracking-widest text-slate-500 font-mono block absolute top-2 right-3 uppercase">
                    {isEn ? "Interactive 2D Telemetry Cross-Section" : "샤프트 커플링 단면 실시간 동축 모니터"}
                  </span>
                  
                  <div className="w-full max-w-[450px] h-36">
                    <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible">
                      {/* Grid Lines */}
                      <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                      <line x1="200" y1="0" x2="200" y2="120" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />

                      {/* Main Centerline Axis (Target Centerline) */}
                      <line x1="30" y1="60" x2="370" y2="60" stroke={vrTrainingPassed ? "#10b981" : "#6366f1"} strokeWidth="1" strokeDasharray="3,3" opacity="0.6" className="transition-all" />

                      {/* LEFT SIDE (Pump Shaft Flange - STATIC) */}
                      <g transform="translate(0, 0)">
                        {/* Pump casing mount block */}
                        <rect x="25" y="35" width="45" height="50" fill="rgba(15, 23, 42, 0.8)" stroke="#475569" strokeWidth="1.5" rx="4" />
                        <text x="32" y="63" fill="#94a3b8" fontSize="8" fontWeight="bold">PUMP</text>
                        {/* Static Shaft */}
                        <rect x="70" y="52" width="100" height="16" fill="url(#pumpShaftGrad)" stroke="#475569" strokeWidth="1" />
                        {/* Static Flange Coupling */}
                        <rect x="170" y="25" width="14" height="70" fill="url(#flangeGrad)" stroke="#64748b" strokeWidth="1.5" rx="3" />
                        <line x1="177" y1="25" x2="177" y2="95" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                      </g>

                      {/* RIGHT SIDE (Motor Shaft Flange - DYNAMIC based on sliders) */}
                      <g transform={`translate(${vrAxial * 90}, ${vrRadial * 130})`} className="transition-all duration-150">
                        {/* Dynamic Flange Coupling */}
                        <rect x="216" y="25" width="14" height="70" fill="url(#dynamicFlangeGrad)" stroke={vrTrainingPassed ? "#10b981" : "#818cf8"} strokeWidth="1.5" rx="3" />
                        <line x1="223" y1="25" x2="223" y2="95" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                        {/* Dynamic Shaft */}
                        <rect x="230" y="52" width="100" height="16" fill="url(#pumpShaftGrad)" stroke="#475569" strokeWidth="1" />
                        {/* Motor casing mount block */}
                        <rect x="330" y="35" width="45" height="50" fill="rgba(15, 23, 42, 0.8)" stroke={vrTrainingPassed ? "#10b981" : "#475569"} strokeWidth="1.5" rx="4" className="transition-all" />
                        <text x="337" y="63" fill="#94a3b8" fontSize="8" fontWeight="bold">MOTOR</text>
                      </g>

                      {/* Laser alignment tool line */}
                      <line 
                        x1="184" 
                        y1="35" 
                        x2={216 + vrAxial * 90} 
                        y2={35 + vrRadial * 130} 
                        stroke={vrTrainingPassed ? "#10b981" : "#f43f5e"} 
                        strokeWidth={vrTrainingPassed ? "1.5" : "1"}
                        className="transition-all"
                      />
                      <circle cx="184" cy="35" r="2.5" fill="#f43f5e" />
                      <circle cx={216 + vrAxial * 90} cy={35 + vrRadial * 130} r="2.5" fill={vrTrainingPassed ? "#10b981" : "#f43f5e"} />

                      {/* Linear Gradients definitions */}
                      <defs>
                        <linearGradient id="pumpShaftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#475569" />
                          <stop offset="50%" stopColor="#94a3b8" />
                          <stop offset="100%" stopColor="#334155" />
                        </linearGradient>
                        <linearGradient id="flangeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#1e293b" />
                          <stop offset="50%" stopColor="#64748b" />
                          <stop offset="100%" stopColor="#0f172a" />
                        </linearGradient>
                        <linearGradient id="dynamicFlangeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#312e81" />
                          <stop offset="50%" stopColor="#818cf8" />
                          <stop offset="100%" stopColor="#1e1b4b" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* concentricity scale readout overlay */}
                  <div className="absolute bottom-2.5 left-4 flex space-x-6 text-[10px] font-mono">
                    <span className="flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>
                      {isEn ? "Laser Alignment Indicator" : "레이저 겨냥 동축선"}
                    </span>
                  </div>
                </div>

                {/* VR User Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Radial Adjust (H Offset) */}
                  <div className="bg-slate-950/40 border border-slate-900 p-4 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-[10.5px] font-semibold text-slate-400">
                      <span>{isEn ? "Horizontal Radial Shimming (Y-Axis)" : "수평 원주(Radial) 높이 보정"}</span>
                      <span className={`font-mono font-black ${vrRadialPass ? 'text-emerald-400' : 'text-rose-500'}`}>
                        {vrRadial > 0 ? `+${vrRadial.toFixed(3)}` : vrRadial.toFixed(3)} mm
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="-0.20" 
                      max="0.20" 
                      step="0.01" 
                      value={vrRadial} 
                      onChange={(e) => setVrRadial(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                    />
                    <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                      <span>-0.20 mm</span>
                      <span className="text-emerald-500/80">Tolerance: ±0.03mm</span>
                      <span>+0.20 mm</span>
                    </div>
                  </div>

                  {/* Axial Adjust (V Gap) */}
                  <div className="bg-slate-950/40 border border-slate-900 p-4 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-[10.5px] font-semibold text-slate-400">
                      <span>{isEn ? "Axial Distance Gap (X-Axis)" : "면방향(Axial) 평행 갭 조정"}</span>
                      <span className={`font-mono font-black ${vrAxialPass ? 'text-emerald-400' : 'text-rose-500'}`}>
                        {vrAxial > 0 ? `+${vrAxial.toFixed(3)}` : vrAxial.toFixed(3)} mm
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="-0.15" 
                      max="0.15" 
                      step="0.01" 
                      value={vrAxial} 
                      onChange={(e) => setVrAxial(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                    />
                    <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                      <span>-0.15 mm</span>
                      <span className="text-emerald-500/80">Tolerance: ±0.02mm</span>
                      <span>+0.15 mm</span>
                    </div>
                  </div>
                </div>

                {/* VR Verdict & Training Log Save */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  vrTrainingPassed 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                    : "bg-amber-500/10 border-amber-500/25 text-amber-400"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {vrTrainingPassed ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                      <h4 className="text-xs font-black uppercase tracking-wider">
                        {vrTrainingPassed 
                          ? (isEn ? "VR TRAINING STATS: PERFECT CONCENTRICITY!" : "VR 훈련 상태: 동축 정밀도 완벽 일치 (합격)") 
                          : (isEn ? "VR STATE: MISALIGNED COAXIAL GAPS" : "VR 훈련 상태: 회전축 정렬 불량 (미보정)")}
                      </h4>
                    </div>
                    {vrTrainingPassed && (
                      <button 
                        onClick={handleSaveVrLog}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-extrabold flex items-center space-x-1 shadow-md transition-colors"
                      >
                        <span>{isEn ? "Log Result" : "훈련 결과 기록하기"}</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-350 leading-relaxed font-sans mt-2">
                    {vrTrainingPassed
                      ? (isEn 
                          ? "Shaft center deviations reside inside high-speed tolerances. Micro-lasers match coaxial points perfectly. Click 'Log Result' to commit this training success!"
                          : "펌프 샤프트와 모터 샤프트 오차가 고속 회전 한계선인 수평 0.03mm / 수직 0.02mm 미만으로 정렬되었습니다. 동축 광섬유 레이저 조준이 안정적으로 완료되었습니다.")
                      : (isEn 
                          ? "Laser target misses dynamic receptor. Adjust H-Radial height and V-Axial distance gaps slowly until the shaft colors change to green."
                          : "상수도 기계 정비 지침 기준치를 만족하지 못했습니다. 수평 마운트 높이와 수직 마운트 간격을 차근차근 조절하여 편차를 줄여주십시오.")}
                  </p>
                </div>

                {/* Logged History List inside mockups */}
                {trainingLogs.length > 0 && (
                  <div className="bg-slate-950/30 border border-slate-900 rounded-2.5xl p-4 space-y-2">
                    <h5 className="text-[10.5px] font-black text-slate-300 uppercase tracking-wide flex items-center">
                      <ShieldCheck size={14} className="text-emerald-400 mr-1.5" />
                      {isEn ? "VR Training Success Record Logs" : "가상 VR 정비 훈련 성공 세션 기록"}
                    </h5>
                    
                    <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1">
                      {trainingLogs.map((log, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[10px] font-mono bg-slate-950/60 border border-slate-900 px-3 py-1.5 rounded-xl text-slate-400 leading-normal">
                          <span>⏱ {log.timestamp}</span>
                          <span>H: <strong className="text-cyan-400">{log.radial}mm</strong></span>
                          <span>V: <strong className="text-indigo-400">{log.axial}mm</strong></span>
                          <span className="text-emerald-400 font-extrabold">{log.verdict}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {logSavedAlert && (
                  <div className="fixed bottom-6 right-6 bg-emerald-600 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 animate-slide-up z-50">
                    <CheckCircle size={15} />
                    <span>{isEn ? "VR Training session successfully logged to PdM cloud!" : "가상 VR 정비 훈련 이력이 PdM 클라우드에 성공적으로 등록되었습니다!"}</span>
                  </div>
                )}
              </div>
            )}

            {/* 2. Mobile PDA inspection & QR mock */}
            {activeMockup === 'mobile' && (
              <div className="glass-panel rounded-3xl p-6.5 border border-indigo-500/15 shadow-xl space-y-5">
                <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-3">
                  <Smartphone className="text-indigo-400 animate-pulse" size={20} />
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">
                    {isEn ? "Mobile PDA Inspection Wireless Gateway & QR Sync" : "현장 모바일 점검표 무선 연동 및 안전 진단 QR 발행기"}
                  </h3>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  {isEn 
                    ? "Generate a digital inspection ticket for Centrifugal Pump Alpha-7. Sync this wirelessly to your hand-held field PDA terminal, or print the barcode standard label to stick on physical casing."
                    : "원심펌프 7호기 점검 지시 표준 문서를 모바일 기기와 동기화합니다. 일시적 보안 토큰을 발급하여 현장 오프라인 안전 점검을 지원하며, 기기 인근 부착용 바코드/QR을 즉시 발행합니다."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  
                  {/* Left Column: QR Code Visual with scanner laser line animation */}
                  <div className="bg-slate-950 border border-slate-900 rounded-2.5xl p-6 relative overflow-hidden flex flex-col items-center justify-center">
                    <span className="text-[7.5px] font-black tracking-widest text-slate-500 font-mono block absolute top-2 right-3">STANDARD BARCODE ENVELOPE</span>
                    
                    {/* QR Code Graphic Wrapper */}
                    <div className="relative w-36 h-36 border border-indigo-500/15 p-2 rounded-2xl bg-slate-950 mt-2 flex items-center justify-center">
                      
                      {/* Sweep Laser Scanner Animation Overlay */}
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-400 shadow-[0_0_12px_#10b981] opacity-70 animate-scanner-sweep z-10"></div>
                      
                      {/* Custom SVG QR Code Graphic */}
                      <svg viewBox="0 0 100 100" className="w-full h-full text-slate-100">
                        {/* Anchor boxes (Corners) */}
                        <rect x="0" y="0" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                        <rect x="5" y="5" width="15" height="15" fill="currentColor" />
                        
                        <rect x="75" y="0" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                        <rect x="80" y="5" width="15" height="15" fill="currentColor" />
                        
                        <rect x="0" y="75" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                        <rect x="5" y="80" width="15" height="15" fill="currentColor" />

                        {/* QR Code Random Pixels simulation */}
                        <rect x="35" y="5" width="10" height="10" fill="currentColor" />
                        <rect x="55" y="0" width="15" height="5" fill="currentColor" />
                        <rect x="60" y="15" width="5" height="15" fill="currentColor" />
                        
                        <rect x="35" y="35" width="15" height="15" fill="currentColor" />
                        <rect x="55" y="40" width="10" height="10" fill="currentColor" />
                        <rect x="75" y="35" width="20" height="5" fill="currentColor" />
                        
                        <rect x="10" y="40" width="15" height="5" fill="currentColor" />
                        <rect x="0" y="55" width="10" height="10" fill="currentColor" />
                        
                        <rect x="35" y="65" width="5" height="15" fill="currentColor" />
                        <rect x="45" y="75" width="15" height="10" fill="currentColor" />
                        <rect x="65" y="65" width="10" height="20" fill="currentColor" />
                        <rect x="80" y="80" width="10" height="10" fill="currentColor" />

                        {/* Custom stylesheet for QR scanner sweep line */}
                        <style>
                          {`
                            @keyframes scannerSweep {
                              0% { top: 0%; }
                              50% { top: 100%; }
                              100% { top: 0%; }
                            }
                            .animate-scanner-sweep {
                              animation: scannerSweep 2.2s ease-in-out infinite;
                            }
                          `}
                        </style>
                      </svg>
                    </div>

                    <span className="text-[9.5px] font-mono text-slate-400 mt-4 tracking-wide font-black">
                      ID: PMP-ALPHA-7-M1
                    </span>
                    <span className="text-[8.5px] text-slate-500 font-medium">
                      {isEn ? "Scan to read Table 6.7.9 specs" : "스캔 시 상수도 표준 지침 연동"}
                    </span>
                  </div>

                  {/* Right Column: Interaction controller */}
                  <div className="space-y-4">
                    <div className="bg-slate-950/60 border border-slate-900 rounded-2.5xl p-4.5 space-y-3 font-sans">
                      <h4 className="text-xs font-extrabold text-white">
                        {isEn ? "PDA Sync Diagnostics Panel" : "모바일 PDA 동기화 관제 패널"}
                      </h4>
                      
                      <div className="space-y-2 text-[10.5px] leading-normal font-medium text-slate-400">
                        <div className="flex justify-between border-b border-slate-900 pb-1.5">
                          <span>{isEn ? "Target Equipment" : "대상 설비 명칭"}</span>
                          <strong className="text-white font-extrabold">Alpha-7 Centrifugal Pump</strong>
                        </div>
                        <div className="flex justify-between border-b border-slate-900 pb-1.5">
                          <span>{isEn ? "Linked Standards" : "연동 검사 규격"}</span>
                          <strong className="text-indigo-400 font-mono">SOP-6.7.9-TABLE</strong>
                        </div>
                        <div className="flex justify-between pb-1">
                          <span>{isEn ? "PDA Connection" : "PDA 무선 통신 상태"}</span>
                          <strong className="text-emerald-400">ONLINE (WPA2-Enterprise)</strong>
                        </div>
                      </div>

                      {/* Connection syncing status controller */}
                      {syncStatus === 'idle' && (
                        <button 
                          onClick={() => setSyncStatus('syncing')}
                          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black tracking-wide flex items-center justify-center space-x-1.5 shadow-md transition-all"
                        >
                          <RefreshCw size={13} className="animate-spin-slow" />
                          <span>{isEn ? "Start Wireless PDA Sync" : "PDA 무선 동기화 개시"}</span>
                        </button>
                      )}

                      {syncStatus === 'syncing' && (
                        <div className="space-y-2 pt-1">
                          <div className="flex justify-between text-[10px] font-mono text-slate-450">
                            <span>{isEn ? "Transmitting telemetry packages..." : "예방정비 RAG 패키지 전송 중..."}</span>
                            <span>{syncProgress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full transition-all duration-150" style={{ width: `${syncProgress}%` }}></div>
                          </div>
                        </div>
                      )}

                      {syncStatus === 'completed' && (
                        <div className="space-y-3 pt-1">
                          <div className="bg-emerald-500/10 border border-emerald-500/25 p-3 rounded-xl flex items-start space-x-2 text-emerald-400">
                            <CheckCircle size={15} className="shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-[10.5px] block font-black">{isEn ? "Wireless Sync Complete!" : "무선 모바일 동기화 완수!"}</strong>
                              <span className="text-[9.5px] text-slate-350 leading-relaxed font-sans block mt-1">
                                {isEn ? "Field token issued. Checked protocol successfully loaded." : "현장 기기 전용 보안 토큰이 발급되었습니다. 모바일 앱에서 점검표를 실행하십시오."}
                              </span>
                            </div>
                          </div>
                          
                          <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-center font-mono text-[10px] text-slate-300">
                            Token: <strong className="text-cyan-400 font-extrabold">{generatedToken}</strong>
                          </div>

                          <button 
                            onClick={() => setSyncStatus('idle')}
                            className="w-full py-2 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-350 hover:text-white rounded-xl text-[10.5px] font-extrabold tracking-wide transition-all"
                          >
                            {isEn ? "Re-sync New Session" : "새 보안 세션 동기화"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Print Checksheet Button */}
                    <button 
                      onClick={() => setShowPrintModal(true)}
                      className="w-full py-2.5 bg-slate-950 border border-slate-900 hover:bg-slate-900 text-slate-350 hover:text-white rounded-xl text-xs font-black tracking-wide flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <Printer size={13} />
                      <span>{isEn ? "Print Standard Inspection Label" : "정비 현장 보전 지시서 레이블 인쇄"}</span>
                    </button>
                  </div>
                </div>

                {/* Print standard label preview mockup */}
                {showPrintModal && (
                  <div className="bg-white text-slate-900 rounded-2.5xl p-5 border border-slate-350 shadow-2xl relative animate-fade-in font-sans leading-normal">
                    <button 
                      onClick={() => setShowPrintModal(false)}
                      className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs transition-colors"
                    >
                      ✕
                    </button>
                    <span className="text-[8px] font-black text-indigo-600 tracking-wider font-mono block mb-1">
                      {isEn ? "BARCODE EMITTER & PUSH LABELLER (MOCK)" : "정비 현장 표준 규격 레이블 출력 미리보기"}
                    </span>
                    <h4 className="text-xs font-black border-b-2 border-slate-800 pb-2 mb-3 tracking-wide">
                      {isEn ? "FIELD EQUIPMENT CHECK ORDER STANDARD" : "상수도 원심펌프 A7호기 예방정비 안전 점검 태그"}
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4 text-[10px] font-medium text-slate-650">
                      <div>
                        <p>{isEn ? "Tag Code:" : "태그 번호:"} <strong className="text-slate-900 font-extrabold">TAG-PMP-A7-001</strong></p>
                        <p>{isEn ? "Component:" : "점검 기기:"} <strong className="text-slate-900 font-extrabold">Bearing & Shaft Coupling</strong></p>
                        <p>{isEn ? "Task Class:" : "점검 구분:"} <strong className="text-slate-900 font-extrabold">Preventive Overhaul</strong></p>
                      </div>
                      <div>
                        <p>{isEn ? "Standard Doc:" : "근거 규격:"} <strong className="text-indigo-600 font-extrabold">Table 6.7.9 Criteria</strong></p>
                        <p>{isEn ? "Interval:" : "점검 주기:"} <strong className="text-slate-900 font-extrabold">12 Months (Overhaul)</strong></p>
                        <p>{isEn ? "Print Date:" : "발행 시간:"} <strong className="text-slate-900 font-mono font-extrabold">{new Date().toLocaleDateString()}</strong></p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-xl">
                      <div className="font-mono text-[9px] text-slate-500">
                        <p className="font-bold text-slate-900 mb-0.5">{isEn ? "INSTRUCTION HIGHLIGHT" : "핵심 점검 조치사항"}</p>
                        <p>{isEn ? "- Dial alignment runout: ±0.03mm" : "- 축 오차 다이얼 계측: ±0.03mm 이하 정렬"}</p>
                        <p>{isEn ? "- Grease fill weight: G = D * B * 0.005" : "- 그리스 충진 유량: 외경 D * 폭 B * 0.005 계량"}</p>
                      </div>
                      <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white text-[8px] font-black text-center font-mono p-1">
                        BAR CODE
                      </div>
                    </div>

                    <div className="mt-4.5 flex justify-end space-x-2.5">
                      <button 
                        onClick={() => {
                          alert(isEn ? "Bar Label successfully output to Zebra Label Printer!" : "지브라 표준 레이블 프린터로 출력이 시작되었습니다!");
                          setShowPrintModal(false);
                        }}
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10.5px] font-extrabold hover:bg-slate-800 transition-colors shadow-md"
                      >
                        🖨️ {isEn ? "Submit Print Job" : "레이저 인쇄 전송"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. AI Bearing RUL prediction time-series graph */}
            {activeMockup === 'rul' && (
              <div className="glass-panel rounded-3xl p-6.5 border border-indigo-500/15 shadow-xl space-y-5">
                <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-3">
                  <LineChart className="text-indigo-400 animate-pulse" size={20} />
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">
                    {isEn ? "AI Bearing Remaining Useful Life (RUL) Prognostics Graph" : "AI 피인용 베어링 잔여 운전 수명(RUL) 실시간 시계열 모형"}
                  </h3>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                  {isEn 
                    ? "Our advanced deep learning models calculate bearing degradation kinetics. Toggle operational load factors to observe how vibration velocity affects predicted RUL." 
                    : "인공지능 시계열 열화 역학 모형이 베어링 마모 추이를 계산합니다. 상수도관망 운전 부하 모드를 선택하여 부하 강도가 잔여 가동 기한(RUL)에 미치는 변화를 체험해 보십시오."}
                </p>

                {/* Load state controller buttons */}
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block mb-2 uppercase">
                    {isEn ? "Simulate Operational Load Intensity" : "원심펌프 운하 가동 강도 설정"}
                  </span>
                  <div className="grid grid-cols-3 gap-2.5 text-[10px] font-black font-sans">
                    <button 
                      onClick={() => setOperatingLoad('low')}
                      className={`py-2 px-1.5 rounded-xl border text-center transition-all ${
                        operatingLoad === 'low' 
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.15)]' 
                          : 'bg-slate-950/40 border-slate-900 text-slate-450 hover:bg-slate-900'
                      }`}
                    >
                      {isEn ? "Low Load (40%)" : "저부하 모드 (40%)"}
                    </button>
                    <button 
                      onClick={() => setOperatingLoad('normal')}
                      className={`py-2 px-1.5 rounded-xl border text-center transition-all ${
                        operatingLoad === 'normal' 
                          ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.15)]' 
                          : 'bg-slate-950/40 border-slate-900 text-slate-450 hover:bg-slate-900'
                      }`}
                    >
                      {isEn ? "Standard (75%)" : "상용 정격 부하 (75%)"}
                    </button>
                    <button 
                      onClick={() => setOperatingLoad('high')}
                      className={`py-2 px-1.5 rounded-xl border text-center transition-all ${
                        operatingLoad === 'high' 
                          ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.15)]' 
                          : 'bg-slate-950/40 border-slate-900 text-slate-450 hover:bg-slate-900'
                      }`}
                    >
                      {isEn ? "Overload (120%)" : "과적 가동 모드 (120%)"}
                    </button>
                  </div>
                </div>

                {/* SVG Visualizing RUL Trend Curve */}
                <div className="bg-slate-950 border border-slate-900 rounded-2.5xl p-5.5 relative overflow-hidden">
                  <span className="text-[7.5px] font-black tracking-widest text-slate-500 font-mono block absolute top-2 right-3 uppercase">
                    {isEn ? "Estimated RUL Wear Curve (30-Day Outlook)" : "향후 30일 베어링 RUL 열화 시계열 예측선"}
                  </span>
                  
                  <div className="h-40 w-full flex items-end justify-between relative select-none mt-3">
                    <svg viewBox="0 0 400 140" className="w-full h-full overflow-visible">
                      {/* Grid Lines */}
                      <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                      <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                      <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                      
                      {/* Labels */}
                      <text x="5" y="25" fill="rgba(255,255,255,0.15)" fontSize="6" fontFamily="monospace">600 hrs</text>
                      <text x="5" y="65" fill="rgba(255,255,255,0.15)" fontSize="6" fontFamily="monospace">300 hrs</text>
                      <text x="5" y="105" fill="rgba(255,255,255,0.15)" fontSize="6" fontFamily="monospace">0 hrs</text>

                      {/* X-axis Timeline days */}
                      <text x="50" y="130" fill="rgba(255,255,255,0.2)" fontSize="6" fontFamily="monospace">{isEn ? "Today" : "현재 계측일"}</text>
                      <text x="160" y="130" fill="rgba(255,255,255,0.15)" fontSize="6" fontFamily="monospace">D+10</text>
                      <text x="270" y="130" fill="rgba(255,255,255,0.15)" fontSize="6" fontFamily="monospace">D+20</text>
                      <text x="360" y="130" fill="rgba(255,255,255,0.2)" fontSize="6" fontFamily="monospace">D+30</text>

                      {/* RUL Trend Curve (Dynamic based on selected load state) */}
                      {operatingLoad === 'low' && (
                        <>
                          <defs>
                            <linearGradient id="lowRulGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <path d="M 50 15 Q 150 18, 250 22 Q 350 25, 380 28" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                          <path d="M 50 15 Q 150 18, 250 22 Q 350 25, 380 28 L 380 115 L 50 115 Z" fill="url(#lowRulGrad)" />
                          <circle cx="380" cy="28" r="3.5" fill="#10b981" />
                          <text x="280" y="45" fill="#10b981" fontSize="7.5" fontWeight="bold">Steady: 680 hrs</text>
                        </>
                      )}

                      {operatingLoad === 'normal' && (
                        <>
                          <defs>
                            <linearGradient id="normalRulGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <path d="M 50 25 Q 150 45, 250 65 Q 350 85, 380 98" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
                          <path d="M 50 25 Q 150 45, 250 65 Q 350 85, 380 98 L 380 115 L 50 115 Z" fill="url(#normalRulGrad)" />
                          <circle cx="380" cy="98" r="3.5" fill="#6366f1" />
                          <text x="260" y="85" fill="#818cf8" fontSize="7.5" fontWeight="bold">RUL: 320 hrs</text>
                        </>
                      )}

                      {operatingLoad === 'high' && (
                        <>
                          <defs>
                            <linearGradient id="highRulGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <path d="M 50 35 Q 110 70, 160 100 Q 200 112, 220 115" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
                          <path d="M 50 35 Q 110 70, 160 100 Q 200 112, 220 115 L 220 115 L 50 115 Z" fill="url(#highRulGrad)" />
                          <circle cx="220" cy="115" r="4.5" fill="#f43f5e" className="animate-pulse" />
                          <text x="230" y="112" fill="#f43f5e" fontSize="7.5" fontWeight="extrabold">🚨 Limit: D+14</text>
                          <text x="90" y="70" fill="#f43f5e" fontSize="7.5" fontWeight="bold">Critical: 38 hrs</text>
                        </>
                      )}
                    </svg>
                  </div>
                </div>

                {/* Real-time statistics reading */}
                <div className="grid grid-cols-3 gap-3.5 font-mono text-center">
                  <div className="bg-slate-950/40 border border-slate-900 p-3 rounded-2xl">
                    <span className="text-[8px] text-slate-500 block mb-1 uppercase font-semibold">
                      {isEn ? "Vibration Velocity" : "진동 가속도 RMS"}
                    </span>
                    <span className={`text-base font-black tracking-tight ${
                      operatingLoad === 'low' ? 'text-emerald-400' :
                      operatingLoad === 'normal' ? 'text-indigo-400' : 'text-rose-500'
                    }`}>
                      {operatingLoad === 'low' ? '0.72' :
                       operatingLoad === 'normal' ? '1.65' : '5.82'} <span className="text-[10px]">mm/s</span>
                    </span>
                  </div>

                  <div className="bg-slate-950/40 border border-slate-900 p-3 rounded-2xl">
                    <span className="text-[8px] text-slate-500 block mb-1 uppercase font-semibold">
                      {isEn ? "Estimated Remaining Hours" : "잔여 가동 예측 시간"}
                    </span>
                    <span className={`text-base font-black tracking-tight ${
                      operatingLoad === 'low' ? 'text-emerald-400' :
                      operatingLoad === 'normal' ? 'text-indigo-400' : 'text-rose-500'
                    }`}>
                      {operatingLoad === 'low' ? '680' :
                       operatingLoad === 'normal' ? '320' : '38'} <span className="text-[10px]">hrs</span>
                    </span>
                  </div>

                  <div className="bg-slate-950/40 border border-slate-900 p-3 rounded-2xl">
                    <span className="text-[8px] text-slate-500 block mb-1 uppercase font-semibold">
                      {isEn ? "Fatigue Damage Index" : "구름 누적 피로 지수"}
                    </span>
                    <span className={`text-base font-black tracking-tight ${
                      operatingLoad === 'low' ? 'text-emerald-400' :
                      operatingLoad === 'normal' ? 'text-indigo-400' : 'text-rose-500'
                    }`}>
                      {operatingLoad === 'low' ? '8.4%' :
                       operatingLoad === 'normal' ? '24.2%' : '88.9%'}
                    </span>
                  </div>
                </div>

                {/* Overload Alert Notification */}
                {operatingLoad === 'high' && (
                  <div className="bg-rose-500/10 border border-rose-500/30 p-4.5 rounded-2.5xl flex items-start space-x-2.5 text-rose-400 animate-slide-up">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-black uppercase block">
                        {isEn ? "Critical Alert: RUL Failure Threshold Near!" : "동작 위험 경보: 모터 베어링 피로 한계 수명 임계점 도달"}
                      </strong>
                      <p className="text-[10px] text-slate-350 leading-relaxed font-sans mt-1">
                        {isEn 
                          ? "Vibration amplitude exceeds 4.5 mm/s limit. Structural integrity degradation of the rolling bearing elements is accelerated by 10x. Schedule bearing exchange within 36 hours."
                          : "상수도 진동 안전 한계치인 4.5 mm/s를 대폭 돌파했습니다. 피로 누적으로 인한 내부 균열(Cracking) 발생 가속도가 정상 범위 대비 10배 이상 폭증하였습니다. 즉시 급유하고 3일 내 점검 교환을 실행하십시오."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
