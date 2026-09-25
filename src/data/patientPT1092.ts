import { MedicalRecord, PatientProfile } from '../types/medical';

export const PATIENT_PT1092_PROFILE: PatientProfile = {
  id: 'PT-1092',
  name: 'Elena Rostova',
  dob: '1974-11-15',
  gender: 'Female',
  mrn: 'MRN-4491028-ER',
  primaryCareProvider: 'Dr. Marcus Webb, MD (St. Jude Oncology Institute)',
  chronicConditions: [
    'Invasive Ductal Carcinoma, Left Breast (ICD-10 C50.912)',
    'Chemotherapy-Induced Cardiotoxicity (ICD-10 I42.7)',
    'Heart Failure with Reduced Ejection Fraction - HFrEF Stage C (ICD-10 I50.22)',
    'Chronic Post-Mastectomy Pain Syndrome (ICD-10 G89.29)',
  ],
  allergies: ['Sulfa Drugs (Stevens-Johnson syndrome risk)', 'Codeine (Severe Nausea)'],
  participatingInstitutions: [
    'St. Jude Comprehensive Oncology Center',
    'Apex Cardio-Vascular Specialists',
    'Mercy Highland Outpatient Clinic',
    'Evergreen Valley Community Urgent Care',
  ],
};

export const PATIENT_PT1092_RECORDS: MedicalRecord[] = [
  // 1. 2020-04-10: Surgical Oncology Consultation & Lumpectomy / Mastectomy
  {
    id: 'REC-ER-2020-001',
    patientId: 'PT-1092',
    type: 'inpatient_discharge',
    date: '2020-04-10T14:00:00Z',
    institution: 'St. Jude Comprehensive Oncology Center',
    title: 'Surgical Pathology & Left Breast Mastectomy Operative Summary',
    sourceDocumentId: 'DOC-SJONC-2020-1102',
    author: 'Dr. Sarah Lin, MD (Surgical Oncology)',
    department: 'Surgical Oncology',
    content: `ST. JUDE COMPREHENSIVE ONCOLOGY CENTER
SURGICAL PATHOLOGY & OPERATIVE DISCHARGE SUMMARY
PATIENT: Elena Rostova | DOB: 1974-11-15 | MRN: MRN-4491028-ER
DATE OF PROCEDURE: 2020-04-10

PREOPERATIVE DIAGNOSIS: Invasive Ductal Carcinoma, Left Breast, Stage IIA (T2N0M0), ER+/PR+, HER2-.
PROCEDURE PERFORMED: Left Total Mastectomy with Sentinel Lymph Node Biopsy.
FINDINGS: Negative margins confirmed on frozen section. 0/3 sentinel lymph nodes positive.
DISCHARGE PLAN: Healing uneventful. Scheduled for adjuvant anthracycline-based chemotherapy following surgical recovery. Baseline cardiac echo ordered.`,
    structuredData: {
      medications: ['Acetaminophen 650mg PO Q6H PRN', 'Cephalexin 500mg PO QID x 7d'],
      activePrescriptions: ['Acetaminophen 650mg PO Q6H PRN'],
      vitals: { BP: '118/76 mmHg', HR: 72, Weight: '64.2 kg' },
    },
  },

  // 2. 2020-06-15: Adjuvant Doxorubicin Chemotherapy Initiation
  {
    id: 'REC-ER-2020-002',
    patientId: 'PT-1092',
    type: 'outpatient_note',
    date: '2020-06-15T10:30:00Z',
    institution: 'St. Jude Comprehensive Oncology Center',
    title: 'Adjuvant Chemotherapy Protocol: Doxorubicin + Cyclophosphamide',
    sourceDocumentId: 'DOC-SJONC-2020-3349',
    author: 'Dr. Marcus Webb, MD (Medical Oncology)',
    department: 'Medical Oncology',
    content: `ST. JUDE COMPREHENSIVE ONCOLOGY CENTER - MEDICAL ONCOLOGY
PATIENT: Elena Rostova | MRN: MRN-4491028-ER | DATE: 2020-06-15

REGIMEN: Doxorubicin (Adriamycin) 60 mg/m2 IV + Cyclophosphamide 600 mg/m2 IV (Cycle 1 of 4).
BASELINE CARDIAC FUNCTION: Echocardiogram baseline Left Ventricular Ejection Fraction (LVEF) 64%. Normal chamber dimensions.
CAUTION: Anthracycline cumulative dose strict tracking protocol active. Patient counseled regarding potential long-term cardiotoxicity risks.`,
    structuredData: {
      medications: ['Doxorubicin 60mg/m2 IV', 'Cyclophosphamide 600mg/m2 IV', 'Ondansetron 8mg PO BID'],
      activePrescriptions: ['Doxorubicin 60mg/m2 IV', 'Cyclophosphamide 600mg/m2 IV'],
      vitals: { BP: '122/80 mmHg', HR: 76, Weight: '63.8 kg' },
      labs: {
        LVEF: { value: 64, unit: '%', flag: 'NORMAL' },
      },
    },
  },

  // 3. 2022-03-18: Chemotherapy Completion & Remission Surveillance
  {
    id: 'REC-ER-2022-001',
    patientId: 'PT-1092',
    type: 'outpatient_note',
    date: '2022-03-18T11:00:00Z',
    institution: 'St. Jude Comprehensive Oncology Center',
    title: 'End of Adjuvant Chemotherapy Summary & Tamoxifen Initiation',
    sourceDocumentId: 'DOC-SJONC-2022-5581',
    author: 'Dr. Marcus Webb, MD (Medical Oncology)',
    department: 'Medical Oncology',
    content: `ST. JUDE COMPREHENSIVE ONCOLOGY CENTER
PATIENT: Elena Rostova | MRN: MRN-4491028-ER | DATE: 2022-03-18

ASSESSMENT: Completed all cycles of anthracycline chemotherapy. Surveillance imaging reveals no recurrent neoplastic disease. Patient in complete clinical remission.
MEDICATION UPDATE:
- Initiate Tamoxifen 20mg PO Daily hormonal suppression.
- Discontinue all acute antiemetics.
- Re-check echocardiogram recommended in 12 months for anthracycline surveillance.`,
    structuredData: {
      medications: ['Tamoxifen 20mg PO Daily'],
      activePrescriptions: ['Tamoxifen 20mg PO Daily'],
      vitals: { BP: '124/82 mmHg', HR: 78, Weight: '65.1 kg' },
      labs: {
        LVEF: { value: 58, unit: '%', flag: 'NORMAL' },
      },
    },
  },

  // 4. TEMPORAL GAP / MISSING INTERVAL: 2022-03-18 to 2022-11-20 (8-Month Care Void)
  // Patient lost to follow-up between chemo completion and acute cardiac onset.

  // 5. 2022-11-20: Acute Exertional Dyspnea & Apex Cardiology Referral
  {
    id: 'REC-ER-2022-002',
    patientId: 'PT-1092',
    type: 'emergency_admission',
    date: '2022-11-20T16:45:00Z',
    institution: 'Evergreen Valley Community Urgent Care',
    title: 'Urgent Care Encounter: Progressive Dyspnea & Orthopnea',
    sourceDocumentId: 'DOC-EVC-2022-8819',
    author: 'Dr. Alan Vance, MD (Emergency Medicine)',
    department: 'Urgent Care Ambulatory',
    content: `EVERGREEN VALLEY COMMUNITY URGENT CARE
PATIENT: Elena Rostova | MRN: MRN-4491028-ER | DATE: 2022-11-20

CHIEF COMPLAINT: Progressive shortness of breath over 3 weeks, now requiring 3 pillows to sleep.
INTERVAL VOID NOTE: Patient has had zero clinical contacts for past 8 months since March 2022.
PHYSICAL EXAM: Bilateral basilar crackles, 2+ pitting lower extremity edema. Elevated JVP.
ECG: Sinus tachycardia with non-specific ST changes.
DISPOSITION: Urgent outpatient referral placed to Apex Cardio-Vascular Specialists for comprehensive heart failure workup.`,
    structuredData: {
      medications: ['Furosemide 20mg PO Daily (short course)'],
      activePrescriptions: ['Tamoxifen 20mg PO Daily', 'Furosemide 20mg PO Daily'],
      vitals: { BP: '136/88 mmHg', HR: 98, Weight: '68.4 kg', SpO2: '93%' },
    },
  },

  // 6. 2023-01-14: Apex Cardio-Vascular Specialists - Acute Heart Failure Confirmed
  {
    id: 'REC-ER-2023-001',
    patientId: 'PT-1092',
    type: 'cardiology_consult',
    date: '2023-01-14T09:15:00Z',
    institution: 'Apex Cardio-Vascular Specialists',
    title: 'Comprehensive Cardio-Oncology Evaluation: HFrEF Diagnosed',
    sourceDocumentId: 'DOC-ACVS-2023-1044',
    author: 'Dr. Gregory House, MD (Cardio-Oncology)',
    department: 'Cardiology / Heart Failure Service',
    content: `APEX CARDIO-VASCULAR SPECIALISTS - CARDIO-ONCOLOGY CLINIC
PATIENT: Elena Rostova | MRN: MRN-4491028-ER | DATE: 2023-01-14

DIAGNOSIS: Anthracycline-Induced Cardiomyopathy with Heart Failure with Reduced Ejection Fraction (HFrEF Stage C, NYHA Class III).
ECHOCARDIOGRAM FINDINGS: Severe global hypokinesis. LVEF dropped precipitously to 32% (Baseline 64%). Elevated NT-proBNP 2,840 pg/mL.
THERAPEUTIC DIRECTIVE:
1. Initiate GDMT guideline-directed heart failure therapy: Lisinopril 5mg PO Daily (titrate to 10mg) + Metoprolol Succinate 25mg PO Daily.
2. CRITICAL PRECAUTION: Strict avoidance of all NSAIDs (Ibuprofen, Naproxen, Celecoxib, Meloxicam). NSAIDs cause renal sodium retention and acute decompensated heart failure exacerbation in HFrEF.`,
    structuredData: {
      medications: ['Lisinopril 5mg PO Daily', 'Metoprolol Succinate 25mg PO Daily', 'Tamoxifen 20mg PO Daily'],
      activePrescriptions: ['Lisinopril 5mg PO Daily', 'Metoprolol Succinate 25mg PO Daily', 'Tamoxifen 20mg PO Daily'],
      vitals: { BP: '112/72 mmHg', HR: 68, Weight: '66.1 kg' },
      labs: {
        LVEF: { value: 32, unit: '%', flag: 'CRITICAL' },
        NTproBNP: { value: 2840, unit: 'pg/mL', flag: 'HIGH' },
      },
    },
  },

  // 7. 2023-07-22: Apex Follow-up - Lisinopril Titration & Cardiac Stabilization
  {
    id: 'REC-ER-2023-002',
    patientId: 'PT-1092',
    type: 'cardiology_consult',
    date: '2023-07-22T14:30:00Z',
    institution: 'Apex Cardio-Vascular Specialists',
    title: 'HFrEF Surveillance: GDMT Titration to Lisinopril 10mg',
    sourceDocumentId: 'DOC-ACVS-2023-4412',
    author: 'Dr. Gregory House, MD (Cardio-Oncology)',
    department: 'Cardiology / Heart Failure Service',
    content: `APEX CARDIO-VASCULAR SPECIALISTS
PATIENT: Elena Rostova | MRN: MRN-4491028-ER | DATE: 2023-07-22

MEDICATION CHANGE:
- Titrated Lisinopril from 5mg PO Daily to Lisinopril 10mg PO Daily.
- Metoprolol Succinate continued at 25mg PO Daily.
REPEAT ECHO: LVEF mildly improved to 38%. NT-proBNP decreased to 1,420 pg/mL.
NOTE: Reinforce strictly to patient and outside facilities: ALL NSAIDs ABSOLUTELY CONTRAINDICATED in this patient due to fragile LV systolic reserve.`,
    structuredData: {
      medications: ['Lisinopril 10mg PO Daily', 'Metoprolol Succinate 25mg PO Daily', 'Tamoxifen 20mg PO Daily'],
      activePrescriptions: ['Lisinopril 10mg PO Daily', 'Metoprolol Succinate 25mg PO Daily', 'Tamoxifen 20mg PO Daily'],
      vitals: { BP: '116/74 mmHg', HR: 64, Weight: '65.4 kg' },
      labs: {
        LVEF: { value: 38, unit: '%', flag: 'LOW' },
        NTproBNP: { value: 1420, unit: 'pg/mL', flag: 'HIGH' },
      },
    },
  },

  // 8. 2024-05-10 CONFLICT RECORD A: St. Jude restarts high-dose NSAID for pain
  {
    id: 'REC-ER-2024-001',
    patientId: 'PT-1092',
    type: 'outpatient_note',
    date: '2024-05-10T10:15:00Z',
    institution: 'St. Jude Comprehensive Oncology Center',
    title: 'Post-Mastectomy Pain Clinic: High-Dose Naproxen Prescribed',
    sourceDocumentId: 'DOC-SJONC-2024-7719',
    author: 'Dr. Allison Cameron, MD (Palliative / Pain Service)',
    department: 'Pain Management Service',
    content: `ST. JUDE COMPREHENSIVE ONCOLOGY CENTER - PAIN MANAGEMENT
PATIENT: Elena Rostova | MRN: MRN-4491028-ER | DATE: 2024-05-10 10:15 EST

CHIEF COMPLAINT: Recurrent chronic left chest wall neuropathic and inflammatory pain. Patient reluctant to use opioids due to codeine sensitivity.
PRESCRIBED THERAPY (DRUG A):
- Drug A: Naproxen 500mg PO BID (Twice Daily) with meals.
DISCHARGE ORDER: "Patient instructed to take Naproxen 500mg Twice Daily for chest wall inflammation. Advised to continue current medications without alteration."
STATUS: Active Order Issued.`,
    structuredData: {
      medications: ['Naproxen 500mg PO BID', 'Tamoxifen 20mg PO Daily'],
      activePrescriptions: ['Naproxen 500mg PO BID', 'Tamoxifen 20mg PO Daily'],
      vitals: { BP: '128/82 mmHg', HR: 74, Weight: '65.2 kg' },
    },
  },

  // 9. 2024-05-10 CONFLICT RECORD B: Apex Cardiology explicitly contraindicates NSAIDs
  {
    id: 'REC-ER-2024-002',
    patientId: 'PT-1092',
    type: 'cardiology_consult',
    date: '2024-05-10T15:30:00Z',
    institution: 'Apex Cardio-Vascular Specialists',
    title: 'Urgent Cardio-Renal Directive: Strict NSAID Contraindication Mandate',
    sourceDocumentId: 'DOC-ACVS-2024-9981',
    author: 'Dr. Gregory House, MD (Cardio-Oncology)',
    department: 'Cardiology / Heart Failure Service',
    content: `APEX CARDIO-VASCULAR SPECIALISTS - HEART FAILURE SERVICE
PATIENT: Elena Rostova | MRN: MRN-4491028-ER | DATE: 2024-05-10 15:30 EST

CRITICAL CLINICAL DIRECTIVE (DRUG B):
- "DO NOT TAKE ANY NSAIDS (NAPROXEN, IBUPROFEN, CELECOXIB). Naproxen is contraindicated due to severe Anthracycline-induced heart failure (LVEF 38%). NSAID ingestion causes afferent renal arteriolar vasoconstriction, blunts Lisinopril efficacy, promotes massive fluid retention, and precipitates acute pulmonary edema.
- Prescribed Therapy: Acetaminophen 500mg PO Q6H PRN prescribed as sole safe analgesic replacement."
STATUS: NSAIDs Contraindicated and Mandated Withdrawn.`,
    structuredData: {
      medications: ['Acetaminophen 500mg PO Q6H PRN', 'Lisinopril 10mg PO Daily', 'Metoprolol Succinate 25mg PO Daily'],
      activePrescriptions: ['Acetaminophen 500mg PO Q6H PRN', 'Lisinopril 10mg PO Daily', 'Metoprolol Succinate 25mg PO Daily'],
      vitals: { BP: '118/74 mmHg', HR: 66, Weight: '65.2 kg' },
    },
  },

  // 10. 2024-09-12: Mercy Highland - Clinical Reconciliation & Stabilization
  {
    id: 'REC-ER-2024-003',
    patientId: 'PT-1092',
    type: 'outpatient_note',
    date: '2024-09-12T11:00:00Z',
    institution: 'Mercy Highland Outpatient Clinic',
    title: 'Comprehensive Multidisciplinary Reconciliation & Cardiac Check',
    sourceDocumentId: 'DOC-MHOC-2024-3312',
    author: 'Dr. Eleanor Vance, MD (Internal Medicine)',
    department: 'Adult Primary Care',
    content: `MERCY HIGHLAND OUTPATIENT CLINIC
PATIENT: Elena Rostova | MRN: MRN-4491028-ER | DATE: 2024-09-12

ASSESSMENT: Reconciled cross-institutional conflict between St. Jude Pain Clinic and Apex Cardiology. Naproxen successfully intercepted and stopped prior to patient ingestion. Patient maintained on Acetaminophen and GDMT heart failure protocol.
CURRENT STATUS: Ejection fraction stable at 41%. No peripheral edema. Patient fully educated on cross-facility EMR reconciliation alerts.`,
    structuredData: {
      medications: ['Lisinopril 10mg PO Daily', 'Metoprolol Succinate 25mg PO Daily', 'Tamoxifen 20mg PO Daily', 'Acetaminophen 500mg PRN'],
      activePrescriptions: ['Lisinopril 10mg PO Daily', 'Metoprolol Succinate 25mg PO Daily', 'Tamoxifen 20mg PO Daily'],
      vitals: { BP: '114/72 mmHg', HR: 64, Weight: '65.0 kg' },
      labs: {
        LVEF: { value: 41, unit: '%', flag: 'NORMAL' },
      },
    },
  },
];
