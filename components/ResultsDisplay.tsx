
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { SimulationResult, SimulationParams } from '../types';
import ParticleReactor from './ParticleReactor';

interface ResultsDisplayProps {
  result: SimulationResult;
  params: SimulationParams;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 border border-slate-600 p-3 rounded-lg shadow-2xl text-xs backdrop-blur-xl">
        <p className="font-bold text-gray-200 mb-2 border-b border-gray-700 pb-1">T: {label} hrs</p>
        <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <p className="text-gray-300">Au: <span className="text-white font-mono">{payload[0].value}%</span></p>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
            <p className="text-gray-300">Ag: <span className="text-white font-mono">{payload[1].value}%</span></p>
        </div>
      </div>
    );
  }
  return null;
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, params }) => {
  return (
    <div className="flex flex-col gap-6 h-full">
      
      {/* 3D REACTOR MODULE */}
      <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-[#020408] group">
        <ParticleReactor params={params} />
        
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"></div>

        {/* HUD UI */}
        <div className="absolute top-0 left-0 w-full h-full p-6 pointer-events-none flex flex-col justify-between">
          <div className="flex justify-between">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-tighter drop-shadow-md">
                   REACTOR <span className="text-blue-500">DIGITAL</span> 
                </h2>
                <p className="text-[10px] text-gray-400 font-mono tracking-widest mt-1">SIMULACIÓN CINÉTICA V2.0</p>
            </div>
            <div className="bg-black/50 backdrop-blur border border-green-500/30 px-3 py-1 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 font-bold font-mono">SYSTEM ONLINE</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
             {/* Key Metrics Cards */}
             <div className="col-span-1 bg-black/60 backdrop-blur-md border border-slate-700 p-3 rounded-lg">
                <p className="text-[10px] text-gray-400 uppercase font-bold">Recuperación Au</p>
                <p className="text-3xl font-mono text-yellow-400 font-bold">{result.auRecovery}%</p>
             </div>
             <div className="col-span-1 bg-black/60 backdrop-blur-md border border-slate-700 p-3 rounded-lg">
                <p className="text-[10px] text-gray-400 uppercase font-bold">Recuperación Ag</p>
                <p className="text-3xl font-mono text-slate-300 font-bold">{result.agRecovery}%</p>
             </div>
          </div>
        </div>
      </div>

      {/* LOWER DASHBOARD GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-auto xl:h-[350px]">
        
        {/* LEFT: KINETIC CHART (2/3 width) */}
        <div className="xl:col-span-2 bg-[#0a0a0a] border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4 z-10">
                <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2 uppercase tracking-wider">
                    <span className="w-1 h-4 bg-blue-500 rounded-sm"></span>
                    Curva Cinética de Lixiviación
                </h3>
                <div className="flex gap-2">
                    <span className="text-[10px] bg-slate-800 text-gray-400 px-2 py-1 rounded border border-slate-700">t: 0-{params.leachingTime}h</span>
                </div>
            </div>

            <div className="flex-grow w-full h-full min-h-[200px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={result.kineticData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorAu" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="time" stroke="#475569" tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                        <YAxis stroke="#475569" tick={{fontSize: 11}} axisLine={false} tickLine={false} domain={[0, 100]} />
                        <Tooltip content={<CustomTooltip />} cursor={{stroke: '#3b82f6', strokeWidth: 1}} />
                        <Legend iconType="plainline" wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
                        <Line type="monotone" dataKey="au" name="Oro (Au)" stroke="#fbbf24" strokeWidth={3} dot={false} activeDot={{r: 5, fill:'#fbbf24', stroke:'black'}} />
                        <Line type="monotone" dataKey="ag" name="Plata (Ag)" stroke="#94a3b8" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                        <ReferenceLine x={24} stroke="#10b981" label={{ value: '24h Objetivo', fill: '#10b981', fontSize: 10, position: 'insideTopRight' }} strokeDasharray="3 3" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            
            {/* Background glowing blob */}
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/10 blur-[80px] rounded-full pointer-events-none"></div>
        </div>

        {/* RIGHT: RADAR ANALYSIS (1/3 width - Filling the 'empty' part) */}
        <div className="xl:col-span-1 bg-[#0a0a0a] border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col relative overflow-hidden">
             <div className="flex justify-between items-center mb-2 z-10">
                <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2 uppercase tracking-wider">
                    <span className="w-1 h-4 bg-purple-500 rounded-sm"></span>
                    Análisis Multi-Variable
                </h3>
            </div>
            
            <div className="flex-grow relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={result.radarData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar name="Performance" dataKey="A" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf6" fillOpacity={0.3} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                            itemStyle={{ color: '#e2e8f0', fontSize: '12px' }} 
                        />
                    </RadarChart>
                </ResponsiveContainer>
                
                {/* Center efficiency score */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-2">
                    <span className="text-2xl font-bold text-white drop-shadow-md">{result.efficiencyScore}</span>
                    <p className="text-[9px] text-gray-400 uppercase">Global Score</p>
                </div>
            </div>

            {/* Mini Footer Logs */}
            <div className="mt-2 pt-3 border-t border-slate-800 z-10">
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>COSTO OP: <span className="text-red-400">HIGH</span></span>
                    <span>SAFETY: <span className="text-green-400">OK</span></span>
                </div>
            </div>

            {/* Background glowing blob */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-900/10 blur-[60px] rounded-full pointer-events-none"></div>
        </div>

      </div>
    </div>
  );
};

export default ResultsDisplay;
