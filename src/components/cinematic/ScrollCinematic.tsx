'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Lenis from 'lenis';
import { AlertTriangle, ArrowRight, ChevronDown, FastForward, Loader2 } from 'lucide-react';

interface ScrollCinematicProps {
  onComplete: (openConflictModal?: boolean) => void;
  onSkip?: () => void;
}

const TOTAL_FRAMES = 123; // 80 frames alignment (0-79) + 43 frames conflict (80-122)

/**
 * Resolves frame image URLs based on index:
 * - Frames 0 to 79: /01_alignment/ezgif-frame-001.jpg through ezgif-frame-080.jpg
 * - Frames 80 to 122: /02_conflict/ezgif-frame-001.jpg through ezgif-frame-043.jpg
 */
export function getFrameUrl(index: number): string {
  if (index < 80) {
    const frameNum = String(index + 1).padStart(3, '0');
    return `/01_alignment/ezgif-frame-${frameNum}.jpg`;
  } else {
    const frameNum = String(index - 79).padStart(3, '0');
    return `/02_conflict/ezgif-frame-${frameNum}.jpg`;
  }
}

interface CachedLayout {
  drawWidth: number;
  drawHeight: number;
  offsetX: number;
  offsetY: number;
  canvasWidth: number;
  canvasHeight: number;
}

/**
 * Computes smooth segment opacity for narrative overlay acts:
 * Fades in over fadeSpan, holds at 1, and fades out over fadeSpan (unless segment ends at 1.0).
 */
function calculateSegmentOpacity(
  progress: number,
  start: number,
  end: number,
  fadeSpan: number = 0.04
): number {
  if (progress < start || progress > end) return 0;
  if (progress < start + fadeSpan) {
    return (progress - start) / fadeSpan;
  }
  if (end < 0.999 && progress > end - fadeSpan) {
    return (end - progress) / fadeSpan;
  }
  return 1;
}

