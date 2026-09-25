import { MedicalRecord, PatientProfile } from '../types/medical';

export const PATIENT_PT2041_PROFILE: PatientProfile = {
  id: 'PT-2041',
  name: 'Ramaswamy K.',
  dob: '1960-06-14',
  gender: 'Male',
  mrn: 'TN-UHID-88412',
  primaryCareProvider: 'Dr. S. Balasubramanian, MBBS, MD (Mylapore Primary Health & Family Clinic)',
  chronicConditions: [
    'Type 2 Diabetes Mellitus (ICD-10 E11.9)',
    'Essential Hypertension (ICD-10 I10)',
    'Chronic Kidney Disease Stage 3b (ICD-10 N18.32)',
    'Dyslipidemia (ICD-10 E78.5)',
  ],
  allergies: ['Penicillin (Urticaria / Rash)', 'Sulfa Drugs (Mild cutaneous reaction)'],
  participatingInstitutions: [
    'Mylapore Primary Health & Family Clinic',
    'Apollo Hospitals (Greams Road, Chennai)',
    'Kauvery Hospital (Alwarpet, Chennai)',
    'Sundaram Medical Foundation (Anna Nagar, Chennai)',
  ],
};

export const PATIENT_RAMASWAMY_PROFILE = PATIENT_PT2041_PROFILE;

