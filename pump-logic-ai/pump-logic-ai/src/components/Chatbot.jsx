import React, { useState, useRef, useEffect } from 'react';
import { X, ArrowUpRight, Bot, Settings, Key, Sparkles, Eye, EyeOff } from 'lucide-react';

export default function Chatbot({ chatbotOpen, setChatbotOpen, t, analysisResult, lang }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [showKeyText, setShowKeyText] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Initialize with localized welcome message when t changes
  useEffect(() => {
    setMessages([
      {
        sender: 'bot',
        text: t.chatbot.welcome,
        time: 'Just now'
      }
    ]);
  }, [t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMsg = {
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    const query = userMsg.text.toLowerCase().trim();
    const isEnglish = lang === 'en';

    if (apiKey.trim()) {
      // 1. Google Gemini Live API Integration
      const systemInstruction = `You are a highly professional predictive maintenance engineering expert chatbot specializing in pump diagnosis and mechanical engineering.
The current operating pump name: Centrifugal Pump Unit 7 (원심펌프 7호기).
Language preference: ${isEnglish ? 'English' : 'Korean'}. Please respond in this language.
Current Diagnostic Status of Centrifugal Pump Unit 7:
${analysisResult ? `
- Risk Level: ${analysisResult.risk_level}
- Vibration RMS: ${analysisResult.vibration_rms} mm/s (Warning threshold: > 2.5 mm/s)
- Current Imbalance: ${analysisResult.current_imbalance}% (Warning threshold: > 0.5% or 4.8%)
- Diagnosed Root Cause: ${analysisResult.root_cause}
- AI Diagnostic Rationale: ${analysisResult.risk_rationale}
- Checked Symptoms: ${analysisResult.checked_symptoms ? analysisResult.checked_symptoms.join(', ') : 'None'}
- Preventive Maintenance Suggestion: ${analysisResult.preventive_maintenance}
- Recommended Actions: ${analysisResult.recommended_actions ? analysisResult.recommended_actions.join('\n') : 'None'}
` : 'No file has been uploaded or analyzed yet. Encourage the user to go to the "Upload New Data" screen and upload vibration/current telemetry files (CSV) for real-time diagnosis.'}

Always respond in a very friendly, polite, and professional tone. Keep your response relatively concise (2-4 sentences or short bullet points) so it fits in a compact floating chat bubble UI.
When asked greetings or common chit-chat (e.g. "안녕", "안녕하세요", "반가워"), reply warmly as the AI Predictive Maintenance assistant and explain how you can help them today.`;

      // Map last 6 messages to Gemini format to maintain chat context
      const chatHistory = messages.slice(-6).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      // Append current message
      chatHistory.push({
        role: 'user',
        parts: [{ text: userMsg.text }]
      });

      fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: chatHistory,
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          }
        })
      })
      .then(res => {
        if (!res.ok) throw new Error("Gemini API call failed");
        return res.json();
      })
      .then(data => {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || (isEnglish ? "Apologies, I couldn't process that response." : "죄송합니다. 답변을 처리하지 못했습니다.");
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: text.trim(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsTyping(false);
      })
      .catch(err => {
        console.error("Gemini API error:", err);
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: isEnglish 
            ? "⚠️ Connection to Gemini API failed. Please check your network connection or ensure your API Key is valid."
            : "⚠️ Gemini API 연동 호출에 실패했습니다. 네트워크 상태 또는 입력하신 API Key가 유효한지 확인해 주십시오.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsTyping(false);
      });
    } else {
      // 2. Intelligent Local Conversation Rule-Engine
      setTimeout(() => {
        let botResponse = '';
        const isGreeting = /(안녕|반가|하이|방가|일어|감사|고마|hello|hi|hey|greetings|thanks)/i.test(query);

        if (isGreeting) {
          botResponse = isEnglish
            ? "Hello! I am your Centrifugal Pump Predictive Maintenance AI Assistant. 🤖 Please feel free to ask about pump diagnostic status, root cause analysis, issuing maintenance work orders, QR code video tutorials, or standard operating manuals!"
            : "안녕하세요! 원심펌프 예지보전 AI 비서입니다. 🤖 현재 기기 진단 상태, 이상 원인 분석, 점검 지시서 발행, QR 가이드 또는 유튜브 정비 가이드 등에 대해 궁금한 점을 질문해 주세요!";
        } else if (query.includes('진동') || query.includes('진폭') || query.includes('흔들') || (isEnglish && (query.includes('vib') || query.includes('amplitude') || query.includes('shak') || query.includes('vibration')))) {
          if (analysisResult) {
            botResponse = isEnglish
              ? `Vibration acceleration RMS is measured at ${analysisResult.vibration_rms} mm/s (warning limit: 2.5 mm/s). XGBoost warns that sustained vibration accelerates bearing degradation and overheating. Recommended actions: ${analysisResult.recommended_actions?.[0] || 'Damping reinforcement'}.`
              : `현재 진동 가속도 RMS 계측값은 ${analysisResult.vibration_rms} mm/s 입니다. (경고 기준치: 2.5 mm/s). 진동이 지속될 경우 베어링 피로 및 과열이 빠르게 진행됩니다. 권고 정비 조치: [${analysisResult.recommended_actions?.[0] || '진동 감쇠 패드 보강'}].`;
          } else {
            botResponse = isEnglish
              ? "Abnormal centrifugal pump vibrations usually originate from rotor unbalance or bearing fatigue. Under our XGBoost predictions, if vibration acceleration RMS exceeds 8.0 mm/s, bearing overheating will follow rapidly."
              : "원심펌프의 비정상 진동은 대개 임펠러 균열(Rotor Unbalance) 또는 베어링 피로 파괴에서 기인합니다. XGBoost 모델 예측에 따르면 진동 가속도 RMS 값이 8.0 mm/s를 돌파할 경우 급속도로 베어링 과열이 동반되오니 주의해 주세요.";
          }
        } else if (query.includes('전류') || query.includes('mcsa') || query.includes('모터') || (isEnglish && (query.includes('current') || query.includes('mcsa') || query.includes('elect')))) {
          if (analysisResult) {
            botResponse = isEnglish
              ? `MCSA 3-phase current imbalance is measured at ${analysisResult.current_imbalance}% (warning limit: 0.5%). This can indicate winding insulation wear or loading imbalance. Recommended actions: ${analysisResult.recommended_actions?.[1] || 'Voltage alignment'}.`
              : `현재 3상 전류 상간 불평형율 계측값은 ${analysisResult.current_imbalance}% 입니다. (경고 기준치: 0.5%). 이는 고정자 권선 손상 또는 전기 부하 불안정성을 유발합니다. 권고 정비 조치: [${analysisResult.recommended_actions?.[1] || '3상 입력 단자 측정 및 차단기 설정'}].`;
          } else {
            botResponse = isEnglish
              ? "Under MCSA current diagnostics, 3-phase phase imbalance exceeds 4.8%. This implies a stator coil winding short or harmonic torque load friction. Please check mounting anchor bolts as well."
              : "MCSA(전류고장진단) 모형상, 모터 고주파 왜곡 및 3상 위상 불평형율이 4.8%를 초과하였습니다. 이는 고정자 코일 권선 단락 또는 회전체 이중 왜곡에 따른 부하 변동 마찰로 보이며, 기초 마운팅 볼트 점검을 병행해야 합니다.";
          }
        } else if (query.includes('유튜브') || query.includes('동영상') || query.includes('큐알') || query.includes('qr') || (isEnglish && (query.includes('qr') || query.includes('video') || query.includes('youtube')))) {
          botResponse = isEnglish
            ? "Standard video tutorials matching this diagnostic anomaly are available via the high-resolution QR code inside the [Maintenance Work Order] modal at the top right."
            : "현재 진단된 결함에 수반되는 맞춤 정비 동영상 가이드는 [점검 지시서 발행]을 클릭하셨을 때 모달 내부 우측 상단에 고해상도 QR 코드로 인쇄되어 즉각 연결됩니다. (축정렬 수리 영상 주소: https://www.youtube.com/watch?v=kU_3zSCSz0o)";
        } else if (query.includes('지시서') || query.includes('점검') || query.includes('wo') || query.includes('order') || query.includes('work')) {
          botResponse = isEnglish
            ? "You can print the Maintenance Work Order by clicking the [Issue Maintenance Work Order] button at the top right of the dashboard or details page. It is prefilled with diagnosed parameters."
            : "대시보드 또는 상세소견 페이지 우측 상단의 [점검 지시서 발행] 버튼을 클릭하시면 실시간 AI 진단 파라미터가 자동으로 채워진 표준 점검 지시서(PDF/인쇄용)가 팝업되어 정비 현장에서 즉시 활용할 수 있습니다.";
        } else if (query.includes('매뉴얼') || query.includes('지침') || query.includes('manual') || query.includes('guide')) {
          botResponse = isEnglish
            ? "You can view complete Centrifugal Pump standard operating procedures, failure code matrices, and safety guides on the 'Manuals & Guides' menu from the sidebar."
            : "원심펌프의 표준 조작 절차(SOP), 고장 진단 매트릭스(Fault Code Matrix), 정비 가이드 지침 전체 내용은 좌측 메뉴의 '정비 매뉴얼 & 지침서' 탭에서 상시 열람하실 수 있습니다.";
        } else {
          if (analysisResult) {
            const isDanger = analysisResult.risk_level === 'DANGER' || analysisResult.risk_level === 'WARNING';
            if (isDanger) {
              botResponse = isEnglish
                ? `Diagnostic Status: [${analysisResult.risk_level}] - ${analysisResult.root_cause}. Analysis: ${analysisResult.risk_rationale} We highly recommend issuing a [Maintenance Order] and performing: ${analysisResult.recommended_actions?.join(' | ') || 'Inspection'}.`
                : `설비 진단 상태: [${analysisResult.risk_level}] - ${analysisResult.root_cause} 결함이 감지되었습니다. 상세 분석: ${analysisResult.risk_rationale} 우측 상단의 [점검 지시서 발행]을 눌러 점검 정비 조치(${analysisResult.recommended_actions?.[0] || '정밀 점검'})를 긴급 가동하시기 바랍니다.`;
            } else {
              botResponse = isEnglish
                ? `Diagnostic Status: [NORMAL] - ${analysisResult.root_cause}. The vibration (${analysisResult.vibration_rms} mm/s) and current imbalance (${analysisResult.current_imbalance}%) levels are normal. Routine monitoring is recommended.`
                : `설비 진단 상태: [정상] - ${analysisResult.root_cause} 상태입니다. 현재 진동 가속도 RMS(${analysisResult.vibration_rms} mm/s) 및 전류 불평형율(${analysisResult.current_imbalance}%) 모두 안정적인 수치 이내를 보여주고 있으며 정기 예방 진단 일정을 준수하시기 바랍니다.`;
            }
          } else {
            botResponse = isEnglish
              ? "Centrifugal pump diagnostics require data. Please go to the 'Upload New Data' page to upload vibration/current telemetry CSV files, and I will assist you with real-time root-cause analysis!"
              : "현재 분석 정보가 없습니다. 먼저 좌측 메뉴의 '신규 데이터 업로드' 화면에서 진동/전류 계측 파일(CSV)을 업로드하여 실시간 진단을 가동해 주시면, 해당 데이터를 해독하여 결함 원인을 상세히 안내해 드리겠습니다!";
          }
        }

        setMessages(prev => [...prev, {
          sender: 'bot',
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  return (
    <div className="absolute bottom-6 right-6 w-96 bg-slate-950/95 border border-slate-800/80 shadow-[0_12px_50px_rgba(0,0,0,0.7)] shadow-indigo-500/10 rounded-2xl overflow-hidden flex flex-col z-50 animate-in slide-in-from-bottom-5 duration-300 print:hidden font-sans">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/80 via-slate-900 to-slate-950 p-4 border-b border-slate-900 flex justify-between items-center relative">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/35 flex items-center justify-center text-cyan-400">
            <Bot size={16} className="animate-bounce" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-blue-100 tracking-wide">{t.chatbot.title}</h3>
            <div className="flex items-center text-[9px] text-emerald-400 font-bold mt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-ping"></span>
              <span>ONLINE</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <button 
            onClick={() => setShowSettings(!showSettings)} 
            title="Gemini LLM 설정"
            className="text-slate-400 hover:text-white p-1.5 hover:bg-slate-900 rounded-lg transition-colors mr-1"
          >
            <Settings size={15} className={showSettings ? "text-indigo-400 rotate-45 transition-transform duration-300" : "transition-transform duration-300"} />
          </button>
          <button 
            onClick={() => setChatbotOpen(false)} 
            className="text-slate-400 hover:text-white p-1.5 hover:bg-slate-900 rounded-lg transition-colors"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Settings Pane */}
      {showSettings && (
        <div className="bg-slate-900/98 p-4 border-b border-slate-800/80 animate-in slide-in-from-top duration-300 relative text-xs">
          <div className="flex items-center space-x-2 text-indigo-400 font-extrabold mb-1.5">
            <Key size={13} />
            <span>Gemini API 연동 설정</span>
          </div>
          <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">
            Google Gemini API Key를 입력하여 실시간 LLM 답변을 활성화합니다. API 키는 브라우저(localStorage)에만 안전하게 보관됩니다.
          </p>
          <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-lg p-1">
            <input
              type={showKeyText ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 bg-transparent px-2 py-1 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
            />
            <button 
              type="button" 
              onClick={() => setShowKeyText(!showKeyText)} 
              className="text-slate-400 hover:text-slate-200 p-1"
            >
              {showKeyText ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <button 
              onClick={() => {
                localStorage.setItem('gemini_api_key', apiKey.trim());
                setShowSettings(false);
                setMessages(prev => [...prev, {
                  sender: 'bot',
                  text: apiKey.trim() 
                    ? (lang === 'en' ? '✅ Gemini API Key successfully registered! Live LLM responses are now enabled.' : '✅ Gemini API Key가 성공적으로 등록되었습니다! 이제 실시간 Gemini LLM의 고도화된 답변이 적용됩니다.')
                    : (lang === 'en' ? 'ℹ️ API Key cleared. Operating on standard local rule-engine.' : 'ℹ️ API Key가 해제되었습니다. 이제 기본 지능형 규칙 엔진으로 작동합니다.'),
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-3 py-1 rounded-md transition-all text-xs shrink-0"
            >
              {lang === 'en' ? "Save" : "저장"}
            </button>
          </div>
        </div>
      )}

      {/* Messages View */}
      <div className="p-4 h-72 overflow-y-auto bg-slate-950/40 flex flex-col space-y-4 text-xs">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div className={`max-w-[85%] rounded-2xl p-3 shadow-md leading-relaxed border ${
              msg.sender === 'user'
                ? 'bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white border-indigo-500/30 rounded-tr-sm'
                : 'bg-slate-900/90 text-slate-200 border-slate-800 rounded-tl-sm'
            }`}>
              <p className="break-words whitespace-pre-wrap">{msg.text}</p>
              <span className={`block text-[9px] mt-1.5 text-right font-mono ${
                msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'
              }`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-slate-900/80 text-slate-400 border border-slate-800 rounded-2xl rounded-tl-sm p-3 text-[10px] flex items-center space-x-1.5 font-mono">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              <span>{t.chatbot.typing}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Engine Status Tag */}
      <div className="px-4 py-1 text-[9px] bg-slate-950 border-t border-slate-900/60 text-slate-500 flex justify-between items-center">
        <span>
          {apiKey.trim() 
            ? (lang === 'en' ? "⚡ Gemini 1.5 Flash Active" : "⚡ Gemini 1.5 Flash 실시간 연동")
            : (lang === 'en' ? "🤖 Standard Local Rule-Engine" : "🤖 기본 지능형 로컬 규칙 엔진")}
        </span>
        {!apiKey.trim() && (
          <button 
            onClick={() => setShowSettings(true)} 
            className="text-indigo-400 hover:underline flex items-center space-x-0.5 shrink-0"
          >
            <Sparkles size={8} />
            <span>{lang === 'en' ? "Connect LLM" : "LLM 연동"}</span>
          </button>
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-slate-900 bg-slate-950/90">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.chatbot.placeholder}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-3 pr-12 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <button 
            type="submit"
            className="absolute right-1.5 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all shadow-md shadow-indigo-600/20"
          >
            <ArrowUpRight size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
