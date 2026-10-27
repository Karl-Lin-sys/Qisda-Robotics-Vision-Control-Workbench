export interface ConfusionMatrixInput {
  totalSamples: number;
  positivePrevalence: number;
  truePositiveRate: number;
  falsePositiveRate: number;
  hasTemporalLeakage: boolean;
}

export interface EvaluationMetricsResult {
  tp: number;
  fp: number;
  tn: number;
  fn: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  mcc: number;
  aurocApprox: number;
  auprcApprox: number;
  biasInflationDelta: number;
  verdict: 'OBJECTIVE_VALID' | 'IMBALANCE_ILLUSION' | 'LEAKAGE_CONTAMINATED';
}

export function computeDeBiasedMetrics(input: ConfusionMatrixInput): EvaluationMetricsResult {
  const N = Math.max(100, Math.round(input.totalSamples));
  const p = Math.min(0.5, Math.max(0.0005, input.positivePrevalence));

  const effectiveTpr = input.hasTemporalLeakage
    ? Math.min(0.995, input.truePositiveRate + (1 - input.truePositiveRate) * 0.65)
    : Math.min(0.999, Math.max(0.01, input.truePositiveRate));

  const effectiveFpr = input.hasTemporalLeakage
    ? Math.max(0.0005, input.falsePositiveRate * 0.2)
    : Math.min(0.99, Math.max(0.0005, input.falsePositiveRate));

  const positives = Math.max(1, Math.round(N * p));
  const negatives = Math.max(1, N - positives);

  const tp = Math.min(positives, Math.max(0, Math.round(positives * effectiveTpr)));
  const fn = positives - tp;
  const fp = Math.min(negatives, Math.max(0, Math.round(negatives * effectiveFpr)));
  const tn = negatives - fp;

  const accuracy = (tp + tn) / (tp + tn + fp + fn);
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = positives > 0 ? tp / positives : 0;
  const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  const denom = Math.sqrt((tp + fp) * (tp + fn) * (tn + fp) * (tn + fn));
  const mcc = denom > 0 ? (tp * tn - fp * fn) / denom : 0;

  const aurocApprox = Math.min(1, Math.max(0, 0.5 * (recall + (1 - fp / negatives))));
  const auprcApprox = Math.min(1, Math.max(0, 0.5 * (precision + recall) * precision + (1 - recall) * p));

  const biasInflationDelta = Math.max(0, accuracy - mcc);

  let verdict: EvaluationMetricsResult['verdict'] = 'OBJECTIVE_VALID';
  if (input.hasTemporalLeakage) {
    verdict = 'LEAKAGE_CONTAMINATED';
  } else if (accuracy > 0.95 && (precision < 0.5 || mcc < 0.55)) {
    verdict = 'IMBALANCE_ILLUSION';
  }

  return {
    tp,
    fp,
    tn,
    fn,
    accuracy,
    precision,
    recall,
    f1Score,
    mcc,
    aurocApprox,
    auprcApprox,
    biasInflationDelta,
    verdict,
  };
}

export interface ComplexitySimulationInput {
  lidarPoints: number;
  bevGridResolution: number;
  controlHorizon: number;
  stateDim: number;
  usePreallocatedZeroCopy: boolean;
}

export interface ComplexitySimulationResult {
  perceptionOps: number;
  controlOps: number;
  calibrationOps: number;
  estimatedLatencyMs: number;
  peakVramMb: number;
  memoryAllocationsPerSec: number;
  meetsRealTimeEtherCatBudget: boolean;
}

export function simulatePipelineComplexity(input: ComplexitySimulationInput): ComplexitySimulationResult {
  const N = Math.max(1024, input.lidarPoints);
  const G = Math.max(32, input.bevGridResolution);
  const T = Math.max(4, input.controlHorizon);
  const dx = Math.max(6, input.stateDim);
  const du = Math.max(6, Math.round(dx * 0.75));
  const C = 64;

  const perceptionOps = N * 16 + G * G * C * 9;
  const controlOps = T * (Math.pow(dx, 3) + Math.pow(dx, 2) * du);
  const calibrationOps = 1280 * 720 * 4;

  const copyPenaltyMs = input.usePreallocatedZeroCopy ? 0 : (N * 16 * 4) / 1e6 + (G * G * C * 4) / 1.5e6 + 6.8;

  const computeMs =
    perceptionOps / 4.2e6 +
    controlOps / 1.8e6 +
    calibrationOps / 8.0e6 +
    copyPenaltyMs;

  const estimatedLatencyMs = Number(computeMs.toFixed(2));

  const baseVramMb = (N * 16 * 4 + G * G * C * 4 * 4 + 1280 * 720 * 8) / (1024 * 1024) + 380;
  const fragmentationMultiplier = input.usePreallocatedZeroCopy ? 1.0 : 1.85;
  const peakVramMb = Math.round(baseVramMb * fragmentationMultiplier);

  const memoryAllocationsPerSec = input.usePreallocatedZeroCopy ? 0 : 30 * 14 + 1000 * 3;
  const meetsRealTimeEtherCatBudget = estimatedLatencyMs <= 25.0 && input.usePreallocatedZeroCopy;

  return {
    perceptionOps,
    controlOps,
    calibrationOps,
    estimatedLatencyMs,
    peakVramMb,
    memoryAllocationsPerSec,
    meetsRealTimeEtherCatBudget,
  };
}

