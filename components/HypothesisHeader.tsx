
import React from 'react';

const HypothesisHeader: React.FC = () => {
  return (
    <div className="bg-[#050505] border-b border-slate-800 relative overflow-hidden">
        {/* Animated Top Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 animate-pulse"></div>

      <div className="max-w-[1900px] mx-auto px-6 py-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          
          {/* LEFT: Branding */}
          <div className="flex items-center gap-5">
            <div className="bg-blue-600/10 p-3 rounded-lg border border-blue-500/20 backdrop-blur-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Simulador Metalúrgico <span className="text-blue-500">PRO</span>
              </h1>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-mono mt-1">
                <span className="text-blue-400">ID:</span> SAUNA-LIB-2025
                <span className="mx-1">|</span>
                <span className="text-green-400">V.2.5.0 STABLE</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Telemetry Data (Fills the 'Empty Part') */}
          <div className="flex gap-1 md:gap-8 w-full lg:w-auto justify-center lg:justify-end bg-slate-900/40 p-2 md:p-3 rounded-xl border border-slate-800/60 backdrop-blur-sm">
            
            <div className="text-center md:text-right px-4 border-r border-slate-700/50 last:border-0">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Ubicación</p>
                <div className="flex items-center gap-2 justify-center md:justify-end">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <p className="text-sm font-semibold text-gray-200">Sauna, La Libertad</p>
                </div>
            </div>

            <div className="text-center md:text-right px-4 border-r border-slate-700/50 hidden sm:block">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Altitud</p>
                <p className="text-sm font-semibold text-gray-200 font-mono">3,850 <span className="text-xs text-gray-500">m.s.n.m</span></p>
            </div>

            <div className="text-center md:text-right px-4 hidden sm:block">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Clima</p>
                <div className="flex items-center gap-2 justify-end">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                    <p className="text-sm font-semibold text-gray-200">Nublado, 12°C</p>
                </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default HypothesisHeader;
