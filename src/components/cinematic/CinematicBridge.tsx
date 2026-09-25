'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  AlertTriangle,
  FastForward,
  Volume2,
  VolumeX,
  Play,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface CinematicBridgeProps {
  onComplete: (openConflictModal?: boolean) => void;
  onSkip?: () => void;
}

export const CinematicBridge: React.FC<CinematicBridgeProps> = ({
  onComplete,
  onSkip,
}) => {
  const [currentVideo, setCurrentVideo] = useState<1 | 2>(1);
  const [isVideo2Ready, setIsVideo2Ready] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasStarted, setHasStarted] = useState(true);

  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  // Attempt autoplay on mount
  useEffect(() => {
    if (video1Ref.current) {
      video1Ref.current
        .play()
        .then(() => setHasStarted(true))
        .catch(() => {
          // If browser policy blocks unmuted/autoplay, keep ready for click
          setHasStarted(false);
        });
    }
  }, []);

  // When Video 1 ends, trigger cross-dissolve to Video 2
  const handleVideo1Ended = () => {
    setCurrentVideo(2);
    if (video2Ref.current) {
      video2Ref.current.currentTime = 0;
      video2Ref.current.play().catch((err) => console.log('Video 2 play catch:', err));
    }
  };

  // When Video 2 ends, freeze on final frame and reveal the prompt
  const handleVideo2Ended = () => {
    if (video2Ref.current) {
      // Pause at final frame
      video2Ref.current.pause();
    }
    setIsCompleted(true);
  };

  // Handle clicking the centered reconstruction prompt
  const handleProceedToReconstruction = () => {
    setIsFadingOut(true);
    // Smooth fade out over 800ms before unlocking workspace and launching ConflictModal
    setTimeout(() => {
      onComplete(true);
    }, 800);
  };

  // Handle skip button
  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onSkip) {
        onSkip();
      } else {
        onComplete(false);
      }
    }, 800);
  };

  // Toggle audio
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (video1Ref.current) video1Ref.current.muted = nextMuted;
    if (video2Ref.current) video2Ref.current.muted = nextMuted;
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#090A0D] flex items-center justify-center overflow-hidden transition-opacity duration-800 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Video Layer 1: 01_alignment.mp4 */}
      <video
        ref={video1Ref}
        src="/assets/video/01_alignment.mp4"
        playsInline
        muted={isMuted}
        autoPlay
        onEnded={handleVideo1Ended}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
          currentVideo === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
        }`}
      />

      {/* Video Layer 2: 02_conflict.mp4 */}
      <video
        ref={video2Ref}
        src="/assets/video/02_conflict.mp4"
        playsInline
        muted={isMuted}
        preload="auto"
        onCanPlay={() => setIsVideo2Ready(true)}
        onEnded={handleVideo2Ended}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
          currentVideo === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
        }`}
      />

      {/* Cinematic Vignette & Grain Overlay */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-15 bg-gradient-to-t from-[#090A0D]/60 via-transparent to-[#090A0D]/50" />

      {/* Top Left: Editorial System Watermark */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-3 select-none pointer-events-none">
        <div className="w-2.5 h-2.5 rounded-full bg-[#E04838] animate-pulse" />
        <div className="flex flex-col">
          <span className="text-xs font-mono tracking-widest text-[#E2E4E9]/80 uppercase font-semibold">
            THRESHOLD // TIMELINE RECONSTRUCTION
          </span>
          <span className="text-[10px] font-mono text-[#8B949E]">
            RAMASWAMY K. · TN-UHID-88412 · LONGITUDINAL CHRONOLOGY
          </span>
        </div>
      </div>

      {/* Top Right: Unobtrusive Skip to Workspace Button & Sound Toggle */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <button
          onClick={toggleMute}
          className="p-2 rounded-lg bg-[#111318]/70 hover:bg-[#181B22] border border-[#1E222B] text-[#8B949E] hover:text-[#E2E4E9] backdrop-blur-md transition-all cursor-pointer"
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#2DD4BF]" />}
        </button>

        <button
          onClick={handleSkip}
          className="px-3.5 py-1.5 rounded-lg bg-[#111318]/80 hover:bg-[#181B22] border border-[#1E222B] hover:border-[#2DD4BF]/40 text-xs font-medium text-[#8B949E] hover:text-[#E2E4E9] backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
        >
          <span>Skip to Workspace</span>
          <FastForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Timeline Phase Progress Tracker */}
      <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between text-[11px] font-mono text-[#8B949E] select-none pointer-events-none">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              currentVideo === 1 ? 'bg-[#2DD4BF] animate-pulse' : 'bg-[#2DD4BF]/40'
            }`}
          />
          <span className={currentVideo === 1 ? 'text-[#E2E4E9]' : 'text-[#8B949E]'}>
            Phase 1: Multi-Facility Alignment
          </span>
        </div>

        <div className="h-[1px] flex-1 mx-6 bg-[#1E222B]/80" />

        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              currentVideo === 2 ? 'bg-[#E04838] animate-pulse' : 'bg-[#1E222B]'
            }`}
          />
          <span className={currentVideo === 2 ? 'text-[#E04838]' : 'text-[#8B949E]'}>
            Phase 2: Discrepancy Synthesis
          </span>
        </div>
      </div>

      {/* Frozen Final Frame State: Centered Overlay Prompt */}
      {isCompleted && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-[#090A0D]/40 backdrop-blur-[2px] transition-all duration-700 animate-in fade-in zoom-in-95">
          <div className="max-w-md w-full flex flex-col items-center text-center space-y-5">
            {/* Subtle Hazard Eyebrow */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#E04838]/15 border border-[#E04838]/30 text-[#E04838] text-xs font-mono uppercase tracking-wider shadow-sm animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-[#E04838]" />
              <span>Cross-Facility Pharmacological Discrepancy</span>
            </div>

            {/* Core Prompt Action Button */}
            <button
              onClick={handleProceedToReconstruction}
              className="group relative px-6 py-4 rounded-xl border border-[#E04838]/60 bg-[#090A0D]/80 hover:bg-[#111318]/95 backdrop-blur-md text-[#E2E4E9] font-mono text-sm tracking-wider uppercase font-semibold transition-all duration-300 hover:border-[#E04838] hover:shadow-[0_0_30px_rgba(224,72,56,0.35)] cursor-pointer flex items-center gap-3 transform hover:scale-[1.02] active:scale-[0.99]"
            >
              {/* Subtle pulsing background glow */}
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#E04838]/10 via-[#E04838]/20 to-[#E04838]/10 opacity-0 group-hover:opacity-100 transition-opacity" />

              <span className="w-2 h-2 rounded-full bg-[#E04838] animate-pulse" />
              <span className="relative z-10">[ CONFLICT DETECTED · VIEW RECONSTRUCTION ]</span>
              <ArrowRight className="w-4 h-4 text-[#E04838] transform group-hover:translate-x-1 transition-transform relative z-10" />
            </button>

            {/* Context Subtext */}
            <p className="text-xs text-[#8B949E] max-w-sm leading-relaxed">
              Concurrent discharge directive from <span className="text-[#E2E4E9]">Apollo Hospitals</span> clashes with outpatient prescription at <span className="text-[#E2E4E9]">Mylapore Clinic</span> on 2022-11-04.
            </p>
          </div>
        </div>
      )}

      {/* Manual Click to Play in case Browser blocks Initial Autoplay */}
      {!hasStarted && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/80">
          <button
            onClick={() => {
              if (video1Ref.current) {
                video1Ref.current.play();
                setHasStarted(true);
              }
            }}
            className="px-6 py-3 rounded-xl bg-[#2DD4BF] text-[#090A0D] font-bold text-sm flex items-center gap-2 shadow-2xl cursor-pointer hover:bg-[#26bba8] transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Cinematic Reconstruction</span>
          </button>
        </div>
      )}
    </div>
  );
};
