export type MedicalRecordType =
  | 'discharge_summary'
  | 'outpatient_note'
  | 'prescription'
  | 'lab_result'
  | 'consultation'
  | 'emergency_visit'
  | 'imaging_report';

export interface StructuredRecordData {
  medications?: string[];
  activePrescriptions?: string[];
  discontinuedPrescriptions?: string[];
  labs?: Record<string, { value: number; unit: string; flag?: 'HIGH' | 'LOW' | 'NORMAL' | 'CRITICAL' }>;
  vitals?: Record<string, string | number>;
  diagnoses?: string[];
  provider?: string;
  department?: string;
}

export interface MedicalRecord {
  id: string;
  type: MedicalRecordType | string;
  date: string; // ISO 8601 YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
  institution: string;
  title: string;
  sourceDocumentId: string;
  content: string; // Plain-text clinical document content for evidence drawer
  patientId?: string;
  author?: string;
  department?: string;
  structuredData?: StructuredRecordData;
}

export interface TimelineEventFlags {
  conflict?: boolean;
  missing?: boolean;
  medicationChange?: boolean;
  trend?: boolean;
}

export type TimelineEventCategory =
  | 'encounter'
  | 'medication_change'
  | 'conflict'
  | 'temporal_gap'
  | 'lab_trend'
  | 'diagnostic'
  | 'inpatient_stay';

export type TimelineEventSeverity = 'info' | 'low' | 'moderate' | 'high' | 'critical';

export interface TimelineEvent {
  id: string;
  date: string;
  type: string;
  title: string;
  description: string;
  sourceIds: string[];
  flags: TimelineEventFlags;
  institution?: string;
  category?: TimelineEventCategory;
  severity?: TimelineEventSeverity;
  metadata?: Record<string, unknown>;
}

export interface ConflictDetail {
  id: string;
  date: string;
  recordAId: string;
  recordBId: string;
  reason: string;
  flaggedItem: string;
  institutionA?: string;
  institutionB?: string;
  titleA?: string;
  titleB?: string;
  valueA?: string;
  valueB?: string;
  clinicalRisk?: string;
}

export interface MedicationChange {
  id: string;
  date: string;
  previousMed: string;
  currentMed: string;
  sourceId: string;
  reason?: string;
  institution?: string;
  prescriber?: string;
}

export interface TemporalGap {
  id: string;
  startDate: string;
  endDate: string;
  gapMonths: number;
  gapDays: number;
  priorRecordId: string;
  nextRecordId: string;
  description: string;
  clinicalSignificance: string;
}

export interface LabTrendPoint {
  date: string;
  value: number;
  recordId: string;
  institution: string;
  interpretation?: string;
  stage?: string;
}

export interface LongitudinalTrend {
  id: string;
  biomarker: string;
  unit: string;
  normalRange: string;
  points: LabTrendPoint[];
  direction: 'worsening' | 'improving' | 'stable' | 'fluctuating';
  deltaPercent: number;
  clinicalSignificance: string;
  alertLevel: 'low' | 'moderate' | 'high' | 'critical';
}

export interface TimelineEventWithSources extends TimelineEvent {
  sourceRecords: MedicalRecord[];
  conflictDetails?: ConflictDetail;
  medicationChangeDetails?: MedicationChange;
  gapDetails?: TemporalGap;
  trendDetails?: LongitudinalTrend;
}

export interface PatientProfile {
  id: string;
  name: string;
  dob: string;
  gender: string;
  mrn: string;
  primaryCareProvider: string;
  chronicConditions: string[];
  allergies: string[];
  participatingInstitutions: string[];
}
