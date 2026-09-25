'use client';

import React, { useEffect } from 'react';
import {
  AlertTriangle,
  X,
  FileText,
  Building2,
  Calendar,
  ShieldAlert,
  ArrowRightLeft,
  ExternalLink,
  CheckCircle2,
  Pill,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { ConflictDetail, MedicalRecord } from '../../types/medical';
import { detectConflicts } from '../../lib/reasoningEngine';
import { PATIENT_PT2041_RECORDS } from '../../data/patientPT2041';

interface ConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  conflict?: ConflictDetail | null;
  onViewEvidence: (recordIds: string[]) => void;
  records?: MedicalRecord[];
}

export const ConflictModal: React.FC<ConflictModalProps> = ({
  isOpen,
  onClose,
  conflict,
  onViewEvidence,
  records = PATIENT_PT2041_RECORDS,
}) => {
  // Fallback to detected conflict if none provided
  const activeConflict = conflict || detectConflicts(records)[0] || detectConflicts(PATIENT_PT2041_RECORDS)[0];

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !activeConflict) return null;

  const recordA = records.find((r) => r.id === activeConflict.recordAId);
  const recordB = records.find((r) => r.id === activeConflict.recordBId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200">
      {/* Outer Modal Container with Obsidian Glass Craftsmanship */}
      <div className="relative w-full max-w-4xl bg-[#0F131D]/95 backdrop-blur-2xl border border-white/[0.1] rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[92vh] min-w-0">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] bg-white/[0.02] flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-[#FF1E56]/15 border border-[#FF1E56]/30 text-[#FF1E56] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(255,30,86,0.3)]">
              <AlertTriangle className="w-5 h-5 stroke-[1.4] animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-[#FF1E56]/20 text-[#FF5A82] border border-[#FF1E56]/60 animate-pulse">
                  Critical Safety Discrepancy
                </span>
                <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 stroke-[1.3] text-[#FF1E56]" />
                  {activeConflict.date.split('T')[0]} · Concurrent Directive
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-light text-white mt-1.5 tracking-[-0.02em]">
                Cross-Institutional Medication Order Conflict
              </h2>
              <p className="text-xs text-zinc-400 mt-1 font-normal tracking-[-0.01em] leading-relaxed">
                Conflicting pharmacotherapy directives issued on the exact same date across two care facilities.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
            aria-label="Close conflict modal"
          >
            <X className="w-4 h-4 stroke-[1.4]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Clinical Hazard Warning Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FF1E56]/15 border border-[#FF1E56]/35 flex items-start gap-3.5 shadow-[0_0_24px_rgba(255,30,86,0.15)]">
            <div className="w-8 h-8 rounded-full bg-[#FF1E56]/20 border border-[#FF1E56]/40 text-[#FF5A82] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-4 h-4 stroke-[1.4]" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-[#FF5A82] tracking-tight">
                Severe Pharmacological Contraindication Risk
              </h4>
              <p className="text-xs text-[#FFE4E1] mt-1 leading-relaxed font-normal">
                {activeConflict.clinicalRisk ||
                  'Simultaneous ingestion of contradictory drug orders without cross-facility reconciliation creates compounded threats of acute toxicity, treatment failure, or vital organ decompensation.'}
              </p>
            </div>
          </div>

          {/* Side-by-Side Comparison Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* Source A */}
            <div className="rounded-2xl bg-[#070A10]/90 border border-white/[0.08] p-5 sm:p-6 flex flex-col justify-between relative group hover:border-white/[0.16] transition-all backdrop-blur-md">
              <div className="absolute top-5 right-5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/[0.05] text-zinc-400 border border-white/[0.08]">
                  Source A · {recordA?.institution.split(' ')[0] || 'Inpatient'}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs text-indigo-400">
                  <Building2 className="w-3.5 h-3.5 stroke-[1.3]" />
                  <span className="font-medium tracking-tight">{recordA?.institution || 'Medical Center A'}</span>
                </div>
                <h3 className="text-base font-normal text-white mt-1.5 tracking-tight">
                  {recordA?.title || 'Clinical Encounter Note (Source A)'}
                </h3>
                <div className="mt-1 text-[11px] font-mono text-zinc-500">
                  Doc ID: {recordA?.sourceDocumentId || activeConflict.recordAId} · Attending: {recordA?.author || 'Attending Physician'}
                </div>

                <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
                  <div className="text-[11px] uppercase tracking-wider font-mono text-[#FF5A82] flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 stroke-[1.4] text-[#FF1E56]" />
                    <span>Prescribed Therapy</span>
                  </div>
                  <div className="text-base font-medium text-white font-mono">
                    {recordA?.structuredData?.activePrescriptions?.[0] || 'Prescribed Regimen A'}
                  </div>
                  <p className="text-xs text-zinc-400 italic pt-1 border-t border-white/[0.06] leading-relaxed">
                    &ldquo;{recordA?.content.split('\n').find((l) => l.toLowerCase().includes('prescribed') || l.toLowerCase().includes('continue') || l.toLowerCase().includes('order')) || 'Order issued without cross-facility review.'}&rdquo;
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-mono text-[11px]">Status: Mandated Active</span>
                <span className="font-mono text-zinc-400 text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3 stroke-[1.3]" /> {activeConflict.date.split('T')[0]}
                </span>
              </div>
            </div>

            {/* Source B */}
            <div className="rounded-2xl bg-[#070A10]/90 border border-white/[0.08] p-5 sm:p-6 flex flex-col justify-between relative group hover:border-white/[0.16] transition-all backdrop-blur-md">
              <div className="absolute top-5 right-5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/[0.05] text-zinc-400 border border-white/[0.08]">
                  Source B · {recordB?.institution.split(' ')[0] || 'Outpatient'}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs text-[#00F2FE]">
                  <Building2 className="w-3.5 h-3.5 stroke-[1.3]" />
                  <span className="font-medium tracking-tight">{recordB?.institution || 'Medical Center B'}</span>
                </div>
                <h3 className="text-base font-normal text-white mt-1.5 tracking-tight">
                  {recordB?.title || 'Clinical Encounter Note (Source B)'}
                </h3>
                <div className="mt-1 text-[11px] font-mono text-zinc-500">
                  Doc ID: {recordB?.sourceDocumentId || activeConflict.recordBId} · Prescriber: {recordB?.author || 'Attending Physician'}
                </div>

                <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
                  <div className="text-[11px] uppercase tracking-wider font-mono text-[#00F2FE] flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 stroke-[1.4] text-[#00F2FE]" />
                    <span>Contradicting Order</span>
                  </div>
                  <div className="text-base font-medium text-white font-mono">
                    {recordB?.structuredData?.activePrescriptions?.[0] || 'Contraindicated Directive B'}
                  </div>
                  <p className="text-xs text-zinc-400 italic pt-1 border-t border-white/[0.06] leading-relaxed">
                    &ldquo;{recordB?.content.split('\n').find((l) => l.toLowerCase().includes('do not') || l.toLowerCase().includes('contraindicated') || l.toLowerCase().includes('discontinued')) || 'Medication explicitly contraindicated.'}&rdquo;
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-teal-400 font-mono text-[11px]">Status: Contraindicated</span>
                <span className="font-mono text-zinc-400 text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3 stroke-[1.3]" /> {activeConflict.date.split('T')[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Root-Cause Synthesis Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs space-y-2">
            <h4 className="font-medium text-white flex items-center gap-2 tracking-tight">
              <ArrowRightLeft className="w-3.5 h-3.5 text-fuchsia-400 stroke-[1.4]" />
              <span>THRESHOLD Deterministic Reconciliation Synthesis</span>
            </h4>
            <p className="text-zinc-400 font-normal leading-relaxed text-xs">
              {activeConflict.reason}
            </p>
          </div>
        </div>

        {/* Modal Footer with Required Action Button */}
        <div className="p-5 sm:p-6 border-t border-white/[0.08] bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-zinc-400 font-mono text-[11px]">
            Records: <code className="text-white font-mono bg-white/[0.06] px-2 py-0.5 rounded-md border border-white/[0.08]">{activeConflict.recordAId}</code> &amp;{' '}
            <code className="text-white font-mono bg-white/[0.06] px-2 py-0.5 rounded-md border border-white/[0.08]">{activeConflict.recordBId}</code>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-normal text-zinc-300 hover:text-white transition-all cursor-pointer flex-1 sm:flex-none"
            >
              Dismiss
            </button>
            <button
              onClick={() => {
                onClose();
                onViewEvidence([activeConflict.recordAId, activeConflict.recordBId]);
              }}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#E04838] to-[#EF4444] hover:from-[#c93d2f] hover:to-[#dc2626] text-white text-xs font-medium shadow-[0_0_24px_rgba(224,72,56,0.35)] transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 stroke-[1.4]" />
              <span>[ View Source Evidence ]</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
