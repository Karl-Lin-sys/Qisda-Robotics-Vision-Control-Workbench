import React, { useState } from 'react';
import { ROOT_CAUSES_AND_SOLUTIONS } from '../data/qisdaReferenceData';
import { CheckCircle2, BookOpen, GitPullRequest, Wrench } from 'lucide-react';

interface RootCauseSectionProps {
  toddlerMode: boolean;
}

export const RootCauseSection: React.FC<RootCauseSectionProps> = ({ toddlerMode }) => {
  const [verifiedSolutions, setVerifiedSolutions] = useState<Record<string, boolean>>({
    'rc-1-sim2real-multisensor-jitter': true,
    'rc-2-longtail-spatiotemporal-leakage': true,
    'rc-3-edge-memory-fragmentation-ethercat': true,
  });

  const toggleVerified = (id: string) => {
    setVerifiedSolutions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeCount = Object.values(verifiedSolutions).filter(Boolean).length;

  return (
    <section aria-labelledby="heading-root-causes" className="space-y-8">
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500">
              03. Structural Root-Cause Analysis &amp; 3 Theoretical Solutions · 5-Year Peer-Reviewed Papers &amp; Official Issue Trackers
            </p>
            <h2
              id="heading-root-causes"
              className="mt-1 text-2xl font-bold tracking-tight text-slate-900"
              style={{ textWrap: 'balance' }}
            >
              Algorithmic Structural Flaws, Sampling Bias &amp; Primary-Source Remediations
            </h2>
          </div>

          <div className="text-xs font-mono font-semibold text-slate-800 tabular-nums">
            Active Remediations: {activeCount} / 3 Verified
          </div>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          {toddlerMode
            ? 'Sometimes robots get tummy aches if their cameras blink at different times, if they only study easy picture books, or if their memory toy-box gets messy! Here are the 3 real reasons why, and how we fix them for good, eh!'
            : '推測や二次情報（個人ブログ・一般トラブルシューティング記事）を一切排除し、過去5年以内の機械学習査読済み論文およびPyTorch・OpenCV・ROS2/Isaac公式Issueトラッカーで解決済みの一次情報のみに基づき、構造的欠陥とサンプリングバイアスの根本原因および3つの具体的解決策を提示します。'}
        </p>
      </div>

      <div className="space-y-6">
        {ROOT_CAUSES_AND_SOLUTIONS.map((item, idx) => {
          const isChecked = !!verifiedSolutions[item.id];
          return (
            <article
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-6 space-y-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <div className="text-xs font-medium text-slate-500">
                    Root Cause 0{idx + 1} · {item.affectedSubsystems}
                  </div>
                  <h3 className="mt-1 text-lg font-bold text-slate-900">{item.titleJp}</h3>
                </div>

                <button
                  type="button"
                  onClick={() => toggleVerified(item.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    isChecked
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{isChecked ? 'Solution Enforced in Pipeline' : 'Enable Solution in Pipeline'}</span>
                </button>
              </div>

              {toddlerMode ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-semibold text-slate-900">
                    Canadian Toddler Story Explanation (Explain Like I&apos;m 4, Eh!):
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-800">
                    {item.canadianToddlerExplanation}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {/* Structural Flaw & Sampling Bias */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-slate-900">
                      Structural Algorithmic Flaw &amp; Training Data Sampling Bias
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-600 whitespace-pre-line">
                      {item.structuralFlawAndSamplingBias}
                    </p>
                  </div>

                  {/* Theoretical Solution */}
                  <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                      <Wrench className="h-3.5 w-3.5 text-slate-700" aria-hidden="true" />
                      <span>{item.concreteSolutionTitle}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line">
                      {item.mathematicalMechanism}
                    </p>
                    <div className="pt-2 border-t border-slate-200 text-xs font-mono font-semibold text-emerald-800 tabular-nums">
                      Verified Impact: {item.expectedImprovementMetric}
                    </div>
                  </div>
                </div>
              )}

              {/* Primary Sources: Papers & Official GitHub Issue Trackers */}
              <div className="grid grid-cols-1 gap-4 pt-2 border-t border-slate-200 md:grid-cols-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                    <BookOpen className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
                    <span>Peer-Reviewed Primary Literature (Last 5 Years)</span>
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-slate-600">
                    {item.primarySourceCitations.map((cite) => (
                      <li key={cite} className="leading-relaxed">
                        • {cite}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                    <GitPullRequest className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
                    <span>Resolved Official Framework Issue Trackers</span>
                  </div>
                  <ul className="mt-2 space-y-1 text-xs font-mono text-slate-600">
                    {item.officialIssueTrackers.map((issue) => (
                      <li key={issue} className="leading-relaxed">
                        • {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
