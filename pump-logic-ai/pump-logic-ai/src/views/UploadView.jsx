import React, { useRef } from 'react';
import { UploadCloud, CheckCircle, FileText, Activity, Zap, BarChart2 } from 'lucide-react';

export default function UploadView({ 
  uploadedFile, setUploadedFile, 
  uploadedVibrationFile, setUploadedVibrationFile,
  uploadedCurrentFile, setUploadedCurrentFile,
  previewRows, setPreviewRows,
  previewVibRows, setPreviewVibRows,
  previewCurRows, setPreviewCurRows,
  handleFileUpload, startAnalysis, defaultPreviewData,
  analysisMode, setAnalysisMode,
  t
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
      if (setPreviewVibRows) setPreviewVibRows([]);
      if (vibInputRef.current) vibInputRef.current.value = '';
    } else if (target === 'cur') {
      setUploadedCurrentFile(null);
      if (setPreviewCurRows) setPreviewCurRows([]);
      if (curInputRef.current) curInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in print:hidden font-sans pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-900 pb-4.5 gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-100 mb-1 tracking-wide">{t.upload.uploadTitle}</h1>
          <p className="text-slate-400 text-xs leading-relaxed">{t.upload.uploadDesc}</p>
        </div>
        
        {/* Toggle Mode Tab with modern glass pill slider */}
        <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-slate-900 text-xs w-full md:w-auto shrink-0">
          <button 
            onClick={() => setAnalysisMode('single')}
            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl font-bold transition-all duration-300 ${
              analysisMode === 'single' 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/30' 
                : 'text-slate-500 hover:text-slate-350'
            }`}
          >
            {t.upload.singleMode}
          </button>
          <button 
            onClick={() => setAnalysisMode('fusion')}
            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-1.5 ${
              analysisMode === 'fusion' 
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-900/30' 
                : 'text-slate-500 hover:text-slate-350'
            }`}
          >
            <Zap size={11} className={analysisMode === 'fusion' ? 'animate-bounce' : ''} />
            <span>{t.upload.fusionMode}</span>
          </button>
        </div>
      </div>

      {analysisMode === 'single' ? (
        /* --- SINGLE SENSOR FILE UPLOAD --- */
        <div 
          className="border-2 border-dashed border-slate-800 bg-slate-900/15 hover:bg-slate-900/30 hover:border-blue-500/40 transition-all duration-300 rounded-3xl p-12 text-center relative flex flex-col items-center justify-center min-h-[260px] group cursor-pointer"
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
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-500/5 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/15 shadow-[0_0_20px_rgba(59,130,246,0.06)] group-hover:scale-105 transition-transform duration-300">
                <UploadCloud size={28} className="text-blue-400" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-200 mb-1.5 break-words max-w-lg">{t.upload.dragSingle}</h3>
              <p className="text-slate-550 text-[11px] mb-4 break-words max-w-lg">{t.upload.clickBrowseSingle}</p>
              <span className="bg-slate-950/80 text-slate-500 text-[9px] font-mono font-bold px-3 py-1 rounded-lg border border-slate-900">
                {t.upload.maxSize}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-3.5 border border-emerald-500/25 shadow-glow-emerald">
                <FileText size={24} className="text-emerald-400" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-200 mb-1 truncate max-w-md">{uploadedFile.name}</h3>
              <p className="text-[10px] text-slate-500 mb-4 font-mono">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
              <div className="flex items-center space-x-2">
                <span className="bg-emerald-500/15 text-emerald-400 text-[9px] font-black px-3 py-1 rounded-full border border-emerald-500/25 flex items-center">
                  <CheckCircle size={11} className="mr-1" /> {t.upload.readyAnalysis}
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); clearFile('single'); }}
                  className="text-[9px] text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/25 transition-colors font-bold"
                >
                  {t.upload.removeBtn}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* --- DUAL MULTI-SENSOR FUSION UPLOAD --- */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* File 1: Vibration Sensor CSV */}
          <div 
            className="border-2 border-dashed border-slate-800 bg-slate-900/15 hover:bg-slate-900/30 hover:border-cyan-500/40 transition-all duration-300 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[220px] cursor-pointer group"
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
                <div className="w-12 h-12 bg-cyan-500/5 rounded-2xl flex items-center justify-center mb-3.5 border border-cyan-500/15 group-hover:scale-105 transition-transform duration-300">
                  <Activity size={20} className="text-cyan-400" />
                </div>
                <h4 className="font-extrabold text-slate-200 text-xs tracking-wide break-words max-w-[240px]">{t.upload.vibTitle}</h4>
                <p className="text-slate-550 text-[10px] mt-1 break-words max-w-[240px]">{t.upload.vibDesc}</p>
                <span className="mt-3.5 bg-cyan-950/40 text-cyan-400 text-[8.5px] font-mono font-black px-2.5 py-1 rounded border border-cyan-900/30 uppercase tracking-wider">
                  VIB_X ACCELERATION
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-3 border border-emerald-500/25">
                  <CheckCircle size={20} className="text-emerald-400" />
                </div>
                <h4 className="font-extrabold text-slate-200 text-xs truncate max-w-[245px]">{uploadedVibrationFile.name}</h4>
                <button 
                  onClick={(e) => { e.stopPropagation(); clearFile('vib'); }}
                  className="mt-3.5 text-[9px] text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/20 transition-all font-bold"
                >
                  {t.upload.removeBtn}
                </button>
              </div>
            )}
          </div>

          {/* File 2: Current Sensor CSV */}
          <div 
            className="border-2 border-dashed border-slate-800 bg-slate-900/15 hover:bg-slate-900/30 hover:border-purple-500/40 transition-all duration-300 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[220px] cursor-pointer group"
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
                <div className="w-12 h-12 bg-purple-500/5 rounded-2xl flex items-center justify-center mb-3.5 border border-purple-500/15 group-hover:scale-105 transition-transform duration-300">
                  <Zap size={20} className="text-purple-400" />
                </div>
                <h4 className="font-extrabold text-slate-200 text-xs tracking-wide break-words max-w-[240px]">{t.upload.curTitle}</h4>
                <p className="text-slate-550 text-[10px] mt-1 break-words max-w-[240px]">{t.upload.curDesc}</p>
                <span className="mt-3.5 bg-purple-950/40 text-purple-400 text-[8.5px] font-mono font-black px-2.5 py-1 rounded border border-purple-900/30 uppercase tracking-wider">
                  3-PHASE POWER WAVE
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-3 border border-emerald-500/25">
                  <CheckCircle size={20} className="text-emerald-400" />
                </div>
                <h4 className="font-extrabold text-slate-200 text-xs truncate max-w-[245px]">{uploadedCurrentFile.name}</h4>
                <button 
                  onClick={(e) => { e.stopPropagation(); clearFile('cur'); }}
                  className="mt-3.5 text-[9px] text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/20 transition-all font-bold"
                >
                  {t.upload.removeBtn}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preview Area (Only shown when files are uploaded to prevent confusion) */}
      {((analysisMode === 'single' && previewRows.length > 0) || 
        (analysisMode === 'fusion' && (previewVibRows.length > 0 || previewCurRows.length > 0))) && (
        <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
          <div className="px-5 py-4 border-b border-slate-900 bg-slate-950/40 flex justify-between items-center">
            <h3 className="font-extrabold text-slate-200 flex items-center text-xs tracking-wide">
              <BarChart2 size={15} className="mr-2 text-cyan-400" /> 
              <span>{t.upload.previewTitle}</span>
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[9px] text-slate-400 uppercase bg-slate-950/70 border-b border-slate-900 font-mono tracking-wider">
                <tr>
                  {Object.keys(
                    analysisMode === 'single' 
                      ? previewRows[0] 
                      : (previewVibRows[0] || previewCurRows[0])
                  ).map((key) => (
                    <th key={key} className="px-6 py-3 border-r border-slate-900/60">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(
                  analysisMode === 'single' 
                    ? previewRows 
                    : (previewVibRows.length ? previewVibRows : previewCurRows)
                ).map((row, i) => (
                  <tr key={i} className="border-b border-slate-900/40 hover:bg-slate-900/20 transition-colors font-mono text-slate-300 text-[11px]">
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="px-6 py-2.5 whitespace-nowrap border-r border-slate-900/40">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button
          onClick={startAnalysis}
          disabled={
            analysisMode === 'single' 
              ? !uploadedFile 
              : (!uploadedVibrationFile || !uploadedCurrentFile)
          }
          className={`flex items-center space-x-2 px-8 py-3.5 rounded-2xl font-black transition-all duration-300 shadow-lg text-xs ${
            (analysisMode === 'single' ? uploadedFile : (uploadedVibrationFile && uploadedCurrentFile))
            ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-indigo-600/35 hover:shadow-cyan-500/40 hover:-translate-y-0.5' 
            : 'bg-slate-900/40 text-slate-655 cursor-not-allowed border border-slate-800/80 shadow-inner'
          }`}
        >
          <Zap size={14} className={ (analysisMode === 'single' ? uploadedFile : (uploadedVibrationFile && uploadedCurrentFile)) ? 'animate-bounce' : '' } />
          <span>{t.upload.startFusionBtn}</span>
        </button>
      </div>
    </div>
  );
}
