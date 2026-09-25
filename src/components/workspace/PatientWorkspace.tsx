'use client';

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
} from 'recharts';
import {
  AlertTriangle,
  Pill,
  Clock,
  History,
  FileText,
  Play,
  ArrowRight,
  ShieldAlert,
  ArrowRightLeft,
  ChevronRight,
  ExternalLink,
  Calendar,
  Building2,
  AlertCircle,
  Activity,
  CheckCircle2,
  Upload,
  User,
  Heart,
  Database,
  Sparkles,
} from 'lucide-react';
import { TimelineEvent, MedicalRecord, PatientProfile } from '../../types/medical';
import { PATIENT_PT2041_PROFILE, PATIENT_PT2041_RECORDS } from '../../data/patientPT2041';
import { PATIENT_PT1092_PROFILE, PATIENT_PT1092_RECORDS } from '../../data/patientPT1092';
import {
  generateTimeline,
  detectConflicts,
  detectMedicationChanges,
  detectGaps,
  detectLongitudinalTrends,
} from '../../lib/reasoningEngine';
import { TimelineRail } from './TimelineRail';
import { ConflictModal } from './ConflictModal';
import { EventInspector } from './EventInspector';
import { EvidenceDrawer } from './EvidenceDrawer';
import { ImportRecordsModal } from './ImportRecordsModal';

interface PatientWorkspaceProps {
  initialConflictOpen?: boolean;
  onReplayCinematic?: () => void;
}

type QuestionKey = 'changed' | 'conflicting' | 'missing' | 'history';