export interface LegalAuditInput {
  containsProprietaryCadOrBom: boolean;
  containsUnredactedFacesOrPii: boolean;
  spdxLicense: 'Apache-2.0' | 'MIT' | 'GPL-3.0-unapproved' | 'None';
  includesUnfilteredMilSpecThermalWeights: boolean;
  nistControlsImplementedCount: number;
}

export interface LegalAuditResult {
  isLegallyClearForGithub: boolean;
  complianceScore: number;
  violations: string[];
  passedChecks: string[];
  recommendedLicenseHeader: string;
}

export function evaluateTaiwanLegalAndNistCompliance(input: LegalAuditInput): LegalAuditResult {
  const violations: string[] = [];
  const passedChecks: string[] = [];
  let score = 100;

  if (input.containsProprietaryCadOrBom) {
    violations.push(
      'Violation of Taiwan Trade Secret Act (營業秘密法第2條・第10條): Proprietary Pro/E CAD assemblies, ODM BOM tables, or unapproved factory calibration parameters detected.'
    );
    score -= 35;
  } else {
    passedChecks.push(
      'Taiwan Trade Secret Act (營業秘密法第2條): Clean room reference implementation using only public OpenUSD primitives and synthetic calibration matrices.'
    );
  }

  if (input.containsUnredactedFacesOrPii) {
    violations.push(
      'Violation of Taiwan Personal Data Protection Act (個人資料保護法第6條・第19條): Unredacted hospital patient/worker faces or HR applicant PII present in dataset/logs.'
    );
    score -= 30;
  } else {
    passedChecks.push(
      'Taiwan PDPA (個人資料保護法): All RGB/LWIR frames and recruitment metadata scrubbed of biometric and personal identifiers.'
    );
  }

  if (input.spdxLicense === 'GPL-3.0-unapproved' || input.spdxLicense === 'None') {
    violations.push(
      'Violation of Taiwan Copyright Act (著作權法第37條) & Corporate IP Policy: Missing permissive SPDX license or copyleft contamination risking proprietary EtherCAT firmware disclosure.'
    );
    score -= 20;
  } else {
    passedChecks.push(
      `Taiwan Copyright Act (著作權法第37條): Explicit ${input.spdxLicense} SPDX license header verified across all PyTorch/TensorFlow/OpenCV reference modules.`
    );
  }

  if (input.includesUnfilteredMilSpecThermalWeights) {
    violations.push(
      'Violation of Taiwan Foreign Trade Act (貿易法第13條 - 戰略性高科技貨品 SHTC): Dual-use LWIR target-tracking weights require MOEA export classification review.'
    );
    score -= 15;
  } else {
    passedChecks.push(
      'Taiwan Foreign Trade Act (貿易法第13條 SHTC): LWIR thermal module restricted to industrial BMS heat dissipation & medical fever screening ranges (30°C–120°C).'
    );
  }

  const clampedNist = Math.min(6, Math.max(0, input.nistControlsImplementedCount));
  if (clampedNist < 6) {
    violations.push(
      `NIST CSF 2.0 Gap: Only ${clampedNist}/6 core cybersecurity functions verified (GOVERN, IDENTIFY, PROTECT, DETECT, RESPOND, RECOVER required).`
    );
    score -= (6 - clampedNist) * 5;
  } else {
    passedChecks.push(
      'NIST CSF 2.0 Complete (6/6 Functions): GOVERN, IDENTIFY, PROTECT, DETECT, RESPOND, and RECOVER controls active.'
    );
  }

  const complianceScore = Math.max(0, score);
  const isLegallyClearForGithub = violations.length === 0 && complianceScore === 100;

  return {
    isLegallyClearForGithub,
    complianceScore,
    violations,
    passedChecks,
    recommendedLicenseHeader: `SPDX-License-Identifier: ${input.spdxLicense === 'MIT' ? 'MIT' : 'Apache-2.0'}`,
  };
}
