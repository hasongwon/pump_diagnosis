import React, { useState, useRef, useEffect } from 'react';
import { X, ArrowUpRight, MessageSquare, Bot } from 'lucide-react';

export default function Chatbot({ chatbotOpen, setChatbotOpen, t }) {
  const [messages, setMessages] = useState([]);

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

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

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

    // Simulated Intelligent Bot Responses
    setTimeout(() => {
      let botResponse = '';
      const query = userMsg.text.toLowerCase();

      // Check language from welcome message to decide language of bot
      const isEnglish = t.chatbot.title === "PdM AI Assistant" && !t.chatbot.welcome.includes("안녕하세요");

      if (isEnglish) {
        botResponse = 'Based on the analysis, a high Z-axis vibration combined with MCSA current frequency deviations strongly suggests a Rotor Shaft Misalignment. We highly recommend issuing a [Maintenance Order] and adjusting the coupling within ±0.03mm using precise laser tools.';
        if (query.includes('vib') || query.includes('amplitude') || query.includes('shak') || query.includes('vibration')) {
          botResponse = 'Abnormal centrifugal pump vibrations usually originate from rotor unbalance or bearing fatigue. Under our XGBoost predictions, if vibration acceleration RMS exceeds 8.0 mm/s, bearing overheating will follow rapidly.';
        } else if (query.includes('current') || query.includes('mcsa') || query.includes('elect')) {
          botResponse = 'Under MCSA current diagnostics, 3-phase phase imbalance exceeds 4.8%. This implies a stator coil winding short or harmonic torque load friction. Please check mounting anchor bolts as well.';
        } else if (query.includes('qr') || query.includes('video') || query.includes('youtube')) {
          botResponse = 'Standard video tutorials matching this diagnostic anomaly are available via the high-resolution QR code inside the [Maintenance Work Order] modal at the top right.';
        }
      } else {
        botResponse = '입력해주신 내용 분석 결과, 현재 원심펌프 7호기에서 감지되고 있는 Z축 이상 진동(임계치 초과)과 MCSA 전류 주파수 편차 융합 결과는 축 중심 불일치(Alignment Error) 확률이 매우 농후함을 시사합니다. [점검 지시서]를 발행하여 표준 레이저 정렬 툴로 커플링 편차를 ±0.03mm 이하로 체결하시기를 강력히 추천합니다.';
        if (query.includes('진동') || query.includes('진폭') || query.includes('흔들')) {
          botResponse = '원심펌프의 비정상 진동은 대개 임펠러 균열(Rotor Unbalance) 또는 베어링 피로 파괴에서 기인합니다. XGBoost 모델 예측에 따르면 진동 가속도 RMS 값이 8.0 mm/s를 돌파할 경우 급속도로 베어링 과열(5번 현상)이 동반되오니 조속히 차단해 주세요.';
        } else if (query.includes('전류') || query.includes('mcsa') || query.includes('모터')) {
          botResponse = 'MCSA(전류고장진단) 모형상, 모터 고주파 왜곡 및 3상 위상 불평형율이 4.8%를 초과하였습니다. 이는 고정자 코일 권선 단락 또는 회전체 이중 왜곡에 따른 부하 변동 마찰로 보이며, 기초 마운팅 볼트 점검을 병행해야 합니다.';
        } else if (query.includes('유튜브') || query.includes('동영상') || query.includes('큐알') || query.includes('qr')) {
          botResponse = '현재 진단된 결함에 수반되는 맞춤 정비 동영상 가이드는 [점검 지시서 발행]을 클릭하셨을 때 모달 내부 우측 상단에 고해상도 QR 코드로 인쇄되어 즉각 연결됩니다. (축정렬 수리 영상 주소: https://www.youtube.com/watch?v=kU_3zSCSz0o)';
        }
      }

      setMessages(prev => [...prev, {
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="absolute bottom-6 right-6 w-96 bg-slate-950/95 border border-slate-800/80 shadow-[0_12px_50px_rgba(0,0,0,0.7)] shadow-indigo-500/10 rounded-2xl overflow-hidden flex flex-col z-50 animate-in slide-in-from-bottom-5 duration-300 print:hidden">
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
        <button onClick={() => setChatbotOpen(false)} className="text-slate-400 hover:text-white p-1 hover:bg-slate-900 rounded-lg transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Messages View */}
      <div className="p-4 h-72 overflow-y-auto bg-slate-950/40 flex flex-col space-y-4 font-sans text-xs">
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
              <p className="break-words">{msg.text}</p>
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

      {/* Input */}
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