export const PatientWorkspace: React.FC<PatientWorkspaceProps> = ({
  initialConflictOpen = false,
  onReplayCinematic,
}) => {
  // Lifted Patient Profile & Records State (Dynamic Multi-Patient & Ingestion)
  const [activeProfile, setActiveProfile] = useState<PatientProfile>(PATIENT_PT2041_PROFILE);
  const [activeRecords, setActiveRecords] = useState<MedicalRecord[]>(PATIENT_PT2041_RECORDS);

  // Modals & Ingestion State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(initialConflictOpen);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false);
  const [evidenceDrawerRecordIds, setEvidenceDrawerRecordIds] = useState<string[]>(['REC-2021-002']);

  // Primary Question Selector ("The Booking Bar")
  const [activeQuestion, setActiveQuestion] = useState<QuestionKey>('changed');

  // Chart range selector for Full history
  const [timeRange, setTimeRange] = useState<'1Y' | '3Y' | '5Y' | 'ALL'>('ALL');

  // Deterministic Analysis Engines dynamically derived from activeRecords
  const timelineEvents = useMemo(() => generateTimeline(activeRecords), [activeRecords]);
  const conflicts = useMemo(() => detectConflicts(activeRecords), [activeRecords]);
  const medChanges = useMemo(() => detectMedicationChanges(activeRecords), [activeRecords]);
  const gaps = useMemo(() => detectGaps(activeRecords), [activeRecords]);
  const trends = useMemo(() => detectLongitudinalTrends(activeRecords), [activeRecords]);

  // Selected event for Inspector
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(
    timelineEvents.find((e) => e.flags.conflict) || timelineEvents[0]
  );

  // Update selected event when patient changes
  React.useEffect(() => {
    const conflictEvent = timelineEvents.find((e) => e.flags.conflict);
    setSelectedEvent(conflictEvent || timelineEvents[0] || null);
    if (activeRecords[0]) {
      setEvidenceDrawerRecordIds([activeRecords[0].id]);
    }
  }, [activeRecords, timelineEvents]);

  // Longitudinal Chart Data (Dynamic by Patient Case)
  const chartData = useMemo(() => {
    if (activeProfile.id === 'PT-1092') {
      // Elena Rostova: Cardio-Oncology LVEF % Trajectory (Chemotherapy Cardiotoxicity)
      return [
        {
          dateKey: 'Apr 20',
          fullDate: '2020-04-10',
          val: 64,
          label: 'LVEF: 64%',
          milestone: 'Mastectomy & Normal Baseline Heart Echo',
          facility: 'St. Jude Oncology',
          recordId: 'REC-ER-2020-001',
        },
        {
          dateKey: 'Jun 20',
          fullDate: '2020-06-15',
          val: 64,
          label: 'LVEF: 64%',
          milestone: 'Doxorubicin Chemotherapy Cycle 1 Initiated',
          facility: 'St. Jude Oncology',
          recordId: 'REC-ER-2020-002',
        },
        {
          dateKey: 'Mar 22',
          fullDate: '2022-03-18',
          val: 58,
          label: 'LVEF: 58%',
          milestone: 'Chemo Completed · Remission · Care Void Begins',
          isGapStart: true,
          facility: 'St. Jude Oncology',
          recordId: 'REC-ER-2022-001',
        },
        {
          dateKey: 'Nov 22',
          fullDate: '2022-11-20',
          val: 42,
          label: 'LVEF: ~42%',
          milestone: 'Urgent Care: Progressive Shortness of Breath (Void Ends)',
          isGapEnd: true,
          facility: 'Evergreen Valley Urgent Care',
          recordId: 'REC-ER-2022-002',
        },
        {
          dateKey: 'Jan 23',
          fullDate: '2023-01-14',
          val: 32,
          label: 'LVEF: 32%',
          milestone: 'Apex Cardiology: Chemo Cardiotoxicity HFrEF (Lisinopril 5mg)',
          isMedChange: true,
          facility: 'Apex Cardio-Vascular',
          recordId: 'REC-ER-2023-001',
        },
        {
          dateKey: 'Jul 23',
          fullDate: '2023-07-22',
          val: 38,
          label: 'LVEF: 38%',
          milestone: 'Lisinopril Titrated to 10mg · LVEF Stabilizing',
          facility: 'Apex Cardio-Vascular',
          recordId: 'REC-ER-2023-002',
        },
        {
          dateKey: 'May 24',
          fullDate: '2024-05-10',
          val: 38,
          label: 'LVEF: 38%',
          milestone: 'CRITICAL CONFLICT: St. Jude Naproxen vs Apex NSAID Ban',
          isConflict: true,
          facility: 'St. Jude / Apex',
          recordId: 'REC-ER-2024-001',
        },
        {
          dateKey: 'Sep 24',
          fullDate: '2024-09-12',
          val: 41,
          label: 'LVEF: 41%',
          milestone: 'Mercy Highland: Conflict Intercepted · LVEF 41% Recovered',
          facility: 'Mercy Highland Outpatient',
          recordId: 'REC-ER-2024-003',
        },
      ];
    }

    // Default Ramaswamy K. (TN-UHID-88412): Renal Serum Creatinine Trajectory
    return [
      {
        dateKey: 'Mar 19',
        fullDate: '2019-03-10',
        val: 1.10,
        label: 'Cr: 1.10',
        milestone: 'Routine Master Health Checkup (Lisinopril 10mg started)',
        facility: 'Mylapore Primary Health & Family Clinic',
        recordId: 'REC-2019-001',
      },
      {
        dateKey: 'Nov 19',
        fullDate: '2019-11-05',
        val: 1.12,
        label: 'Cr: 1.12',
        milestone: 'Acute Care: Seasonal Bronchitis evaluation',
        facility: 'Sundaram Medical Foundation (Anna Nagar)',
        recordId: 'REC-2019-002',
      },
      {
        dateKey: 'Apr 20',
        fullDate: '2020-04-12',
        val: 1.12,
        label: 'Cr: 1.12',
        milestone: 'Hypertension & Glycemia follow-up check',
        facility: 'Mylapore Primary Health & Family Clinic',
        recordId: 'REC-2020-001',
      },
      {
        dateKey: 'Sep 20',
        fullDate: '2020-09-18',
        val: 1.10,
        label: 'Cr: 1.10',
        milestone: 'Nephrology Baseline Benchmark (Normal filtration, Cr 1.10 mg/dL)',
        facility: 'Kauvery Hospital (Alwarpet, Chennai)',
        recordId: 'REC-2020-002',
      },
      {
        dateKey: 'Feb 21',
        fullDate: '2021-02-22',
        val: 1.14,
        label: 'Cr: 1.14',
        milestone: 'Intractable dry cough evaluation post-Lisinopril',
        facility: 'Mylapore Primary Health & Family Clinic',
        recordId: 'REC-2021-001',
      },
      {
        dateKey: 'Jul 21',
        fullDate: '2021-07-14',
        val: 1.15,
        label: 'Cr: 1.15',
        milestone: 'Medication Switch: Tab. Lisinopril 10mg → Tab. Losartan 20mg OD',
        isMedChange: true,
        facility: 'Mylapore Primary Health & Family Clinic',
        recordId: 'REC-2021-002',
      },
      {
        dateKey: 'Dec 21',
        fullDate: '2021-12-08',
        val: 1.16,
        label: 'Cr: 1.16',
        milestone: 'Post-ARB transition surveillance (Cough resolved)',
        facility: 'Mylapore Primary Health & Family Clinic',
        recordId: 'REC-2021-003',
      },
      {
        dateKey: 'May 22',
        fullDate: '2022-05-12',
        val: 1.55,
        label: 'Cr: 1.55',
        milestone: 'CKD Stage 3a progression confirmed (eGFR 51 mL/min)',
        facility: 'Kauvery Hospital (Alwarpet, Chennai)',
        recordId: 'REC-2022-001',
      },
      {
        dateKey: 'Nov 22',
        fullDate: '2022-11-04',
        val: 1.62,
        label: 'Cr: 1.62',
        milestone: 'CRITICAL CONFLICT: Apollo Metformin 1000mg vs Mylapore Glipizide 10mg',
        isConflict: true,
        facility: 'Apollo Hospitals / Mylapore Clinic',
        recordId: 'REC-2022-002',
      },
      {
        dateKey: 'Mar 23',
        fullDate: '2023-03-20',
        val: 1.65,
        label: 'Cr: 1.65',
        milestone: 'Right Ankle Sprain (Last contact before 10.9-month Thanjavur care void)',
        isGapStart: true,
        facility: 'Sundaram Medical Foundation (Anna Nagar)',
        recordId: 'REC-2023-001',
      },
      {
        dateKey: 'Feb 24',
        fullDate: '2024-02-15',
        val: 1.82,
        label: 'Cr: 1.82',
        milestone: 'ED Admission: Prerenal Azotemia & Hyperglycemia (Care void ends)',
        isGapEnd: true,
        facility: 'Apollo Hospitals (Greams Road, Chennai)',
        recordId: 'REC-2024-001',
      },
      {
        dateKey: 'Jun 24',
        fullDate: '2024-06-18',
        val: 2.10,
        label: 'Cr: 2.10',
        milestone: 'CKD Stage 3b Confirmatory Peak (Nephrology: +90.9% Escalation)',
        facility: 'Kauvery Hospital (Alwarpet, Chennai)',
        recordId: 'REC-2024-002',
      },
      {
        dateKey: 'Nov 24',
        fullDate: '2024-11-20',
        val: 2.06,
        label: 'Cr: 2.06',
        milestone: 'Renoprotection Protocol Initiated (Empagliflozin 10mg)',
        facility: 'Mylapore Primary Health & Family Clinic',
        recordId: 'REC-2024-003',
      },
      {
        dateKey: 'Jan 25',
        fullDate: '2025-01-28',
        val: 2.05,
        label: 'Cr: 2.05',
        milestone: '2025 Comprehensive Review: Renal Trajectory Plateaued',
        facility: 'Apollo Hospitals (Greams Road, Chennai)',
        recordId: 'REC-2025-001',
      },
    ];
  }, [activeProfile.id]);

  const filteredChartData = useMemo(() => {
    if (timeRange === '1Y') return chartData.slice(-4);
    if (timeRange === '3Y') return chartData.slice(-8);
    if (timeRange === '5Y') return chartData.slice(-11);
    return chartData;
  }, [chartData, timeRange]);

  const handleOpenEvidence = (recordIds: string[]) => {
    setEvidenceDrawerRecordIds(recordIds);
    setIsEvidenceDrawerOpen(true);
  };

  const handleSelectEvent = (event: TimelineEvent) => {
    setSelectedEvent(event);
    if (event.flags.conflict) {
      setIsConflictModalOpen(true);
    } else {
      setIsInspectorOpen(true);
    }
  };

  // Switch between loaded patient cases or imported data
  const handleLoadPatient = (profile: PatientProfile, newRecords: MedicalRecord[]) => {
    setActiveProfile(profile);
    setActiveRecords(newRecords);
    setActiveQuestion('changed');
  };

  return (
    <div className="bg-[#07090E] p-4 sm:p-6 lg:p-8 min-h-screen text-[#E4E6EB] font-sans antialiased flex flex-col items-center relative overflow-hidden">
      {/* Global Atmosphere & Ambient Gradients Canvas */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-[#1F264A]/30 blur-[130px]" />
        <div className="absolute top-[10%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-[#8A1C38]/20 blur-[140px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-[#142D3C]/25 blur-[140px]" />
      </div>

      {/* Outer Constrained Container */}
      <div className="w-full max-w-5xl flex flex-col space-y-8 min-w-0 relative z-10">

        {/* ============================================================= */}
        {/* 1. HEADER & CONTEXT BANNER                                    */}
        {/* ============================================================= */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] min-w-0">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
                {activeProfile.name} <span className="text-zinc-500 font-mono text-lg font-normal">· {activeProfile.mrn || activeProfile.id}</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-white/[0.05] border border-white/[0.08] text-zinc-400">
                DOB: {activeProfile.dob}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#00F2FE]/10 text-[#00F2FE] border border-[#00F2FE]/25">
                {activeRecords.length} Records
              </span>
            </div>
            <p className="text-sm text-zinc-400 font-normal mt-1">
              {activeProfile.id === 'PT-1092'
                ? `${activeRecords.length} scattered records from 3 hospitals organized into one timeline.`
                : '15 scattered records from 4 hospitals in Chennai reconstructed into one timeline.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* [+ Import Records] Ingestion Modal Trigger - Iridescent Luxury Pill */}
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#00F2FE]/20 via-[#4FACFE]/20 to-[#6A11CB]/20 border border-[#00F2FE]/50 text-white shadow-[0_0_20px_rgba(0,242,254,0.2)] hover:shadow-[0_0_30px_rgba(0,242,254,0.4)] text-xs font-medium transition-all duration-300 cursor-pointer flex items-center gap-2"
              title="Import clinical documents or switch patient benchmarks"
            >
              <Upload className="w-3.5 h-3.5 stroke-[1.5] text-[#00F2FE]" />
              <span className="tracking-wide">[+ Import Records]</span>
            </button>

            {onReplayCinematic && activeProfile.id === 'PT-2041' && (
              <button
                onClick={onReplayCinematic}
                className="px-4 py-2 rounded-full bg-[#0F131D]/80 hover:bg-[#141926]/90 border border-white/[0.08] hover:border-white/[0.16] text-xs font-medium text-zinc-300 hover:text-white transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Play className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>Replay Intro</span>
              </button>
            )}

            <button
              onClick={() => handleOpenEvidence(activeRecords.map((r) => r.id))}
              className="px-4 py-2 rounded-full bg-[#0F131D]/80 hover:bg-[#141926]/90 border border-white/[0.08] hover:border-white/[0.16] text-xs font-medium text-white transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
            >
              <FileText className="w-3.5 h-3.5 stroke-[1.5] text-[#00F2FE]" />
              <span>All Source Documents ({activeRecords.length})</span>
            </button>
          </div>
        </header>

        {/* ============================================================= */}
        {/* 2. THE PRIMARY QUESTION SELECTOR ("THE BOOKING BAR")          */}
        {/* ============================================================= */}
        <section className="space-y-4">
          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-medium text-white tracking-tight">
              What would you like to understand?
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Select a question to inspect reconstructed facts for {activeProfile.name}.
            </p>
          </div>

          {/* 4 Large Interactive Tabs/Cards in Horizontal Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Card 1: What changed? */}
            <button
              onClick={() => setActiveQuestion('changed')}
              className={`p-4 rounded-2xl text-left transition-all duration-300 border cursor-pointer relative flex flex-col justify-between min-h-[104px] ${
                activeQuestion === 'changed'
                  ? 'bg-gradient-to-br from-[#00F2FE]/15 via-[#00B4D8]/5 to-transparent border-[#00F2FE]/50 shadow-[0_0_25px_-5px_rgba(0,242,254,0.3)]'
                  : 'bg-[#0F131D]/80 backdrop-blur-2xl border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:border-[#00F2FE]/40 hover:bg-[#141926]/85'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium tracking-tight ${
                  activeQuestion === 'changed' ? 'text-white font-semibold' : 'text-zinc-300'
                }`}>
                  What changed?
                </span>
                <Pill className={`w-4 h-4 stroke-[1.5] ${
                  activeQuestion === 'changed' ? 'text-[#00F2FE]' : 'text-zinc-500'
                }`} />
              </div>
              <div className="text-xs font-normal text-zinc-400 mt-2">
                {activeProfile.id === 'PT-1092'
                  ? '1 GDMT dose titration'
                  : 'Blood pressure tablet switched (Lisinopril → Losartan due to persistent dry cough).'}
              </div>
            </button>

            {/* Card 2: What's conflicting? */}
            <button
              onClick={() => setActiveQuestion('conflicting')}
              className={`p-4 rounded-2xl text-left transition-all duration-300 border cursor-pointer relative flex flex-col justify-between min-h-[104px] ${
                activeQuestion === 'conflicting'
                  ? 'bg-gradient-to-br from-[#FF1E56]/20 via-[#BA133B]/8 to-transparent border-[#FF1E56]/60 shadow-[0_0_30px_-5px_rgba(255,30,86,0.35)]'
                  : 'bg-[#0F131D]/80 backdrop-blur-2xl border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:border-[#FF1E56]/40 hover:bg-[#141926]/85'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium tracking-tight ${
                  activeQuestion === 'conflicting' ? 'text-white font-semibold' : 'text-zinc-300'
                }`}>
                  What&apos;s conflicting?
                </span>
                <span className="w-2 h-2 rounded-full bg-[#FF1E56] shadow-[0_0_10px_#FF1E56] animate-pulse" />
              </div>
              <div className="text-xs font-normal text-zinc-400 mt-2">
                {activeProfile.id === 'PT-1092'
                  ? '1 dangerous clash (Naproxen vs NSAID ban)'
                  : 'Apollo Hospitals & Mylapore Clinic prescribed opposing diabetes tablets on 04-Nov-2022.'}
              </div>
            </button>

            {/* Card 3: What's missing? */}
            <button
              onClick={() => setActiveQuestion('missing')}
              className={`p-4 rounded-2xl text-left transition-all duration-300 border cursor-pointer relative flex flex-col justify-between min-h-[104px] ${
                activeQuestion === 'missing'
                  ? 'bg-gradient-to-br from-[#F7971E]/15 via-[#FF7300]/5 to-transparent border-[#F7971E]/50 shadow-[0_0_25px_-5px_rgba(247,151,30,0.25)]'
                  : 'bg-[#0F131D]/80 backdrop-blur-2xl border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:border-[#F7971E]/40 hover:bg-[#141926]/85'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium tracking-tight ${
                  activeQuestion === 'missing' ? 'text-white font-semibold' : 'text-zinc-300'
                }`}>
                  What&apos;s missing?
                </span>
                <Clock className={`w-4 h-4 stroke-[1.5] ${
                  activeQuestion === 'missing' ? 'text-[#F7971E]' : 'text-zinc-500'
                }`} />
              </div>
              <div className="text-xs font-normal text-zinc-400 mt-2">
                {activeProfile.id === 'PT-1092'
                  ? '8-month post-chemo gap'
                  : '10-month gap with zero checkups while in Thanjavur (Mar 2023 – Feb 2024).'}
              </div>
            </button>

            {/* Card 4: Full history */}
            <button
              onClick={() => setActiveQuestion('history')}
              className={`p-4 rounded-2xl text-left transition-all duration-300 border cursor-pointer relative flex flex-col justify-between min-h-[104px] ${
                activeQuestion === 'history'
                  ? 'bg-gradient-to-br from-[#7B2CBF]/15 via-[#3C096C]/5 to-transparent border-[#9D4EDD]/50 shadow-[0_0_25px_-5px_rgba(157,78,221,0.25)]'
                  : 'bg-[#0F131D]/80 backdrop-blur-2xl border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:border-[#9D4EDD]/40 hover:bg-[#141926]/85'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium tracking-tight ${
                  activeQuestion === 'history' ? 'text-white font-semibold' : 'text-zinc-300'
                }`}>
                  Full history
                </span>
                <History className={`w-4 h-4 stroke-[1.5] ${
                  activeQuestion === 'history' ? 'text-[#C77DFF]' : 'text-zinc-500'
                }`} />
              </div>
              <div className="text-xs font-normal text-zinc-400 mt-2">
                {activeRecords[0]?.date.split('-')[0]}–2025 timeline
              </div>
            </button>

          </div>
        </section>

        {/* ============================================================= */}
        {/* 3. DEDICATED VIEWS BASED ON USER CHOICE                       */}
        {/* ============================================================= */}
        <main className="w-full">
          
          {/* ----------------------------------------------------------- */}
          {/* VIEW A: "What changed?"                                     */}
          {/* ----------------------------------------------------------- */}
          {activeQuestion === 'changed' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0F131D]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:border-white/[0.16] space-y-6 transition-all duration-300">
              {activeProfile.id === 'PT-1092' ? (
                /* Elena Rostova Case: Cardiotoxicity Medication Titration */
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                      <Calendar className="w-3.5 h-3.5 stroke-[1.5] text-[#00F2FE]" />
                      <span>July 22, 2023</span>
                      <span className="text-zinc-600">·</span>
                      <Building2 className="w-3.5 h-3.5 stroke-[1.5] text-zinc-400" />
                      <span>Apex Cardio-Vascular Specialists</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-[#00F2FE] bg-[#00F2FE]/15 border border-[#00F2FE]/30">
                      GDMT Heart Failure Titration
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-white">
                      Heart failure therapy was doubled to protect failing heart
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Encounter Note ID: DOC-ACVS-2023-4412 · Attending: Dr. Gregory House, MD
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-[#070A10]/90 border border-white/[0.08] backdrop-blur-md">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        Previous Dose
                      </span>
                      <div className="text-lg font-medium text-zinc-400">
                        Lisinopril 5mg PO Daily
                      </div>
                      <p className="text-xs text-zinc-500 font-mono">
                        Class: ACE-Inhibitor (Initial Cardio-Oncology Start)
                      </p>
                    </div>

                    <div className="space-y-1 sm:border-l sm:border-white/[0.08] sm:pl-6">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#00F2FE]">
                        Titrated Regimen
                      </span>
                      <div className="text-lg font-medium text-[#00F2FE] font-mono">
                        Lisinopril 10mg PO Daily
                      </div>
                      <p className="text-xs text-zinc-400 font-mono">
                        Target Dose: Enhanced LV Afterload Reduction
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-1.5">
                    <span className="text-xs font-medium text-white">Why was this changed?</span>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                      Cardiologist titrated Lisinopril to 10mg following chemotherapy cardiotoxicity (LVEF 32%) to arrest adverse myocardial remodeling, preserve ejection fraction, and reduce long-term mortality.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-start">
                    <button
                      onClick={() => handleOpenEvidence(['REC-ER-2023-002'])}
                      className="px-5 py-2.5 rounded-full bg-[#00F2FE]/15 hover:bg-[#00F2FE]/25 border border-[#00F2FE]/40 text-[#00F2FE] text-xs font-medium transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-[0_0_15px_rgba(0,242,254,0.15)] hover:shadow-[0_0_20px_rgba(0,242,254,0.3)]"
                    >
                      <FileText className="w-3.5 h-3.5 stroke-[1.5]" />
                      <span>[ View Original Doctor Note ]</span>
                    </button>
                  </div>
                </>
              ) : (
                /* Ramaswamy K. / Default Case: Lisinopril -> Losartan Switch */
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                      <Calendar className="w-3.5 h-3.5 stroke-[1.5] text-[#00F2FE]" />
                      <span>July 14, 2021</span>
                      <span className="text-zinc-600">·</span>
                      <Building2 className="w-3.5 h-3.5 stroke-[1.5] text-zinc-400" />
                      <span>Mylapore Primary Health & Family Clinic</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-[#00F2FE] bg-[#00F2FE]/15 border border-[#00F2FE]/30">
                      Medication Transition
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-white">
                      Blood pressure tablet was replaced
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Encounter Note ID: DOC-MYL-2021-4402 · Attending: Dr. S. Balasubramanian, MBBS, MD
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-[#070A10]/90 border border-white/[0.08] backdrop-blur-md">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        Previous Medication
                      </span>
                      <div className="text-lg font-medium text-zinc-400 line-through decoration-[#FF1E56] decoration-2">
                        Tab. Lisinopril 10mg
                      </div>
                      <p className="text-xs text-zinc-500 font-mono">
                        Class: ACE-Inhibitor (Oral Daily)
                      </p>
                    </div>

                    <div className="space-y-1 sm:border-l sm:border-white/[0.08] sm:pl-6">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#00F2FE]">
                        New / Replacement Medication
                      </span>
                      <div className="text-lg font-medium text-[#00F2FE] font-mono">
                        Tab. Losartan 20mg OD
                      </div>
                      <p className="text-xs text-zinc-400 font-mono">
                        Class: Angiotensin II Receptor Blocker (ARB)
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-1.5">
                    <span className="text-xs font-medium text-white">Why was this changed?</span>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                      Dr. S. Balasubramanian discontinued Tab. Lisinopril due to persistent, intractable dry cough for &gt;6 weeks post-initiation (&quot;Intractable ACE-inhibitor induced dry cough&quot;). Switched to Tab. Losartan 20mg OD (1-0-0) to maintain blood pressure and renal protection without triggering bradykinin cough reflexes.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-start">
                    <button
                      onClick={() => handleOpenEvidence(['REC-2021-002'])}
                      className="px-5 py-2.5 rounded-full bg-[#00F2FE]/15 hover:bg-[#00F2FE]/25 border border-[#00F2FE]/40 text-[#00F2FE] text-xs font-medium transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-[0_0_15px_rgba(0,242,254,0.15)] hover:shadow-[0_0_20px_rgba(0,242,254,0.3)]"
                    >
                      <FileText className="w-3.5 h-3.5 stroke-[1.5]" />
                      <span>[ View Original Doctor Note ]</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* VIEW B: "What's conflicting?"                               */}
          {/* ----------------------------------------------------------- */}
          {activeQuestion === 'conflicting' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#140D14]/85 backdrop-blur-2xl border border-[#FF1E56]/50 shadow-[0_15px_60px_rgba(255,30,86,0.2)] space-y-6 transition-all duration-300">
              {activeProfile.id === 'PT-1092' ? (
                /* Elena Rostova Case: St. Jude Naproxen vs Apex NSAID Contraindication */
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                      <Calendar className="w-3.5 h-3.5 stroke-[1.5] text-[#FF1E56]" />
                      <span>May 10, 2024</span>
                      <span className="text-zinc-600">·</span>
                      <span>Issued on the exact same date across two care facilities</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-[#FF5A82] bg-[#FF1E56]/20 border border-[#FF1E56]/60 font-semibold animate-pulse">
                      Critical Safety Clash
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-white flex items-center gap-2">
                      <AlertTriangle className="w-6 h-6 stroke-[1.5] text-[#FF1E56]" />
                      <span>Two records written on the same day disagree</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      St. Jude Comprehensive Oncology Center vs Apex Cardio-Vascular Specialists
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-[#070A10]/90 border border-white/[0.08] backdrop-blur-md space-y-2">
                      <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                        Pain Management (St. Jude)
                      </div>
                      <div className="text-base font-medium text-white">
                        Prescribed high-dose Naproxen 500mg Twice Daily for chest wall inflammation.
                      </div>
                      <p className="text-xs text-zinc-400 italic pt-1 border-t border-white/[0.06]">
                        &ldquo;Instructed to take Naproxen 500mg BID with meals for post-mastectomy pain. Advised to continue all meds.&rdquo;
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#070A10]/90 border border-white/[0.08] backdrop-blur-md space-y-2">
                      <div className="text-xs font-mono uppercase tracking-wider text-[#00F2FE]">
                        Cardio-Oncology (Apex Cardio)
                      </div>
                      <div className="text-base font-medium text-white">
                        Explicitly ordered patient to STOP ALL NSAIDs immediately due to heart failure.
                      </div>
                      <p className="text-xs text-zinc-400 italic pt-1 border-t border-white/[0.06]">
                        &ldquo;DO NOT TAKE ANY NSAIDS. Naproxen is contraindicated due to anthracycline heart failure (LVEF 38%). Acetaminophen only.&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FF1E56]/15 border border-[#FF1E56]/35 space-y-1">
                    <span className="text-xs font-semibold text-[#FF5A82] flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-[#FF1E56]" />
                      What is the danger?
                    </span>
                    <p className="text-xs sm:text-sm text-[#FFE4E1] leading-relaxed">
                      Taking Naproxen causes severe renal vasoconstriction, blunts heart failure drugs, causes fluid overload, and triggers acute pulmonary edema.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-start">
                    <button
                      onClick={() => setIsConflictModalOpen(true)}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-[#FF1E56] to-[#BA133B] hover:from-[#e01948] hover:to-[#9e0f31] text-white text-xs font-medium shadow-[0_0_30px_rgba(255,30,86,0.4)] transition-all duration-300 cursor-pointer flex items-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4 stroke-[1.5]" />
                      <span>[ Inspect Both Conflicting Documents ]</span>
                    </button>
                  </div>
                </>
              ) : (
                /* Ramaswamy K. / Default Case: Metformin vs Glipizide Conflict */
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                      <Calendar className="w-3.5 h-3.5 stroke-[1.5] text-[#FF1E56]" />
                      <span>November 4, 2022</span>
                      <span className="text-zinc-600">·</span>
                      <span>Issued on the exact same date across two care facilities</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-[#FF5A82] bg-[#FF1E56]/20 border border-[#FF1E56]/60 font-semibold animate-pulse">
                      Critical Safety Clash
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-white flex items-center gap-2">
                      <AlertTriangle className="w-6 h-6 stroke-[1.5] text-[#FF1E56]" />
                      <span>Two records written on the same day disagree</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Apollo Hospitals (Greams Road, Chennai) vs Mylapore Primary Health & Family Clinic
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-[#070A10]/90 border border-white/[0.08] backdrop-blur-md space-y-2">
                      <div className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                        Inpatient Discharge (Apollo Greams Road)
                      </div>
                      <div className="text-base font-medium text-white">
                        Mandated Tab. Metformin 1000mg PO BD (1-0-1) after meals.
                      </div>
                      <p className="text-xs text-zinc-400 italic pt-1 border-t border-white/[0.06]">
                        &ldquo;Tab. Metformin 1000mg PO BD (1-0-1) after meals. Continue strict adherence for glycemic control.&rdquo; (DOC-APO-2022-9901)
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#070A10]/90 border border-white/[0.08] backdrop-blur-md space-y-2">
                      <div className="text-xs font-mono uppercase tracking-wider text-[#00F2FE]">
                        Primary Clinic Prescription (Mylapore Clinic)
                      </div>
                      <div className="text-base font-medium text-white">
                        Explicitly ordered: &ldquo;DO NOT TAKE METFORMIN&rdquo; and prescribed Tab. Glipizide ER 10mg OD.
                      </div>
                      <p className="text-xs text-zinc-400 italic pt-1 border-t border-white/[0.06]">
                        &ldquo;DO NOT TAKE METFORMIN. Metformin strictly withheld due to borderline renal clearance (eGFR 51 mL/min) and contrast exposure. Start Tab. Glipizide ER 10mg OD.&rdquo; (DOC-MYL-2022-7741)
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FF1E56]/15 border border-[#FF1E56]/35 space-y-1">
                    <span className="text-xs font-semibold text-[#FF5A82] flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-[#FF1E56]" />
                      What is the danger?
                    </span>
                    <p className="text-xs sm:text-sm text-[#FFE4E1] leading-relaxed">
                      Simultaneous intake triggers high risk of Metformin-Associated Lactic Acidosis (MALA) in the setting of impaired renal function (eGFR 51 mL/min) plus severe hypoglycemia from concurrent Glipizide.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-start">
                    <button
                      onClick={() => setIsConflictModalOpen(true)}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-[#FF1E56] to-[#BA133B] hover:from-[#e01948] hover:to-[#9e0f31] text-white text-xs font-medium shadow-[0_0_30px_rgba(255,30,86,0.4)] transition-all duration-300 cursor-pointer flex items-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4 stroke-[1.5]" />
                      <span>[ Inspect Both Conflicting Documents ]</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* VIEW C: "What's missing?"                                   */}
          {/* ----------------------------------------------------------- */}
          {activeQuestion === 'missing' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#141217]/85 backdrop-blur-2xl border border-[#F7971E]/40 shadow-[0_15px_60px_rgba(247,151,30,0.15)] space-y-6 transition-all duration-300">
              {activeProfile.id === 'PT-1092' ? (
                /* Elena Rostova Case: 8-Month Post-Chemo Care Void */
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                      <Clock className="w-3.5 h-3.5 stroke-[1.5] text-[#F7971E]" />
                      <span>March 18, 2022 ───► November 20, 2022</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-[#F7971E] bg-[#F7971E]/15 border border-[#F7971E]/30">
                      247 Days Missing
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-white flex items-center gap-2">
                      <AlertCircle className="w-6 h-6 stroke-[1.5] text-[#F7971E]" />
                      <span>8 months with zero cardiology follow-ups</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Unmonitored interval between chemotherapy completion and acute heart failure presentation
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#070A10]/90 border border-white/[0.08] backdrop-blur-md space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                      <div className="text-zinc-300">
                        <span className="text-zinc-500 block text-[10px]">BEFORE GAP:</span>
                        2022-03-18 · St. Jude (Chemo Complete, LVEF 58%)
                      </div>
                      <div className="text-right text-zinc-300">
                        <span className="text-zinc-500 block text-[10px]">AFTER GAP:</span>
                        2022-11-20 · Urgent Care (Dyspnea, LVEF 32%)
                      </div>
                    </div>

                    <div className="relative py-3 flex items-center">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 shrink-0 shadow-sm" />
                      <div className="flex-1 h-[2px] mx-2 border-t-2 border-dashed border-[#F7971E]/80 relative">
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0F131D] px-2 text-[10px] font-mono text-[#F7971E] border border-[#F7971E]/40 rounded-full">
                          8-Month Post-Chemo Void (247 Days)
                        </span>
                      </div>
                      <div className="w-3 h-3 rounded-full bg-[#FF1E56] shrink-0 shadow-[0_0_10px_#FF1E56]" />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-1.5">
                    <span className="text-xs font-medium text-white">Clinical Consequence</span>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                      Elena vanished from clinical surveillance for 8 months after completing doxorubicin. By the time symptoms forced an urgent care visit, she had developed severe Anthracycline cardiotoxicity with an ejection fraction of 32%.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-start">
                    <button
                      onClick={() => handleOpenEvidence(['REC-ER-2022-001', 'REC-ER-2022-002'])}
                      className="px-5 py-2.5 rounded-full bg-[#F7971E]/15 hover:bg-[#F7971E]/25 border border-[#F7971E]/40 text-[#F7971E] text-xs font-medium transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-[0_0_15px_rgba(247,151,30,0.15)] hover:shadow-[0_0_20px_rgba(247,151,30,0.3)]"
                    >
                      <FileText className="w-3.5 h-3.5 stroke-[1.5]" />
                      <span>[ Inspect Surrounding Encounters ]</span>
                    </button>
                  </div>
                </>
              ) : (
                /* Ramaswamy K. / Default Case: 10.9-Month Care Gap */
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                      <Clock className="w-3.5 h-3.5 stroke-[1.5] text-[#F7971E]" />
                      <span>March 20, 2023 ───► February 15, 2024</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-[#F7971E] bg-[#F7971E]/15 border border-[#F7971E]/30">
                      332 Days Missing
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-white flex items-center gap-2">
                      <AlertCircle className="w-6 h-6 stroke-[1.5] text-[#F7971E]" />
                      <span>10 months with zero medical checkups</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Surveillance gap detected across all participating care networks
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#070A10]/90 border border-white/[0.08] backdrop-blur-md space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                      <div className="text-zinc-300">
                        <span className="text-zinc-500 block text-[10px]">BEFORE GAP:</span>
                        2023-03-20 · Sundaram Medical Foundation (Ankle Sprain)
                      </div>
                      <div className="text-right text-zinc-300">
                        <span className="text-zinc-500 block text-[10px]">AFTER GAP:</span>
                        2024-02-15 · Apollo Hospitals ED (Prerenal Azotemia)
                      </div>
                    </div>

                    <div className="relative py-3 flex items-center">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 shrink-0 shadow-sm" />
                      <div className="flex-1 h-[2px] mx-2 border-t-2 border-dashed border-[#F7971E]/80 relative">
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0F131D] px-2 text-[10px] font-mono text-[#F7971E] border border-[#F7971E]/40 rounded-full">
                          10.9-Month Care Void (332 Days)
                        </span>
                      </div>
                      <div className="w-3 h-3 rounded-full bg-[#FF1E56] shrink-0 shadow-[0_0_10px_#FF1E56]" />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-1.5">
                    <span className="text-xs font-medium text-white">Clinical Consequence</span>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                      332 days with zero clinic visits, prescription refills, or lab tracking while Ramaswamy was residing at his ancestral home in rural Thanjavur. Unmonitored progression of diabetic nephropathy resulted in emergency admission with acute dehydration, elevated creatinine (1.82 mg/dL), and accelerated renal decline into Stage 3b CKD.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-start">
                    <button
                      onClick={() => handleOpenEvidence(['REC-2023-001', 'REC-2024-001'])}
                      className="px-5 py-2.5 rounded-full bg-[#F7971E]/15 hover:bg-[#F7971E]/25 border border-[#F7971E]/40 text-[#F7971E] text-xs font-medium transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-[0_0_15px_rgba(247,151,30,0.15)] hover:shadow-[0_0_20px_rgba(247,151,30,0.3)]"
                    >
                      <FileText className="w-3.5 h-3.5 stroke-[1.5]" />
                      <span>[ Inspect Surrounding Encounters ]</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* VIEW D: "Full history"                                      */}
          {/* ----------------------------------------------------------- */}
          {activeQuestion === 'history' && (
            <div className="space-y-6">
              {/* Full Timeline Rail Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0F131D]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:border-white/[0.16] space-y-4 transition-all duration-300">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div>
                    <h3 className="text-base font-medium text-white tracking-tight">
                      Full Longitudinal Chronology ({activeProfile.name})
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {activeRecords.length} Normalized encounters across {activeProfile.participatingInstitutions?.length || 4} institutions. Click any node to inspect.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-[#C77DFF] bg-[#7B2CBF]/15 px-2.5 py-0.5 rounded-full border border-[#9D4EDD]/30">
                    {activeRecords.length} Encounters
                  </span>
                </div>

                <TimelineRail
                  records={activeRecords}
                  events={timelineEvents}
                  selectedEventId={selectedEvent?.id}
                  onSelectEvent={handleSelectEvent}
                  onOpenConflictModal={() => setIsConflictModalOpen(true)}
                />
              </div>

              {/* Full Trajectory Area Curve Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0F131D]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] hover:border-white/[0.16] space-y-4 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-medium text-white tracking-tight">
                      {activeProfile.id === 'PT-1092' ? 'Cardiac Ejection Fraction (LVEF %) Trajectory' : 'Kidney Function Trajectory (2019–2025)'}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {activeProfile.id === 'PT-1092' ? 'Anthracycline cardiotoxicity drop and recovery curve' : 'Serum Creatinine (mg/dL) elevation and eGFR filtration drop'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/[0.06] text-xs font-mono self-start sm:self-auto">
                    {(['1Y', '3Y', '5Y', 'ALL'] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setTimeRange(r)}
                        className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                          timeRange === r
                            ? 'bg-white/[0.14] text-white font-medium shadow-sm'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full h-64 sm:h-72 pt-2 min-w-0 relative">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <AreaChart
                      data={filteredChartData}
                      margin={{ top: 20, right: 20, left: -20, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="historyChartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={activeProfile.id === 'PT-1092' ? '#FF1E56' : '#00F2FE'} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={activeProfile.id === 'PT-1092' ? '#FF1E56' : '#00F2FE'} stopOpacity={0.0} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255, 255, 255, 0.05)"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="dateKey"
                        stroke="#52525B"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: 'rgba(255, 255, 255, 0.06)' }}
                      />

                      <YAxis
                        stroke="#52525B"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: 'rgba(255, 255, 255, 0.06)' }}
                        domain={activeProfile.id === 'PT-1092' ? [20, 75] : [0.7, 2.3]}
                      />

                      <ReferenceArea
                        x1={activeProfile.id === 'PT-1092' ? 'Mar 22' : 'Mar 23'}
                        x2={activeProfile.id === 'PT-1092' ? 'Nov 22' : 'Feb 24'}
                        fill="#F7971E"
                        fillOpacity={0.09}
                        stroke="#F7971E"
                        strokeDasharray="3 3"
                        strokeOpacity={0.35}
                      />

                      <ReferenceLine
                        x={activeProfile.id === 'PT-1092' ? 'May 24' : 'Nov 22'}
                        stroke="#FF1E56"
                        strokeWidth={1.5}
                      />

                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-[#0F131D]/95 backdrop-blur-2xl border border-white/[0.12] p-3.5 rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.6)] text-xs space-y-1.5 min-w-[240px]">
                                <div className="flex items-center justify-between gap-3">
                                  <span className="font-mono text-zinc-400 font-medium">
                                    {data.fullDate}
                                  </span>
                                  {data.isConflict && (
                                    <span className="px-1.5 py-0.5 rounded bg-[#FF1E56]/20 text-[#FF5A82] border border-[#FF1E56]/40 font-mono text-[10px] animate-pulse">
                                      Conflict
                                    </span>
                                  )}
                                  {data.isMedChange && (
                                    <span className="px-1.5 py-0.5 rounded bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/30 font-mono text-[10px]">
                                      Rx Switch
                                    </span>
                                  )}
                                </div>
                                <div className="text-base font-light text-white font-mono">
                                  {data.label}
                                </div>
                                <div className="text-[11px] text-zinc-300 pt-1 border-t border-white/[0.08]">
                                  {data.milestone}
                                </div>
                                <div className="text-[10px] text-zinc-500 font-mono flex items-center justify-between pt-1">
                                  <span>{data.facility.split(' ')[0]}</span>
                                  <span className="text-[#00F2FE] underline cursor-pointer">
                                    {data.recordId}
                                  </span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />

                      <Area
                        type="monotone"
                        dataKey="val"
                        stroke={activeProfile.id === 'PT-1092' ? '#FF1E56' : '#00F2FE'}
                        strokeWidth={2}
                        fill="url(#historyChartGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* ============================================================= */}
      {/* 4. MODALS & DRAWERS (INTEGRATED DATA INGESTION & COMPARISON)   */}
      {/* ============================================================= */}
      
      {/* Data Ingestion & Multi-Patient Modal */}
      <ImportRecordsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onLoadPatient={handleLoadPatient}
        activePatientId={activeProfile.id}
      />

      {/* Cross-Facility Conflict Modal */}
      <ConflictModal
        isOpen={isConflictModalOpen}
        onClose={() => setIsConflictModalOpen(false)}
        conflict={conflicts[0]}
        records={activeRecords}
        onViewEvidence={(ids) => handleOpenEvidence(ids)}
      />

      {/* Event Inspector Slide-over */}
      <EventInspector
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        event={selectedEvent}
        records={activeRecords}
        onOpenEvidence={(id) => handleOpenEvidence([id])}
        onOpenConflictModal={() => setIsConflictModalOpen(true)}
      />

      {/* Evidence Source Document Drawer */}
      <EvidenceDrawer
        isOpen={isEvidenceDrawerOpen}
        onClose={() => setIsEvidenceDrawerOpen(false)}
        recordIds={evidenceDrawerRecordIds}
        records={activeRecords}
      />
    </div>
  );
};
