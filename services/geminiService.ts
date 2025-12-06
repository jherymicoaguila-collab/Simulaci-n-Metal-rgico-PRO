import { GoogleGenAI } from "@google/genai";
import { SimulationParams, SimulationResult } from '../types';

export const analyzeSimulation = async (params: SimulationParams, result: SimulationResult): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Error: API Key no configurada.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Actúa como un profesor experto en metalurgia extractiva y química de minerales.
    
    Analiza la siguiente simulación basada en la hipótesis: "La aplicación combinada de flotación, pretratamiento oxidante con peróxido de hidrógeno y lixiviación mejora la recuperación en minerales con arsenopirita."

    **Parámetros de Entrada:**
    - Granulometría (% malla -200): ${params.granulometry}%
    - Dosificación de Colector: ${params.collectorDosage} g/t
    - pH: ${params.ph}
    - Concentración H2O2: ${params.h2o2Concentration}%
    - Tiempo de Lixiviación: ${params.leachingTime} horas

    **Resultados Obtenidos:**
    - Recuperación Oro (Au): ${result.auRecovery}%
    - Recuperación Plata (Ag): ${result.agRecovery}%
    - Eficiencia General: ${result.efficiencyScore}/100

    **Tarea:**
    Proporciona una explicación breve (máximo 100 palabras) y educativa para un estudiante.
    Explica por qué se obtuvieron estos resultados basándote en la química (oxidación de arsenopirita, efecto del pH en la cianuración, cinética).
    Si los resultados son malos, sugiere qué cambiar. Usa un tono motivador.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No se pudo generar el análisis.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ocurrió un error al conectar con el profesor virtual IA.";
  }
};