import ExcelJS from "exceljs"
import {
  CalculationResponse,
  CandidateInput,
  Method402Branch,
  MethodResult,
  ProgramTrackScore,
  SelectedMajorResult,
} from "@/types/admission"

const SUBJECT_LABELS: Record<string, string> = {
  toan: "Toán",
  van: "Ngữ văn",
  anh: "Tiếng Anh",
  ly: "Vật lý",
  hoa: "Hóa học",
  su: "Lịch sử",
  dia: "Địa lý",
  gdktpl: "GDKT&PL",
  tinhoc: "Tin học",
  congnghecongnghiep: "Công nghệ công nghiệp",
  congnghenongnghiep: "Công nghệ nông nghiệp",
  tiengphap: "Tiếng Pháp",
  tiengtrung: "Tiếng Trung",
}

function round2(value: number) {
  return Math.round(value * 100) / 100
}

function scaleTo30(raw: number, maxScale: number) {
  return round2((raw * 30) / maxScale)
}

function formatSubjects(subjects?: string[]) {
  if (!subjects?.length) return ""
  return subjects.map((s) => SUBJECT_LABELS[s] ?? s).join(" + ")
}

function formatValue(value: unknown) {
  return value == null ? "" : value
}

function formatCertificate(method?: MethodResult | null) {
  if (!method?.certificateUsed) return ""
  return `${method.certificateUsed.certificateType} - ${method.certificateUsed.rawValue}`
}

function autoFitColumns(worksheet: ExcelJS.Worksheet) {
  worksheet.columns?.forEach((column) => {
    let maxLength = 12
    column.eachCell?.({ includeEmpty: true }, (cell) => {
      const value = cell.value ? String(cell.value) : ""
      maxLength = Math.max(maxLength, value.length + 2)
    })
    column.width = Math.min(maxLength, 40)
  })
}

function styleHeaderRow(row: ExcelJS.Row) {
  row.eachCell((cell) => {
    cell.font = { bold: true }
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    }
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "D9EAF7" },
    }
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    }
  })
}

function styleAllBorders(worksheet: ExcelJS.Worksheet) {
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      }
      cell.alignment = {
        vertical: "middle",
        wrapText: true,
      }
    })
  })
}

function fillBestMethodCell(cell: ExcelJS.Cell) {
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "E2F0D9" },
  }
  cell.font = {
    bold: true,
    color: { argb: "1F6E43" },
  }
}

function centerColumns(
  worksheet: ExcelJS.Worksheet,
  columnNumbers: number[],
  fromRow = 2,
) {
  for (let rowNumber = fromRow; rowNumber <= worksheet.rowCount; rowNumber++) {
    const row = worksheet.getRow(rowNumber)
    columnNumbers.forEach((col) => {
      row.getCell(col).alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      }
    })
  }
}

function getBestTrackScore(
  method?: MethodResult | null,
): ProgramTrackScore | null {
  if (!method?.programTrackScores?.length) return null

  const validTracks = method.programTrackScores.filter(
    (track) => typeof track.scoreDisplay === "number",
  )

  if (!validTracks.length) return null

  return [...validTracks].sort(
    (a, b) => (b.scoreDisplay ?? 0) - (a.scoreDisplay ?? 0),
  )[0]
}

function getBaseScoreBeforeBonus(method?: MethodResult | null): number | string {
  const bestTrack = getBestTrackScore(method)
  return bestTrack?.baseScoreBeforeBonus ?? ""
}

function get402Branch(method402: MethodResult | null | undefined, branch: Method402Branch) {
  return method402?.branches402?.find((item) => item.branch === branch) ?? null
}

export async function buildAdmissionExcel(params: {
  input: CandidateInput
  result: CalculationResponse
}) {
  const { input, result } = params
  const workbook = new ExcelJS.Workbook()

  workbook.creator = "ChatGPT"
  workbook.created = new Date()

  // SHEET 1: Tổng quan theo ngành
  const wsSummary = workbook.addWorksheet("Tong_quan_nganh")

  wsSummary.addRow([
    "STT",
    "Mã ngành",
    "Tên ngành",
    "Loại CTĐT",
    "Tổ hợp tối ưu nhất",
    "Môn trong tổ hợp",
    "Chứng chỉ dùng",
    "PTXT100",
    "PTXT409",
    "PTXT410",
    "PTXT500",
    "HSA",
    "TSA",
    "SAT",
    "ACT",
    "PTXT tốt nhất",
  ])

  styleHeaderRow(wsSummary.getRow(1))

  result.selectedMajorResults.forEach((row: SelectedMajorResult, index) => {
    const excelRow = wsSummary.addRow([
      index + 1,
      row.code,
      row.name,
      formatValue(row.programType),
      formatValue(row.bestCombination?.combination),
      formatSubjects(row.bestCombination?.subjects),
      row.certificateUsed
        ? `${row.certificateUsed.certificateType} - ${row.certificateUsed.rawValue}`
        : "",
      formatValue(row.methodScores["100"]),
      formatValue(row.methodScores["409"]),
      formatValue(row.methodScores["410"]),
      formatValue(row.methodScores["500"]),
      formatValue(row.method402Scores.HSA),
      formatValue(row.method402Scores.TSA),
      formatValue(row.method402Scores.SAT),
      formatValue(row.method402Scores.ACT),
      formatValue(row.bestMethodAmongMainMethods),
    ])

    const best = row.bestMethodAmongMainMethods
    if (best === "100") fillBestMethodCell(excelRow.getCell(8))
    if (best === "409") fillBestMethodCell(excelRow.getCell(9))
    if (best === "410") fillBestMethodCell(excelRow.getCell(10))
    if (best === "500") fillBestMethodCell(excelRow.getCell(11))
  })

  styleAllBorders(wsSummary)
  centerColumns(wsSummary, [1, 2, 8, 9, 10, 11, 12, 13, 14, 15, 16])
  autoFitColumns(wsSummary)

  // SHEET 2: Chi tiết từng PTXT theo ngành
  const wsMethodDetails = workbook.addWorksheet("Chi_tiet_tung_PTDT")

  wsMethodDetails.addRow([
    "Mã ngành",
    "Tên ngành",
    "Loại CTĐT",
    "PTXT",
    "Đủ điều kiện",
    "Điểm xét tuyển",
    "Điểm gốc trước cộng",
    "Tổ hợp tốt nhất",
    "Môn trong tổ hợp",
    "Chứng chỉ dùng",
    "Điểm chứng chỉ quy đổi",
    "Điểm ưu tiên gốc",
    "Ưu tiên sau giảm",
    "Điểm xét thưởng",
    "Điểm khuyến khích",
    "Tổng điểm cộng",
    "Ghi chú",
  ])

  styleHeaderRow(wsMethodDetails.getRow(1))

  result.selectedMajorResults.forEach((row) => {
    const details = row.methodDetails ?? {}

    ;(["100", "409", "410", "500"] as const).forEach((methodCode) => {
      const method = details[methodCode] ?? null

      wsMethodDetails.addRow([
        row.code,
        row.name,
        formatValue(row.programType),
        methodCode,
        method?.eligible ? "Có" : "Không",
        formatValue(method?.scoreDisplay),
        formatValue(getBaseScoreBeforeBonus(method)),
        formatValue(method?.bestCombination?.combination),
        formatSubjects(method?.bestCombination?.subjects),
        formatCertificate(method),
        formatValue(method?.certificateUsed?.convertedScore),
        formatValue(method?.priorityBase),
        formatValue(method?.priorityAdjusted),
        formatValue(method?.awardScore),
        formatValue(method?.encouragementScore),
        formatValue(method?.totalBonus30),
        formatValue(method?.note),
      ])
    })
  })

  styleAllBorders(wsMethodDetails)
  centerColumns(wsMethodDetails, [4, 5, 6, 7, 11, 12, 13, 14, 15, 16])
  autoFitColumns(wsMethodDetails)

  // SHEET 3: Chi tiết PTXT 402 theo từng ngành và từng nhánh
  const ws402 = workbook.addWorksheet("Chi_tiet_402")

  ws402.addRow([
    "Mã ngành",
    "Tên ngành",
    "Loại CTĐT",
    "Được phép xét 402",
    "Nhánh",
    "Là nhánh tốt nhất",
    "Điểm gốc",
    "Thang điểm nhánh",
    "Điểm gốc quy thang 30",
    "Chứng chỉ dùng",
    "Điểm ưu tiên gốc",
    "Ưu tiên sau giảm (thang 30)",
    "Ưu tiên quy đổi theo thang nhánh",
    "Điểm xét thưởng",
    "Điểm khuyến khích",
    "Tổng điểm cộng (thang 30)",
    "Tổng điểm cộng quy đổi theo thang nhánh",
    "Điểm xét tuyển cuối cùng",
    "Ghi chú",
  ])

  styleHeaderRow(ws402.getRow(1))

  result.selectedMajorResults.forEach((row) => {
    const method402 = row.methodDetails?.["402"] ?? null

    if (!method402) {
      ws402.addRow([
        row.code,
        row.name,
        formatValue(row.programType),
        "Không",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Ngành này không cho phép xét PTXT 402.",
      ])
      return
    }

    const branches = method402.branches402 ?? []

    if (!branches.length) {
      ws402.addRow([
        row.code,
        row.name,
        formatValue(row.programType),
        "Có",
        "",
        "",
        "",
        "",
        "",
        formatCertificate(method402),
        formatValue(method402.priorityBase),
        formatValue(method402.priorityAdjusted),
        "",
        formatValue(method402.awardScore),
        formatValue(method402.encouragementScore),
        formatValue(method402.totalBonus30),
        "",
        formatValue(method402.scoreDisplay),
        formatValue(method402.note),
      ])
      return
    }

    branches.forEach((branch) => {
      const isBest = method402.bestBranch402 === branch.branch

      const excelRow = ws402.addRow([
        row.code,
        row.name,
        formatValue(row.programType),
        "Có",
        branch.branch,
        isBest ? "Có" : "",
        formatValue(branch.rawBase),
        formatValue(branch.maxScale),
        formatValue(scaleTo30(branch.rawBase, branch.maxScale)),
        formatCertificate(method402),
        formatValue(branch.priorityBase),
        formatValue(branch.priorityAdjusted),
        formatValue(branch.priorityAdjustedScaled),
        formatValue(branch.awardScore),
        formatValue(branch.encouragementScore),
        formatValue(branch.totalBonus30),
        formatValue(branch.totalBonusScaled),
        formatValue(branch.finalScore),
        isBest ? "Nhánh tốt nhất của PTXT 402." : "",
      ])

      if (isBest) {
        fillBestMethodCell(excelRow.getCell(6))
        fillBestMethodCell(excelRow.getCell(18))
      }
    })
  })

  styleAllBorders(ws402)
  centerColumns(ws402, [4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18])
  autoFitColumns(ws402)

  // SHEET 4: Dữ liệu đầu vào
  const wsInput = workbook.addWorksheet("Du_lieu_dau_vao")

  wsInput.addRow(["Trường", "Giá trị"])
  styleHeaderRow(wsInput.getRow(1))

  const pushInputRow = (label: string, value: unknown) => {
    wsInput.addRow([label, value == null ? "" : String(value)])
  }

  pushInputRow("Năm tốt nghiệp", input.graduationYear)
  pushInputRow("Điểm ưu tiên khu vực", input.priorityAreaScore)
  pushInputRow("Điểm ưu tiên đối tượng", input.priorityObjectScore)
  pushInputRow("Tổng điểm ưu tiên", input.priorityScore)
  pushInputRow(
    "Trường chuyên / trọng điểm",
    input.isSpecializedSchool ? "Có" : "Không",
  )

  Object.entries(input.examScores ?? {}).forEach(([key, value]) => {
    pushInputRow(`Điểm thi ${SUBJECT_LABELS[key] ?? key}`, value)
  })

  Object.entries(input.transcript10 ?? {}).forEach(([key, value]) => {
    pushInputRow(`Học bạ lớp 10 - ${SUBJECT_LABELS[key] ?? key}`, value)
  })

  Object.entries(input.transcript11 ?? {}).forEach(([key, value]) => {
    pushInputRow(`Học bạ lớp 11 - ${SUBJECT_LABELS[key] ?? key}`, value)
  })

  Object.entries(input.transcript12 ?? {}).forEach(([key, value]) => {
    pushInputRow(`Học bạ lớp 12 - ${SUBJECT_LABELS[key] ?? key}`, value)
  })

  pushInputRow("HSA", input.hsa)
  pushInputRow("TSA", input.tsa)
  pushInputRow("SAT", input.sat)
  pushInputRow("ACT", input.act)

  pushInputRow("IELTS", input.certificates?.ielts)
  pushInputRow("TOEFL iBT", input.certificates?.toeflIbt)
  pushInputRow("VSTEP", input.certificates?.vstep)
  pushInputRow("APTIS", input.certificates?.aptis)
  pushInputRow("HSK cấp độ", input.certificates?.hskLevel)
  pushInputRow("TCF", input.certificates?.tcf)
  pushInputRow("DELF", input.certificates?.delf)
  pushInputRow(
    "TOEIC LR",
    input.certificates?.toeic4Skills?.listeningReading,
  )
  pushInputRow(
    "TOEIC SW",
    input.certificates?.toeic4Skills?.speakingWriting,
  )

  input.awards?.forEach((award, index) => {
    pushInputRow(
      `Giải HSG ${index + 1}`,
      `${SUBJECT_LABELS[award.subject] ?? award.subject} - ${award.level}`,
    )
  })

  input.selectedMajors?.forEach((major, index) => {
    pushInputRow(
      `Ngành đã chọn ${index + 1}`,
      `${major.code} - ${major.name} (${major.programType ?? ""})`,
    )
  })

  styleAllBorders(wsInput)
  autoFitColumns(wsInput)

  const buffer = await workbook.xlsx.writeBuffer()
  return buffer
}