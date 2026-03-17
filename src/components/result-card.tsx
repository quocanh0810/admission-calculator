import { CalculationResponse, SelectedMajorResult } from "@/types/admission"

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

function formatSubjectsVietnamese(subjects: string[]) {
  return subjects.map((subject) => SUBJECT_LABELS[subject] ?? subject).join(" + ")
}

function formatScore(value: number | null | undefined) {
  if (value == null) return "-"
  return String(value)
}

function ScoreCell({
  value,
  active = false,
}: {
  value: number | null | undefined
  active?: boolean
}) {
  return (
    <td
      className={`px-4 py-4 text-center text-sm font-semibold ${
        active ? "bg-emerald-50 text-emerald-700" : "text-slate-700"
      }`}
    >
      {formatScore(value)}
    </td>
  )
}

function MajorResultsTable({
  rows,
}: {
  rows: SelectedMajorResult[]
}) {
  if (!rows?.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500">
        Chưa có ngành nào được chọn để phân tích.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-[1650px] w-full border-collapse">
          <thead className="bg-slate-100">
            <tr>
              <th
                rowSpan={2}
                className="border-b border-slate-200 px-4 py-4 text-center text-sm font-semibold text-slate-700"
              >
                STT
              </th>

              <th
                rowSpan={2}
                className="border-b border-slate-200 px-4 py-4 text-left text-sm font-semibold text-slate-700"
              >
                Tên ngành + Chương trình đào tạo
              </th>

              <th
                rowSpan={2}
                className="border-b border-slate-200 px-4 py-4 text-left text-sm font-semibold text-slate-700"
              >
                Tổ hợp tối ưu nhất
              </th>

              <th
                rowSpan={2}
                className="border-b border-slate-200 px-4 py-4 text-left text-sm font-semibold text-slate-700"
              >
                Chứng chỉ
              </th>

              <th
                colSpan={4}
                className="border-b border-slate-200 px-4 py-4 text-center text-sm font-semibold text-slate-700"
              >
                Các PTXT
              </th>

              <th
                colSpan={4}
                className="border-b border-slate-200 px-4 py-4 text-center text-sm font-semibold text-slate-700"
              >
                Điểm bài thi riêng
              </th>
            </tr>

            <tr>
              <th className="border-b border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700">
                PTXT100
              </th>
              <th className="border-b border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700">
                PTXT409
              </th>
              <th className="border-b border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700">
                PTXT410
              </th>
              <th className="border-b border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700">
                PTXT500
              </th>

              <th className="border-b border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700">
                HSA
              </th>
              <th className="border-b border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700">
                TSA
              </th>
              <th className="border-b border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700">
                SAT
              </th>
              <th className="border-b border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700">
                ACT
              </th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {rows.map((row, index) => (
              <tr
                key={`${row.code}-${row.programType ?? "default"}-${index}`}
                className="border-b border-slate-200 align-top"
              >
                <td className="px-4 py-4 text-center text-sm text-slate-700">
                  {index + 1}
                </td>

                <td className="px-4 py-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {row.code} - {row.name}
                  </p>
                  {row.programType ? (
                    <p className="mt-1 text-sm text-slate-600">
                      {row.programType}
                    </p>
                  ) : null}
                </td>

                <td className="px-4 py-4">
                  {row.bestCombination ? (
                    <>
                      <p className="text-sm font-semibold text-slate-900">
                        {row.bestCombination.combination}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {formatSubjectsVietnamese(row.bestCombination.subjects)}
                      </p>
                    </>
                  ) : (
                    <span className="text-sm text-slate-400">-</span>
                  )}
                </td>

                <td className="px-4 py-4">
                  {row.certificateUsed ? (
                    <>
                      <p className="text-sm font-semibold text-slate-900">
                        {row.certificateUsed.certificateType}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {String(row.certificateUsed.rawValue)}
                      </p>
                    </>
                  ) : (
                    <span className="text-sm text-slate-400">-</span>
                  )}
                </td>

                <ScoreCell
                  value={row.methodScores["100"]}
                  active={row.bestMethodAmongMainMethods === "100"}
                />
                <ScoreCell
                  value={row.methodScores["409"]}
                  active={row.bestMethodAmongMainMethods === "409"}
                />
                <ScoreCell
                  value={row.methodScores["410"]}
                  active={row.bestMethodAmongMainMethods === "410"}
                />
                <ScoreCell
                  value={row.methodScores["500"]}
                  active={row.bestMethodAmongMainMethods === "500"}
                />

                <td className="px-4 py-4 text-center text-sm text-slate-700">
                  {formatScore(row.method402Scores.HSA)}
                </td>
                <td className="px-4 py-4 text-center text-sm text-slate-700">
                  {formatScore(row.method402Scores.TSA)}
                </td>
                <td className="px-4 py-4 text-center text-sm text-slate-700">
                  {formatScore(row.method402Scores.SAT)}
                </td>
                <td className="px-4 py-4 text-center text-sm text-slate-700">
                  {formatScore(row.method402Scores.ACT)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function ResultCard({
  result,
}: {
  result: CalculationResponse
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Kết quả theo ngành đã chọn
          </h2>
        </div>

        <MajorResultsTable rows={result.selectedMajorResults ?? []} />
      </section>
    </div>
  )
}