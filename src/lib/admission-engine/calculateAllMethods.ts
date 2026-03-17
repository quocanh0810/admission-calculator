import { SCORE_BUCKETS } from "../../data/scoreBuckets"
import {
  CalculationResponse,
  CandidateInput,
  Method402Branch,
  MethodResult,
  ScoreBucketResult,
  SelectedMajorResult,
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
    (method) => method.eligible && typeof method.scoreDisplay === "number",
  )

  if (!eligible.length) return null

  return [...eligible].sort(
    (a, b) => (b.scoreDisplay ?? 0) - (a.scoreDisplay ?? 0),
  )[0]
}

function pickTrackMethod(
  method: MethodResult,
  track: "standard" | "special",
): MethodResult {
  const trackScore = method.programTrackScores?.find(
    (item) => item.track === track,
  )

  const trackHasScore = typeof trackScore?.scoreDisplay === "number"
  const methodIsEligible = method.eligible && trackHasScore

  return {
    ...method,
    scoreRaw: methodIsEligible ? (trackScore?.scoreDisplay ?? null) : null,
    scoreDisplay: methodIsEligible ? (trackScore?.scoreDisplay ?? null) : null,
    bestCombination: methodIsEligible ? trackScore?.bestCombination : undefined,
    priorityBase: methodIsEligible
      ? (trackScore?.priorityBase ?? method.priorityBase ?? 0)
      : 0,
    priorityAdjusted: methodIsEligible
      ? (trackScore?.priorityAdjusted ?? method.priorityAdjusted ?? 0)
      : 0,
    awardScore: methodIsEligible
      ? (trackScore?.awardScore ?? method.awardScore ?? 0)
      : 0,
    encouragementScore: methodIsEligible
      ? (trackScore?.encouragementScore ?? method.encouragementScore ?? 0)
      : 0,
    totalBonus30: methodIsEligible
      ? (trackScore?.totalBonus30 ?? method.totalBonus30 ?? 0)
      : 0,
    eligible: methodIsEligible,
    note: method.note,
    certificateUsed: method.certificateUsed,
    programTrackScores: methodIsEligible && trackScore ? [trackScore] : [],
  }
}

function getBestMethodAmongMainMethods(scores: {
  "100": number | null
  "409": number | null
  "410": number | null
  "500": number | null
}): "100" | "409" | "410" | "500" | null {
  const entries: Array<["100" | "409" | "410" | "500", number | null]> = [
    ["100", scores["100"]],
    ["409", scores["409"]],
    ["410", scores["410"]],
    ["500", scores["500"]],
  ]

  const validEntries = entries.filter(
    (entry): entry is ["100" | "409" | "410" | "500", number] =>
      typeof entry[1] === "number",
  )

  if (!validEntries.length) return null

  validEntries.sort((a, b) => b[1] - a[1])
  return validEntries[0][0]
}

function get402Score(
  method402: MethodResult | null,
  branch: Method402Branch,
): number | null {
  const result = method402?.branches402?.find((item) => item.branch === branch)
  return result?.finalScore ?? null
}

