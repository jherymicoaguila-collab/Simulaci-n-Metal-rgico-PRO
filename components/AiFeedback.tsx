import React, { useState } from 'react';
import { AnalysisStatus, SimulationParams, SimulationResult } from '../types';
import { analyzeSimulation } from '../services/geminiService';

interface AiFeedbackProps {
  params: SimulationParams;
  result: SimulationResult;
}

const AiFeedback: React.FC<AiFeedbackProps> = ({ params, result }) => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [feedback, setFeedback] = useState<string>("");

  const handleAnalysis = async () => {
    setStatus(AnalysisStatus.LOADING);
    const text = await analyzeSimulation(params, result);
    setFeedback(text);
    setStatus(AnalysisStatus.SUCCESS);
  };

  return (
    <div className="mt-6 bg-slate-900/50 border border-indigo-500/30 rounded-xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <svg className="w-24 h-24 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-6h2zm0-8h-2V7h2z"/>
        </svg>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-indigo-300 flex items-center gap-2">
            <span className="text-2xl">🤖</span> Profesor Virtual (AI)
          </h3>
          {status === AnalysisStatus.IDLE && (
            <button 
              onClick={handleAnalysis}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
            >
              Analizar Resultados
            </button>
          )}
           {status === AnalysisStatus.SUCCESS && (
            <button 
              onClick={handleAnalysis}
              className="text-indigo-400 hover:text-indigo-300 text-sm underline"
            >
              Actualizar Análisis
            </button>
          )}
        </div>

        {status === AnalysisStatus.LOADING && (
          <div className="flex items-center gap-3 text-gray-400 animate-pulse">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Analizando cinética química...</span>
          </div>
        )}

        {status === AnalysisStatus.SUCCESS && (
          <div className="bg-indigo-950/30 p-4 rounded-lg border border-indigo-500/20">
            <p className="text-gray-200 leading-relaxed text-sm md:text-base">
              {feedback}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiFeedback;