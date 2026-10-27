/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TechSelectionSection } from './components/TechSelectionSection';
import { PythonBigOSection } from './components/PythonBigOSection';
import { RootCauseSection } from './components/RootCauseSection';
import { NistAndLegalGithubSection } from './components/NistAndLegalGithubSection';
import { Sparkles, BookOpen, Shield, Code2, Cpu } from 'lucide-react';

export default function App() {
  const [toddlerMode, setToddlerMode] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'ALL' | 'TECH' | 'CODE' | 'ROOT_CAUSE' | 'NIST_LEGAL'>('ALL');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-8 border-b border-slate-200 bg-white/95 backdrop-blur px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveView('ALL');
          }}
          className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
        >
          Qisda Robotics Vision &amp; Control
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav aria-label="Primary Sections" className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
          <a
            href="#section-architecture"
            onClick={() => setActiveView('ALL')}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Architecture
          </a>
          <a
            href="#section-code"
            onClick={() => setActiveView('ALL')}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Official Code &amp; Big-O
          </a>
          <a
            href="#section-root-causes"
            onClick={() => setActiveView('ALL')}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Root Causes
          </a>
          <a
            href="#section-nist-legal"
            onClick={() => setActiveView('ALL')}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            NIST &amp; Taiwan Law
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <a
            href="#section-nist-legal"
            onClick={() => setActiveView('ALL')}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            Verify GitHub Export
          </a>
        </div>
      </header>

      {/* Main Content Container */}
      <main id="top" className="mx-auto w-full max-w-7xl flex-1 px-6 py-8 space-y-10">
        {/* Hero & Workspace Mode Bar */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3 max-w-3xl">
              <div className="text-xs font-medium text-slate-500">
                佳世達科技股份有限公司 (Qisda Corp.) · 機器人研究開發工程師【機器視覺產品中心】 · Taoyuan Guishan R&amp;D
              </div>
              <h1
                className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900"
                style={{ textWrap: 'balance' }}
              >
                {toddlerMode
                  ? 'How We Build Polite, Super-Safe Helper Robots in Taoyuan, Eh!'
                  : 'Peer-Reviewed Robotics Architecture, Zero-Leak Reference Code & NIST CSF 2.0 Verification'}
              </h1>
              <p className="text-sm leading-relaxed text-slate-600">
                {toddlerMode
                  ? 'Good day, little buddy! Put on your warm toque and grab a hot chocolate! This workbench shows how Qisda builds smart helper robots for hospitals and factories—using laser eyes (LiDAR), warm night-goggles (LWIR), gentle skating legs (Whole-Body Control), 6 safety shields (NIST CSF 2.0), and polite Taiwan laws before sharing on GitHub, eh!'
                  : '過去3年以内のトップカンファレンス（CVPR / ICCV / ECCV / NeurIPS / RSS / ICRA）査読済み論文・GitHub高再現性実装に基づく技術選定、PyTorch / TensorFlow / OpenCV公式ドキュメント準拠のメモリリークゼロPython実装とBig-O解析、5年以内の一次情報に基づく3大根本原因解決策、NIST CSF 2.0および台湾法準拠GitHub公開スイート。'}
              </p>
            </div>

            {/* Register Switcher: Engineering vs. Canadian Toddler Mode */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <div className="text-xs font-semibold text-slate-700">Explanation Register Mode</div>
              <div
                role="group"
                aria-label="Toggle Canadian English Toddler Explanation Mode"
                className="inline-flex rounded-lg bg-slate-100 p-1"
              >
                <button
                  type="button"
                  onClick={() => setToddlerMode(false)}
                  className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    !toddlerMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  PhD / R&amp;D Engineering Spec
                </button>
                <button
                  type="button"
                  onClick={() => setToddlerMode(true)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    toddlerMode ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>Canadian Toddler Mode (Eh!)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Canadian English Toddler Story Callout — Always accessible + interactive full-page toggle */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-bold text-slate-900">
                Canadian English Toddler Guide (Explain Like I&apos;m 4, Eh!) · {toddlerMode ? 'Full-Page Toddler Mode Active' : 'Summary View'}
              </div>
              <button
                type="button"
                onClick={() => setToddlerMode((prev) => !prev)}
                className="text-xs font-semibold text-slate-900 underline decoration-slate-400 hover:decoration-slate-900 whitespace-nowrap shrink-0"
              >
                {toddlerMode ? 'Switch Tables Back to PhD Spec' : 'Translate All Tables & Code Notes to Toddler Mode, Eh!'}
              </button>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-6 md:grid-cols-4 text-xs leading-relaxed text-slate-600">
              <div>
                <span className="font-semibold text-slate-900">1. Smart Eyes &amp; Boots: </span>
                Our Qisda helper robot uses colour cameras, laser rulers (LiDAR), and cosy heat-goggles (LWIR) so it can walk politely through hospitals and factories without bumping into a loonie on the floor, eh!
              </div>
              <div>
                <span className="font-semibold text-slate-900">2. No Peeking at Answers: </span>
                We never let the robot cheat by looking at the same storybook page twice (No Data Leakage), and we make sure it spots super-rare puddles (De-Biased AUPRC &amp; MCC)!
              </div>
              <div>
                <span className="font-semibold text-slate-900">3. Tidy Toy-Box Speed (Big-O): </span>
                Every Lego block has its own spot in the toy box ahead of time (`@torch.inference_mode` &amp; `DLPack`), so the robot never drops crumbs in its memory!
              </div>
              <div>
                <span className="font-semibold text-slate-900">4. 6 Safety Shields &amp; Taiwan Laws: </span>
                We follow all 6 NIST safety shields (Govern, Identify, Protect, Detect, Respond, Recover) and Taiwan’s polite laws before sharing our code on GitHub, buddy!
              </div>
            </div>
          </div>

          {/* Full-Width 4-Column Qisda Spec KPI Strip (Hairline dividers, zero nested cards) */}
          <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:divide-x sm:divide-slate-200">
            <div className="sm:pr-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>1. Autonomous Perception &amp; SLAM</span>
                <BookOpen className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              </div>
              <div className="mt-1.5 font-mono text-sm font-bold text-slate-900 tabular-nums">
                LiDAR · RGB-D · LWIR · IMU
              </div>
              <div className="mt-1 text-xs text-slate-600">
                BEVFusion + FAST-LIO2 + FoundationPose
              </div>
            </div>

            <div className="sm:px-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>2. Whole-Body Control &amp; Isaac</span>
                <Cpu className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              </div>
              <div className="mt-1.5 font-mono text-sm font-bold text-slate-900 tabular-nums">
                1000 Hz EtherCAT · OpenUSD
              </div>
              <div className="mt-1 text-xs text-slate-600">
                Isaac Lab WBC-RL + Diffusion Policy + CBF-QP
              </div>
            </div>

            <div className="sm:px-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>3. Edge Memory &amp; Big-O Budget</span>
                <Code2 className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              </div>
              <div className="mt-1.5 font-mono text-sm font-bold text-slate-900 tabular-nums">
                0 B/s Leak · p99.9 &lt; 1.2 ms
              </div>
              <div className="mt-1 text-xs text-slate-600">
                Jetson Orin NITROS DLPack + CV_16SC2 LUT
              </div>
            </div>

            <div className="sm:pl-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>4. NIST CSF 2.0 &amp; Taiwan Law</span>
                <Shield className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              </div>
              <div className="mt-1.5 font-mono text-sm font-bold text-slate-900 tabular-nums">
                6/6 NIST · 4 R.O.C. Statutes
              </div>
              <div className="mt-1 text-xs text-slate-600">
                營業秘密法 · 個資法 · 著作權法 · SHTC Compliant
              </div>
            </div>
          </div>

          {/* Workspace View Filter Bar */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <span className="text-xs font-medium text-slate-500">Workspace View Filter:</span>
            <div role="group" aria-label="Workspace Section Filter" className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
              {[
                { id: 'ALL', label: 'Show All 4 Engineering Sections' },
                { id: 'TECH', label: '01. Tech Comparison & Metrics' },
                { id: 'CODE', label: '02. Official Python & Big-O' },
                { id: 'ROOT_CAUSE', label: '03. Root Causes & 3 Solutions' },
                { id: 'NIST_LEGAL', label: '04. NIST CSF 2.0 & Taiwan GitHub' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setActiveView(btn.id as typeof activeView)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    activeView === btn.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Section 1: Peer-Reviewed Tech Comparison & De-Biased Metrics */}
        {(activeView === 'ALL' || activeView === 'TECH') && (
          <div id="section-architecture">
            <TechSelectionSection toddlerMode={toddlerMode} />
          </div>
        )}

        {/* Section 2: Official Python Code & Big-O Complexity */}
        {(activeView === 'ALL' || activeView === 'CODE') && (
          <div id="section-code">
            <PythonBigOSection toddlerMode={toddlerMode} />
          </div>
        )}

        {/* Section 3: Root Causes & 3 Concrete Solutions */}
        {(activeView === 'ALL' || activeView === 'ROOT_CAUSE') && (
          <div id="section-root-causes">
            <RootCauseSection toddlerMode={toddlerMode} />
          </div>
        )}

        {/* Section 4: NIST CSF 2.0 & Taiwan Legal Compliance GitHub Upload */}
        {(activeView === 'ALL' || activeView === 'NIST_LEGAL') && (
          <div id="section-nist-legal">
            <NistAndLegalGithubSection toddlerMode={toddlerMode} />
          </div>
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-5 text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div>
            Qisda Robotics Vision &amp; Control Workbench · SPDX-License-Identifier: Apache-2.0
          </div>
          <div>
            NIST CSF 2.0 (GV/ID/PR/DE/RS/RC) · R.O.C. (Taiwan) Trade Secret Act &amp; PDPA Verified
          </div>
        </div>
      </footer>
    </div>
  );
}