function buildSelectedMajorResults(params: {
  input: CandidateInput
}): SelectedMajorResult[] {
  const { input } = params

  const selectedMajors = input.selectedMajors ?? []
  if (!selectedMajors.length) return []

  return selectedMajors.map((major) => {
    const method100 = major.allowedMethods.includes("100")
      ? calculateMethod100(input, major)
      : null

    const method402 = major.allowedMethods.includes("402")
      ? calculateMethod402(input, major)
      : null

    const method409 = major.allowedMethods.includes("409")
      ? calculateMethod409(input, major)
      : null

    const method410 = major.allowedMethods.includes("410")
      ? calculateMethod410(input, major)
      : null

    const method500 = major.allowedMethods.includes("500")
      ? calculateMethod500(input, major)
      : null

    const methodScores: SelectedMajorResult["methodScores"] = {
      "100":
        method100?.eligible && typeof method100.scoreDisplay === "number"
          ? method100.scoreDisplay
          : null,
      "409":
        method409?.eligible && typeof method409.scoreDisplay === "number"
          ? method409.scoreDisplay
          : null,
      "410":
        method410?.eligible && typeof method410.scoreDisplay === "number"
          ? method410.scoreDisplay
          : null,
      "500":
        method500?.eligible && typeof method500.scoreDisplay === "number"
          ? method500.scoreDisplay
          : null,
    }

    const bestMethodAmongMainMethods =
      getBestMethodAmongMainMethods(methodScores)

    const bestMethod =
      bestMethodAmongMainMethods === "100"
        ? method100
        : bestMethodAmongMainMethods === "409"
          ? method409
          : bestMethodAmongMainMethods === "410"
            ? method410
            : bestMethodAmongMainMethods === "500"
              ? method500
              : null

    return {
      code: major.code,
      name: major.name,
      programType: major.programType,
      bestCombination: bestMethod?.bestCombination,
      certificateUsed:
        bestMethod?.certificateUsed ??
        method409?.certificateUsed ??
        method410?.certificateUsed ??
        method100?.certificateUsed ??
        method500?.certificateUsed ??
        method402?.certificateUsed,
      methodScores,
      method402Scores: {
        HSA: major.allowedMethods.includes("402")
          ? get402Score(method402, "HSA")
          : null,
        TSA: major.allowedMethods.includes("402")
          ? get402Score(method402, "TSA")
          : null,
        SAT: major.allowedMethods.includes("402")
          ? get402Score(method402, "SAT")
          : null,
        ACT: major.allowedMethods.includes("402")
          ? get402Score(method402, "ACT")
          : null,
      },
      bestMethodAmongMainMethods,
      methodDetails: {
        "100": method100,
        "402": method402,
        "409": method409,
        "410": method410,
        "500": method500,
      },
    }
  })
}

export function calculateAllMethods(
  input: CandidateInput,
): CalculationResponse {
  const method100 = calculateMethod100(input)
  const method409 = calculateMethod409(input)
  const method402 = calculateMethod402(input)
  const method410 = calculateMethod410(input)
  const method500 = calculateMethod500(input)

  const standardComparableMethods: MethodResult[] = [
    pickTrackMethod(method100, "standard"),
    pickTrackMethod(method409, "standard"),
    pickTrackMethod(method500, "standard"),
  ]

  const specialComparableMethods: MethodResult[] = [
    pickTrackMethod(method100, "special"),
    pickTrackMethod(method409, "special"),
    pickTrackMethod(method500, "special"),
  ]

  const standardMethod410 = pickTrackMethod(method410, "standard")
  const specialMethod410 = pickTrackMethod(method410, "special")

  const standardBestComparableMethod =
    recommendComparableMethod(standardComparableMethods)

  const specialBestComparableMethod =
    recommendComparableMethod(specialComparableMethods)

  const scoreBuckets: ScoreBucketResult[] = [
    {
      key: SCORE_BUCKETS.standard.key,
      title: SCORE_BUCKETS.standard.title,
      combinations: SCORE_BUCKETS.standard.combinations,
      comparableMethods: standardComparableMethods,
      bestComparableMethod: standardBestComparableMethod,
      method410: standardMethod410,
    },
    {
      key: SCORE_BUCKETS.special.key,
      title: SCORE_BUCKETS.special.title,
      combinations: SCORE_BUCKETS.special.combinations,
      comparableMethods: specialComparableMethods,
      bestComparableMethod: specialBestComparableMethod,
      method410: specialMethod410,
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
    ...standardComparableMethods,
    ...specialComparableMethods,
    method402,
    standardMethod410,
    specialMethod410,
    manual301,
  ]

  const eligibleMajorResults = buildMajorEvaluations(allMethods)

  const selectedMajorResults = buildSelectedMajorResults({ input })

  const globalBest = recommendComparableMethod([
    ...standardComparableMethods,
    ...specialComparableMethods,
    standardMethod410,
    specialMethod410,
  ])

  return {
    scoreBuckets,
    method402,
    manual301,
    eligibleMajorResults,
    selectedMajorResults,
    summary: {
      totalEligibleMethods: allMethods.filter((method) => method.eligible)
        .length,
      recommendedMethod: globalBest?.method ?? null,
    },
  }
}