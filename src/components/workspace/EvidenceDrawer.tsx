'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  FileText,
  Copy,
  Check,
  Building2,
  Calendar,
  AlertTriangle,
  Pill,
  Search,
  ExternalLink,
  Split,
  Eye,
  Layers,
  Sparkles,
} from 'lucide-react';
import { MedicalRecord } from '../../types/medical';
import { PATIENT_PT2041_RECORDS } from '../../data/patientPT2041';

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  recordIds?: string[]; // Supports multiple records (e.g. for conflict comparison)
  activeRecordId?: string | null;
  records?: MedicalRecord[];
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  isOpen,
  onClose,
  recordIds = [],
  activeRecordId,
  records = PATIENT_PT2041_RECORDS,
}) => {
  // Determine list of records to view
  const targetRecordIds = useMemo(() => {
    if (recordIds.length > 0) return recordIds;
    if (activeRecordId) return [activeRecordId];
    return [records[0]?.id || ''];
  }, [recordIds, activeRecordId, records]);

  const [selectedTabId, setSelectedTabId] = useState<string>(targetRecordIds[0] || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [enableHighlights, setEnableHighlights] = useState(true);
  const [splitView, setSplitView] = useState(false);

  // Sync selected tab when recordIds change
  useEffect(() => {
    if (targetRecordIds.length > 0 && !targetRecordIds.includes(selectedTabId)) {
      setSelectedTabId(targetRecordIds[0]);
    }
  }, [targetRecordIds, selectedTabId]);

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

  if (!isOpen) return null;

  const currentRecord = records.find((r) => r.id === selectedTabId) || records[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /**
   * Evaluates each line to determine if it should be highlighted:
   * - Oxide-red: Conflicting directives (Drug A / Drug B / Metformin vs Glipizide)
   * - Teal: Medication transitions (Medication A / Medication B / Lisinopril to Losartan)
   */
  const renderAnnotatedDocument = (content: string) => {
    const lines = content.split('\n');

    return (
      <div className="font-mono text-xs leading-relaxed select-text space-y-0.5">
        {lines.map((line, idx) => {
          const lower = line.toLowerCase();
          const lineNum = idx + 1;

          // Conflict matchers (Oxide-Red: #E04838)
          const isConflictLine =
            enableHighlights &&
            (lower.includes('drug a') ||
              lower.includes('drug b') ||
              lower.includes('metformin 1000mg') ||
              lower.includes('glipizide er') ||
              lower.includes('do not take metformin') ||
              lower.includes('discrepancy') ||
              lower.includes('cross-facility') ||
              lower.includes('contraindicated'));

          // Medication change matchers (Teal: #2DD4BF)
          const isMedChangeLine =
            enableHighlights &&
            !isConflictLine &&
            (lower.includes('medication a') ||
              lower.includes('medication b') ||
              lower.includes('lisinopril 10mg') ||
              lower.includes('losartan') ||
              lower.includes('transition to losartan') ||
              lower.includes('discontinued medication') ||
              lower.includes('new / replacement medication'));

          // Search term highlight
          const isSearchMatch =
            searchTerm.trim() !== '' && lower.includes(searchTerm.toLowerCase());

          let lineBg = 'hover:bg-white/[0.02]';
          let textColor = 'text-zinc-300';
          let borderIndicator = 'border-l-2 border-transparent';

          if (isConflictLine) {
            lineBg = 'bg-[#E04838]/12 hover:bg-[#E04838]/20';
            textColor = 'text-[#FFA198] font-medium';
            borderIndicator = 'border-l-2 border-[#E04838]';
          } else if (isMedChangeLine) {
            lineBg = 'bg-[#2DD4BF]/12 hover:bg-[#2DD4BF]/20';
            textColor = 'text-teal-300 font-medium';
            borderIndicator = 'border-l-2 border-[#2DD4BF]';
          }

          if (isSearchMatch) {
            lineBg += ' ring-1 ring-amber-400/50 bg-amber-500/10';
          }

          return (
            <div
              key={idx}
              className={`flex items-start py-0.5 px-3 rounded-md transition-colors ${lineBg} ${borderIndicator}`}
            >
              <span className="w-10 text-[10px] text-zinc-600 select-none font-mono text-right pr-4 shrink-0 pt-0.5">
                {lineNum}
              </span>
              <span className={`flex-1 whitespace-pre-wrap break-words ${textColor}`}>
                {line || ' '}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full lg:max-w-4xl md:max-w-2xl bg-[#0F131D]/98 backdrop-blur-3xl border-l border-white/[0.08] shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col transform transition-all duration-300">
      {/* Top Bar with Document Tabs */}
      <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none min-w-0">
          <div className="w-9 h-9 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-teal-400 shrink-0 shadow-sm">
            <FileText className="w-4 h-4 stroke-[1.4]" />
          </div>

          {/* Multiple Document Tabs if multiple are linked */}
          <div className="flex items-center gap-1.5 flex-nowrap min-w-0">
            {targetRecordIds.map((id) => {
              const rec = records.find((r) => r.id === id);
              if (!rec) return null;
              const isActive = rec.id === selectedTabId && !splitView;

              return (
                <button
                  key={rec.id}
                  onClick={() => {
                    setSelectedTabId(rec.id);
                    setSplitView(false);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white/[0.12] text-white border border-white/[0.22] font-medium shadow-sm'
                      : 'bg-white/[0.03] text-zinc-400 border border-white/[0.06] hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <span>{rec.sourceDocumentId}</span>
                  {rec.id === 'REC-2022-002' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E04838] animate-pulse" />
                  )}
                  {rec.id === 'REC-2022-003' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E04838]" />
                  )}
                  {rec.id === 'REC-2021-002' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
                  )}
                </button>
              );
            })}

            {/* Split Comparison View Toggle for Multi-Document Review */}
            {targetRecordIds.length > 1 && (
              <button
                onClick={() => setSplitView(!splitView)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  splitView
                    ? 'bg-[#E04838]/20 text-[#FFA198] border border-[#E04838]/40 font-medium shadow-sm'
                    : 'bg-white/[0.03] text-zinc-400 border border-white/[0.06] hover:text-white hover:bg-white/[0.06]'
                }`}
                title="Toggle side-by-side comparison"
              >
                <Split className="w-3.5 h-3.5 stroke-[1.4]" />
                <span>Side-by-Side</span>
              </button>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
          aria-label="Close evidence drawer"
        >
          <X className="w-4 h-4 stroke-[1.4]" />
        </button>
      </div>

      {/* Control & Search Toolbar */}
      <div className="px-5 py-3 border-b border-white/[0.06] bg-white/[0.01] flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Document Metadata Pill */}
        <div className="flex items-center gap-3 text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 stroke-[1.3] text-teal-400" />
            <span className="text-white font-medium">{currentRecord?.institution}</span>
          </div>
          <span className="text-zinc-600">•</span>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
            <Calendar className="w-3 h-3 stroke-[1.3]" />
            <span>{currentRecord?.date.split('T')[0]}</span>
          </div>
        </div>

        {/* Search & Highlight Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-3 text-zinc-500 pointer-events-none stroke-[1.4]" />
            <input
              type="text"
              placeholder="Search note..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.14] rounded-full pl-8 pr-3 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-teal-500/50 transition-all font-normal"
            />
          </div>

          {/* Toggle Highlights */}
          <button
            onClick={() => setEnableHighlights(!enableHighlights)}
            className={`px-3 py-1 rounded-full border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              enableHighlights
                ? 'bg-teal-500/15 border-teal-500/30 text-teal-300 font-medium'
                : 'bg-white/[0.03] border-white/[0.06] text-zinc-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5 stroke-[1.4]" />
            <span>{enableHighlights ? 'Highlights ON' : 'Raw Text'}</span>
          </button>

          {/* Copy Plain Text */}
          <button
            onClick={() => handleCopy(currentRecord?.content || '')}
            className="p-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
            title="Copy plain-text document"
          >
            {copied ? <Check className="w-4 h-4 text-teal-400" /> : <Copy className="w-4 h-4 stroke-[1.4]" />}
          </button>
        </div>
      </div>

      {/* Highlights Legend Banner */}
      {enableHighlights && (
        <div className="px-5 py-2.5 bg-white/[0.015] border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-[11px]">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-zinc-500 font-mono text-[10px] uppercase">Auto-Annotated:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E04838]" />
              <span className="text-[#FFA198] font-medium">Contradictory / Conflict Directive</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
              <span className="text-teal-300 font-medium">Medication Transition</span>
            </div>
          </div>
          <span className="text-zinc-500 font-mono text-[10px]">Deterministic NLP Parser</span>
        </div>
      )}

      {/* Main Document Content Canvas */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-[#06070B]">
        {splitView && targetRecordIds.length > 1 ? (
          /* Side-by-Side Dual Document Comparison */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {targetRecordIds.slice(0, 2).map((recId) => {
              const rec = records.find((r) => r.id === recId);
              if (!rec) return null;

              return (
                <div
                  key={rec.id}
                  className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-4 sm:p-5 flex flex-col h-full overflow-hidden shadow-inner"
                >
                  <div className="pb-3 border-b border-white/[0.06] flex items-center justify-between mb-3">
                    <div>
                      <span className="text-[11px] font-mono text-teal-400">
                        {rec.sourceDocumentId}
                      </span>
                      <h4 className="text-xs font-medium text-white truncate max-w-[260px] mt-0.5">
                        {rec.title}
                      </h4>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {rec.date.split('T')[0]}
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {renderAnnotatedDocument(rec.content)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Single Document View with Full Width */
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.08] p-5 sm:p-6 shadow-inner">
            {currentRecord && renderAnnotatedDocument(currentRecord.content)}
          </div>
        )}
      </div>

      {/* Bottom Info Footer */}
      <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-white/[0.01] flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="text-zinc-500">RECORD:</span>
          <span className="text-white font-medium">{currentRecord?.id}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-500">DOCTOR:</span>
          <span className="text-zinc-300">{currentRecord?.author || 'Attending Physician'}</span>
        </div>
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
};
