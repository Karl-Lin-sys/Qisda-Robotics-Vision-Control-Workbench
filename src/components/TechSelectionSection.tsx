import React, { useState, useMemo } from 'react';
import { PEER_REVIEWED_TECH_MATRIX, PeerReviewedTechEntry } from '../data/qisdaReferenceData';
import { computeDeBiasedMetrics } from '../utils/roboticsAnalytics';
import { CheckCircle2, AlertTriangle, ShieldAlert, ExternalLink, Sliders } from 'lucide-react';

interface TechSelectionSectionProps {
  toddlerMode: boolean;
}

export const TechSelectionSection: React.FC<TechSelectionSectionProps> = ({ toddlerMode }) => {
  const [selectedPillar, setSelectedPillar] = useState<'ALL' | PeerReviewedTechEntry['qisdaPillar']>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive De-Biased Evaluation Simulator State
  const [prevalencePct, setPrevalencePct] = useState<number>(0.5); // 0.5% rare event
  const [tprPct, setTprPct] = useState<number>(82);
  const [fprPct, setFprPct] = useState<number>(1.8);
  const [hasTemporalLeakage, setHasTemporalLeakage] = useState<boolean>(false);

  const filteredTech = useMemo(() => {
    return PEER_REVIEWED_TECH_MATRIX.filter((item) => {
      const matchesPillar = selectedPillar === 'ALL' || item.qisdaPillar === selectedPillar;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.methodName.toLowerCase().includes(q) ||
        item.venueAndYear.toLowerCase().includes(q) ||
        item.qisdaRequirementTag.toLowerCase().includes(q) ||
        item.githubRepo.toLowerCase().includes(q);
      return matchesPillar && matchesQuery;
    });
  }, [selectedPillar, searchQuery]);

  const metrics = useMemo(() => {
    return computeDeBiasedMetrics({
      totalSamples: 20000,
      positivePrevalence: prevalencePct / 100,
      truePositiveRate: tprPct / 100,
      falsePositiveRate: fprPct / 100,
      hasTemporalLeakage,
    });
  }, [prevalencePct, tprPct, fprPct, hasTemporalLeakage]);

  return (
    <section aria-labelledby="heading-tech-selection" className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-medium text-slate-500">
          01. Peer-Reviewed Architecture Selection · CVPR / ICCV / ECCV / NeurIPS / RSS / ICRA (2023–2026)
        </p>
        <h2
          id="heading-tech-selection"
          className="mt-1 text-2xl font-bold tracking-tight text-slate-900"
          style={{ textWrap: 'balance' }}
        >
          Qisda Machine Vision &amp; Robotics R&amp;D Technology Selection Matrix
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          {toddlerMode
            ? 'Hey there, little buddy! Here is how we pick the smartest, safest brain-tools for our Qisda helper robot in Taoyuan, using only real science tested by the top robot teachers in the world, eh!'
            : '過去3年以内のトップカンファレンス査読済み論文およびGitHub高再現性リポジトリ（Star数上位）のみに基づき、佳世達科技（Qisda）機器視覚製品中心の3大開発領域（自律システム・全身運動制御・光機電熱ハードウェア統合）の最適技術を客観比較します。'}
        </p>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          role="group"
          aria-label="Filter by Qisda Robotics R&D Pillar"
          className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1"
        >
          {[
            { id: 'ALL', label: 'All 3 R&D Pillars (6)' },
            { id: 'PERCEPTION_SLAM', label: '1. Perception & SLAM' },
            { id: 'LOCOMOTION_WBC', label: '2. Locomotion & WBC' },
            { id: 'HARDWARE_EDGE_USD', label: '3. Optical, Jetson & OpenUSD' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedPillar(tab.id as typeof selectedPillar)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                selectedPillar === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <label htmlFor="tech-search-input" className="sr-only">
            Search peer-reviewed methods or sensors
          </label>
          <input
            id="tech-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by sensor (LiDAR, LWIR, Isaac)..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
          />
        </div>
      </div>

      {/* High-Density Comparison Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        {filteredTech.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-medium text-slate-700">No matching peer-reviewed architectures found.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedPillar('ALL');
                setSearchQuery('');
              }}
              className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <th className="py-3 pl-4 pr-3 font-semibold">Method &amp; Primary Venue</th>
                <th className="px-3 py-3 font-semibold">Qisda JD Requirement Mapping</th>
                <th className="px-3 py-3 font-semibold">GitHub Repo &amp; Reproducibility</th>
                <th className="px-3 py-3 font-semibold">De-Biased Metric &amp; Protocol</th>
                <th className="px-3 py-3 font-semibold text-right">Big-O &amp; Orin Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTech.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors align-top">
                  <td className="py-3.5 pl-4 pr-3">
                    <div className="font-semibold text-slate-900 text-sm">{item.methodName}</div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      <span>{item.venueAndYear}</span>
                      <span aria-hidden="true"> · </span>
                      <span>Selected Architecture</span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed max-w-xs">{item.paperTitle}</p>
                  </td>

                  <td className="px-3 py-3.5">
                    <div className="font-medium text-slate-800">{item.qisdaRequirementTag}</div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600 max-w-md">
                      {toddlerMode ? item.canadianToddlerExplanation : item.technicalRationaleJp}
                    </p>
                  </td>

                  <td className="px-3 py-3.5 font-mono tabular-nums">
                    <a
                      href={`https://github.com/${item.githubRepo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-slate-900 underline decoration-slate-300 hover:decoration-slate-900"
                    >
                      {item.githubRepo}
                      <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                    </a>
                    <div className="mt-1 text-slate-500">
                      Stars: {item.githubStars} · {item.reproducibilityGrade}
                    </div>
                  </td>

                  <td className="px-3 py-3.5 max-w-xs">
                    <div className="font-mono font-semibold text-slate-900 tabular-nums">
                      {item.primaryMetricValue}
                    </div>
                    <div className="text-slate-500 mt-0.5">{item.primaryMetricName}</div>
                    <p className="mt-1 text-slate-600 leading-relaxed">{item.deBiasedProtocol}</p>
                  </td>

                  <td className="py-3.5 pl-3 pr-4 text-right font-mono tabular-nums">
                    <div className="font-semibold text-slate-900">{item.jetsonOrinFp16LatencyMs.toFixed(2)} ms</div>
                    <div className="mt-0.5 text-slate-500">Time: {item.timeComplexityBigO}</div>
                    <div className="text-slate-500">Space: {item.spaceComplexityBigO}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Interactive De-Biased Evaluation & Data Leakage Simulator */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-slate-700" aria-hidden="true" />
              <h3 className="text-base font-bold text-slate-900">
                Interactive Data Leakage &amp; Class-Imbalance Evaluation Auditor
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-600">
              {toddlerMode
                ? 'Try moving the sliders, buddy! See why guessing "everything is fine" looks like 99% on a normal test, but our special MCC and AUPRC scores catch the trick right away, eh!'
                : 'フレーム単位ランダム分割による時空間データリージェージ（Frame-Level Leakage）および希少異常クラス不均衡（Long-Tail Imbalance）がAccuracy/AUROCに与えるバイアスを定量検証します。'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium">
            {metrics.verdict === 'OBJECTIVE_VALID' && (
              <span className="inline-flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                Status: Objective &amp; De-Biased Evaluation
              </span>
            )}
            {metrics.verdict === 'IMBALANCE_ILLUSION' && (
              <span className="inline-flex items-center gap-1.5 text-amber-700">
                <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                Warning: High-Accuracy Class Imbalance Illusion Detected
              </span>
            )}
            {metrics.verdict === 'LEAKAGE_CONTAMINATED' && (
              <span className="inline-flex items-center gap-1.5 text-red-700">
                <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
                Critical: Spatiotemporal Frame Leakage Active
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Controls Column */}
          <div className="space-y-4 lg:col-span-5">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <label htmlFor="slider-prevalence">
                  Rare Event Prevalence (Obstacle / Thermal Anomaly)
                </label>
                <span className="font-mono tabular-nums">{prevalencePct.toFixed(1)}%</span>
              </div>
              <input
                id="slider-prevalence"
                type="range"
                min={0.2}
                max={10.0}
                step={0.2}
                value={prevalencePct}
                onChange={(e) => setPrevalencePct( parseFloat(e.target.value) )}
                className="mt-1.5 w-full accent-slate-900"
              />
              <p className="text-[11px] text-slate-500">
                In factory/hospital logs, emergency obstacles occur in &lt;1% of frames (20,000 total frames).
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <label htmlFor="slider-tpr">True Positive Rate (Model Sensitivity / Recall)</label>
                <span className="font-mono tabular-nums">{tprPct}%</span>
              </div>
              <input
                id="slider-tpr"
                type="range"
                min={30}
                max={99}
                step={1}
                value={tprPct}
                onChange={(e) => setTprPct(parseInt(e.target.value, 10))}
                className="mt-1.5 w-full accent-slate-900"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <label htmlFor="slider-fpr">False Positive Rate (False Brake Rate per Frame)</label>
                <span className="font-mono tabular-nums">{fprPct.toFixed(1)}%</span>
              </div>
              <input
                id="slider-fpr"
                type="range"
                min={0.1}
                max={8.0}
                step={0.1}
                value={fprPct}
                onChange={(e) => setFprPct(parseFloat(e.target.value))}
                className="mt-1.5 w-full accent-slate-900"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2.5 text-xs font-medium text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasTemporalLeakage}
                  onChange={(e) => setHasTemporalLeakage(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <span>Simulate Naive Frame-Level Random Split (Temporal Leakage)</span>
              </label>
              <p className="mt-1 pl-6 text-[11px] text-slate-500">
                When checked, adjacent 30Hz video frames leak across Train/Test, artificially inflating test scores via background memorization.
              </p>
            </div>
          </div>

          {/* Metrics Comparison Column */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 p-3.5">
                <div className="text-xs text-slate-500">Naive Accuracy (Biased)</div>
                <div className="mt-1 font-mono text-xl font-bold text-slate-900 tabular-nums">
                  {(metrics.accuracy * 100).toFixed(2)}%
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  Dominated by {metrics.tn.toLocaleString()} True Negatives
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 p-3.5">
                <div className="text-xs text-slate-500">AUROC (Optimistic)</div>
                <div className="mt-1 font-mono text-xl font-bold text-slate-900 tabular-nums">
                  {(metrics.aurocApprox * 100).toFixed(2)}%
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  Insensitive to FP count when TN is huge
                </div>
              </div>

              <div className="rounded-lg border border-slate-900 bg-slate-50 p-3.5">
                <div className="text-xs font-semibold text-slate-900">Matthews Corr. (MCC)</div>
                <div className="mt-1 font-mono text-xl font-bold text-slate-900 tabular-nums">
                  {metrics.mcc.toFixed(3)}
                </div>
                <div className="mt-1 text-[11px] text-slate-600">
                  Objective balanced score (-1 to +1)
                </div>
              </div>

              <div className="rounded-lg border border-slate-900 bg-slate-50 p-3.5">
                <div className="text-xs font-semibold text-slate-900">AUPRC (PR-AUC)</div>
                <div className="mt-1 font-mono text-xl font-bold text-slate-900 tabular-nums">
                  {(metrics.auprcApprox * 100).toFixed(2)}%
                </div>
                <div className="mt-1 text-[11px] text-slate-600">
                  Gold standard for rare safety events
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 p-3.5">
                <div className="text-xs text-slate-500">Precision (PPV)</div>
                <div className="mt-1 font-mono text-xl font-bold text-slate-900 tabular-nums">
                  {(metrics.precision * 100).toFixed(2)}%
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  TP: {metrics.tp} · FP: {metrics.fp}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 p-3.5">
                <div className="text-xs text-slate-500">Accuracy-MCC Bias Gap</div>
                <div className="mt-1 font-mono text-xl font-bold text-amber-700 tabular-nums">
                  +{(metrics.biasInflationDelta * 100).toFixed(1)} pt
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  FN Missed Hazards: {metrics.fn}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-700 leading-relaxed">
              <span className="font-semibold text-slate-900">Engineering Takeaway: </span>
              At <span className="font-mono tabular-nums">{prevalencePct.toFixed(1)}%</span> obstacle prevalence and{' '}
              <span className="font-mono tabular-nums">{fprPct.toFixed(1)}%</span> FPR, Naive Accuracy reports{' '}
              <span className="font-mono font-semibold tabular-nums">{(metrics.accuracy * 100).toFixed(2)}%</span>{' '}
              despite generating <span className="font-mono font-semibold tabular-nums">{metrics.fp}</span> false emergency stops against only{' '}
              <span className="font-mono font-semibold tabular-nums">{metrics.tp}</span> real detections (Precision ={' '}
              <span className="font-mono font-semibold tabular-nums">{(metrics.precision * 100).toFixed(1)}%</span>, MCC ={' '}
              <span className="font-mono font-semibold tabular-nums">{metrics.mcc.toFixed(3)}</span>). All Qisda perception gates enforce{' '}
              <span className="font-semibold">Episode-Blocked AUPRC &ge; 0.80</span> and <span className="font-semibold">MCC &ge; 0.75</span>.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
