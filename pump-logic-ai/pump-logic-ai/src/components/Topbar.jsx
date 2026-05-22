import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Bell, Settings, Sun, Moon } from 'lucide-react';

export default function Topbar({ chatbotOpen, setChatbotOpen, theme, setTheme, lang, setLang, t }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readIds, setReadIds] = useState([]);

  const settingsRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const notifications = [
    { id: 1, key: 'notif1', time: lang === 'ko' ? '10분 전' : '10m ago', type: 'alert' },
    { id: 2, key: 'notif2', time: lang === 'ko' ? '1시간 전' : '1h ago', type: 'dataset' },
    { id: 3, key: 'notif3', time: lang === 'ko' ? '2시간 전' : '2h ago', type: 'guideline' },
    { id: 4, key: 'notif4', time: lang === 'ko' ? '3시간 전' : '3h ago', type: 'mcsa' },
  ];

  const unreadCount = notifications.length - readIds.length;

  const handleMarkAllRead = () => {
    setReadIds(notifications.map(n => n.id));
  };

  const handleToggleRead = (id) => {
    if (readIds.includes(id)) {
      setReadIds(readIds.filter(x => x !== id));
    } else {
      setReadIds([...readIds, id]);
    }
  };

  return (
    <header className="h-16 border-b border-slate-900/60 bg-slate-950/45 backdrop-blur-md flex items-center justify-between px-6 z-10 shrink-0 print:hidden relative">
      {/* Background ambient beam */}
      <div className="absolute top-0 left-1/3 right-1/3 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

      <div className="flex items-center flex-1">
        <h2 className="text-sm font-black bg-gradient-to-r from-slate-200 via-slate-100 to-slate-400 bg-clip-text text-transparent hidden lg:block tracking-wide uppercase">
          {t.topbar.title}
        </h2>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Glowing Interactive AI Chatbot Button */}
        <button
          onClick={() => {
            setChatbotOpen(!chatbotOpen);
            setSettingsOpen(false);
            setNotificationsOpen(false);
          }}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-extrabold transition-all duration-300 border ${
            chatbotOpen
              ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white border-transparent shadow-[0_0_15px_rgba(99,102,241,0.45)] scale-105'
              : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20 hover:text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.08)]'
          }`}
        >
          <MessageSquare size={13} className={chatbotOpen ? 'animate-bounce' : ''} />
          <span>{t.topbar.aiChatbot}</span>
        </button>

        {/* Notifications */}
        <div className="relative animate-fade-in" ref={notificationsRef}>
          <button 
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setSettingsOpen(false);
            }}
            className={`p-2 text-slate-400 hover:text-slate-200 relative group transition-colors rounded-xl hover:bg-slate-900/40 border border-transparent hover:border-slate-800/40 ${
              notificationsOpen ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.15)]' : ''
            }`}
            title={t.topbar.notifications}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-slate-950 animate-pulse shadow-[0_0_6px_#f43f5e]"></span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-[320px] sm:w-[380px] rounded-2xl glass-panel border border-slate-800/80 p-4 shadow-xl z-50 animate-slide-up text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/50 mb-3">
                <div className="flex items-center space-x-2">
                  <Bell size={14} className="text-indigo-400 animate-pulse" />
                  <span className="text-[11px] font-black tracking-wider text-slate-200">{t.topbar.notifications}</span>
                  {unreadCount > 0 && (
                    <span className="bg-rose-500/20 text-rose-450 border border-rose-500/30 text-[9px] px-1.5 py-0.5 rounded-md font-bold">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    {t.topbar.markAllRead}
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {notifications.map((notif) => {
                  const isRead = readIds.includes(notif.id);
                  const notifText = t.topbar[notif.key];
                  
                  // Icon & colors by type
                  let icon = null;
                  let colorClass = "";
                  if (notif.type === 'alert') {
                    icon = <span className="flex-shrink-0 w-2 h-2 rounded-full bg-rose-500 animate-ping mt-1.5"></span>;
                    colorClass = isRead ? "text-slate-500" : "text-rose-400 font-semibold";
                  } else if (notif.type === 'dataset') {
                    icon = <span className="flex-shrink-0 w-2 h-2 rounded-full bg-cyan-500 mt-1.5"></span>;
                    colorClass = isRead ? "text-slate-500" : "text-cyan-400 font-semibold";
                  } else if (notif.type === 'guideline') {
                    icon = <span className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500 mt-1.5"></span>;
                    colorClass = isRead ? "text-slate-500" : "text-emerald-400 font-semibold";
                  } else {
                    icon = <span className="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-500 mt-1.5"></span>;
                    colorClass = isRead ? "text-slate-500" : "text-indigo-400 font-semibold";
                  }

                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleToggleRead(notif.id)}
                      className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer flex items-start space-x-3 select-none text-left ${
                        isRead
                          ? 'bg-slate-950/20 border-slate-900/30 opacity-60 hover:opacity-100'
                          : 'bg-slate-900/30 hover:bg-slate-900/50 border-slate-800/40 hover:border-slate-800/80 shadow-[0_2px_8px_rgba(0,0,0,0.1)]'
                      }`}
                    >
                      {icon}
                      <div className="flex-1 min-w-0">
                        <p className={`text-[11px] leading-relaxed text-left ${colorClass}`}>
                          {notifText}
                        </p>
                        <span className="text-[9px] text-slate-500 block mt-1 font-mono text-left">{notif.time}</span>
                      </div>
                      {!isRead && (
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0 mt-1.5 shadow-[0_0_4px_#6366f1]"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="relative animate-fade-in" ref={settingsRef}>
          <button 
            onClick={() => {
              setSettingsOpen(!settingsOpen);
              setNotificationsOpen(false);
            }}
            className={`p-2 text-slate-400 hover:text-slate-200 group transition-all rounded-xl hover:bg-slate-900/40 border border-transparent hover:border-slate-800/40 ${
              settingsOpen ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.15)]' : ''
            }`}
            title={t.topbar.settings}
          >
            <Settings size={18} className={`transition-transform duration-500 ${settingsOpen ? 'rotate-90' : 'group-hover:rotate-45'}`} />
          </button>

          {/* Settings Dropdown Panel */}
          {settingsOpen && (
            <div className="absolute right-0 mt-3 w-72 rounded-2xl glass-panel border border-slate-800/80 p-4 shadow-xl z-50 animate-slide-up text-left">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-800/50 mb-4">
                <Settings size={14} className="text-indigo-400" />
                <span className="text-[11px] font-black tracking-wider text-slate-200">{t.topbar.settings}</span>
              </div>

              {/* Theme Mode Option */}
              <div className="mb-5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 text-left">{t.topbar.themeMode}</span>
                <div className="grid grid-cols-2 gap-2 bg-slate-950/40 p-1 rounded-xl border border-slate-900/30">
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex items-center justify-center space-x-2 py-2 rounded-lg text-[11px] font-black transition-all duration-300 cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                    }`}
                  >
                    <Moon size={12} className={theme === 'dark' ? 'text-indigo-200' : 'text-slate-400'} />
                    <span>{t.topbar.darkTheme}</span>
                  </button>
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex items-center justify-center space-x-2 py-2 rounded-lg text-[11px] font-black transition-all duration-300 cursor-pointer ${
                      theme === 'light'
                        ? 'bg-amber-500 text-slate-900 shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                    }`}
                  >
                    <Sun size={12} className={theme === 'light' ? 'text-amber-800 animate-spin [animation-duration:10s]' : 'text-slate-400'} />
                    <span>{t.topbar.lightTheme}</span>
                  </button>
                </div>
              </div>

              {/* Language Option */}
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 text-left">{t.topbar.language}</span>
                <div className="grid grid-cols-2 gap-2 bg-slate-950/40 p-1 rounded-xl border border-slate-900/30">
                  <button
                    onClick={() => setLang('ko')}
                    className={`flex items-center justify-center py-2 rounded-lg text-[11px] font-black transition-all duration-300 cursor-pointer ${
                      lang === 'ko'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                    }`}
                  >
                    <span>{t.topbar.korean}</span>
                  </button>
                  <button
                    onClick={() => setLang('en')}
                    className={`flex items-center justify-center py-2 rounded-lg text-[11px] font-black transition-all duration-300 cursor-pointer ${
                      lang === 'en'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                    }`}
                  >
                    <span>{t.topbar.english}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
