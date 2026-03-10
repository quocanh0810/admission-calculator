import { majors } from "@/data/majors"
import {
  CalculationResponse,
  CandidateInput,
  MethodResult,
} from "@/types/admission"
import { calculateMethod100 } from "./calculateMethod100"
import { calculateMethod402 } from "./calculateMethod402"
import { calculateMethod409 } from "./calculateMethod409"
import { calculateMethod410 } from "./calculateMethod410"
import { calculateMethod500 } from "./calculateMethod500"
import { buildMajorEvaluations } from "./buildMajorEvaluations"

function recommendComparableMethod(
  methods: MethodResult[],
): MethodResult | null {
  const eligible = methods.filter(
    (m) => m.eligible && typeof m.scoreDisplay === "number",
  )

  if (!eligible.length) return null

  return eligible.sort(
    (a, b) => (b.scoreDisplay ?? 0) - (a.scoreDisplay ?? 0),
  )[0]
}

export function calculateAllMethods(
  input: CandidateInput,
): CalculationResponse {
  const method100 = calculateMethod100(
    input,
    majors.filter((major) => major.allowedMethods.includes("100")),
  )

  const method409 = calculateMethod409(
    input,
    majors.filter((major) => major.allowedMethods.includes("409")),
  )

  const method500 = calculateMethod500(
    input,
    majors.filter((major) => major.allowedMethods.includes("500")),
  )

  const method410 = calculateMethod410(
    input,
    majors.filter((major) => major.allowedMethods.includes("410")),
  )

  const method402 = calculateMethod402(input)

  const manual301: MethodResult = {
    method: "301",
    eligible: false,
    scoreRaw: null,
    scoreDisplay: null,
    maxScale: 30,
    note: "PTXT 301 là diện xét hồ sơ/minh chứng, không tự chấm điểm tự động.",
  }

  const comparableMethods: MethodResult[] = [method100, method409, method500]
  const bestComparableMethod = recommendComparableMethod(comparableMethods)

  const allMethods: MethodResult[] = [
    ...comparableMethods,
    method410,
    method402,
    manual301,
  ]

  const eligibleMajorResults = buildMajorEvaluations(allMethods)

  return {
    comparableMethods,
    bestComparableMethod,
    method410,
    method402,
    manual301,
    eligibleMajorResults,
    summary: {
      totalEligibleMethods: allMethods.filter((m) => m.eligible).length,
      recommendedMethod: bestComparableMethod?.method ?? null,
    },
  }
}