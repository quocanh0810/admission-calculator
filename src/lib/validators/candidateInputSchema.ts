import { z } from "zod"

const score10 = z.number().min(0).max(10)

const transcriptSchema = z
  .object({
    toan: score10.optional(),
    van: score10.optional(),
    anh: score10.optional(),
    ly: score10.optional(),
    hoa: score10.optional(),
    sinh: score10.optional(),
    su: score10.optional(),
    dia: score10.optional(),
    gdktpl: score10.optional(),
    tinhoc: score10.optional(),
    congnghecongnghiep: score10.optional(),
    congnghenongnghiep: score10.optional(),
  })
  .strict()

const examScoresSchema = z
  .object({
    toan: score10.optional(),
    van: score10.optional(),
    anh: score10.optional(),
    ly: score10.optional(),
    hoa: score10.optional(),
    sinh: score10.optional(),
    su: score10.optional(),
    dia: score10.optional(),
    gdktpl: score10.optional(),
    tinhoc: score10.optional(),
    congnghecongnghiep: score10.optional(),
    congnghenongnghiep: score10.optional(),
    tiengphap: score10.optional(),
    tiengtrung: score10.optional(),
  })
  .strict()

const methodCodeSchema = z.enum(["100", "301", "402", "409", "410", "500"])

const combinationCodeSchema = z.enum([
  "A00",
  "A01",
  "D01",
  "D03",
  "D04",
  "D07",
  "D09",
  "D10",
  "X25",
  "X26",
  "X27",
  "X28",
])

const majorSchema = z
  .object({
    code: z.string().min(1),
    name: z.string().min(1),
    programType: z.string().optional(),
    allowedMethods: z.array(methodCodeSchema),
    combinations: z.array(combinationCodeSchema),
    benchmark2025: z.number().optional(),
  })
  .strict()

const toeic4SkillsSchema = z
  .object({
    listeningReading: z.number().min(0).max(990),
    speakingWriting: z.number().min(0).max(400),
  })
  .strict()

const certificatesSchema = z
  .object({
    ielts: z.number().min(0).max(9).optional(),
    toeflIbt: z.number().min(0).max(120).optional(),
    vstep: z.number().min(0).max(10).optional(),
    aptis: z.number().min(0).max(200).optional(),
    toeic4Skills: toeic4SkillsSchema.optional(),
    hskLevel: z.union([
      z.literal(3),
      z.literal(4),
      z.literal(5),
      z.literal(6),
    ]).optional(),
    tcf: z.number().min(0).max(699).optional(),
    delf: z.enum(["B1", "B2", "C1", "C2"]).optional(),
  })
  .strict()
  .optional()

const awardSchema = z
  .object({
    subject: z.enum([
      "toan",
      "van",
      "anh",
      "ly",
      "hoa",
      "sinh",
      "su",
      "dia",
      "gdktpl",
      "tinhoc",
      "tiengphap",
      "tiengtrung",
    ]),
    level: z.enum(["nhat", "nhi", "ba"]),
  })
  .strict()

export const candidateInputSchema = z
  .object({
    graduationYear: z.literal(2026),

    priorityScore: z.number().min(0).max(3),
    priorityAreaScore: z.number().min(0).max(1).optional(),
    priorityObjectScore: z.number().min(0).max(2).optional(),

    isSpecializedSchool: z.boolean().optional(),
    selectedMajors: z.array(majorSchema).default([]),

    examScores: examScoresSchema,

    transcript10: transcriptSchema,
    transcript11: transcriptSchema,
    transcript12: transcriptSchema,

    hsa: z.number().min(0).max(150).optional(),
    tsa: z.number().min(0).max(100).optional(),
    sat: z.number().min(0).max(1600).optional(),
    act: z.number().min(0).max(36).optional(),

    certificates: certificatesSchema,

    awards: z.array(awardSchema).default([]),
  })
  .strict()

export type CandidateInputSchema = z.infer<typeof candidateInputSchema>