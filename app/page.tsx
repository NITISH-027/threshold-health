'use client';

import React, { useState } from 'react';
import { PatientWorkspace } from '../src/components/workspace/PatientWorkspace';
import { ScrollCinematic } from '../src/components/cinematic/ScrollCinematic';

export default function Home() {
  const [openConflictOnStart, setOpenConflictOnStart] = useState(false);

  const handleScrollToWorkspace = (openConflict: boolean = false) => {
    if (openConflict) {
      setOpenConflictOnStart(true);
    }
    const el = document.getElementById('workspace-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-[#F4F4F6] flex flex-col font-sans selection:bg-white/20 selection:text-white">
      {/* Global Navigation Header (Minimal, Apple-Caliber Precision) */}
      <header className="h-10 bg-[#08090C]/90 border-b border-white/[0.07] text-xs px-4 sm:px-6 flex items-center justify-between text-zinc-400 backdrop-blur-xl sticky top-0 z-40 select-none">
        {/* Left: THRESHOLD / Longitudinal History Reconstruction (Click to scroll to top) */}
        <button
          onClick={handleScrollToTop}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity text-left bg-transparent border-none p-0"
          title="Scroll to top / Replay intro"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="font-mono font-medium tracking-[0.08em] text-white uppercase text-[11px]">
            THRESHOLD
          </span>
          <span className="text-zinc-600 font-light">/</span>
          <span className="text-[11px] text-zinc-400 font-normal tracking-tight hidden sm:inline">
            Longitudinal Health Synthesis
          </span>
        </button>

        {/* Center: Ramaswamy K. (TN-UHID-88412) · 15 Records · 1 Conflict · 1 Gap */}
        <div className="hidden md:flex items-center gap-2.5 font-mono text-[11px] text-zinc-400">
          <span className="text-zinc-200 font-medium tracking-tight">Ramaswamy K. (TN-UHID-88412)</span>
          <span className="text-zinc-600">·</span>
          <span>15 Records</span>
          <span className="text-zinc-600">·</span>
          <span className="text-[#E04838] font-medium">1 Safety Conflict</span>
          <span className="text-zinc-600">·</span>
          <span className="text-[#F59E0B] font-medium">10.9-mo Gap</span>
        </div>

        {/* Right: Telemetry / Engine Status Indicator */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
          <span className="hidden sm:inline text-zinc-400">Cross-Facility EMR Engine</span>
          <span className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-zinc-300 text-[10px]">
            v2.4
          </span>
        </div>
      </header>

      {/* Scroll-Driven Canvas Cinematic Section */}
      <div id="cinematic-section" className="w-full">
        <ScrollCinematic
          onComplete={(openConflict) => handleScrollToWorkspace(Boolean(openConflict))}
          onSkip={() => handleScrollToWorkspace(false)}
        />
      </div>

      {/* Main Patient Workspace - Direct Continuous Vertical Flow */}
      <div id="workspace-section" className="w-full min-h-screen relative z-10">
        <PatientWorkspace initialConflictOpen={openConflictOnStart} />
      </div>
    </div>
  );
}
