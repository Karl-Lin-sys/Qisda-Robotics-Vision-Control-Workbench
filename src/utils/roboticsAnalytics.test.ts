import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeDeBiasedMetrics,
  simulatePipelineComplexity,
  evaluateTaiwanLegalAndNistCompliance,
} from './roboticsAnalytics';

test('computeDeBiasedMetrics detects class imbalance illusion when accuracy is high but precision/MCC is low', () => {
  const res = computeDeBiasedMetrics({
    totalSamples: 10000,
    positivePrevalence: 0.005, // 50 positive rare anomalies, 9950 normal frames
    truePositiveRate: 0.70,
    falsePositiveRate: 0.02, // 199 false positives -> precision = 35 / (35 + 199) = 14.9%
    hasTemporalLeakage: false,
  });

  assert.equal(res.accuracy > 0.97, true);
  assert.equal(res.precision < 0.25, true);
  assert.equal(res.verdict, 'IMBALANCE_ILLUSION');
});

test('computeDeBiasedMetrics flags temporal leakage when adjacent video frames leak across splits', () => {
  const clean = computeDeBiasedMetrics({
    totalSamples: 10000,
    positivePrevalence: 0.02,
    truePositiveRate: 0.75,
    falsePositiveRate: 0.01,
    hasTemporalLeakage: false,
  });

  const leaked = computeDeBiasedMetrics({
    totalSamples: 10000,
    positivePrevalence: 0.02,
    truePositiveRate: 0.75,
    falsePositiveRate: 0.01,
    hasTemporalLeakage: true,
  });

  assert.equal(leaked.verdict, 'LEAKAGE_CONTAMINATED');
  assert.equal(leaked.mcc > clean.mcc, true);
});

test('simulatePipelineComplexity enforces zero-copy preallocation for real-time EtherCAT budget', () => {
  const zeroCopy = simulatePipelineComplexity({
    lidarPoints: 65536,
    bevGridResolution: 128,
    controlHorizon: 16,
    stateDim: 18,
    usePreallocatedZeroCopy: true,
  });

  const naiveCopy = simulatePipelineComplexity({
    lidarPoints: 65536,
    bevGridResolution: 128,
    controlHorizon: 16,
    stateDim: 18,
    usePreallocatedZeroCopy: false,
  });

  assert.equal(zeroCopy.memoryAllocationsPerSec, 0);
  assert.equal(zeroCopy.meetsRealTimeEtherCatBudget, true);
  assert.equal(naiveCopy.memoryAllocationsPerSec > 0, true);
  assert.equal(naiveCopy.estimatedLatencyMs > zeroCopy.estimatedLatencyMs, true);
  assert.equal(naiveCopy.peakVramMb > zeroCopy.peakVramMb, true);
});

test('evaluateTaiwanLegalAndNistCompliance passes only when all Taiwan statutes and 6 NIST functions are satisfied', () => {
  const compliant = evaluateTaiwanLegalAndNistCompliance({
    containsProprietaryCadOrBom: false,
    containsUnredactedFacesOrPii: false,
    spdxLicense: 'Apache-2.0',
    includesUnfilteredMilSpecThermalWeights: false,
    nistControlsImplementedCount: 6,
  });

  assert.equal(compliant.isLegallyClearForGithub, true);
  assert.equal(compliant.complianceScore, 100);
  assert.equal(compliant.violations.length, 0);

  const nonCompliant = evaluateTaiwanLegalAndNistCompliance({
    containsProprietaryCadOrBom: true,
    containsUnredactedFacesOrPii: true,
    spdxLicense: 'None',
    includesUnfilteredMilSpecThermalWeights: false,
    nistControlsImplementedCount: 4,
  });

  assert.equal(nonCompliant.isLegallyClearForGithub, false);
  assert.equal(nonCompliant.complianceScore < 50, true);
  assert.equal(nonCompliant.violations.length, 4);
});
