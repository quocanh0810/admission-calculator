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

export type MethodCode =
  | "100"
  | "301"
  | "402"
  | "409"
  | "410"
  | "500"

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

export type Method402Branch = "HSA" | "TSA" | "SAT" | "ACT"

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

export interface Major {
  code: string
  name: string
  programType?: string
  allowedMethods: MethodCode[]
  combinations: CombinationCode[]
  benchmark2025?: number
}

export interface CandidateInput {
  graduationYear: 2026

  priorityScore: number
  priorityAreaScore?: number
  priorityObjectScore?: number

  isSpecializedSchool?: boolean
  selectedMajors?: Major[]

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
    tcf?: number
    delf?: "B1" | "B2" | "C1" | "C2"
  }

  awards?: AwardInput[]
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
  branch: Method402Branch
  maxScale: 150 | 100 | 1600 | 36

  rawBase: number
  priorityBase: number
  priorityAdjusted: number
  priorityAdjustedScaled: number

  awardScore: number
  encouragementScore: number
  totalBonus30: number
  totalBonusScaled: number

  finalScore: number
}

/**
 * Dùng để audit từng tổ hợp khi xuất Excel.
 * Rất hữu ích để debug logic tính điểm.
 */
export interface CombinationAuditResult {
  combination: CombinationCode
  subjects: Subject[]

  isEligible: boolean
  reason?: string

  baseScoreBeforeBonus: number | null
  finalScore: number | null

  toanScore?: number | null
  secondSubjectScore?: number | null
  certificateConvertedScore?: number | null

  priorityBase?: number
  priorityAdjusted?: number
  awardScore?: number
  encouragementScore?: number
  totalBonus30?: number
}

/**
 * Kết quả theo từng nhóm chương trình (standard / special)
 * trong một phương thức.
 */
export interface ProgramTrackScore {
  track: "standard" | "special"
  trackLabel: string

  scoreDisplay: number | null
  baseScoreBeforeBonus?: number | null

  bestCombination?: CombinationScoreResult

  priorityBase?: number
  priorityAdjusted?: number
  awardScore?: number
  encouragementScore?: number
  totalBonus30?: number

  combinationAudits?: CombinationAuditResult[]
}

/**
 * Kết quả chung của một phương thức xét tuyển.
 */
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

  /**
   * PTXT 402
   */
  branches402?: Method402BranchResult[]
  bestBranch402?: Method402Branch

  /**
   * PTXT 100 / 409 / 410 / 500
   */
  programTrackScores?: ProgramTrackScore[]
}

export interface MajorMethodEvaluation {
  majorCode: string
  majorName: string
  method: MethodCode
  scoreDisplay: number
  benchmark2025?: number
  marginVsBenchmark?: number | null
}

export interface ScoreBucketResult {
  key: "standard" | "special"
  title: string
  combinations: CombinationCode[]
  comparableMethods: MethodResult[]
  bestComparableMethod: MethodResult | null
  method410: MethodResult | null
}

/**
 * Type riêng để lưu chi tiết từng phương thức theo từng ngành.
 * Về bản chất gần tương đương MethodResult,
 * nhưng tách riêng để dễ đọc và dễ export.
 */
export interface SelectedMajorMethodDetail {
  method: MethodCode
  eligible: boolean

  scoreDisplay: number | null
  scoreRaw: number | null
  maxScale: 30 | 36 | 100 | 150 | 1600

  bestCombination?: CombinationScoreResult
  certificateUsed?: CertificateConversionResult

  priorityBase?: number
  priorityAdjusted?: number
  awardScore?: number
  encouragementScore?: number
  totalBonus30?: number

  note?: string

  programTrackScores?: ProgramTrackScore[]

  branches402?: Method402BranchResult[]
  bestBranch402?: Method402Branch
}

export interface SelectedMajorResult {
  code: string
  name: string
  programType?: string

  bestCombination?: CombinationScoreResult
  certificateUsed?: CertificateConversionResult

  methodScores: Record<"100" | "409" | "410" | "500", number | null>
  method402Scores: Record<Method402Branch, number | null>

  bestMethodAmongMainMethods: "100" | "409" | "410" | "500" | null

  /**
   * Toàn bộ chi tiết từng PTXT cho ngành này,
   * dùng để xuất Excel / debug.
   */
  methodDetails?: {
    "100"?: SelectedMajorMethodDetail | null
    "402"?: SelectedMajorMethodDetail | null
    "409"?: SelectedMajorMethodDetail | null
    "410"?: SelectedMajorMethodDetail | null
    "500"?: SelectedMajorMethodDetail | null
  }
}

export interface CalculationResponse {
  scoreBuckets: ScoreBucketResult[]

  method402: MethodResult | null
  manual301: MethodResult | null

  eligibleMajorResults: MajorMethodEvaluation[]
  selectedMajorResults: SelectedMajorResult[]

  summary: {
    totalEligibleMethods: number
    recommendedMethod: MethodCode | null
  }
}