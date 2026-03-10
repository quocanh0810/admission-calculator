import { MajorMethodEvaluation } from "@/types/admission"

export default function MajorRanking({
  rows,
}: {
  rows: MajorMethodEvaluation[]
}) {
  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
        Chưa có đủ dữ liệu để xếp hạng ngành. Hãy nhập thêm điểm hoặc chứng chỉ để
        hệ thống phân tích sâu hơn.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                Ngành
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                PTXT
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                Điểm của bạn
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                Benchmark
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">
                Chênh lệch
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {rows.map((row) => {
              const positive = (row.marginVsBenchmark ?? 0) >= 0

              return (
                <tr key={`${row.majorCode}-${row.method}`} className="align-top">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-semibold text-slate-900">{row.majorCode}</p>
                      <p className="mt-1 text-slate-600">{row.majorName}</p>
                    </div>
                  </td>

                  <td className="px-4 py-4 font-medium text-slate-800">
                    {row.method}
                  </td>

                  <td className="px-4 py-4 font-medium text-slate-900">
                    {row.scoreDisplay}
                  </td>

                  <td className="px-4 py-4 text-slate-700">
                    {row.benchmark2025 ?? "-"}
                  </td>

                  <td className="px-4 py-4">
                    {row.marginVsBenchmark == null ? (
                      <span className="text-slate-500">-</span>
                    ) : (
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          positive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {positive ? "+" : ""}
                        {row.marginVsBenchmark}
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}