export const PATIENT_PT2041_RECORDS: MedicalRecord[] = [
  // ---------------------------------------------------------------------------
  // Record 1: 2019-03-10 - Mylapore Primary Health & Family Clinic
  // ---------------------------------------------------------------------------
  {
    id: 'REC-2019-001',
    patientId: 'PT-2041',
    type: 'outpatient_note',
    date: '2019-03-10T09:30:00Z',
    institution: 'Mylapore Primary Health & Family Clinic',
    title: 'Annual Comprehensive Wellness & Hypertension Intake',
    sourceDocumentId: 'DOC-MYL-2019-8812',
    author: 'Dr. S. Balasubramanian, MBBS, MD (General Medicine)',
    department: 'Primary Care / General Medicine',
    structuredData: {
      medications: ['Tab. Lisinopril 10mg PO OD', 'Tab. Metformin 500mg PO BD', 'Tab. Ecosprin 75mg PO OD'],
      activePrescriptions: ['Tab. Lisinopril 10mg PO OD', 'Tab. Metformin 500mg PO BD'],
      vitals: { BP: '142/88 mmHg', HR: 74, Weight: '78.5 kg', BMI: 27.4 },
      labs: {
        creatinine: { value: 1.10, unit: 'mg/dL', flag: 'NORMAL' },
        eGFR: { value: 76, unit: 'mL/min/1.73m2', flag: 'NORMAL' },
        hba1c: { value: 6.6, unit: '%', flag: 'NORMAL' },
      },
      diagnoses: ['Essential Hypertension (Stage 1)', 'Type 2 Diabetes Mellitus (Early onset)'],
    },
    content: `================================================================================
MYLAPORE PRIMARY HEALTH & FAMILY CLINIC - GENERAL MEDICINE
No. 44 Kutchery Road, Mylapore, Chennai 600004 | Tel: 044-2464-1890
================================================================================
PATIENT: Ramaswamy K.                  DOB: 1960-06-14 (66 Y / M)  UHID: TN-UHID-88412
ENCOUNTER DATE: 2019-03-10 09:30 IST   DOC ID: DOC-MYL-2019-8812
PHYSICIAN: Dr. S. Balasubramanian, MBBS, MD (General Medicine) · Reg No: TN-48192

CHIEF COMPLAINT:
"Master health checkup. Occasional headache in the occipital region for past 2 months."

HISTORY OF PRESENT ILLNESS:
Ramaswamy K., a 59-year-old retired accounts officer residing in Mylapore, presents for
baseline health review. Reports occasional morning headaches and fatigue after walking.
Denies chest pain, palpitation, breathlessness on exertion, or pedal edema. Home BP
recordings taken at local pharmacy show 140-146/88-92 mmHg.

CLINICAL EXAMINATION:
- General: Conscious, oriented, afebrile, moderately built and nourished.
- Vitals: BP 142/88 mmHg (Right arm sitting), Pulse 74/min regular, SpO2 98% room air.
- CVS: S1, S2 heard, no murmurs.
- RS: Normal vesicular breath sounds bilaterally, no wheeze or crackles.
- P/A: Soft, non-tender, no organomegaly.
- Extremities: Bilateral peripheral pulses well palpable; no pedal edema.

BIOCHEMICAL INVESTIGATIONS (Aarthi Scans & Labs, Mylapore):
- Fasting Blood Sugar: 126 mg/dL
- HbA1c: 6.6 %
- Serum Creatinine: 1.10 mg/dL (Reference: 0.70 - 1.30 mg/dL)
- Estimated GFR (CKD-EPI): 76 mL/min/1.73m2
- Lipid Profile: Total Cholesterol 208 mg/dL | LDL 128 mg/dL | Triglycerides 172 mg/dL

IMPRESSION & RX:
1. Essential Hypertension (Stage 1):
   - Tab. Lisinopril 10mg PO OD (1-0-0) after breakfast.
2. Type 2 Diabetes Mellitus:
   - Tab. Metformin 500mg PO BD (1-0-1) after food.
3. Lifestyle: Low salt South Indian diabetic diet (reduce white rice, avoid appalam/pickles).
4. Review with home BP log in 3 months.

Electronically Signed: Dr. S. Balasubramanian, MBBS, MD
Date: 2019-03-10 11:15 IST`,
  },

  // ---------------------------------------------------------------------------
  // Record 2: 2019-11-05 - Sundaram Medical Foundation, Anna Nagar
  // ---------------------------------------------------------------------------
  {
    id: 'REC-2019-002',
    patientId: 'PT-2041',
    type: 'outpatient_note',
    date: '2019-11-05T14:15:00Z',
    institution: 'Sundaram Medical Foundation (Anna Nagar, Chennai)',
    title: 'Outpatient Encounter: Acute Tracheobronchitis and URI',
    sourceDocumentId: 'DOC-SMF-2019-4102',
    author: 'Dr. K. Sundaram, MS (Emergency Medicine)',
    department: 'Acute Care / Outpatient Triage',
    structuredData: {
      medications: ['Tab. Lisinopril 10mg PO OD', 'Tab. Metformin 500mg PO BD', 'Tab. Azithromycin 500mg OD x 3 days'],
      vitals: { BP: '136/84 mmHg', HR: 82, Temp: '99.4 F', SpO2: '97%' },
      diagnoses: ['Acute Bronchitis (ICD-10 J20.9)', 'Upper Respiratory Tract Infection'],
    },
    content: `================================================================================
SUNDARAM MEDICAL FOUNDATION - COMMUNITY CLINICAL SERVICES
9C 4th Avenue, Shanthi Colony, Anna Nagar, Chennai 600040 | Tel: 044-2626-8844
================================================================================
PATIENT: Ramaswamy K.                  DOB: 1960-06-14        UHID: TN-UHID-88412
ENCOUNTER DATE: 2019-11-05 14:15 IST   DOC ID: DOC-SMF-2019-4102
ATTENDING: Dr. K. Sundaram, MS

REASON FOR CONSULTATION:
Patient visiting daughter in Anna Nagar developed sudden dry cough, throat irritation,
and low-grade fever following monsoon rains over the past 4 days.

CURRENT MEDICATIONS:
- Tab. Lisinopril 10mg OD
- Tab. Metformin 500mg BD

EXAMINATION:
- Pharynx: Mild congestion of posterior pharyngeal wall.
- Chest: Scattered rhonchi bilaterally; clear on coughing.
- Vitals: BP 136/84 mmHg, Pulse 82/min.
- Chest X-Ray (PA view): Clear lung fields, normal cardiothoracic ratio.

PLAN:
- Presumed viral tracheobronchitis.
- Tab. Azithromycin 500mg OD for 3 days.
- Syp. Ascoril-D 10ml TID PRN for cough relief.
- Continue regular antihypertensive (Lisinopril 10mg OD) and antidiabetic medicines.

Electronically Signed: Dr. K. Sundaram, MS
Date: 2019-11-05 15:45 IST`,
  },

  // ---------------------------------------------------------------------------
  // Record 3: 2020-04-12 - Mylapore Primary Health & Family Clinic
  // ---------------------------------------------------------------------------
  {
    id: 'REC-2020-001',
    patientId: 'PT-2041',
    type: 'outpatient_note',
    date: '2020-04-12T10:00:00Z',
    institution: 'Mylapore Primary Health & Family Clinic',
    title: 'Chronic Disease Review & Blood Pressure Surveillance',
    sourceDocumentId: 'DOC-MYL-2020-1190',
    author: 'Dr. S. Balasubramanian, MBBS, MD',
    department: 'Primary Care / General Medicine',
    structuredData: {
      medications: ['Tab. Lisinopril 10mg PO OD', 'Tab. Metformin 500mg PO BD'],
      activePrescriptions: ['Tab. Lisinopril 10mg PO OD', 'Tab. Metformin 500mg PO BD'],
      vitals: { BP: '138/84 mmHg', HR: 72, Weight: '79.1 kg' },
      diagnoses: ['Essential Hypertension (controlled)', 'Type 2 Diabetes Mellitus'],
    },
    content: `================================================================================
MYLAPORE PRIMARY HEALTH & FAMILY CLINIC
No. 44 Kutchery Road, Mylapore, Chennai 600004 | Tel: 044-2464-1890
================================================================================
PATIENT: Ramaswamy K.                  DOB: 1960-06-14        UHID: TN-UHID-88412
ENCOUNTER DATE: 2020-04-12 10:00 IST   DOC ID: DOC-MYL-2020-1190
PHYSICIAN: Dr. S. Balasubramanian, MBBS, MD

CLINICAL REVIEW:
Patient reports regular compliance with Lisinopril 10mg and Metformin 500mg.
Mentions an occasional irritating throat tickle that has lingered on and off, but
attributes it to dust and change in weather. No breathlessness, syncope, or angioedema.
Home BP generally around 134-138/84 mmHg.

ASSESSMENT:
- Hypertension well controlled on Lisinopril 10mg OD.
- Routine nephrology/biomarker surveillance advised at Kauvery Hospital Alwarpet for
  comprehensive annual renal profile.

PLAN:
- Refill Tab. Lisinopril 10mg OD and Tab. Metformin 500mg BD.
- Recommended nephrology baseline screening at Kauvery Hospital.

Electronically Signed: Dr. S. Balasubramanian, MBBS, MD
Date: 2020-04-12 10:50 IST`,
  },

  // ---------------------------------------------------------------------------
  // Record 4: 2020-09-18 - Kauvery Hospital (Alwarpet, Chennai) [Trend Visit 1/3]
  // ---------------------------------------------------------------------------
  {
    id: 'REC-2020-002',
    patientId: 'PT-2041',
    type: 'lab_result',
    date: '2020-09-18T08:45:00Z',
    institution: 'Kauvery Hospital (Alwarpet, Chennai)',
    title: 'Renal Function & Metabolic Panel [Longitudinal Trend Visit 1]',
    sourceDocumentId: 'DOC-KAUV-2020-5519',
    author: 'Dr. R. Meenakshi, MD, DM (Nephrology)',
    department: 'Department of Nephrology & Renal Sciences',
    structuredData: {
      medications: ['Tab. Lisinopril 10mg PO OD', 'Tab. Metformin 500mg PO BD'],
      labs: {
        creatinine: { value: 1.10, unit: 'mg/dL', flag: 'NORMAL' },
        eGFR: { value: 72, unit: 'mL/min/1.73m2', flag: 'NORMAL' },
        bun: { value: 18, unit: 'mg/dL', flag: 'NORMAL' },
        potassium: { value: 4.4, unit: 'mEq/L', flag: 'NORMAL' },
        hba1c: { value: 6.6, unit: '%', flag: 'NORMAL' },
      },
      diagnoses: ['Baseline Renal Profiling', 'Stage 2 CKD baseline risk'],
    },
    content: `================================================================================
KAUVERY HOSPITAL CHENNAI - RENAL SCIENCES LABORATORY REPORT
No. 81 TTK Road, Alwarpet, Chennai 600018 | Tel: 044-4000-6000
================================================================================
PATIENT: Ramaswamy K.                  DOB: 1960-06-14        UHID: TN-UHID-88412
SPECIMEN COLLECTED: 2020-09-18 08:45   DOC ID: DOC-KAUV-2020-5519
ATTENDING NEPHROLOGIST: Dr. R. Meenakshi, MD, DM Nephro

COMPREHENSIVE RENAL & METABOLIC BIO-MARKERS (VISIT 1 BASELINE):
--------------------------------------------------------------------------------
TEST NAME                  RESULT       FLAG       REFERENCE RANGE
--------------------------------------------------------------------------------
Serum Creatinine           1.10 mg/dL   NORMAL     0.70 - 1.30 mg/dL
Estimated GFR (CKD-EPI)    72 mL/min    NORMAL     > 60 mL/min/1.73m2
Blood Urea Nitrogen (BUN)  18 mg/dL     NORMAL     8 - 23 mg/dL
Serum Potassium            4.4 mEq/L    NORMAL     3.5 - 5.0 mEq/L
Serum Sodium               140 mEq/L    NORMAL     135 - 145 mEq/L
HbA1c Glycated Hemoglobin  6.6 %        ELEVATED   < 5.7 % (Normal), 5.7-6.4% (Pre)
Urine Microalbumin/Cr      24 mg/g      NORMAL     < 30 mg/g
--------------------------------------------------------------------------------

CLINICAL INTERPRETATION:
Baseline renal function indicates preserved glomerular filtration with Serum Creatinine
of 1.10 mg/dL and eGFR of 72 mL/min. HbA1c is borderline elevated at 6.6%. Lisinopril
10mg OD provides appropriate renoprotective renin-angiotensin-aldosterone blockade.

Verified By: Dr. R. Meenakshi, MD, DM (Nephrology)
Date: 2020-09-18 11:30 IST`,
  },

  // ---------------------------------------------------------------------------
  // Record 5: 2021-02-22 - Mylapore Primary Health & Family Clinic
  // ---------------------------------------------------------------------------
  {
    id: 'REC-2021-001',
    patientId: 'PT-2041',
    type: 'outpatient_note',
    date: '2021-02-22T11:00:00Z',
    institution: 'Mylapore Primary Health & Family Clinic',
    title: 'Outpatient Follow-Up: Persistent Intractable Dry Cough',
    sourceDocumentId: 'DOC-MYL-2021-2309',
    author: 'Dr. S. Balasubramanian, MBBS, MD',
    department: 'Primary Care / General Medicine',
    structuredData: {
      medications: ['Tab. Lisinopril 10mg PO OD (Suspected Culprit)', 'Tab. Metformin 500mg PO BD'],
      vitals: { BP: '144/86 mmHg', HR: 76, RR: 16 },
      diagnoses: ['ACE-Inhibitor Induced Cough (suspected)', 'Essential Hypertension'],
    },
    content: `================================================================================
MYLAPORE PRIMARY HEALTH & FAMILY CLINIC
No. 44 Kutchery Road, Mylapore, Chennai 600004 | Tel: 044-2464-1890
================================================================================
PATIENT: Ramaswamy K.                  DOB: 1960-06-14        UHID: TN-UHID-88412
ENCOUNTER DATE: 2021-02-22 11:00 IST   DOC ID: DOC-MYL-2021-2309
PHYSICIAN: Dr. S. Balasubramanian, MBBS, MD

SUBJECTIVE:
Patient returns complaining of a continuous, distressing dry brassy cough for past 8 weeks.
Cough is non-productive, worse at night, and significantly disturbs sleep. No fever, no hemoptysis,
no chest pain. Ayurvedic decoctions and OTC syrups gave no relief.

MEDICATION REVIEW:
- Tab. Lisinopril 10mg PO OD (Active ACE-Inhibitor)
- Tab. Metformin 500mg PO BD

OBJECTIVE:
- Respiratory system: Bilateral lung fields clear. No adventitious sounds.
- Throat: Mild granular pharyngitis without exudates.

ASSESSMENT:
Highly suggestive of classic bradykinin-mediated ACE-inhibitor induced dry cough
secondary to Lisinopril 10mg.

PLAN:
Advised switching to Angiotensin Receptor Blocker (ARB) Losartan. Patient requested a brief trial
of steam inhalation and lozenges first; agreed to formal transition if cough continues.

Electronically Signed: Dr. S. Balasubramanian, MBBS, MD
Date: 2021-02-22 12:15 IST`,
  },

  // ---------------------------------------------------------------------------
  // Record 6: 2021-07-14 - Mylapore Primary Clinic (MEDICATION CHANGE)
  // ---------------------------------------------------------------------------
  {
    id: 'REC-2021-002',
    patientId: 'PT-2041',
    type: 'prescription',
    date: '2021-07-14T15:30:00Z',
    institution: 'Mylapore Primary Health & Family Clinic',
    title: 'Prescription Slip: Transition to Tab. Losartan (Cough Resolution)',
    sourceDocumentId: 'DOC-MYL-2021-6674',
    author: 'Dr. S. Balasubramanian, MBBS, MD',
    department: 'Primary Care / General Medicine',
    structuredData: {
      discontinuedPrescriptions: ['Medication A: Lisinopril 10mg PO Daily'],
      activePrescriptions: ['Medication B: Losartan 20mg PO Daily'],
      medications: ['Tab. Losartan 20mg PO OD', 'Tab. Metformin 500mg PO BD'],
      diagnoses: ['Intractable ACE-Inhibitor Induced Dry Cough', 'Essential Hypertension'],
    },
    content: `================================================================================
DR. S. BALASUBRAMANIAN, MD (GEN MED) · MYLAPORE CLINIC
No. 44 Kutchery Road, Mylapore, Chennai 600004 · PRESCRIPTION SLIP
================================================================================
PATIENT: Ramaswamy K.                  DOB: 1960-06-14        UHID: TN-UHID-88412
ORDER DATE: 2021-07-14 15:30 IST       DOC ID: DOC-MYL-2021-6674
REG NO: TN-48192

MEDICATION RECONCILIATION & PRESCRIPTION MODIFICATION:
--------------------------------------------------------------------------------
DISCONTINUED MEDICATION:
- Drug Name: Tab. Lisinopril 10mg Oral Tablet [Medication A 10mg]
- Status: DISCONTINUED / WITHDRAWN IMMEDIATELY
- Clinical Reason: Intractable ACE-inhibitor induced dry cough persisting >6 weeks.
- Effective Date: 2021-07-14

NEW / REPLACEMENT MEDICATION PRESCRIBED:
- Drug Name: Tab. Losartan Potassium 20mg [Medication B 20mg]
- Dosage & Directions: 1 tablet (20mg) orally once daily every morning (1-0-0) after breakfast.
- Quantity: 90 Tablets (3-month supply)
- Class: Angiotensin II Receptor Blocker (ARB)
- Target Indication: Essential Hypertension with renal hemodynamic protection.
- Transition Instruction: Stop Lisinopril immediately; commence Tab. Losartan 20mg from tomorrow.
--------------------------------------------------------------------------------

PATIENT COUNSELING:
Patient informed that dry cough will completely resolve within 2 to 4 weeks after stopping
Lisinopril. Tab. Losartan 20mg controls blood pressure and protects kidney filtration without
bradykinin accumulation. Continue Tab. Metformin 500mg BD.

Electronically Signed: Dr. S. Balasubramanian, MBBS, MD
Date: 2021-07-14 16:00 IST`,
  },

  // ---------------------------------------------------------------------------
  // Record 7: 2021-12-08 - Kauvery Hospital (Alwarpet, Chennai)
  // ---------------------------------------------------------------------------
  {
    id: 'REC-2021-003',
    patientId: 'PT-2041',
    type: 'consultation',
    date: '2021-12-08T10:15:00Z',
    institution: 'Kauvery Hospital (Alwarpet, Chennai)',
    title: 'Nephrology Follow-Up: Evaluation Post-Losartan Transition',
    sourceDocumentId: 'DOC-KAUV-2021-7890',
    author: 'Dr. R. Meenakshi, MD, DM (Nephrology)',
    department: 'Department of Nephrology & Renal Sciences',
    structuredData: {
      medications: ['Tab. Losartan 20mg PO OD', 'Tab. Metformin 500mg PO BD'],
      vitals: { BP: '128/80 mmHg', HR: 70, Weight: '78.8 kg' },
      labs: {
        potassium: { value: 4.6, unit: 'mEq/L', flag: 'NORMAL' },
        creatinine: { value: 1.18, unit: 'mg/dL', flag: 'NORMAL' },
      },
      diagnoses: ['Essential Hypertension (controlled on ARB)', 'Type 2 Diabetes Mellitus'],
    },
    content: `================================================================================
KAUVERY HOSPITAL CHENNAI - DEPARTMENT OF NEPHROLOGY
No. 81 TTK Road, Alwarpet, Chennai 600018 | Tel: 044-4000-6000
================================================================================
PATIENT: Ramaswamy K.                  DOB: 1960-06-14        UHID: TN-UHID-88412
VISIT DATE: 2021-12-08 10:15 IST       DOC ID: DOC-KAUV-2021-7890
NEPHROLOGIST: Dr. R. Meenakshi, MD, DM Nephro

CONSULTATION NOTES:
Mr. Ramaswamy presents for scheduled post-transition renal follow-up. He transitioned
from Lisinopril 10mg to Tab. Losartan 20mg daily in July 2021. He reports that his
persistent dry cough resolved completely within 2 weeks of stopping Lisinopril.

OBJECTIVE FINDINGS:
- Blood Pressure: 128/80 mmHg sitting right arm.
- Serum Potassium: 4.6 mEq/L (Normal: 3.5 - 5.0).
- Serum Creatinine: 1.18 mg/dL (Stable renal baseline).
- Urine: No macroscopic hematuria or foamy urine.

IMPRESSION & PLAN:
1. Excellent clinical tolerance of Tab. Losartan 20mg with complete cough resolution and normal BP.
2. Continue Tab. Losartan 20mg PO OD and Tab. Metformin 500mg PO BD.
3. Repeat comprehensive metabolic and renal biomarker panel in May 2022.

Electronically Signed: Dr. R. Meenakshi, MD, DM (Nephrology)
Date: 2021-12-08 11:45 IST`,
  },

  // ---------------------------------------------------------------------------
  // Record 8: 2022-05-12 - Kauvery Hospital (Alwarpet, Chennai) [Trend Visit 2/3]
  // ---------------------------------------------------------------------------
  {
    id: 'REC-2022-001',
    patientId: 'PT-2041',
    type: 'lab_result',
    date: '2022-05-12T09:00:00Z',
    institution: 'Kauvery Hospital (Alwarpet, Chennai)',
    title: 'Longitudinal Renal Evaluation & Glycemic Assessment [Visit 2]',
    sourceDocumentId: 'DOC-KAUV-2022-3021',
    author: 'Dr. R. Meenakshi, MD, DM (Nephrology)',
    department: 'Department of Nephrology & Renal Sciences',
    structuredData: {
      medications: ['Tab. Losartan 20mg PO OD', 'Tab. Metformin 500mg PO BD'],
      labs: {
        creatinine: { value: 1.55, unit: 'mg/dL', flag: 'HIGH' },
        eGFR: { value: 51, unit: 'mL/min/1.73m2', flag: 'LOW' },
        bun: { value: 27, unit: 'mg/dL', flag: 'HIGH' },
        potassium: { value: 4.8, unit: 'mEq/L', flag: 'NORMAL' },
        hba1c: { value: 7.5, unit: '%', flag: 'HIGH' },
      },
      diagnoses: ['Chronic Kidney Disease, Stage 3a (ICD-10 N18.31)', 'Type 2 Diabetes Mellitus'],
    },
    content: `================================================================================
KAUVERY HOSPITAL CHENNAI - RENAL SCIENCES LABORATORY REPORT
No. 81 TTK Road, Alwarpet, Chennai 600018 | Tel: 044-4000-6000
================================================================================
PATIENT: Ramaswamy K.                  DOB: 1960-06-14        UHID: TN-UHID-88412
SPECIMEN COLLECTED: 2022-05-12 09:00   DOC ID: DOC-KAUV-2022-3021
ATTENDING NEPHROLOGIST: Dr. R. Meenakshi, MD, DM Nephro

LONGITUDINAL RENAL & METABOLIC SURVEILLANCE (VISIT 2):
--------------------------------------------------------------------------------
TEST NAME                  RESULT       FLAG       REFERENCE RANGE
--------------------------------------------------------------------------------
Serum Creatinine           1.55 mg/dL   HIGH       0.70 - 1.30 mg/dL   [Prior: 1.10]
Estimated GFR (CKD-EPI)    51 mL/min    LOW        > 60 mL/min/1.73m2  [Prior: 72]
Blood Urea Nitrogen (BUN)  27 mg/dL     HIGH       8 - 23 mg/dL
Serum Potassium            4.8 mEq/L    NORMAL     3.5 - 5.0 mEq/L
HbA1c Glycated Hemoglobin  7.5 %        HIGH       < 5.7 %             [Prior: 6.6%]
Urine Microalbumin/Cr      78 mg/g      HIGH       < 30 mg/g
--------------------------------------------------------------------------------

LONGITUDINAL TRAJECTORY IMPRESSION:
Serum Creatinine has increased from 1.10 mg/dL (Sep 2020) to 1.55 mg/dL (May 2022),
reflecting an initial 40.9% elevation with eGFR falling to 51 mL/min. Patient is now in
CKD Stage 3a with diabetic nephropathy progression (HbA1c 7.5%).

PRECAUTIONS:
- Avoid all NSAIDs (Brufen, Voveran, Combiflam strictly prohibited).
- Caution regarding Metformin dosing as eGFR approaches 45 mL/min boundary.

Verified By: Dr. R. Meenakshi, MD, DM (Nephrology)
Date: 2022-05-12 11:30 IST`,
  },

  // ---------------------------------------------------------------------------
  // Record 9: 2022-11-04 - Apollo Hospitals (Greams Road) [CONFLICT PART A]
  // ---------------------------------------------------------------------------
  {
    id: 'REC-2022-002',
    patientId: 'PT-2041',
    type: 'discharge_summary',
    date: '2022-11-04T11:30:00Z',
    institution: 'Apollo Hospitals (Greams Road, Chennai)',
    title: 'Inpatient Discharge Summary: Syncopal Workup & Glycemic Plan',
    sourceDocumentId: 'DOC-APO-2022-9901',
    author: 'Dr. K. Venkatraman, MD, DM (Cardiology & Internal Medicine)',
    department: 'Inpatient General Medicine & Cardiology',
    structuredData: {
      medications: [
        'Drug A: Tab. Metformin 1000mg PO BD',
        'Tab. Losartan 20mg PO OD',
        'Tab. Atorva 20mg PO QHS',
      ],
      activePrescriptions: ['Tab. Metformin 1000mg PO BD', 'Tab. Losartan 20mg PO OD'],
      vitals: { BP: '134/82 mmHg', HR: 72 },
      diagnoses: ['Orthostatic Syncope (Resolved)', 'Hypertensive Urgency', 'Type 2 Diabetes Mellitus'],
    },
    content: `================================================================================
APOLLO HOSPITALS ENTERPRISE LTD. · 21 GREAMS LANE, CHENNAI 600006
INPATIENT DISCHARGE SUMMARY · DEPARTMENT OF GENERAL MEDICINE & CARDIOLOGY
================================================================================
PATIENT: Ramaswamy K.                  DOB: 1960-06-14 (66 Y / M)  UHID: TN-UHID-88412
ADMISSION DATE: 2022-11-01 22:15 IST   DISCHARGE DATE: 2022-11-04 11:30 IST
RECORD ID: REC-2022-002                DOC ID: DOC-APO-2022-9901
ATTENDING PHYSICIAN: Dr. K. Venkatraman, MD, DM · Reg No: TN-33219

HOSPITAL COURSE & CLINICAL SUMMARY:
Patient presented to Apollo Emergency following a transient syncopal episode at home in Mylapore.
Blood pressure on arrival was 186/102 mmHg. Brain CT without contrast showed no acute intracranial
pathology. 2D Echo showed concentric LVH with preserved ejection fraction (58%). Patient stabilized
with IV fluids and bed rest.

DISCHARGE MEDICATIONS (CONFIRMED ON DISCHARGE):
1. Drug A: Tab. Metformin 1000mg PO BD (1-0-1) after meals.
   [DISCHARGE ORDER: Patient instructed to continue Tab. Metformin 1000mg Twice Daily for ongoing diabetes management.]
2. Tab. Losartan 20mg PO OD (1-0-0) after breakfast.
3. Tab. Atorvastatin 20mg PO at bedtime (0-0-1).
4. Tab. Ecosprin 75mg PO OD.

DISCHARGE ADVICE:
Patient discharged in hemodynamically stable condition. Advised to continue all discharge
medications without alteration and follow up with local family physician in Mylapore.

Electronically Signed: Dr. K. Venkatraman, MD, DM
Apollo Hospitals, Greams Road, Chennai
Date: 2022-11-04 11:45 IST`,
  },

  // ---------------------------------------------------------------------------
  // Record 10: 2022-11-04 - Mylapore Primary Clinic [CONFLICT PART B]
  // ---------------------------------------------------------------------------
  {
    id: 'REC-2022-003',
    patientId: 'PT-2041',
    type: 'prescription',
    date: '2022-11-04T16:00:00Z',
    institution: 'Mylapore Primary Health & Family Clinic',
    title: 'Prescription Slip: Post-Discharge Diabetic Revision (Metformin Withdrawn)',
    sourceDocumentId: 'DOC-MYL-2022-7741',
    author: 'Dr. S. Balasubramanian, MBBS, MD',
    department: 'Primary Care / General Medicine',
    structuredData: {
      medications: [
        'Drug B: Tab. Glipizide ER 10mg PO OD',
        'Tab. Losartan 20mg PO OD',
      ],
      activePrescriptions: ['Tab. Glipizide ER 10mg PO OD'],
      discontinuedPrescriptions: ['Metformin 1000mg PO BID (Contraindicated due to renal risk)'],
      diagnoses: ['Type 2 Diabetes Mellitus with Renal Risk', 'Post-Discharge Medication Reconciliation'],
    },
    content: `================================================================================
DR. S. BALASUBRAMANIAN, MD (GEN MED) · MYLAPORE CLINIC
No. 44 Kutchery Road, Mylapore, Chennai 600004 · PRESCRIPTION SLIP
================================================================================
PATIENT: Ramaswamy K.                  DOB: 1960-06-14        UHID: TN-UHID-88412
ORDER DATE: 2022-11-04 16:00 IST       DOC ID: DOC-MYL-2022-7741
REG NO: TN-48192

POST-HOSPITALIZATION PRESCRIPTION DIRECTIVE:
--------------------------------------------------------------------------------
ACTIVE PRESCRIPTION ORDER:
- Drug Name: Tab. Glipizide ER 10mg Oral Tablet [Drug B]
- Sig: Take 1 tablet (10mg) orally once daily in the morning before breakfast (1-0-0).
- Quantity: 30 Tablets

EXPLICIT CLINICAL WARNING & CONFLICTING DIRECTIVE:
- "DO NOT TAKE METFORMIN. Metformin 1000mg is contraindicated and hereby DISCONTINUED
  due to borderline eGFR (51 mL/min) and contrast exposure during hospitalization.
  Patient is prescribed Glipizide ER 10mg daily as the sole replacement oral hypoglycemic."
--------------------------------------------------------------------------------

CRITICAL SAFETY FLAG FOR PATIENT & FAMILY:
There is an active cross-facility discrepancy. Discharge summary issued today (2022-11-04)
from Apollo Hospitals Greams Road instructs patient to continue Metformin 1000mg BD (Drug A),
whereas this outpatient prescription concurrently mandates Tab. Glipizide ER 10mg (Drug B)
with Metformin cessation. Simultaneous ingestion poses severe hypoglycemia and fatal
lactic acidosis hazards (MALA).

Electronically Signed: Dr. S. Balasubramanian, MBBS, MD
Date: 2022-11-04 16:20 IST`,
  },

  // ---------------------------------------------------------------------------
  // Record 11: 2023-03-20 - Sundaram Medical Foundation, Anna Nagar
  // (LAST RECORD BEFORE 10.9-MONTH TEMPORAL GAP)
  // ---------------------------------------------------------------------------
  {
    id: 'REC-2023-001',
    patientId: 'PT-2041',
    type: 'outpatient_note',
    date: '2023-03-20T13:45:00Z',
    institution: 'Sundaram Medical Foundation (Anna Nagar, Chennai)',
    title: 'Outpatient Triage: Right Ankle Inversion Injury (Pre-Thanjavur Departure)',
    sourceDocumentId: 'DOC-SMF-2023-1188',
    author: 'Dr. K. Sundaram, MS (Emergency / Ortho)',
    department: 'Acute Care / Musculoskeletal Triage',
    structuredData: {
      medications: ['Tab. Losartan 20mg PO OD', 'Tab. Glipizide ER 10mg PO OD'],
      vitals: { BP: '138/84 mmHg', HR: 78, SpO2: '98%' },
      diagnoses: ['Right Ankle Sprain, Grade 1 (ICD-10 S93.401A)'],
    },
    content: `================================================================================
SUNDARAM MEDICAL FOUNDATION - COMMUNITY CLINICAL SERVICES
9C 4th Avenue, Shanthi Colony, Anna Nagar, Chennai 600040 | Tel: 044-2626-8844
================================================================================
PATIENT: Ramaswamy K.                  DOB: 1960-06-14        UHID: TN-UHID-88412
ENCOUNTER DATE: 2023-03-20 13:45 IST   DOC ID: DOC-SMF-2023-1188
ATTENDING: Dr. K. Sundaram, MS

PRESENTING COMPLAINT:
Patient slipped on tiled steps while visiting relatives in Anna Nagar. Twisted right ankle.
Complains of lateral swelling and pain on weight bearing. Patient mentions he is traveling
tomorrow to his ancestral home in rural Thanjavur for family agricultural work and temple festival.

EXAMINATION:
- Tenderness over anterior talofibular ligament (ATFL). No bony tenderness on malleoli.
- X-ray Right Ankle: No fracture or subluxation.

PLAN:
- Grade 1 lateral ankle sprain. Crepe bandage support and ice application.
- Explicitly avoid Brufen/Voveran due to known renal impairment. Tab. Paracetamol 650mg
  TID PRN prescribed for pain.
- Advised patient to register at local Thanjavur clinic for routine diabetic and BP follow-up.

*** NOTE: Patient traveled to rural Thanjavur; zero subsequent medical contact for 10.9 months. ***

Electronically Signed: Dr. K. Sundaram, MS
Date: 2023-03-20 14:40 IST`,
  },

  // ---------------------------------------------------------------------------
  // Record 12: 2024-02-15 - Apollo Hospitals (Greams Road, Chennai)
  // (FIRST RECORD AFTER 10.9-MONTH MISSING INTERVAL GAP)
  // ---------------------------------------------------------------------------
  {
    id: 'REC-2024-001',
    patientId: 'PT-2041',
    type: 'emergency_visit',
    date: '2024-02-15T18:20:00Z',
    institution: 'Apollo Hospitals (Greams Road, Chennai)',
    title: 'Emergency Encounter: Post-Thanjavur Dehydration & Severe Glycemic Derangement',
    sourceDocumentId: 'DOC-APO-2024-0544',
    author: 'Dr. K. Venkatraman, MD, DM',
    department: 'Emergency Medicine',
    structuredData: {
      medications: ['Unverified compliance over preceding 11 months in Thanjavur'],
      vitals: { BP: '158/92 mmHg', HR: 94, Temp: '98.8 F', SpO2: '96%' },
      labs: {
        glucose: { value: 248, unit: 'mg/dL', flag: 'HIGH' },
        creatinine: { value: 1.82, unit: 'mg/dL', flag: 'HIGH' },
        potassium: { value: 5.1, unit: 'mEq/L', flag: 'HIGH' },
      },
      diagnoses: [
        'Uncontrolled Hyperglycemia (RBS 248 mg/dL)',
        'Acute Prerenal Azotemia on CKD',
        'Prolonged Loss to Clinical Follow-Up (332 Days)',
      ],
    },
    content: `================================================================================
APOLLO HOSPITALS ENTERPRISE LTD. · 21 GREAMS LANE, CHENNAI 600006
EMERGENCY SERVICES & CRITICAL CARE
================================================================================
PATIENT: Ramaswamy K.                  DOB: 1960-06-14        UHID: TN-UHID-88412
PRESENTATION DATE: 2024-02-15 18:20    DOC ID: DOC-APO-2024-0544
ATTENDING: Dr. K. Venkatraman, MD, DM

CLINICAL PRESENTATION & SURVEILLANCE VOID:
Patient brought to Apollo Emergency by son immediately upon return to Chennai from rural
Thanjavur. Patient is severely lethargic, dehydrated, with dry tongue and postural dizziness.
Son confirms Ramaswamy lived at the village ancestral home from March 2023 to February 2024
(~332 days / 10.9 months) with ZERO medical checkups, no blood tests, and erratic pill refills.

EMERGENCY INVESTIGATIONS:
- Random Capillary Blood Glucose: 248 mg/dL (Critical High)
- Stat Serum Creatinine: 1.82 mg/dL (Sharply increased from 1.55 mg/dL baseline)
- Blood Urea: 38 mg/dL
- Serum Potassium: 5.1 mEq/L

TREATMENT:
- IV Normal Saline 2 litres infused with rapid improvement in hydration and blood pressure.
- Subcutaneous plain insulin sliding scale administered.
- Immediate nephrology re-engagement at Kauvery Hospital mandated within 7 days.

Electronically Signed: Dr. K. Venkatraman, MD, DM
Date: 2024-02-15 22:30 IST`,
  },

  // ---------------------------------------------------------------------------
  // Record 13: 2024-06-18 - Kauvery Hospital (Alwarpet, Chennai) [Trend Visit 3/3]
  // ---------------------------------------------------------------------------
  {
    id: 'REC-2024-002',
    patientId: 'PT-2041',
    type: 'lab_result',
    date: '2024-06-18T09:15:00Z',
    institution: 'Kauvery Hospital (Alwarpet, Chennai)',
    title: 'Comprehensive Renal Evaluation & Confirmatory Peak [Trend Visit 3]',
    sourceDocumentId: 'DOC-KAUV-2024-6109',
    author: 'Dr. R. Meenakshi, MD, DM (Nephrology)',
    department: 'Department of Nephrology & Renal Sciences',
    structuredData: {
      medications: ['Tab. Losartan 20mg PO OD', 'Tab. Glipizide ER 10mg PO OD'],
      labs: {
        creatinine: { value: 2.10, unit: 'mg/dL', flag: 'CRITICAL' },
        eGFR: { value: 36, unit: 'mL/min/1.73m2', flag: 'CRITICAL' },
        bun: { value: 42, unit: 'mg/dL', flag: 'HIGH' },
        potassium: { value: 5.0, unit: 'mEq/L', flag: 'NORMAL' },
        hba1c: { value: 8.4, unit: '%', flag: 'CRITICAL' },
      },
      diagnoses: [
        'Chronic Kidney Disease, Stage 3b (ICD-10 N18.32)',
        'Diabetic Nephropathy, Accelerated Progression',
        'Uncontrolled Type 2 Diabetes Mellitus',
      ],
    },
    content: `================================================================================
KAUVERY HOSPITAL CHENNAI - DEPARTMENT OF NEPHROLOGY & RENAL SCIENCES
No. 81 TTK Road, Alwarpet, Chennai 600018 | Tel: 044-4000-6000
================================================================================
PATIENT: Ramaswamy K.                  DOB: 1960-06-14        UHID: TN-UHID-88412
SPECIMEN COLLECTED: 2024-06-18 09:15   DOC ID: DOC-KAUV-2024-6109
ATTENDING NEPHROLOGIST: Dr. R. Meenakshi, MD, DM Nephro

COMPREHENSIVE RENAL & METABOLIC BIO-MARKERS (VISIT 3 - CONFIRMATORY TREND):
--------------------------------------------------------------------------------
TEST NAME                  RESULT       FLAG       REFERENCE RANGE
--------------------------------------------------------------------------------
Serum Creatinine           2.10 mg/dL   CRITICAL   0.70 - 1.30 mg/dL   [2020: 1.10 | 2022: 1.55]
Estimated GFR (CKD-EPI)    36 mL/min    CRITICAL   > 60 mL/min/1.73m2  [2020: 72   | 2022: 51]
Blood Urea Nitrogen (BUN)  42 mg/dL     HIGH       8 - 23 mg/dL
Serum Potassium            5.0 mEq/L    BORDER     3.5 - 5.0 mEq/L
HbA1c Glycated Hemoglobin  8.4 %        CRITICAL   < 5.7 %             [2020: 6.6% | 2022: 7.5%]
Urine Microalbumin/Cr      194 mg/g     CRITICAL   < 30 mg/g
--------------------------------------------------------------------------------

LONGITUDINAL CLINICAL TRAJECTORY ANALYSIS (3-VISIT CONFIRMATION):
- Baseline (2020-09-18): Creatinine 1.10 mg/dL | eGFR 72 mL/min | HbA1c 6.6%
- Intermediate (2022-05-12): Creatinine 1.55 mg/dL | eGFR 51 mL/min | HbA1c 7.5%
- Current Visit (2024-06-18): Creatinine 2.10 mg/dL | eGFR 36 mL/min | HbA1c 8.4%

CLINICAL SYNTHESIS & IMPRESSION:
A sustained +90.9% surge in Serum Creatinine (1.10 -> 1.55 -> 2.10 mg/dL) and a 50%
collapse in eGFR (72 -> 36 mL/min) confirms accelerated progression to Chronic Kidney Disease
Stage 3b. The 10.9-month surveillance void while residing in rural Thanjavur without glycemic
monitoring allowed uncontrolled diabetic glomerulosclerosis to advance unchecked.

NEPHROLOGY INTERVENTION:
1. Formal CKD Stage 3b management protocol initiated.
2. Low-protein South Indian renal diet (0.8 g/kg/day). Strict sodium restriction.
3. Coordinate with Dr. Balasubramanian at Mylapore Clinic for SGLT2 inhibitor initiation.
4. Mandatory quarterly nephrology surveillance every 90 days.

Verified By: Dr. R. Meenakshi, MD, DM (Nephrology)
Date: 2024-06-18 12:45 IST`,
  },

  // ---------------------------------------------------------------------------
  // Record 14: 2024-11-20 - Mylapore Primary Health & Family Clinic
  // ---------------------------------------------------------------------------
  {
    id: 'REC-2024-003',
    patientId: 'PT-2041',
    type: 'outpatient_note',
    date: '2024-11-20T14:00:00Z',
    institution: 'Mylapore Primary Health & Family Clinic',
    title: 'Care Alignment & SGLT2 Renoprotection Integration',
    sourceDocumentId: 'DOC-MYL-2024-8841',
    author: 'Dr. S. Balasubramanian, MBBS, MD',
    department: 'Primary Care / General Medicine',
    structuredData: {
      medications: [
        'Tab. Losartan 20mg PO OD',
        'Tab. Glipizide ER 5mg PO OD (Dose Reduced)',
        'Tab. Empagliflozin 10mg PO OD (Added Jardiance)',
      ],
      vitals: { BP: '128/78 mmHg', HR: 74, Weight: '77.2 kg' },
      labs: {
        creatinine: { value: 2.06, unit: 'mg/dL', flag: 'HIGH' },
        eGFR: { value: 37, unit: 'mL/min/1.73m2', flag: 'LOW' },
        hba1c: { value: 7.9, unit: '%', flag: 'HIGH' },
      },
      diagnoses: ['Chronic Kidney Disease Stage 3b', 'Type 2 Diabetes Mellitus with Nephropathy'],
    },
    content: `================================================================================
MYLAPORE PRIMARY HEALTH & FAMILY CLINIC
No. 44 Kutchery Road, Mylapore, Chennai 600004 | Tel: 044-2464-1890
================================================================================
PATIENT: Ramaswamy K.                  DOB: 1960-06-14        UHID: TN-UHID-88412
ENCOUNTER DATE: 2024-11-20 14:00 IST   DOC ID: DOC-MYL-2024-8841
PHYSICIAN: Dr. S. Balasubramanian, MBBS, MD

PURPOSE OF VISIT:
Follow up post-nephrology consult with Dr. Meenakshi (Kauvery Hospital) to align medications
and implement Stage 3b renal preservation protocol.

ASSESSMENT & PLAN:
1. CKD Stage 3b:
   - Serum Creatinine has plateaued at 2.06 mg/dL (eGFR 37).
   - In alignment with Kauvery nephrology, initiated Tab. Empagliflozin (Jardiance) 10mg PO OD
     to slow glomerular filtration decline.
   - Downward titration of Glipizide ER from 10mg to 5mg OD to prevent hypoglycemia.
2. Blood Pressure:
   - Continue Tab. Losartan 20mg PO OD.
3. Care Continuity:
   - Regular local checkups booked every 8 weeks in Mylapore to avoid any future gaps.

Electronically Signed: Dr. S. Balasubramanian, MBBS, MD
Date: 2024-11-20 15:30 IST`,
  },

  // ---------------------------------------------------------------------------
  // Record 15: 2025-01-28 - Kauvery Hospital (Alwarpet, Chennai)
  // ---------------------------------------------------------------------------
  {
    id: 'REC-2025-001',
    patientId: 'PT-2041',
    type: 'consultation',
    date: '2025-01-28T11:00:00Z',
    institution: 'Kauvery Hospital (Alwarpet, Chennai)',
    title: 'Longitudinal Nephrology Surveillance & 2025 Benchmark Assessment',
    sourceDocumentId: 'DOC-KAUV-2025-1033',
    author: 'Dr. R. Meenakshi, MD, DM (Nephrology)',
    department: 'Department of Nephrology & Renal Sciences',
    structuredData: {
      medications: [
        'Tab. Losartan 20mg PO OD',
        'Tab. Empagliflozin 10mg PO OD',
        'Tab. Glipizide ER 5mg PO OD',
      ],
      vitals: { BP: '126/78 mmHg', HR: 68, Weight: '76.4 kg' },
      labs: {
        creatinine: { value: 2.05, unit: 'mg/dL', flag: 'HIGH' },
        eGFR: { value: 37, unit: 'mL/min/1.73m2', flag: 'LOW' },
        potassium: { value: 4.7, unit: 'mEq/L', flag: 'NORMAL' },
        hba1c: { value: 7.3, unit: '%', flag: 'HIGH' },
      },
      diagnoses: ['Chronic Kidney Disease Stage 3b (Stabilized)', 'Type 2 Diabetes Mellitus'],
    },
    content: `================================================================================
KAUVERY HOSPITAL CHENNAI - SPECIALTY SURVEILLANCE REPORT
No. 81 TTK Road, Alwarpet, Chennai 600018 | Tel: 044-4000-6000
================================================================================
PATIENT: Ramaswamy K.                  DOB: 1960-06-14        UHID: TN-UHID-88412
VISIT DATE: 2025-01-28 11:00 IST       DOC ID: DOC-KAUV-2025-1033
NEPHROLOGIST: Dr. R. Meenakshi, MD, DM Nephro

2019-2025 COMPREHENSIVE BENCHMARK UPDATE:
Patient presents for routine nephrology surveillance. Following the initiation of Empagliflozin
and regimen reconciliation between Mylapore Clinic and Kauvery Hospital, the progressive surge
in serum creatinine has plateaued.

CURRENT OBJECTIVE METRICS:
- Blood Pressure: 126/78 mmHg (optimal control on Losartan).
- Serum Creatinine: 2.05 mg/dL (stabilized vs 2.10 mg/dL peak in June 2024).
- eGFR: 37 mL/min/1.73m2.
- HbA1c: 7.3% (improved from 8.4%).

SYNTHESIS:
Renal filtration has successfully stabilized under coordinated multidisciplinary care across
Mylapore Clinic, Kauvery Hospital, and Apollo Hospitals. Family understands the critical role
of continuous surveillance in Chennai.

Electronically Signed: Dr. R. Meenakshi, MD, DM (Nephrology)
Date: 2025-01-28 12:15 IST`,
  },
];