export const ScrollCinematic: React.FC<ScrollCinematicProps> = ({
  onComplete,
  onSkip,
}) => {
  // DOM References
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Overlay DOM refs for direct DOM mutation (ZERO React state in scroll loop)
  const storyContainerRef = useRef<HTMLDivElement>(null);
  const act1Ref = useRef<HTMLDivElement>(null);
  const act2Ref = useRef<HTMLDivElement>(null);
  const act3Ref = useRef<HTMLDivElement>(null);
  const act4Ref = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const scrubTrackRef = useRef<HTMLDivElement>(null);
  const telemetryFrameRef = useRef<HTMLSpanElement>(null);

  // Hardware-accelerated pre-decoded ImageBitmaps
  const bitmapsRef = useRef<(ImageBitmap | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const cachedLayoutRef = useRef<CachedLayout>({
    drawWidth: 0,
    drawHeight: 0,
    offsetX: 0,
    offsetY: 0,
    canvasWidth: 0,
    canvasHeight: 0,
  });

  // Zero React State in Scroll Loop: Pure ref progress and frame pointers
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const lastRenderedFrameRef = useRef<number>(-1);
  const isTransitioningRef = useRef<boolean>(false);
  const naturalDimensionsRef = useRef<{ width: number; height: number }>({ width: 1920, height: 1080 });

  // Preloading progress state (only used ONCE during initial asset decode before scroll begins)
  const [loadPercentage, setLoadPercentage] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  /**
   * Recalculates canvas sizing and pre-computes aspect-fill / cover layout.
   * Cached to avoid executing math inside the 60fps draw loop.
   */
  const updateLayout = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    const canvasWidth = displayWidth * dpr;
    const canvasHeight = displayHeight * dpr;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    const imgWidth = naturalDimensionsRef.current.width;
    const imgHeight = naturalDimensionsRef.current.height;

    const canvasAspect = canvasWidth / canvasHeight;
    const imgAspect = imgWidth / imgHeight;

    let drawWidth: number;
    let drawHeight: number;
    let offsetX: number;
    let offsetY: number;

    if (canvasAspect > imgAspect) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgAspect;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * imgAspect;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = 0;
    }

    cachedLayoutRef.current = {
      drawWidth,
      drawHeight,
      offsetX,
      offsetY,
      canvasWidth,
      canvasHeight,
    };

    // Re-draw current frame after resize
    if (lastRenderedFrameRef.current >= 0) {
      const bitmap = bitmapsRef.current[lastRenderedFrameRef.current];
      const ctx = ctxRef.current;
      if (ctx && bitmap) {
        ctx.drawImage(bitmap, offsetX, offsetY, drawWidth, drawHeight);
      }
    }
  }, []);

  /**
   * Trigger transition into the workspace with fade-out
   */
  const triggerTransition = useCallback((openConflictModal: boolean) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete(openConflictModal);
    }, 700);
  }, [onComplete]);

  /**
   * Hardware-Accelerated Progressive Preloader:
   * Uses fetch -> blob -> createImageBitmap to offload image decoding to background threads.
   * Progressively unlocks the canvas at 10% (12 frames) so users on Vercel never wait for 100%.
   */
  useEffect(() => {
    let isCancelled = false;
    let isUnlocked = false;
    const INITIAL_BURST_FRAMES = 12; // 10% gate to unlock canvas immediately

    // Concurrency controlled preload queue
    const preloadAllFrames = async () => {
      let loaded = 0;
      const CONCURRENCY = 12;
      const indices = Array.from({ length: TOTAL_FRAMES }, (_, i) => i);

      const loadSingleFrame = async (i: number) => {
        try {
          const url = getFrameUrl(i);
          const res = await fetch(url);
          const blob = await res.blob();
          const bitmap = await createImageBitmap(blob);

          if (isCancelled) return;

          bitmapsRef.current[i] = bitmap;

          // Record dimensions from first frame
          if (i === 0) {
            naturalDimensionsRef.current = {
              width: bitmap.width || 1920,
              height: bitmap.height || 1080,
            };
            updateLayout();
            // Draw frame 0 immediately to eliminate black flash
            const ctx = ctxRef.current;
            const layout = cachedLayoutRef.current;
            if (ctx && layout.drawWidth > 0) {
              ctx.drawImage(bitmap, layout.offsetX, layout.offsetY, layout.drawWidth, layout.drawHeight);
              lastRenderedFrameRef.current = 0;
            }
          }

          loaded++;
          const pct = Math.round((loaded / TOTAL_FRAMES) * 100);
          setLoadPercentage(pct);

          // Progressive unlock: unlock interactive canvas as soon as the first 12 frames (10%) are ready
          if (!isUnlocked && loaded >= INITIAL_BURST_FRAMES) {
            isUnlocked = true;
            setIsReady(true);
            updateLayout();
          }
        } catch (err) {
          console.error(`Failed to load frame ${i}:`, err);
        }
      };

      // Process in batches
      for (let i = 0; i < indices.length; i += CONCURRENCY) {
        if (isCancelled) break;
        const batch = indices.slice(i, i + CONCURRENCY);
        await Promise.all(batch.map((idx) => loadSingleFrame(idx)));

        // Ensure canvas is unlocked after first batch finishes regardless
        if (!isUnlocked && loaded >= Math.min(INITIAL_BURST_FRAMES, indices.length)) {
          isUnlocked = true;
          setIsReady(true);
          updateLayout();
        }
      }

      if (!isCancelled && !isUnlocked) {
        setIsReady(true);
        updateLayout();
      }
    };

    preloadAllFrames();

    return () => {
      isCancelled = true;
      // Close all ImageBitmaps on unmount to free GPU memory
      bitmapsRef.current.forEach((bm) => bm?.close());
    };
  }, [updateLayout]);

  /**
   * Lenis Smooth Scroll & Independent 60 FPS RAF Lerp Engine
   */
  useEffect(() => {
    if (!canvasRef.current) return;

    // Optimized context flags
    const ctx = canvasRef.current.getContext('2d', {
      alpha: false,
      desynchronized: true,
    });
    ctxRef.current = ctx;

    updateLayout();
    window.addEventListener('resize', updateLayout);

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: true,
    });

    const updateScrollTarget = (scrollY: number) => {
      if (!containerRef.current) return;
      const totalScrollable = containerRef.current.scrollHeight - window.innerHeight;
      if (totalScrollable > 0) {
        targetProgressRef.current = Math.max(0, Math.min(1, scrollY / totalScrollable));
      }
    };

    lenis.on('scroll', (e: { scroll: number }) => {
      updateScrollTarget(e.scroll);
    });

    // Fallback native scroll listener
    const onNativeScroll = () => {
      updateScrollTarget(window.scrollY || window.pageYOffset);
    };
    window.addEventListener('scroll', onNativeScroll, { passive: true });

    let rafId: number;

    // 60 FPS Continuous Animation Loop
    const loop = (time: number) => {
      lenis.raf(time);

      // Smooth inertia damping
      currentProgressRef.current +=
        (targetProgressRef.current - currentProgressRef.current) * 0.08;

      const progress = currentProgressRef.current;

      // Frame selection: Math.min(122, Math.floor(progress * 123))
      const targetFrame = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(progress * TOTAL_FRAMES)));

      // Render only when frame index changes
      if (targetFrame !== lastRenderedFrameRef.current) {
        let bitmap = bitmapsRef.current[targetFrame];

        // Graceful Frame Fallback: If target frame is still downloading, render closest loaded frame
        if (!bitmap) {
          // Search backwards for the most recent decoded frame
          for (let f = targetFrame - 1; f >= 0; f--) {
            if (bitmapsRef.current[f]) {
              bitmap = bitmapsRef.current[f];
              break;
            }
          }
          // Secondary fallback: search forwards if user scrolled backwards
          if (!bitmap) {
            for (let f = targetFrame + 1; f < TOTAL_FRAMES; f++) {
              if (bitmapsRef.current[f]) {
                bitmap = bitmapsRef.current[f];
                break;
              }
            }
          }
        }

        const activeCtx = ctxRef.current;
        const layout = cachedLayoutRef.current;

        if (activeCtx && bitmap && layout.drawWidth > 0) {
          activeCtx.drawImage(
            bitmap,
            layout.offsetX,
            layout.offsetY,
            layout.drawWidth,
            layout.drawHeight
          );
          lastRenderedFrameRef.current = targetFrame;
        }
      }

      // --- ZERO REACT STATE: Direct DOM mutations for 4-act narrative overlay ---
      const op1 = calculateSegmentOpacity(progress, 0.05, 0.25, 0.04);
      const op2 = calculateSegmentOpacity(progress, 0.30, 0.55, 0.05);
      const op3 = calculateSegmentOpacity(progress, 0.60, 0.78, 0.04);
      const op4 = calculateSegmentOpacity(progress, 0.82, 1.00, 0.05);

      const maxStoryOp = Math.max(op1, op2, op3, op4);

      if (storyContainerRef.current) {
        storyContainerRef.current.style.opacity = maxStoryOp.toFixed(3);
        const cardInner = storyContainerRef.current.firstElementChild as HTMLElement | null;
        if (cardInner) {
          if (op4 > 0.15) {
            cardInner.style.borderColor = 'rgba(255, 77, 77, 0.5)';
            cardInner.style.boxShadow =
              '0 0 35px -5px rgba(255, 77, 77, 0.3), 0 25px 50px -12px rgba(0, 0, 0, 0.85)';
          } else {
            cardInner.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            cardInner.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.85)';
          }
        }
      }

      if (act1Ref.current) {
        act1Ref.current.style.opacity = op1.toFixed(3);
        act1Ref.current.style.transform = `translateY(${((1 - op1) * 8).toFixed(1)}px)`;
      }

      if (act2Ref.current) {
        act2Ref.current.style.opacity = op2.toFixed(3);
        act2Ref.current.style.transform = `translateY(${((1 - op2) * 8).toFixed(1)}px)`;
      }

      if (act3Ref.current) {
        act3Ref.current.style.opacity = op3.toFixed(3);
        act3Ref.current.style.transform = `translateY(${((1 - op3) * 8).toFixed(1)}px)`;
      }

      if (act4Ref.current) {
        act4Ref.current.style.opacity = op4.toFixed(3);
        act4Ref.current.style.transform = `translateY(${((1 - op4) * 8).toFixed(1)}px)`;
        act4Ref.current.style.pointerEvents = op4 > 0.25 ? 'auto' : 'none';
      }

      // Scroll Down Prompt: Fades out after initial scroll (0 to 0.04)
      if (scrollIndicatorRef.current) {
        const indOpacity = progress < 0.04 ? 1 - progress / 0.04 : 0;
        scrollIndicatorRef.current.style.opacity = indOpacity.toFixed(2);
      }

      // Bottom Scrub Progress Track
      if (scrubTrackRef.current) {
        scrubTrackRef.current.style.width = `${(progress * 100).toFixed(1)}%`;
      }

      // Telemetry Frame Text
      if (telemetryFrameRef.current) {
        telemetryFrameRef.current.textContent = `Frame ${targetFrame + 1} / ${TOTAL_FRAMES} · 60 FPS`;
      }

      // Auto-hand-off when reaching the very end of playback (0.995)
      if (progress >= 0.995 && !isTransitioningRef.current) {
        triggerTransition(false);
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.removeEventListener('resize', updateLayout);
      window.removeEventListener('scroll', onNativeScroll);
    };
  }, [updateLayout, triggerTransition]);

  return (
    <div
      ref={containerRef}
      className={`relative h-[450vh] bg-[#090A0D] text-[#E2E4E9] select-none transition-opacity duration-700 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Sticky Fullscreen Canvas Viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full object-cover block transition-opacity duration-500 ${
            isReady ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Ambient Dark Gradient Vignette for Depth */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#090A0D]/70 via-transparent to-[#090A0D]/60" />

        {/* Minimal Percentage Loader (only shown while decoding ImageBitmaps into GPU memory) */}
        {!isReady && (
          <div className="absolute inset-0 z-40 bg-[#090A0D] flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#111318] border border-[#1E222B] flex items-center justify-center text-[#2DD4BF]">
              <Loader2 className="w-5 h-5 animate-spin text-[#2DD4BF]" />
            </div>
            <div>
              <span className="text-xs font-mono tracking-widest text-[#E2E4E9] uppercase font-bold">
                THRESHOLD // DECODING HARDWARE BITMAPS
              </span>
              <p className="text-xs font-mono text-[#8B949E] mt-1">
                Streaming pre-rendered frames for zero-lag 60 FPS playback
              </p>
            </div>
            {/* Progress bar */}
            <div className="w-48 h-1 bg-[#1E222B] rounded-full overflow-hidden">
              <div
                style={{ width: `${loadPercentage}%` }}
                className="h-full bg-gradient-to-r from-[#2DD4BF] to-[#E04838] transition-all duration-150"
              />
            </div>
            <span className="text-[11px] font-mono text-[#2DD4BF] font-semibold">
              {loadPercentage}%
            </span>

            {/* Instant Fail-Safe Bypass Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  if (onSkip) onSkip();
                  else triggerTransition(false);
                }}
                className="group px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] hover:border-white/[0.25] text-xs font-mono text-zinc-300 hover:text-white transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-lg"
              >
                <span>[ Skip to Workspace → ]</span>
                <FastForward className="w-3.5 h-3.5 text-[#2DD4BF] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* Top Minimal Telemetry & Skip Button */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-auto z-20">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E04838] animate-pulse" />
            <div className="flex flex-col">
              <span className="text-xs font-mono tracking-widest text-[#E2E4E9] uppercase font-semibold">
                THRESHOLD // KINETIC ENGINE
              </span>
              <span
                ref={telemetryFrameRef}
                className="text-[10px] font-mono text-[#8B949E]"
              >
                Frame 1 / 123 · 60 FPS
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              if (onSkip) onSkip();
              else triggerTransition(false);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-[#111318]/80 hover:bg-[#181B22] border border-[#1E222B] hover:border-[#2DD4BF]/50 text-xs font-mono text-[#8B949E] hover:text-[#E2E4E9] backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
          >
            <span>[ Skip to Workspace ]</span>
            <FastForward className="w-3.5 h-3.5 text-[#2DD4BF]" />
          </button>
        </div>

        {/* Cinematic Step-by-Step Narrative Subtitle Overlay (Controlled via Direct DOM Mutation) */}
        <div
          ref={storyContainerRef}
          style={{ opacity: 0 }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[90%] text-center pointer-events-none transition-opacity duration-150 will-change-transform"
        >
          <div className="bg-[#080B11]/75 backdrop-blur-xl border border-white/[0.08] rounded-2xl px-6 py-5 shadow-2xl transition-all duration-300">
            <div className="grid grid-cols-1 items-center justify-center">
              
              {/* Act I: Fragmentation (Progress 0.05 to 0.25) */}
              <div
                ref={act1Ref}
                style={{ opacity: 0, transform: 'translateY(8px)' }}
                className="col-start-1 row-start-1 flex flex-col items-center justify-center transition-all duration-75"
              >
                <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-[#00F2FE]">
                  CHENNAI, TAMIL NADU · 2019 – 2025
                </span>
                <h2 className="text-lg md:text-xl font-medium tracking-tight text-[#F1F3F9] mt-1">
                  4 Care Networks. 7 Years. Zero Connection.
                </h2>
                <p className="text-xs md:text-sm text-[#A0A5B5] leading-relaxed mt-1.5 max-w-xl">
                  Every clinic handed Ramaswamy another paper slip. None shared his medical history.
                </p>
              </div>

              {/* Act II: Alignment (Progress 0.30 to 0.55) */}
              <div
                ref={act2Ref}
                style={{ opacity: 0, transform: 'translateY(8px)' }}
                className="col-start-1 row-start-1 flex flex-col items-center justify-center transition-all duration-75"
              >
                <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-[#00F2FE]">
                  LONGITUDINAL RECONSTRUCTION
                </span>
                <h2 className="text-lg md:text-xl font-medium tracking-tight text-[#F1F3F9] mt-1">
                  Connecting 15 Scattered Records.
                </h2>
                <p className="text-xs md:text-sm text-[#A0A5B5] leading-relaxed mt-1.5 max-w-xl">
                  Discharge summaries, blood panels, and handwritten notes aligned into one continuous life sequence.
                </p>
              </div>

              {/* Act III: The Timeline (Progress 0.60 to 0.78) */}
              <div
                ref={act3Ref}
                style={{ opacity: 0, transform: 'translateY(8px)' }}
                className="col-start-1 row-start-1 flex flex-col items-center justify-center transition-all duration-75"
              >
                <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-[#00F2FE]">
                  CHRONOLOGICAL INTELLIGENCE
                </span>
                <h2 className="text-lg md:text-xl font-medium tracking-tight text-[#F1F3F9] mt-1">
                  Understanding What Changed and When.
                </h2>
                <p className="text-xs md:text-sm text-[#A0A5B5] leading-relaxed mt-1.5 max-w-xl">
                  Tracing health trajectory across six years—until the records reach November 4, 2022.
                </p>
              </div>

              {/* Act IV: The Conflict Anomaly (Progress 0.82 to 1.00) */}
              <div
                ref={act4Ref}
                style={{ opacity: 0, transform: 'translateY(8px)', pointerEvents: 'none' }}
                className="col-start-1 row-start-1 flex flex-col items-center justify-center transition-all duration-75"
              >
                <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-[#FF4D4D] flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D4D] animate-ping inline-block" />
                  CRITICAL SAFETY DISCREPANCY · 04-NOV-2022
                </span>
                <h2 className="text-lg md:text-xl font-medium tracking-tight text-[#F1F3F9] mt-1">
                  A Silent Medication Collision.
                </h2>
                <p className="text-xs md:text-sm text-[#A0A5B5] leading-relaxed mt-1.5 max-w-xl">
                  Apollo discharged him with Metformin. That same afternoon, Mylapore Clinic strictly ordered Metformin stopped due to kidney risk. Taking both risks toxic lactic acidosis.
                </p>
                <div className="mt-3.5 pt-0.5 pointer-events-auto">
                  <button
                    onClick={() => triggerTransition(false)}
                    className="group relative px-6 py-2.5 rounded-full bg-[#0A0D14]/90 hover:bg-[#151926] backdrop-blur-md border border-[#FF3366]/70 hover:border-[#FF3366] text-white text-xs font-mono tracking-wider uppercase font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,51,102,0.45)] shadow-[0_0_20px_rgba(255,51,102,0.25)] cursor-pointer flex items-center gap-2.5 mx-auto transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#FF3366] animate-pulse" />
                    <span>[ RECONSTRUCT RAMASWAMY&apos;S TIMELINE → ]</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FF5A82] transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Initial Scroll Prompt Indicator (Direct DOM mutated opacity) */}
        <div
          ref={scrollIndicatorRef}
          style={{ opacity: 1 }}
          className="absolute bottom-10 left-0 right-0 flex flex-col items-center justify-center pointer-events-none animate-bounce text-[#8B949E] transition-opacity duration-300"
        >
          <span className="text-[11px] font-mono tracking-wider uppercase text-[#8B949E]/80 mb-1">
            Scroll down to explore reconstruction
          </span>
          <ChevronDown className="w-4 h-4 text-[#2DD4BF]" />
        </div>

        {/* Bottom Timeline Phase Progress Bar */}
        <div className="absolute bottom-3 left-6 right-6 z-20 flex items-center justify-between text-[10px] font-mono text-[#8B949E] select-none pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
            <span className="text-[#E2E4E9]">Phase 1: Multi-Facility Alignment</span>
          </div>

          {/* Visual Scrub Track */}
          <div className="h-[2px] flex-1 mx-6 bg-[#1E222B] relative rounded-full overflow-hidden">
            <div
              ref={scrubTrackRef}
              style={{ width: '0%' }}
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#2DD4BF] to-[#E04838]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E04838]" />
            <span className="text-[#E04838]">Phase 2: Discrepancy Synthesis</span>
          </div>
        </div>
      </div>
    </div>
  );
};
