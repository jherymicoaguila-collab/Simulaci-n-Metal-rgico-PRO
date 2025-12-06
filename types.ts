
export interface SimulationParams {
  granulometry: number; // % passing mesh 200 (finer is higher number)
  collectorDosage: number; // g/t
  ph: number; // 0-14
  h2o2Concentration: number; // % concentration
  leachingTime: number; // hours
}

export interface SimulationResult {
  auRecovery: number; // %
  agRecovery: number; // %
  efficiencyScore: number; // 0-100 calculated metric
  kineticData: { time: number; au: number; ag: number }[]; // For line chart
  radarData: { subject: string; A: number; fullMark: number }[]; // For Radar chart
  costAnalysis: { label: string; value: number; color: string }[];
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
