
import { SimulationParams, SimulationResult } from '../types';

export const calculateSimulation = (params: SimulationParams): SimulationResult => {
  const { granulometry, collectorDosage, ph, h2o2Concentration, leachingTime } = params;

  // --- PHYSICS ENGINE ---

  // 1. pH Factor (Optimum ~10.5)
  const phOptimal = 10.5;
  const phFactor = Math.exp(-Math.pow(ph - phOptimal, 2) / 4);

  // 2. Granulometry (Diminishing returns after 85%)
  const granFactor = 1 / (1 + Math.exp(-0.06 * (granulometry - 55)));

  // 3. Collector (Optimum ~150g/t)
  const collectorOptimal = 150;
  const collectorFactor = Math.max(0, 1 - Math.abs(collectorDosage - collectorOptimal) / 350);

  // 4. Oxidant (Logarithmic boost)
  const h2o2Factor = Math.log(h2o2Concentration + 1) / Math.log(12); 

  // 5. Kinetics (Time)
  const k_Au = 0.14 * (1 + h2o2Factor * 0.8) * granFactor;
  const k_Ag = 0.09 * (1 + h2o2Factor * 0.5) * granFactor;

  // Max Recovery Calculation
  const maxAu = 96 * phFactor * (0.75 + 0.25 * collectorFactor); 
  const maxAg = 88 * phFactor * (0.75 + 0.25 * collectorFactor);

  const auRecovery = parseFloat((maxAu * (1 - Math.exp(-k_Au * leachingTime))).toFixed(2));
  const agRecovery = parseFloat((maxAg * (1 - Math.exp(-k_Ag * leachingTime))).toFixed(2));

  // --- MULTI-DIMENSIONAL SCORES ---

  // 1. Kinetic Speed: How fast did we reach 90% of max?
  const kineticScore = Math.min(100, k_Au * 400);

  // 2. Cost Efficiency: Penalize high chemicals and time
  // Normalize costs: H2O2 is expensive, Time is OpEx
  const costIndex = (h2o2Concentration * 5) + (leachingTime * 1.5) + (collectorDosage / 10);
  const costScore = Math.max(0, 100 - costIndex);

  // 3. Environmental Safety: Penalize extreme pH and high dosage
  const safetyScore = Math.max(0, 100 - (Math.abs(ph - 7) * 5 + h2o2Concentration * 3 + collectorDosage/20));

  // 4. Stability: Penalize extreme granulometry (slimes)
  const stabilityScore = granulometry > 90 ? 60 : 95;

  const efficiencyScore = Math.round((auRecovery + costScore + safetyScore) / 3);

  // Kinetic Curve Data
  const kineticData = [];
  for (let t = 0; t <= 48; t += 2) {
    kineticData.push({
      time: t,
      au: parseFloat((maxAu * (1 - Math.exp(-k_Au * t))).toFixed(2)),
      ag: parseFloat((maxAg * (1 - Math.exp(-k_Ag * t))).toFixed(2)),
    });
  }

  return {
    auRecovery: Math.max(0, auRecovery),
    agRecovery: Math.max(0, agRecovery),
    efficiencyScore,
    kineticData,
    radarData: [
      { subject: 'Recuperación', A: auRecovery, fullMark: 100 },
      { subject: 'Costo-Eficiencia', A: costScore, fullMark: 100 },
      { subject: 'Seguridad Amb.', A: safetyScore, fullMark: 100 },
      { subject: 'Cinética', A: kineticScore, fullMark: 100 },
      { subject: 'Estabilidad', A: stabilityScore, fullMark: 100 },
    ],
    costAnalysis: [
        { label: 'Reactivos', value: (collectorDosage + h2o2Concentration * 20), color: '#3b82f6' },
        { label: 'Energía (t)', value: leachingTime * 5, color: '#eab308' },
        { label: 'Molienda', value: granulometry * 2, color: '#ef4444' }
    ]
  };
};
