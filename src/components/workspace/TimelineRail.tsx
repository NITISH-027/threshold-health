'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Pill,
  TrendingUp,
  Clock,
  Building2,
  Calendar,
  Sparkles,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { TimelineEvent, MedicalRecord } from '../../types/medical';
import { PATIENT_PT2041_RECORDS } from '../../data/patientPT2041';
import { generateTimeline } from '../../lib/reasoningEngine';

interface TimelineRailProps {
  records?: MedicalRecord[];
  events?: TimelineEvent[];
  selectedEventId?: string | null;
  onSelectEvent: (event: TimelineEvent) => void;
  onOpenConflictModal?: () => void;
}

export const TimelineRail: React.FC<TimelineRailProps> = ({
  records = PATIENT_PT2041_RECORDS,
  events: propEvents,
  selectedEventId,
  onSelectEvent,
  onOpenConflictModal,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'conflict' | 'medication' | 'gap' | 'trend'>('all');
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  // Generate or use passed events
  const allEvents = useMemo(() => {
    return propEvents || generateTimeline(records);
  }, [propEvents, records]);

  // Timeline boundaries (2019 to 2025)
  const startTime = useMemo(() => new Date('2019-01-01T00:00:00Z').getTime(), []);
  const endTime = useMemo(() => new Date('2025-07-01T00:00:00Z').getTime(), []);
  const totalDuration = endTime - startTime;

  const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025];

  // Calculate percentage along the rail
  const getPercent = (dateStr: string) => {
    const time = new Date(dateStr).getTime();
    const pct = ((time - startTime) / totalDuration) * 100;
    return Math.max(2, Math.min(98, pct));
  };

  // Coordinates for the 10.9-month temporal gap between REC-2023-001 and REC-2024-001
  const gapStartPercent = getPercent('2023-03-20T13:45:00Z');
  const gapEndPercent = getPercent('2024-02-15T18:20:00Z');
  const gapWidthPercent = gapEndPercent - gapStartPercent;

  // Filter events based on active tab
  const filteredEvents = useMemo(() => {
    // Exclude synthetic duplicate events from direct rendering on the line,
    // keeping distinct clinical touchpoints plus the conflict and gap markers
    const primaryEvents = allEvents.filter((e) => !e.id.startsWith('EVT-CONF-'));

    return primaryEvents.filter((event) => {
      if (filterType === 'all') return true;
      if (filterType === 'conflict') return event.flags.conflict;
      if (filterType === 'medication') return event.flags.medicationChange;
      if (filterType === 'gap') return event.flags.missing || event.type === 'missing_interval_marker';
      if (filterType === 'trend') return event.flags.trend;
      return true;
    });
  }, [allEvents, filterType]);

  const handleNodeClick = (event: TimelineEvent) => {
    onSelectEvent(event);
    if (event.flags.conflict && onOpenConflictModal) {
      onOpenConflictModal();
    }
  };

  return (
    <div className="w-full bg-[#0F131D]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:border-white/[0.16] hover:bg-[#141926]/85 transition-all duration-300 rounded-2xl p-4 sm:p-5 min-w-0">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-white/[0.06] gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-[#2DD4BF]">
            <Clock className="w-4 h-4 stroke-[1.3]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium tracking-tight text-white">
                Longitudinal Chronology
              </h3>
              <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
                2019 – 2025
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-normal tracking-[-0.01em]">
              15 Multi-Institutional Encounters across 4 Systems
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-white/[0.06] text-xs overflow-x-auto max-w-full scrollbar-none">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-full transition-all whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-white/[0.1] text-white font-medium shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All (15)
          </button>
          <button
            onClick={() => setFilterType('conflict')}
            className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all whitespace-nowrap ${
              filterType === 'conflict'
                ? 'bg-[#E04838]/20 text-[#E04838] border border-[#E04838]/40 font-medium'
                : 'text-zinc-400 hover:text-[#E04838]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E04838]" />
            Conflicts (1)
          </button>
          <button
            onClick={() => setFilterType('medication')}
            className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all whitespace-nowrap ${
              filterType === 'medication'
                ? 'bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/40 font-medium'
                : 'text-zinc-400 hover:text-[#2DD4BF]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
            Med Change
          </button>
          <button
            onClick={() => setFilterType('gap')}
            className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all whitespace-nowrap ${
              filterType === 'gap'
                ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40 font-medium'
                : 'text-zinc-400 hover:text-[#F59E0B]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
            10.9mo Gap
          </button>
          <button
            onClick={() => setFilterType('trend')}
            className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all whitespace-nowrap ${
              filterType === 'trend'
                ? 'bg-[#818CF8]/20 text-[#818CF8] border border-[#818CF8]/40 font-medium'
                : 'text-zinc-400 hover:text-[#818CF8]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#818CF8]" />
            Labs (3)
          </button>
        </div>
      </div>

      {/* Main Horizontal Timeline Canvas */}
      <div className="relative mt-8 mb-4 pt-10 pb-8 px-4 overflow-x-auto min-h-[160px] select-none">
        <div className="relative min-w-[760px] w-full h-16 flex items-center">
          {/* Continuous Baseline Track */}
          <div className="absolute left-0 right-0 h-[2px] bg-[#1E222B]" />

          {/* Temporal Gap: 10.9-Month Dashed Segment between March 2023 and Feb 2024 */}
          <div
            style={{
              left: `${gapStartPercent}%`,
              width: `${gapWidthPercent}%`,
            }}
            className="absolute h-8 -top-3 flex flex-col items-center justify-center cursor-pointer group z-0"
            onClick={() => {
              const gapEvent = allEvents.find((e) => e.flags.missing || e.type === 'missing_interval_marker');
              if (gapEvent) onSelectEvent(gapEvent);
            }}
            title="10.9-Month Temporal Surveillance Void (Mar 2023 - Feb 2024)"
          >
            {/* Dashed Bridge Line */}
            <div className="w-full h-0 border-t-2 border-dashed border-[#F59E0B]/70 group-hover:border-[#F59E0B] transition-colors" />

            {/* Gap Warning Label */}
            <div className="absolute -top-6 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[10px] font-mono text-[#F59E0B] whitespace-nowrap group-hover:scale-105 transition-transform shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
              10.9-mo Surveillance Void
            </div>
          </div>

          {/* Year Grid Lines & Labels */}
          {years.map((year) => {
            const pct = getPercent(`${year}-01-01T00:00:00Z`);
            return (
              <div
                key={year}
                style={{ left: `${pct}%` }}
                className="absolute top-0 bottom-0 flex flex-col items-center pointer-events-none"
              >
                <div className="w-[1px] h-3 bg-[#1E222B] -top-1 absolute" />
                <span className="absolute -bottom-6 text-[11px] font-mono font-medium text-[#4B5563]">
                  {year}
                </span>
              </div>
            );
          })}

          {/* Render Timeline Event Markers */}
          {filteredEvents.map((event) => {
            const isSelected = selectedEventId === event.id || selectedEventId === `EVT-${event.sourceIds[0]}`;
            const isHovered = hoveredEventId === event.id;
            const leftPercent = getPercent(event.date);

            const isConflict = Boolean(event.flags.conflict);
            const isMedChange = Boolean(event.flags.medicationChange);
            const isGapNode = Boolean(event.flags.missing && !isConflict);
            const isTrend = Boolean(event.flags.trend && !isConflict && !isMedChange);

            // Styling based on exact specification
            let markerClasses = '';
            let innerIcon = null;

            if (isConflict) {
              // The Conflict Node: Multi-layered pulsing crimson ring
              markerClasses =
                'w-7 h-7 -top-3.5 bg-[#0F131D] border-2 border-[#FF1E56] text-[#FF1E56] ring-4 ring-[#FF1E56]/30 shadow-[0_0_20px_#FF1E56] animate-pulse z-20';
              innerIcon = <AlertTriangle className="w-3.5 h-3.5" />;
            } else if (isMedChange) {
              // Medication changes: Iridescent teal halo
              markerClasses =
                'w-6 h-6 -top-3 bg-[#0F131D] border-2 border-[#2DD4BF] text-[#2DD4BF] ring-4 ring-[#2DD4BF]/25 shadow-[0_0_16px_rgba(45,212,191,0.6)] z-15';
              innerIcon = <Pill className="w-3 h-3" />;
            } else if (isGapNode) {
              // Amber post-gap marker
              markerClasses =
                'w-5 h-5 -top-2.5 bg-[#0F131D] border-2 border-[#F7971E] text-[#F7971E] ring-2 ring-[#F7971E]/20 shadow-[0_0_12px_rgba(247,151,30,0.4)] z-10';
              innerIcon = <Clock className="w-2.5 h-2.5" />;
            } else if (isTrend) {
              // Longitudinal trend marker
              markerClasses =
                'w-5 h-5 -top-2.5 bg-[#0F131D] border-2 border-[#9D4EDD] text-[#9D4EDD] ring-2 ring-[#9D4EDD]/20 shadow-[0_0_12px_rgba(157,78,221,0.4)] z-10';
              innerIcon = <TrendingUp className="w-2.5 h-2.5" />;
            } else {
              // Standard visits: Opal pearl ring
              markerClasses =
                'w-4 h-4 -top-2 bg-[#0B0E14] border-2 border-white/40 hover:border-white/80 text-white/80 shadow-[0_0_8px_rgba(255,255,255,0.15)] z-10';
              innerIcon = <span className="w-1.5 h-1.5 rounded-full bg-white/60" />;
            }

            return (
              <div
                key={event.id}
                style={{ left: `${leftPercent}%` }}
                className="absolute flex flex-col items-center"
              >
                {/* Clickable Node */}
                <button
                  onClick={() => handleNodeClick(event)}
                  onMouseEnter={() => setHoveredEventId(event.id)}
                  onMouseLeave={() => setHoveredEventId(null)}
                  className={`absolute rounded-full flex items-center justify-center transition-all transform hover:scale-125 focus:outline-none ${markerClasses} ${
                    isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#090A0D] scale-125' : ''
                  }`}
                  aria-label={event.title}
                >
                  {innerIcon}
                </button>

                {/* Node Top Date Tag */}
                <div
                  className={`absolute -top-7 text-[10px] font-mono whitespace-nowrap transition-opacity pointer-events-none ${
                    isSelected ? 'text-[#E2E4E9] font-bold opacity-100' : 'text-[#6B7280] opacity-80'
                  }`}
                >
                  {event.date.split('T')[0].slice(2)}
                </div>

                {/* Hover / Active Floating Tooltip */}
                {(isHovered || isSelected) && (
                  <div
                    className={`absolute -top-20 z-30 flex flex-col items-center pointer-events-none transition-all ${
                      isSelected ? 'scale-100' : 'scale-95'
                    }`}
                  >
                    <div className="bg-[#181B22] text-[#E2E4E9] text-xs px-2.5 py-1.5 rounded-md border border-[#2A303C] shadow-2xl whitespace-nowrap flex flex-col items-start gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] text-[#2DD4BF]">
                          {event.date.split('T')[0]}
                        </span>
                        {isConflict && (
                          <span className="text-[9px] font-semibold uppercase px-1 rounded bg-[#E04838]/20 text-[#E04838] border border-[#E04838]/40">
                            Conflict
                          </span>
                        )}
                        {isMedChange && (
                          <span className="text-[9px] font-semibold uppercase px-1 rounded bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/40">
                            Rx Switch
                          </span>
                        )}
                      </div>
                      <span className="font-medium text-[11px] max-w-[220px] truncate text-[#E2E4E9]">
                        {event.title}
                      </span>
                      <span className="text-[10px] text-[#8B949E] max-w-[220px] truncate">
                        {event.institution || 'Outpatient'}
                      </span>
                    </div>
                    {/* Tooltip triangle */}
                    <div className="w-2 h-2 bg-[#181B22] border-r border-b border-[#2A303C] transform rotate-45 -mt-1" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend & Quick Jump Bar */}
      <div className="mt-4 pt-3.5 border-t border-white/[0.06] flex flex-wrap items-center justify-between text-xs text-zinc-400 gap-3">
        <div className="flex items-center gap-4 flex-wrap text-[11px] font-normal tracking-[-0.01em]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-white/50 bg-[#0C0D13]" />
            <span className="text-zinc-300">Routine Visit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-[#2DD4BF] bg-[#0C0D13]" />
            <span className="text-[#2DD4BF]">Med Change (2021)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-[#E04838] bg-[#0C0D13] animate-pulse" />
            <span className="text-[#E04838]">Discharge Conflict (2022)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0 border-t border-dashed border-[#F59E0B]" />
            <span className="text-[#F59E0B]">10.9-mo Care Void</span>
          </div>
        </div>

        {/* Quick Pivot Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const medChange = allEvents.find((e) => e.flags.medicationChange);
              if (medChange) onSelectEvent(medChange);
            }}
            className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[11px] text-[#2DD4BF] border border-[#2DD4BF]/30 transition-all font-mono"
          >
            Jump to 2021 Switch
          </button>
          <button
            onClick={() => {
              if (onOpenConflictModal) onOpenConflictModal();
              else {
                const conf = allEvents.find((e) => e.flags.conflict);
                if (conf) onSelectEvent(conf);
              }
            }}
            className="px-3 py-1 rounded-full bg-[#E04838]/12 hover:bg-[#E04838]/20 text-[11px] text-[#E04838] border border-[#E04838]/30 transition-all font-medium flex items-center gap-1.5 shadow-sm"
          >
            <AlertTriangle className="w-3 h-3 stroke-[1.4]" />
            <span>View 2022 Conflict</span>
          </button>
        </div>
      </div>
    </div>
  );
};
