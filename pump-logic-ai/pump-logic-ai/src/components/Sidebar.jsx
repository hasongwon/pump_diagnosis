import React from 'react';
import { Activity, UploadCloud, BarChart2, FileText, BookOpen } from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage, t }) {
  const SidebarItem = ({ icon: Icon, label, id }) => {
    const isActive = currentPage === id;
    return (
      <button
        onClick={() => setCurrentPage(id)}
        className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative group ${
          isActive
            ? 'bg-indigo-600/20 text-cyan-400 border border-indigo-500/35 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
            : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent'
        }`}
      >
        {/* Left Glowing bar */}
        {isActive && (
          <div className="absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-r-md shadow-[0_0_8px_#06b6d4]"></div>
        )}
        <Icon 
          size={18} 
          className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'}`} 
        />
        <span className="font-semibold text-sm tracking-wide">{label}</span>
      </button>
    );
  };

  return (
    <aside className="w-64 bg-slate-950/60 border-r border-slate-900/80 flex flex-col backdrop-blur-xl shrink-0 hidden md:flex print:hidden relative z-20">
      <div className="p-6 border-b border-slate-900/60">
        <div className="flex items-center space-x-3 text-cyan-400 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <Activity className="animate-pulse text-white" size={18} />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider text-slate-100 bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
              PUMP LOGIC AI
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">PdM SOLUTION</p>
          </div>
        </div>
        <div className="flex items-center mt-2.5 px-2.5 py-1 bg-slate-900/50 rounded-md border border-slate-800/60 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse shadow-[0_0_8px_#10b981]"></span>
          <span className="text-[9px] text-slate-400 font-mono font-bold">{t.topbar.systemAlpha}</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <SidebarItem icon={Activity} label={t.sidebar.dashboard} id="dashboard" />
        <SidebarItem icon={UploadCloud} label={t.sidebar.upload} id="upload" />
        <SidebarItem icon={BarChart2} label={t.sidebar.diagnostics} id="diagnostics" />
        <SidebarItem icon={FileText} label={t.sidebar.reports} id="reports" />
        <SidebarItem icon={BookOpen} label={t.sidebar.manuals} id="manuals" />
      </nav>

      <div className="p-4 border-t border-slate-900/80 bg-slate-950/40">
        <div className="flex items-center space-x-3 p-2 rounded-xl bg-slate-900/20 border border-slate-800/40">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white font-extrabold shadow-lg shadow-indigo-600/25 border border-indigo-400/20">
            A
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-200 truncate">{t.sidebar.admin}</p>
            <div className="flex items-center text-[10px] text-emerald-400 font-semibold mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-ping"></span>
              <span>{t.sidebar.operator}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
