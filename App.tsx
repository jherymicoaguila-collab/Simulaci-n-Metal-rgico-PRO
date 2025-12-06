import React, { useState, useEffect, useMemo } from 'react';
import HypothesisHeader from './components/HypothesisHeader';
import ControlPanel from './components/ControlPanel';
import ResultsDisplay from './components/ResultsDisplay';
import AiFeedback from './components/AiFeedback';
import { SimulationParams, SimulationResult } from './types';
import { calculateSimulation } from './services/simulationLogic';

const App: React.FC = () => {
  // Initial parameters based on typical metallurgical ranges
  const [params, setParams] = useState<SimulationParams>({
    granulometry: 70, // Standard 70% passing -200 mesh
    collectorDosage: 150, // g/t
    ph: 9.0, // Typical start, though optimal is higher
    h2o2Concentration: 2, // Start with some bubbles visually
    leachingTime: 24, // 24 hours
  });

  const [result, setResult] = useState<SimulationResult | null>(null);

  // Real-time calculation using useMemo/useEffect to mimic simulation engine
  useEffect(() => {
    const newResult = calculateSimulation(params);
    setResult(newResult);
  }, [params]);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-blue-500/30 bg-black">
      <HypothesisHeader />

      <main className="flex-grow p-4 md:p-6 lg:p-8 overflow-hidden">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          
          {/* Left Sidebar: Controls */}
          <div className="lg:col-span-4 xl:col-span-3">
            <ControlPanel params={params} onChange={setParams} />
          </div>

          {/* Right Area: Results */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
            {result && <ResultsDisplay result={result} params={params} />}
            
            {result && <AiFeedback params={params} result={result} />}
          </div>
        </div>
      </main>

      <footer className="bg-black/80 border-t border-slate-900 p-6 text-center text-slate-600 text-sm">
        <p>© 2024 Proyecto de Investigación - Ingeniería Metalúrgica</p>
        <p className="mt-1 text-xs opacity-50">Simulación con fines educativos. Modelos matemáticos simplificados.</p>
      </footer>
    </div>
  );
};

export default App;