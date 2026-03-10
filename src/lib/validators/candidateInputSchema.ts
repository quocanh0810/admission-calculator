import { z } from "zod"

const score10 = z.number().min(0).max(10)

const transcriptSchema = z.object({
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

export const candidateInputSchema = z.object({
  graduationYear: z.literal(2026),
  priorityScore: z.number().min(0).max(3),
  isSpecializedSchool: z.boolean().optional(),

  examScores: z.object({
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
  }),

  transcript10: transcriptSchema,
  transcript11: transcriptSchema,
  transcript12: transcriptSchema,

  hsa: z.number().min(0).max(150).optional(),
  tsa: z.number().min(0).max(100).optional(),
  sat: z.number().min(0).max(1600).optional(),
  act: z.number().min(0).max(36).optional(),

  certificates: z
    .object({
      ielts: z.number().min(0).max(9).optional(),
      toeflIbt: z.number().min(0).max(120).optional(),
      vstep: z.number().min(0).max(10).optional(),
      aptis: z.number().min(0).max(200).optional(),
      toeic4Skills: z
        .object({
          listeningReading: z.number().min(0).max(990),
          speakingWriting: z.number().min(0).max(400),
        })
        .optional(),
      hskLevel: z.union([
        z.literal(3),
        z.literal(4),
        z.literal(5),
        z.literal(6),
      ]).optional(),
      hskScore: z.number().min(0).max(300).optional(),
      tcf: z.number().min(0).max(699).optional(),
      delf: z.enum(["B1", "B2", "C1", "C2"]).optional(),
    })
    .optional(),

  awards: z
    .array(
      z.object({
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
      }),
    )
    .optional(),
})

export type CandidateInputSchema = z.infer<typeof candidateInputSchema>