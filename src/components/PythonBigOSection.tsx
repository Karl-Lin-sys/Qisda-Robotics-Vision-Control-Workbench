import React, { useState, useMemo } from 'react';
import { PYTHON_REFERENCE_MODULES } from '../data/qisdaReferenceData';
import { simulatePipelineComplexity } from '../utils/roboticsAnalytics';
import { Copy, Check, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';

interface PythonBigOSectionProps {
  toddlerMode: boolean;
}

export const PythonBigOSection: React.FC<PythonBigOSectionProps> = ({ toddlerMode }) => {
  const [activeModuleId, setActiveModuleId] = useState<string>(PYTHON_REFERENCE_MODULES[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Interactive Big-O & Jetson AGX Orin Simulator State
  const [lidarPoints, setLidarPoints] = useState<number>(65536);
  const [bevGridResolution, setBevGridResolution] = useState<number>(128);
  const [controlHorizon, setControlHorizon] = useState<number>(16);
  const [stateDim, setStateDim] = useState<number>(24);
  const [usePreallocatedZeroCopy, setUsePreallocatedZeroCopy] = useState<boolean>(true);

  const activeModule = useMemo(
    () => PYTHON_REFERENCE_MODULES.find((m) => m.id === activeModuleId) || PYTHON_REFERENCE_MODULES[0],
    [activeModuleId]
  );

  const simResult = useMemo(
    () =>
      simulatePipelineComplexity({
        lidarPoints,
        bevGridResolution,
        controlHorizon,
        stateDim,
        usePreallocatedZeroCopy,
      }),
    [lidarPoints, bevGridResolution, controlHorizon, stateDim, usePreallocatedZeroCopy]
  );

  const handleCopyCode = (id: string, code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <section aria-labelledby="heading-python-bigo" className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-medium text-slate-500">
          02. Official Reference Code &amp; Algorithmic Complexity · PyTorch 2.x / OpenCV 4.10 / TensorFlow 2.17 XLA
        </p>
        <h2
          id="heading-python-bigo"
          className="mt-1 text-2xl font-bold tracking-tight text-slate-900"
          style={{ textWrap: 'balance' }}
        >
          Zero-Leak Official Reference Implementations &amp; Big-O Complexity Analysis
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          {toddlerMode
            ? 'Here is our super-tidy computer recipe book! We follow only the official instruction manuals from PyTorch, OpenCV, and TensorFlow so our robot never drops crumbs in its memory or slows down, eh!'
            : '非公式ブログを一切参照せず、PyTorch・OpenCV・TensorFlowの最新公式ドキュメントおよび公式リファレンス実装のみに基づき、メモリリークとCUDA同期ストールを完全に排除した実装コードと計算量（Big-O）解析を提示します。'}
        </p>
      </div>

      {/* Module Selector Tabs */}
      <div
        role="tablist"
        aria-label="Official Reference Python Modules"
        className="flex flex-wrap gap-1.5 rounded-lg bg-slate-100 p-1.5"
      >
        {PYTHON_REFERENCE_MODULES.map((mod) => {
          const isSelected = mod.id === activeModule.id;
          return (
            <button
              key={mod.id}
              role="tab"
              aria-selected={isSelected}
              type="button"
              onClick={() => setActiveModuleId(mod.id)}
              className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {mod.framework}
            </button>
          );
        })}
      </div>

      {/* Selected Module Metadata + Code View */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">{activeModule.title}</h3>
              <p className="mt-1 text-xs text-slate-500 font-mono">
                Official Spec: {activeModule.officialDocsSource}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCopyCode(activeModule.id, activeModule.code)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
            >
              {copiedId === activeModule.id ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  <span>Copied Module</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
                  <span>Copy Python Module</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="text-[11px] font-medium text-slate-500">Time Complexity (Big-O)</div>
              <div className="mt-1 font-mono text-xs font-semibold text-slate-900 tabular-nums">
                {activeModule.timeComplexity}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="text-[11px] font-medium text-slate-500">Space Complexity (Big-O)</div>
              <div className="mt-1 font-mono text-xs font-semibold text-slate-900 tabular-nums">
                {activeModule.spaceComplexity}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="text-[11px] font-medium text-slate-500">
                {toddlerMode ? 'Canadian Toddler Story, Eh!' : 'Anti-Patterns & Memory Leaks Eliminated'}
              </div>
              <div className="mt-1 text-xs text-slate-700 leading-relaxed">
                {toddlerMode ? activeModule.canadianToddlerSummary : activeModule.antiPatternEliminated}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 p-5 overflow-x-auto">
          <pre className="text-xs leading-relaxed text-slate-100 font-mono tabular-nums">
            <code>{activeModule.code}</code>
          </pre>
        </div>
      </div>

      {/* Interactive Big-O & Jetson AGX Orin Real-Time Budget Calculator */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-slate-700" aria-hidden="true" />
              <h3 className="text-base font-bold text-slate-900">
                Interactive Big-O Complexity &amp; Jetson AGX Orin Latency / Memory Verifier
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-600">
              {toddlerMode
                ? 'See how fast our robot brain thinks when we change the number of laser dots or turn on our magic Zero-Copy sharing trick, eh!'
                : '点群数 N、BEVグリッド解像度 H×W、MPC予測ホライズン T、全身関節状態次元 d_x を変更し、Big-O計算量とJetson Orin上の実時間制御予算（≤ 25.0 ms・動的確保0回）を検証します。'}
            </p>
          </div>

          <div className="text-xs font-medium">
            {simResult.meetsRealTimeEtherCatBudget ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                Real-Time Deterministic (Meets 40Hz Perception &amp; 1kHz EtherCAT)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-amber-700">
                <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                Exceeds Real-Time Budget or Dynamic Heap Churn Active
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Sliders */}
          <div className="space-y-4 lg:col-span-5">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <label htmlFor="bigo-lidar-points">LiDAR Point Cloud Size (N_pts)</label>
                <span className="font-mono tabular-nums">{lidarPoints.toLocaleString()} pts</span>
              </div>
              <input
                id="bigo-lidar-points"
                type="range"
                min={16384}
                max={131072}
                step={16384}
                value={lidarPoints}
                onChange={(e) => setLidarPoints(parseInt(e.target.value, 10))}
                className="mt-1.5 w-full accent-slate-900"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <label htmlFor="bigo-bev-grid">BEV Grid Resolution (H = W)</label>
                <span className="font-mono tabular-nums">
                  {bevGridResolution} × {bevGridResolution}
                </span>
              </div>
              <select
                id="bigo-bev-grid"
                value={bevGridResolution}
                onChange={(e) => setBevGridResolution(parseInt(e.target.value, 10))}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-mono text-slate-900"
              >
                <option value={64}>64 × 64 (Compact Indoor AMR)</option>
                <option value={128}>128 × 128 (Qisda Standard Factory/Hospital)</option>
                <option value={256}>256 × 256 (High-Density Long Range)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <label htmlFor="bigo-horizon">Whole-Body Control Horizon (T_mpc)</label>
                <span className="font-mono tabular-nums">{controlHorizon} steps</span>
              </div>
              <input
                id="bigo-horizon"
                type="range"
                min={8}
                max={32}
                step={4}
                value={controlHorizon}
                onChange={(e) => setControlHorizon(parseInt(e.target.value, 10))}
                className="mt-1.5 w-full accent-slate-900"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <label htmlFor="bigo-statedim">Whole-Body State Dimension (d_x)</label>
                <span className="font-mono tabular-nums">{stateDim} DoF</span>
              </div>
              <input
                id="bigo-statedim"
                type="range"
                min={12}
                max={36}
                step={6}
                value={stateDim}
                onChange={(e) => setStateDim(parseInt(e.target.value, 10))}
                className="mt-1.5 w-full accent-slate-900"
              />
            </div>

            <div className="pt-1">
              <label className="flex items-center gap-2.5 text-xs font-medium text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={usePreallocatedZeroCopy}
                  onChange={(e) => setUsePreallocatedZeroCopy(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <span>Enable Pre-Allocated Ring Buffer &amp; DLPack Zero-Copy</span>
              </label>
            </div>
          </div>

          {/* Computed Complexity Outputs */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 p-3.5">
              <div className="text-xs text-slate-500">Perception FLOPs O(N + G²C)</div>
              <div className="mt-1 font-mono text-lg font-bold text-slate-900 tabular-nums">
                {(simResult.perceptionOps / 1e6).toFixed(2)} M
              </div>
              <div className="mt-1 text-[11px] text-slate-500">Pillar scatter + 2D Conv neck</div>
            </div>

            <div className="rounded-lg border border-slate-200 p-3.5">
              <div className="text-xs text-slate-500">WBC Control Ops O(T·d_x³)</div>
              <div className="mt-1 font-mono text-lg font-bold text-slate-900 tabular-nums">
                {(simResult.controlOps / 1e3).toFixed(1)} K
              </div>
              <div className="mt-1 text-[11px] text-slate-500">Riccati + CBF safety filter</div>
            </div>

            <div className="rounded-lg border border-slate-200 p-3.5">
              <div className="text-xs text-slate-500">LWIR+RGB LUT Ops O(W·H)</div>
              <div className="mt-1 font-mono text-lg font-bold text-slate-900 tabular-nums">
                {(simResult.calibrationOps / 1e6).toFixed(2)} M
              </div>
              <div className="mt-1 text-[11px] text-slate-500">CV_16SC2 fixed-point remap</div>
            </div>

            <div className="rounded-lg border border-slate-900 bg-slate-50 p-3.5">
              <div className="text-xs font-semibold text-slate-900">End-to-End Cycle Latency</div>
              <div className="mt-1 font-mono text-lg font-bold text-slate-900 tabular-nums">
                {simResult.estimatedLatencyMs.toFixed(2)} ms
              </div>
              <div className="mt-1 text-[11px] text-slate-600">Target budget: &le; 25.00 ms</div>
            </div>

            <div className="rounded-lg border border-slate-900 bg-slate-50 p-3.5">
              <div className="text-xs font-semibold text-slate-900">Runtime Heap Allocations</div>
              <div className="mt-1 font-mono text-lg font-bold text-slate-900 tabular-nums">
                {simResult.memoryAllocationsPerSec.toLocaleString()} /s
              </div>
              <div className="mt-1 text-[11px] text-slate-600">Target: 0 allocs/s (Zero-Leak)</div>
            </div>

            <div className="rounded-lg border border-slate-200 p-3.5">
              <div className="text-xs text-slate-500">Unified Memory Footprint</div>
              <div className="mt-1 font-mono text-lg font-bold text-slate-900 tabular-nums">
                {simResult.peakVramMb} MB
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                {usePreallocatedZeroCopy ? 'Contiguous static arena' : 'Fragmented heap (+85%)'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
