import {
  CandidateInput,
  Major,
  Method402BranchResult,
  MethodResult,
} from "@/types/admission"
import {
  getBestCertificateConversion,
  getBestCertificateConversionForMajor,
} from "@/data/certificateRules"
import { getAwardScoreForMajor } from "@/data/awardRules"
import {
  calculateTotalBonus30,
  round2,
  scaleBonus30ToScaleN,
} from "./helpers"

type Candidate402 = {
  branch: "HSA" | "TSA" | "SAT" | "ACT"
  rawBase: number
  maxScale: 150 | 100 | 1600 | 36
}

function build402Candidates(input: CandidateInput): Candidate402[] {
  const candidates: Candidate402[] = []

  if (typeof input.hsa === "number" && input.hsa >= 80) {
    candidates.push({
      branch: "HSA",
      rawBase: input.hsa,
      maxScale: 150,
    })
  }

  if (typeof input.tsa === "number" && input.tsa >= 50) {
    candidates.push({
      branch: "TSA",
      rawBase: input.tsa,
      maxScale: 100,
    })
  }

  if (typeof input.sat === "number" && input.sat >= 1000) {
    candidates.push({
      branch: "SAT",
      rawBase: input.sat,
      maxScale: 1600,
    })
  }

  if (typeof input.act === "number" && input.act >= 20) {
    candidates.push({
      branch: "ACT",
      rawBase: input.act,
      maxScale: 36,
    })
  }

  return candidates
}

export function calculateMethod402(
  input: CandidateInput,
  major?: Major,
): MethodResult {
  const cert = major
    ? getBestCertificateConversionForMajor(input.certificates, major.code)
    : getBestCertificateConversion(input.certificates)

  const encouragement = cert?.encouragementScore ?? 0
  const award = getAwardScoreForMajor(input.awards, major)

  const candidates = build402Candidates(input)

  if (!candidates.length) {
    return {
      method: "402",
      eligible: false,
      scoreRaw: null,
      scoreDisplay: null,
      maxScale: 30,
      note: major
        ? `Không đủ ngưỡng HSA/TSA/SAT/ACT cho ngành ${major.code}.`
        : "Không đủ ngưỡng HSA/TSA/SAT/ACT.",
      priorityBase: input.priorityScore,
      priorityAdjusted: 0,
      awardScore: 0,
      encouragementScore: 0,
      totalBonus30: 0,
      certificateUsed: cert ?? undefined,
      branches402: [],
    }
  }

  const branches402: Method402BranchResult[] = candidates.map((candidate) => {
    const bonus30 = calculateTotalBonus30({
      priorityBase: input.priorityScore,
      totalScoreBeforePriority: candidate.rawBase,
      maxScaleForPriorityRule: candidate.maxScale,
      awardScore: award,
      encouragementScore: encouragement,
    })

    const priorityAdjustedScaled = round2(
      (bonus30.priorityAdjusted * candidate.maxScale) / 30,
    )

    const totalBonusScaled = round2(
      scaleBonus30ToScaleN(bonus30.totalBonus30, candidate.maxScale),
    )

    const finalScore = round2(
      Math.min(candidate.rawBase + totalBonusScaled, candidate.maxScale),
    )

    return {
      branch: candidate.branch,
      maxScale: candidate.maxScale,

      rawBase: candidate.rawBase,
      priorityBase: input.priorityScore,
      priorityAdjusted: bonus30.priorityAdjusted,
      priorityAdjustedScaled,

      awardScore: bonus30.awardScore,
      encouragementScore: bonus30.encouragementScore,
      totalBonus30: bonus30.totalBonus30,
      totalBonusScaled,

      finalScore,
    }
  })

  const best = [...branches402].sort((a, b) => b.finalScore - a.finalScore)[0]

  return {
    method: "402",
    eligible: true,
    scoreRaw: best.finalScore,
    scoreDisplay: best.finalScore,
    maxScale: best.maxScale,
    note: major
      ? `Kết quả PTXT 402 được tính riêng theo từng nhánh hợp lệ cho ngành ${major.code}; hệ thống chọn nhánh có điểm cao nhất.`
      : "Kết quả PTXT 402 được tính riêng theo từng nhánh hợp lệ; hệ thống chọn nhánh có điểm cao nhất.",
    priorityBase: best.priorityBase,
    priorityAdjusted: best.priorityAdjusted,
    awardScore: best.awardScore,
    encouragementScore: best.encouragementScore,
    totalBonus30: best.totalBonus30,
    certificateUsed: cert ?? undefined,
    branches402,
    bestBranch402: best.branch,
  }
}