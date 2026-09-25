'use client';

import React, { useState } from 'react';
import { PatientWorkspace } from '../src/components/workspace/PatientWorkspace';
import { ScrollCinematic } from '../src/components/cinematic/ScrollCinematic';

export default function Home() {
  const [showCinematic, setShowCinematic] = useState(true);

  const handleCinematicComplete = () => {
    setShowCinematic(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-[#F4F4F6] flex flex-col font-sans selection:bg-white/20 selection:text-white">
      {/* Global Navigation Header (Minimal, Apple-Caliber Precision) */}
      <header className="h-10 bg-[#08090C]/90 border-b border-white/[0.07] text-xs px-4 sm:px-6 flex items-center justify-between text-zinc-400 backdrop-blur-xl sticky top-0 z-40 select-none">
        {/* Left: THRESHOLD / Longitudinal History Reconstruction */}
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="font-mono font-medium tracking-[0.08em] text-white uppercase text-[11px]">
            THRESHOLD
          </span>
          <span className="text-zinc-600 font-light">/</span>
          <span className="text-[11px] text-zinc-400 font-normal tracking-tight hidden sm:inline">
            Longitudinal Health Synthesis
          </span>
        </div>

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

      {/* Scroll-Driven Canvas Cinematic Overlay */}
      {showCinematic && (
        <ScrollCinematic
          onComplete={handleCinematicComplete}
          onSkip={handleCinematicComplete}
        />
      )}

      {/* Main Patient Workspace - Lands Directly on Dashboard */}
      <div className={`flex-1 ${showCinematic ? 'hidden' : 'block'}`}>
        <PatientWorkspace onReplayCinematic={() => setShowCinematic(true)} />
      </div>
    </div>
  );
}
