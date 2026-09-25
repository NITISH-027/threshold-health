'use client';

import React from 'react';
import {
  X,
  Calendar,
  Building2,
  FileText,
  Pill,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  Activity,
  User,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { TimelineEvent, MedicalRecord } from '../../types/medical';
import { getEventWithSources, getRecordById } from '../../lib/reasoningEngine';
import { PATIENT_PT2041_RECORDS } from '../../data/patientPT2041';

interface EventInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  event: TimelineEvent | null;
  records?: MedicalRecord[];
  onOpenEvidence: (recordId: string) => void;
  onOpenConflictModal?: () => void;
}

export const EventInspector: React.FC<EventInspectorProps> = ({
  isOpen,
  onClose,
  event,
  records = PATIENT_PT2041_RECORDS,
  onOpenEvidence,
  onOpenConflictModal,
}) => {
  if (!isOpen || !event) return null;

  // Hydrate with deterministic engine
  const hydrated = getEventWithSources(event.id, [event], records) || {
    ...event,
    sourceRecords: records.filter((r) => event.sourceIds.includes(r.id)),
  };

  const primaryRecord = hydrated.sourceRecords[0] || getRecordById(event.sourceIds[0], records);
  const isMedChange = Boolean(event.flags.medicationChange || hydrated.medicationChangeDetails);
  const isConflict = Boolean(event.flags.conflict || hydrated.conflictDetails);
  const isGap = Boolean(event.flags.missing || event.type === 'missing_interval_marker' || hydrated.gapDetails);
  const isTrend = Boolean(event.flags.trend || hydrated.trendDetails);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-xl bg-[#0F131D]/95 backdrop-blur-3xl border-l border-white/[0.08] shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col transform transition-all duration-300 ease-in-out">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-white/[0.08] bg-white/[0.02] flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
              isConflict
                ? 'bg-[#E04838]/12 border-[#E04838]/25 text-[#E04838] shadow-[0_0_16px_rgba(224,72,56,0.2)]'
                : isMedChange
                ? 'bg-[#2DD4BF]/12 border-[#2DD4BF]/25 text-[#2DD4BF] shadow-[0_0_16px_rgba(45,212,191,0.2)]'
                : isGap
                ? 'bg-[#F59E0B]/12 border-[#F59E0B]/25 text-[#F59E0B] shadow-[0_0_16px_rgba(245,158,11,0.2)]'
                : 'bg-white/[0.04] border-white/[0.08] text-white shadow-sm'
            }`}
          >
            {isConflict ? (
              <AlertTriangle className="w-5 h-5 stroke-[1.4] animate-pulse" />
            ) : isMedChange ? (
              <Pill className="w-5 h-5 stroke-[1.4]" />
            ) : isGap ? (
              <Clock className="w-5 h-5 stroke-[1.4]" />
            ) : isTrend ? (
              <TrendingUp className="w-5 h-5 stroke-[1.4] text-indigo-400" />
            ) : (
              <Activity className="w-5 h-5 stroke-[1.4] text-white" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 stroke-[1.3]" />
                {event.date.split('T')[0]}
              </span>
              {isMedChange && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#2DD4BF]/15 text-[#2DD4BF] border border-[#2DD4BF]/30 font-medium">
                  Rx Transition
                </span>
              )}
              {isConflict && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#E04838]/15 text-[#FFA198] border border-[#E04838]/30 font-medium">
                  Cross-Site Conflict
                </span>
              )}
              {isGap && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 font-medium">
                  Missing Interval
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-light text-white mt-1.5 line-clamp-2 tracking-tight">
              {event.title}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1">
              <Building2 className="w-3.5 h-3.5 stroke-[1.3] text-teal-400" />
              <span>{event.institution || primaryRecord?.institution || 'Medical Center'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
          aria-label="Close inspector drawer"
        >
          <X className="w-4 h-4 stroke-[1.4]" />
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
        {/* SPECIFIC REQUIREMENT: 2021 Medication Change Showcase */}
        {isMedChange && (
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-[#2DD4BF]/30 shadow-[0_0_24px_rgba(45,212,191,0.08)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#2DD4BF] font-medium flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 stroke-[1.4]" />
                Medication Transition Protocol (2021)
              </span>
              <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/[0.06]">
                2021-07-14
              </span>
            </div>

            {/* Previous vs Current Transition Flow */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="text-[10px] uppercase font-mono text-zinc-500">Discontinued</div>
                  <div className="text-sm font-medium text-zinc-400 line-through decoration-[#E04838] decoration-2 mt-0.5">
                    Lisinopril 10mg
                  </div>
                  <span className="text-[10px] text-zinc-500">ACE-Inhibitor (Oral Daily)</span>
                </div>

                <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#2DD4BF]">
                  <ArrowRight className="w-3.5 h-3.5 stroke-[1.4]" />
                </div>

                <div className="flex-1 sm:text-right">
                  <div className="text-[10px] uppercase font-mono text-[#2DD4BF]">Replacement</div>
                  <div className="text-sm font-medium text-[#2DD4BF] mt-0.5 font-mono">
                    Losartan 20mg
                  </div>
                  <span className="text-[10px] text-zinc-500">ARB Class (Oral Daily)</span>
                </div>
              </div>
            </div>

            {/* Rationale and Prescriber Note */}
            <div className="text-xs space-y-1.5">
              <span className="font-medium text-white tracking-tight">Clinical Rationale:</span>
              <p className="text-zinc-400 leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/[0.06] font-normal">
                Patient developed persistent, intractable bradykinin-mediated dry brassy cough on
                Lisinopril 10mg PO Daily. Switched to Angiotensin II Receptor Blocker (ARB)
                Losartan 20mg to preserve blood pressure regulation and renal protection without cough induction.
              </p>
            </div>

            {/* Linked Source Document Link */}
            <div className="pt-2 flex items-center justify-between text-xs border-t border-white/[0.06]">
              <span className="text-zinc-500 font-mono text-[11px]">Linked Source Document:</span>
              <button
                onClick={() => onOpenEvidence('REC-2021-002')}
                className="text-[#2DD4BF] hover:underline font-mono text-xs flex items-center gap-1 cursor-pointer"
              >
                <span>DOC-MHOC-2021-6674</span>
                <ChevronRight className="w-3 h-3 stroke-[1.3]" />
              </button>
            </div>
          </div>
        )}

        {/* 2022 Conflict Event Highlight */}
        {isConflict && (
          <div className="p-5 rounded-2xl bg-rose-500/[0.07] border border-rose-500/25 space-y-3.5 shadow-[0_0_24px_rgba(244,63,94,0.08)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-rose-300 font-medium flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 stroke-[1.4] text-[#E04838]" />
                Simultaneous Order Conflict
              </span>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded-full border border-rose-500/25">
                2022-11-04
              </span>
            </div>
            <p className="text-xs text-rose-200/80 leading-relaxed font-normal">
              Hospital Discharge orders Drug A (Metformin 1000mg BID), whereas concurrent Outpatient
              prescription orders Drug B (Glipizide ER 10mg) with Metformin cessation due to eGFR 51.
            </p>
            {onOpenConflictModal && (
              <button
                onClick={onOpenConflictModal}
                className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-[#E04838] to-[#EF4444] hover:from-[#c93d2f] hover:to-[#dc2626] text-white text-xs font-medium transition-all shadow-[0_0_20px_rgba(224,72,56,0.3)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 stroke-[1.4]" />
                <span>Launch Side-by-Side Conflict Modal</span>
              </button>
            )}
          </div>
        )}

        {/* Temporal Gap / Void Information */}
        {isGap && (
          <div className="p-5 rounded-2xl bg-amber-500/[0.07] border border-amber-500/25 space-y-3 shadow-[0_0_24px_rgba(245,158,11,0.08)]">
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-amber-300 uppercase">
              <Clock className="w-4 h-4 stroke-[1.4] text-[#F59E0B]" />
              <span>10.9-Month Care Continuity Void</span>
            </div>
            <p className="text-xs text-amber-100/80 leading-relaxed font-normal">
              332 days elapsed between the ankle sprain on 2023-03-20 and the Emergency Department
              admission on 2024-02-15 without routine surveillance, lab checks, or medication renewals.
            </p>
            <div className="text-[11px] text-zinc-400 bg-black/40 p-3 rounded-xl border border-white/[0.06] font-normal leading-relaxed">
              Clinical Impact: Presentation with acute prerenal azotemia and severe hyperglycemia (248 mg/dL).
            </div>
          </div>
        )}

        {/* Longitudinal Biomarker Trend Showcase */}
        {isTrend && (
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-300 font-medium flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 stroke-[1.4] text-indigo-400" />
                Longitudinal Renal Trajectory (3 Visits)
              </span>
              <span className="text-[10px] font-mono text-[#FFA198] bg-[#E04838]/15 px-2.5 py-0.5 rounded-full border border-[#E04838]/30">
                +90.9% Escalation
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[10px] font-mono text-zinc-500">2020-09-18</div>
                <div className="text-sm font-medium text-white mt-1 font-mono">1.10 mg/dL</div>
                <div className="text-[10px] text-teal-400 font-mono mt-0.5">eGFR 72 (Normal)</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[10px] font-mono text-zinc-500">2022-05-12</div>
                <div className="text-sm font-medium text-[#F59E0B] mt-1 font-mono">1.55 mg/dL</div>
                <div className="text-[10px] text-[#F59E0B] font-mono mt-0.5">eGFR 51 (CKD 3a)</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[10px] font-mono text-zinc-500">2024-06-18</div>
                <div className="text-sm font-medium text-[#FFA198] mt-1 font-mono">2.10 mg/dL</div>
                <div className="text-[10px] text-[#E04838] font-mono mt-0.5">eGFR 36 (CKD 3b)</div>
              </div>
            </div>
          </div>
        )}

        {/* Clinical Note Snippet & Encounter Summary */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase font-mono tracking-wider text-zinc-400 font-medium">
            Encounter Synopsis &amp; Metadata
          </h4>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <span className="text-zinc-500">Attending / Author:</span>
              <span className="font-medium text-white">
                {primaryRecord?.author || 'Attending Physician'}
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <span className="text-zinc-500">Department:</span>
              <span className="text-zinc-300">
                {primaryRecord?.department || 'Internal Medicine'}
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <span className="text-zinc-500">Source Document ID:</span>
              <span className="font-mono text-teal-400 text-[11px]">
                {primaryRecord?.sourceDocumentId || 'DOC-UNSPECIFIED'}
              </span>
            </div>

            {/* Vitals or Labs if present */}
            {primaryRecord?.structuredData?.vitals && (
              <div className="pt-2">
                <span className="text-[11px] font-normal text-zinc-500 block mb-1.5">
                  Encounter Vitals:
                </span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(primaryRecord.structuredData.vitals).map(([k, v]) => (
                    <span
                      key={k}
                      className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/[0.06] text-[11px] font-mono text-zinc-300"
                    >
                      {k}: <span className="text-white font-medium">{v}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description Excerpt */}
        <div className="space-y-2">
          <h4 className="text-xs uppercase font-mono tracking-wider text-zinc-400 font-medium">
            Clinical Notes Excerpt
          </h4>
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.06] text-xs font-mono text-zinc-400 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
            {primaryRecord?.content.slice(0, 520) || event.description}...
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-5 sm:p-6 border-t border-white/[0.08] bg-white/[0.01] flex items-center justify-between gap-3">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-normal text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
        >
          Close
        </button>

        {primaryRecord && (
          <button
            onClick={() => {
              onClose();
              onOpenEvidence(primaryRecord.id);
            }}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-[#090A0D] text-xs font-semibold transition-all shadow-[0_0_24px_rgba(45,212,191,0.25)] flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Open Clinical Document</span>
          </button>
        )}
      </div>
    </div>
  );
};
