'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  User,
  Activity,
  Heart,
  ShieldAlert,
  ArrowRight,
  Database,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { MedicalRecord, PatientProfile } from '../../types/medical';
import { PATIENT_PT2041_PROFILE, PATIENT_PT2041_RECORDS } from '../../data/patientPT2041';
import { PATIENT_PT1092_PROFILE, PATIENT_PT1092_RECORDS } from '../../data/patientPT1092';

interface ImportRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadPatient: (profile: PatientProfile, records: MedicalRecord[]) => void;
  activePatientId: string;
}

export const ImportRecordsModal: React.FC<ImportRecordsModalProps> = ({
  isOpen,
  onClose,
  onLoadPatient,
  activePatientId,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();

    if (file.name.endsWith('.json')) {
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          const records: MedicalRecord[] = Array.isArray(parsed) ? parsed : parsed.records || [parsed];

          const customProfile: PatientProfile = parsed.profile || {
            id: parsed.patientId || `PT-CUSTOM-${Math.floor(1000 + Math.random() * 9000)}`,
            name: parsed.patientName || file.name.replace('.json', ''),
            dob: '1970-01-01',
            gender: 'Unknown',
            mrn: `MRN-CUSTOM-${Math.floor(100000 + Math.random() * 900000)}`,
            primaryCareProvider: 'Attending Physician',
            chronicConditions: ['Imported Patient History'],
            allergies: ['None Reported'],
            participatingInstitutions: Array.from(new Set(records.map((r) => r.institution || 'Care Facility'))),
          };

          setImportStatus(`Successfully parsed ${records.length} records from ${file.name}`);
          setImportedCount(records.length);

          setTimeout(() => {
            onLoadPatient(customProfile, records);
            onClose();
          }, 800);
        } catch (err) {
          console.error(err);
          setImportStatus('Failed to parse JSON. Please check file format.');
        }
      };
      reader.readAsText(file);
    } else {
      // Raw plain-text file (.txt)
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        const title = lines[0]?.slice(0, 80) || file.name.replace('.txt', '');

        // Auto-wrap into a new MedicalRecord
        const customRecord: MedicalRecord = {
          id: `REC-CUSTOM-${Math.floor(1000 + Math.random() * 9000)}`,
          patientId: 'PT-CUSTOM',
          type: 'outpatient_note',
          date: new Date().toISOString(),
          institution: file.name.includes('Hospital') ? 'Imported Hospital' : 'Imported Outpatient Clinic',
          title: title,
          sourceDocumentId: `DOC-IMPORT-${Math.floor(10000 + Math.random() * 90000)}`,
          author: 'Imported Clinical Note Author',
          department: 'General Medicine',
          content: text,
          structuredData: {
            medications: [],
            activePrescriptions: [],
          },
        };

        const customProfile: PatientProfile = {
          id: 'PT-CUSTOM',
          name: file.name.replace('.txt', '').replace(/_/g, ' '),
          dob: '1975-06-15',
          gender: 'Specified',
          mrn: `MRN-IMPORT-${Math.floor(100000 + Math.random() * 900000)}`,
          primaryCareProvider: 'Imported Clinical Team',
          chronicConditions: ['Imported Clinical Chart'],
          allergies: ['No Known Drug Allergies (NKDA)'],
          participatingInstitutions: [customRecord.institution],
        };

        setImportStatus(`Created normalized clinical record from ${file.name}`);
        setImportedCount(1);

        setTimeout(() => {
          onLoadPatient(customProfile, [customRecord]);
          onClose();
        }, 800);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0F131D]/95 backdrop-blur-2xl border border-white/[0.1] rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] bg-white/[0.02] flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#00F2FE]/15 border border-[#00F2FE]/30 text-[#00F2FE] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(0,242,254,0.2)]">
              <Database className="w-5 h-5 stroke-[1.4]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-medium text-white tracking-tight">
                Import Medical Records &amp; Patient Cases
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Ingest unstructured clinical notes or switch between multi-hospital patient benchmarks.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[1.4]" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* SECTION 1: Drag & Drop Dropzone */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300 block">
              1. Ingest Clinical Documents (.txt or .json)
            </label>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center space-y-3 ${
                dragActive
                  ? 'border-[#00F2FE] bg-[#00F2FE]/10 scale-[1.01] shadow-[0_0_25px_rgba(0,242,254,0.2)]'
                  : 'border-white/[0.12] bg-[#070A10]/60 hover:bg-[#070A10]/90 hover:border-[#00F2FE]/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.json"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#00F2FE] shadow-[0_0_15px_rgba(0,242,254,0.15)]">
                <Upload className="w-5 h-5 stroke-[1.4]" />
              </div>

              <div>
                <span className="text-sm font-medium text-white">
                  Drop medical records here or <span className="text-[#00F2FE] underline">browse files</span>
                </span>
                <p className="text-xs text-zinc-500 mt-1 font-mono">
                  Accepts unstructured plain-text notes (.txt) or pre-parsed FHIR/JSON (.json)
                </p>
              </div>

              {importStatus && (
                <div className="mt-2 px-3 py-1.5 rounded-full bg-[#00F2FE]/15 border border-[#00F2FE]/30 text-[#00F2FE] text-xs font-mono flex items-center gap-2 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{importStatus}</span>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2: Quick-Load Pre-parsed Cases */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-300">
                2. Quick-Load Pre-Parsed Benchmark Cases (Judge Demonstration)
              </label>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Instant 1-Click Load</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Case 1: Ramaswamy K. (TN-UHID-88412) */}
              <div
                onClick={() => {
                  onLoadPatient(PATIENT_PT2041_PROFILE, PATIENT_PT2041_RECORDS);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer relative group flex flex-col justify-between space-y-3 ${
                  activePatientId === 'PT-2041'
                    ? 'bg-[#0F1824] border-[#00F2FE]/50 shadow-[0_0_25px_rgba(0,242,254,0.2)]'
                    : 'bg-[#070A10]/70 border-white/[0.08] hover:bg-[#0F1824]/60 hover:border-[#00F2FE]/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-[#00F2FE] font-medium flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>Case 1 (Default)</span>
                    </span>
                    {activePatientId === 'PT-2041' && (
                      <span className="px-2 py-0.5 rounded-full bg-[#00F2FE]/15 text-[#00F2FE] text-[10px] font-mono font-semibold border border-[#00F2FE]/30">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-medium text-white mt-1.5">
                    Ramaswamy K. · TN-UHID-88412
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    15 records across 4 Chennai care facilities with CKD 3b progression, Lisinopril dry cough switch, and concurrent Metformin/Glipizide clash.
                  </p>
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>15 Records · 4 Facilities</span>
                  <span className="text-[#00F2FE] group-hover:underline flex items-center gap-1">
                    <span>Load Case</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Case 2: Elena Rostova (PT-1092) */}
              <div
                onClick={() => {
                  onLoadPatient(PATIENT_PT1092_PROFILE, PATIENT_PT1092_RECORDS);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer relative group flex flex-col justify-between space-y-3 ${
                  activePatientId === 'PT-1092'
                    ? 'bg-[#1C0E14] border-[#FF1E56]/60 shadow-[0_0_25px_rgba(255,30,86,0.25)]'
                    : 'bg-[#070A10]/70 border-white/[0.08] hover:bg-[#1C0E14]/60 hover:border-[#FF1E56]/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-[#FF5A82] font-medium flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-[#FF1E56]" />
                      <span>Case 2 · Cardio-Oncology</span>
                    </span>
                    {activePatientId === 'PT-1092' && (
                      <span className="px-2 py-0.5 rounded-full bg-[#FF1E56]/20 text-[#FF5A82] text-[10px] font-mono font-semibold border border-[#FF1E56]/40 animate-pulse">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-medium text-white mt-1.5">
                    Elena Rostova · PT-1092
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Anthracycline cardiotoxicity (LVEF 32%), 8-month chemo-cardiac void, and dangerous 2024 NSAID contraindication conflict.
                  </p>
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>10 Records · 4 Facilities</span>
                  <span className="text-[#FF5A82] group-hover:underline flex items-center gap-1">
                    <span>Load Case</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-white/[0.01] flex items-center justify-between text-xs text-zinc-400">
          <span className="font-mono text-[11px]">
            Active Patient: <strong className="text-white">{activePatientId}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            Dismiss
          </button>
        </div>

      </div>
    </div>
  );
};
