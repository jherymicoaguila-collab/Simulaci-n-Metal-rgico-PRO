
import React from 'react';
import { SimulationParams } from '../types';
import OreSample3D from './OreSample3D';

interface ControlPanelProps {
  params: SimulationParams;
  onChange: (newParams: SimulationParams) => void;
}

const Slider = ({ 
  label, 
  value, 
  min, 
  max, 
  unit, 
  step, 
  onChange, 
  colorClass 
}: { 
  label: string; 
  value: number; 
  min: number; 
  max: number; 
  unit: string; 
  step: number; 
  onChange: (val: number) => void; 
  colorClass: string;
}) => (
  <div className="mb-5 group">
    <div className="flex justify-between items-end mb-2">
      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide group-hover:text-gray-300 transition-colors">{label}</label>
      <span className={`text-base font-bold font-mono ${colorClass} drop-shadow-sm`}>
        {value} <span className="text-[9px] text-gray-600 font-normal">{unit}</span>
      </span>
    </div>
    <div className="relative h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
        {/* Track fill */}
        <div 
            className={`absolute top-0 left-0 h-full ${colorClass.replace('text-', 'bg-')} shadow-[0_0_8px_currentColor] opacity-80`} 
            style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        ></div>
        <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        />
    </div>
  </div>
);

const ControlPanel: React.FC<ControlPanelProps> = ({ params, onChange }) => {
  const updateParam = (key: keyof SimulationParams, value: number) => {
    onChange({ ...params, [key]: value });
  };

  return (
    <div className="bg-[#050505]/90 backdrop-blur-xl p-0 rounded-2xl border border-slate-800 flex flex-col h-full shadow-2xl relative overflow-hidden">
      
      {/* Decorative lines */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-900 via-blue-500 to-blue-900 opacity-50"></div>

      {/* Header */}
      <div className="p-6 pb-2 border-b border-slate-800/50">
        <h2 className="text-sm font-bold text-white flex items-center gap-3">
            <span className="w-1 h-4 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]"></span>
            CONFIGURACIÓN DE PROCESO
        </h2>
        <p className="text-[10px] text-gray-500 mt-1 pl-4">Ajuste de variables operativas en tiempo real</p>
      </div>

      {/* Sliders Area */}
      <div className="p-6 space-y-2 flex-shrink-0">
            <Slider
                label="Granulometría (% -200m)"
                value={params.granulometry}
                min={40}
                max={98}
                step={1}
                unit="%"
                colorClass="text-emerald-400"
                onChange={(v) => updateParam('granulometry', v)}
            />

            <Slider
                label="Dosificación Colector"
                value={params.collectorDosage}
                min={50}
                max={300}
                step={10}
                unit="g/t"
                colorClass="text-purple-400"
                onChange={(v) => updateParam('collectorDosage', v)}
            />

            <Slider
                label="pH (Alcalinidad)"
                value={params.ph}
                min={7}
                max={14}
                step={0.1}
                unit="pH"
                colorClass="text-pink-400"
                onChange={(v) => updateParam('ph', v)}
            />

            <Slider
                label="Concentración H₂O₂"
                value={params.h2o2Concentration}
                min={0}
                max={10}
                step={0.1}
                unit="%"
                colorClass="text-sky-400"
                onChange={(v) => updateParam('h2o2Concentration', v)}
            />

            <Slider
                label="Tiempo Residencia"
                value={params.leachingTime}
                min={0}
                max={48}
                step={1}
                unit="hrs"
                colorClass="text-amber-400"
                onChange={(v) => updateParam('leachingTime', v)}
            />
      </div>

      {/* 3D MINERAL SAMPLE & ANALYSIS (Fills remaining space) */}
      <div className="flex-grow min-h-[250px] relative border-t border-slate-800 bg-[#020305]">
         
         {/* Title Overlay */}
         <div className="absolute top-4 left-6 z-10 pointer-events-none">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></span>
                Mineralogía de Alimentación
            </h3>
            <p className="text-[9px] text-gray-600 font-mono mt-1">MUESTRA: M-2025-X • LEY: 12.5 g/t Au</p>
         </div>

         {/* 3D Viewport */}
         <div className="absolute inset-0 z-0">
             <OreSample3D />
         </div>

         {/* Data Overlay Floating */}
         <div className="absolute bottom-6 right-6 z-10 pointer-events-none text-right">
             <div className="space-y-1">
                 <div className="bg-black/40 backdrop-blur px-2 py-1 rounded border border-slate-800 inline-block">
                    <span className="text-[9px] text-gray-500 mr-2">Au (Oro)</span>
                    <span className="text-xs text-yellow-500 font-mono font-bold">4.5%</span>
                 </div>
                 <div className="block"></div>
                 <div className="bg-black/40 backdrop-blur px-2 py-1 rounded border border-slate-800 inline-block">
                    <span className="text-[9px] text-gray-500 mr-2">FeAsS (Arsenopirita)</span>
                    <span className="text-xs text-slate-300 font-mono font-bold">32.1%</span>
                 </div>
                 <div className="block"></div>
                 <div className="bg-black/40 backdrop-blur px-2 py-1 rounded border border-slate-800 inline-block">
                    <span className="text-[9px] text-gray-500 mr-2">S (Sulfuros)</span>
                    <span className="text-xs text-red-400 font-mono font-bold">18.4%</span>
                 </div>
             </div>
         </div>
         
         {/* Decorative Corner Lines */}
         <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-slate-800 rounded-bl-xl opacity-50"></div>
         <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-slate-800 rounded-tr-xl opacity-50"></div>

      </div>
      
    </div>
  );
};

export default ControlPanel;
