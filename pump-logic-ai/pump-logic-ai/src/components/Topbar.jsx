import React from 'react';
import { Search, MessageSquare, Bell, Settings, Sun, Moon, Globe } from 'lucide-react';

export default function Topbar({ chatbotOpen, setChatbotOpen, theme, setTheme, lang, setLang, t }) {
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="h-16 border-b border-slate-900/60 bg-slate-950/45 backdrop-blur-md flex items-center justify-between px-6 z-10 shrink-0 print:hidden relative">
      {/* Background ambient beam */}
      <div className="absolute top-0 left-1/3 right-1/3 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

      <div className="flex items-center flex-1">
        <div className="relative w-64 hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" size={14} />
          <input
            type="text"
            placeholder={t.topbar.search}
            className="w-full bg-slate-900/40 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/60 transition-all font-sans"
          />
        </div>
        <h2 className="ml-8 text-sm font-black bg-gradient-to-r from-slate-200 via-slate-100 to-slate-400 bg-clip-text text-transparent hidden lg:block tracking-wide uppercase">
          {t.topbar.title}
        </h2>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Language Selection Buttons */}
        <div className="flex items-center bg-slate-900/50 border border-slate-800/80 rounded-xl p-0.5 relative">
          <button
            onClick={() => setLang('ko')}
            className={`px-2.5 py-1 text-[10px] font-black rounded-lg transition-all duration-300 ${
              lang === 'ko'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            KO
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-2.5 py-1 text-[10px] font-black rounded-lg transition-all duration-300 ${
              lang === 'en'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            EN
          </button>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-slate-200 transition-all rounded-xl hover:bg-slate-900/40 border border-transparent hover:border-slate-800/40 relative group"
          title={theme === 'dark' ? "Light Mode" : "Dark Mode"}
        >
          {theme === 'dark' ? (
            <Sun size={18} className="text-amber-400 animate-spin [animation-duration:30s] group-hover:scale-110 transition-transform" />
          ) : (
            <Moon size={18} className="text-indigo-500 group-hover:scale-110 transition-transform" />
          )}
        </button>

        {/* Glowing Interactive AI Chatbot Button */}
        <button
          onClick={() => setChatbotOpen(!chatbotOpen)}
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
        <button className="p-2 text-slate-400 hover:text-slate-200 relative group transition-colors rounded-xl hover:bg-slate-900/40 border border-transparent hover:border-slate-800/40">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-slate-950 animate-pulse shadow-[0_0_6px_#f43f5e]"></span>
        </button>

        {/* Settings */}
        <button className="p-2 text-slate-400 hover:text-slate-200 group transition-all rounded-xl hover:bg-slate-900/40 border border-transparent hover:border-slate-800/40">
          <Settings size={18} className="group-hover:rotate-45 transition-transform duration-500" />
        </button>
      </div>
    </header>
  );
}
