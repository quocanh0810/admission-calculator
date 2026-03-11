import { SCORE_BUCKETS } from "../../data/scoreBuckets"
import {
  CalculationResponse,
  CandidateInput,
  MethodResult,
  ScoreBucketResult,
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

  return eligible.sort((a, b) => (b.scoreDisplay ?? 0) - (a.scoreDisplay ?? 0))[0]
}

export function calculateAllMethods(
  input: CandidateInput,
): CalculationResponse {
  const standard100 = calculateMethod100(input)
  const standard409 = calculateMethod409(input)
  const method402 = calculateMethod402(input)
  const method410 = calculateMethod410(input, [])
  const method500 = calculateMethod500(input)

  const comparableMethods: MethodResult[] = [standard100, standard409, method500]
  const bestComparableMethod = recommendComparableMethod(comparableMethods)

  const scoreBuckets: ScoreBucketResult[] = [
    {
      key: SCORE_BUCKETS.standard.key,
      title: SCORE_BUCKETS.standard.title,
      combinations: SCORE_BUCKETS.standard.combinations,
      comparableMethods,
      bestComparableMethod,
      method410,
    },
    {
      key: SCORE_BUCKETS.special.key,
      title: SCORE_BUCKETS.special.title,
      combinations: SCORE_BUCKETS.special.combinations,
      comparableMethods,
      bestComparableMethod,
      method410,
    },
  ]

  const manual301: MethodResult = {
    method: "301",
    eligible: false,
    scoreRaw: null,
    scoreDisplay: null,
    maxScale: 30,
    note: "PTXT 301 là diện xét hồ sơ/minh chứng, không tự chấm điểm tự động.",
  }

  const allMethods: MethodResult[] = [
    ...comparableMethods,
    method402,
    method410,
    manual301,
  ]

  const eligibleMajorResults = buildMajorEvaluations(allMethods)

  return {
    scoreBuckets,
    method402,
    manual301,
    eligibleMajorResults,
    summary: {
      totalEligibleMethods: allMethods.filter((m) => m.eligible).length,
      recommendedMethod: bestComparableMethod?.method ?? null,
    },
  }
}