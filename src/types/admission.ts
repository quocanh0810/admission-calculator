export type Subject =
  | "toan"
  | "van"
  | "anh"
  | "ly"
  | "hoa"
  | "sinh"
  | "su"
  | "dia"
  | "gdktpl"
  | "tinhoc"
  | "congnghecongnghiep"
  | "congnghenongnghiep"
  | "tiengphap"
  | "tiengtrung"

export type TranscriptSubject =
  | "toan"
  | "van"
  | "anh"
  | "ly"
  | "hoa"
  | "sinh"
  | "su"
  | "dia"
  | "gdktpl"
  | "tinhoc"
  | "congnghecongnghiep"
  | "congnghenongnghiep"

export type CombinationCode =
  | "A00"
  | "A01"
  | "D01"
  | "D03"
  | "D04"
  | "D07"
  | "D09"
  | "D10"
  | "X25"
  | "X26"
  | "X27"
  | "X28"

export type MethodCode = "100" | "301" | "402" | "409" | "410" | "500"

export type CertificateType =
  | "IELTS"
  | "TOEFL_IBT"
  | "VSTEP"
  | "APTIS"
  | "TOEIC_4_SKILLS"
  | "HSK"
  | "TCF"
  | "DELF"

export type HighSchoolAwardLevel = "nhat" | "nhi" | "ba"

export interface AwardInput {
  subject: Subject
  level: HighSchoolAwardLevel
}

export type TranscriptYearScores = {
  [key in TranscriptSubject]?: number
}

export interface Toeic4Skills {
  listeningReading: number
  speakingWriting: number
}

export interface CandidateInput {
  graduationYear: 2026
  priorityScore: number
  isSpecializedSchool?: boolean

  examScores: Partial<Record<Subject, number>>

  transcript10: TranscriptYearScores
  transcript11: TranscriptYearScores
  transcript12: TranscriptYearScores

  hsa?: number
  tsa?: number
  sat?: number
  act?: number

  certificates?: {
    ielts?: number
    toeflIbt?: number
    vstep?: number
    aptis?: number
    toeic4Skills?: Toeic4Skills
    hskLevel?: 3 | 4 | 5 | 6
    hskScore?: number
    tcf?: number
    delf?: "B1" | "B2" | "C1" | "C2"
  }

  awards?: AwardInput[]
}

export interface Major {
  code: string
  name: string
  programType?: string
  allowedMethods: MethodCode[]
  combinations: CombinationCode[]
  benchmark2025?: number
}

export interface CertificateConversionResult {
  certificateType: CertificateType
  rawValue: string | number
  convertedScore: number
  encouragementScore: number
}

export interface CombinationScoreResult {
  combination: CombinationCode
  subjects: Subject[]
  score: number
}

export interface Method402BranchResult {
  branch: "HSA" | "TSA" | "SAT" | "ACT"
  maxScale: 150 | 100 | 1600 | 36

  rawBase: number
  priorityBase: number
  priorityAdjusted: number
  awardScore: number
  encouragementScore: number
  totalBonus30: number
  totalBonusScaled: number

  finalScore: number
}

export interface MethodResult {
  method: MethodCode
  eligible: boolean
  scoreRaw: number | null
  scoreDisplay: number | null
  maxScale: 30 | 36 | 100 | 150 | 1600
  note?: string
  bestCombination?: CombinationScoreResult
  certificateUsed?: CertificateConversionResult

  priorityBase?: number
  priorityAdjusted?: number
  awardScore?: number
  encouragementScore?: number
  totalBonus30?: number

  branches402?: Method402BranchResult[]
  bestBranch402?: "HSA" | "TSA" | "SAT" | "ACT"
}

export interface MajorMethodEvaluation {
  majorCode: string
  majorName: string
  method: MethodCode
  scoreDisplay: number
  benchmark2025?: number
  marginVsBenchmark?: number | null
}

export interface CalculationResponse {
  comparableMethods: MethodResult[]
  bestComparableMethod: MethodResult | null

  method410: MethodResult | null
  method402: MethodResult | null
  manual301: MethodResult | null

  eligibleMajorResults: MajorMethodEvaluation[]

  summary: {
    totalEligibleMethods: number
    recommendedMethod: MethodCode | null
  }
}