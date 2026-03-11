import { CalculationResponse, MethodResult } from "@/types/admission"
import MethodTable from "./method-table"

const SUBJECT_LABELS: Record<string, string> = {
    toan: "Toán",
    van: "Văn",
    anh: "Anh",
    ly: "Lý",
    hoa: "Hóa",
    su: "Sử",
    dia: "Địa",
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

  function BestMethodBanner({ method }: { method: MethodResult | null }) {
    if (!method) {
      return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-600">
            Chưa xác định được phương thức tối ưu trong nhóm so sánh 100, 409, 500.
          </p>
        </div>
      )
    }
  
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Phương thức có lợi nhất trong nhóm so sánh
        </p>
  
        <div className="mt-3 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex-1">
            <p className="text-3xl font-bold text-emerald-900">{method.method}</p>
            <p className="mt-1 text-sm leading-6 text-emerald-800">
              {method.note ??
                "Đây là phương thức đang có lợi nhất trong nhóm 100, 409, 500."}
            </p>
  
            {/* <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-xl bg-white/70 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                  Điểm ưu tiên gốc
                </p>
                <p className="mt-1 text-xl font-bold text-emerald-900">
                  {method.priorityBase ?? 0}
                </p>
              </div>
  
              <div className="rounded-xl bg-white/70 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                  Ưu tiên sau giảm
                </p>
                <p className="mt-1 text-xl font-bold text-emerald-900">
                  {method.priorityAdjusted ?? 0}
                </p>
              </div>
  
              <div className="rounded-xl bg-white/70 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                  Điểm khuyến khích
                </p>
                <p className="mt-1 text-base font-semibold text-emerald-900">
                  {method.encouragementScore ?? 0}
                </p>
              </div>
            </div> */}
  
            {/* <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white/70 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                  Điểm xét thưởng
                </p>
                <p className="mt-1 text-base font-semibold text-emerald-900">
                  {method.awardScore ?? 0}
                </p>
              </div>
  
              <div className="rounded-xl bg-white/70 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                  Điểm cộng
                </p>
                <p className="mt-1 text-xl font-bold text-emerald-900">
                  {method.totalBonus30 ?? 0}
                </p>
              </div>
            </div> */}
  
            {/* {method.bestCombination ? (
              <div className="mt-4 rounded-xl bg-white/70 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                  Tổ hợp tốt nhất
                </p>
                <p className="mt-1 text-base font-bold text-emerald-900">
                  {method.bestCombination.combination}
                </p>
                <p className="mt-1 text-sm text-emerald-800">
                  {formatSubjectsVietnamese(method.bestCombination.subjects)}
                </p>
              </div>
            ) : null} */}
          </div>
  
          {/* <div className="rounded-xl bg-white/70 px-5 py-4 xl:min-w-[180px]">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
              Điểm xét tuyển
            </p>
            <p className="mt-2 text-3xl font-bold text-emerald-900">
              {method.scoreDisplay ?? "-"}
            </p>
          </div> */}
        </div>
  
        {method.programTrackScores?.length ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {method.programTrackScores.map((track) => (
              <div key={track.track} className="rounded-xl bg-white/70 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                  {track.track === "standard"
                    ? "Tổng điểm đạt được tối đa 30 điểm - Chương trình chuẩn"
                    : "Tổng điểm đạt được tối đa 30 điểm - IPOP / Song bằng / Tiên tiến"}
                </p>
  
                <p className="mt-2 text-2xl font-bold text-emerald-900">
                  {track.scoreDisplay ?? "-"}
                </p>
  
                {track.bestCombination ? (
                  <>
                    <p className="mt-2 text-sm font-semibold text-emerald-900">
                      {track.bestCombination.combination}
                    </p>
                    <p className="mt-1 text-sm text-emerald-800">
                      {formatSubjectsVietnamese(track.bestCombination.subjects)}
                    </p>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    )
  }

function MethodSummaryCard({
  title,
  description,
  method,
  scoreLabel = "Điểm",
}: {
  title: string
  description?: string
  method: MethodResult | null
  scoreLabel?: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        ) : null}
      </div>

      {!method ? (
        <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
          Chưa có dữ liệu.
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-500">Phương thức</p>
              <p className="text-2xl font-bold text-slate-900">{method.method}</p>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium text-slate-500">{scoreLabel}</p>
              <p className="text-2xl font-bold text-slate-900">
                {method.scoreDisplay ?? "-"}
              </p>
            </div>
          </div>

          {method.programTrackScores?.length ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
                {method.programTrackScores.map((track) => (
                <div key={track.track} className="rounded-xl bg-white/70 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                    {track.track === "standard"
                        ? "Tổng điểm đạt được_tối đa 30 điểm - Chương trình chuẩn"
                        : "Tổng điểm đạt được_tối đa 30 điểm - IPOP / Song bằng / Tiên tiến"}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-emerald-900">
                    {track.scoreDisplay ?? "-"}
                    </p>
                    {track.bestCombination ? (
                    <p className="mt-1 text-sm text-emerald-800">
                        {track.bestCombination.combination}
                    </p>
                    ) : null}
                </div>
                ))}
            </div>
            ) : null}

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Trạng thái
              </p>
              <p
                className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                  method.eligible
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {method.eligible ? "Đủ điều kiện" : "Chưa đủ điều kiện"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Điểm ưu tiên
              </p>
              <p className="mt-2 text-sm text-slate-700">
                Gốc: {method.priorityBase ?? 0}
              </p>
              <p className="mt-1 text-sm text-slate-700">
                Sau giảm: {method.priorityAdjusted ?? 0}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Điểm xét thưởng
              </p>
              <p className="mt-2 text-sm text-slate-700">
                {method.awardScore ?? 0}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Điểm khuyến khích
              </p>
              <p className="mt-2 text-sm text-slate-700">
                {method.encouragementScore ?? 0}
              </p>
            </div>
          </div>

          {method.bestCombination ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Tổ hợp tốt nhất
              </p>
              <p className="mt-2 text-base font-semibold text-emerald-900">
                {method.bestCombination.combination}
              </p>
              <p className="mt-1 text-sm text-emerald-800">
                {formatSubjectsVietnamese(method.bestCombination.subjects)}
              </p>
            </div>
          ) : null}

          {method.certificateUsed ? (
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Chứng chỉ sử dụng
              </p>
              <p className="mt-2 text-sm text-slate-700">
                {method.certificateUsed.certificateType} -{" "}
                {String(method.certificateUsed.rawValue)}
              </p>
            </div>
          ) : null}

          {method.note ? (
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              {method.note}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

function Method402Card({ method }: { method: MethodResult | null }) {
    if (!method) {
      return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-slate-900">Phương thức 402</h3>
          </div>
  
          <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
            Chưa có dữ liệu.
          </div>
        </div>
      )
    }
  
    const branches = method.branches402 ?? []
  
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-slate-900">Phương thức 402</h3>
        </div>
  
        {!method.eligible || !branches.length ? (
          <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
            Không đủ ngưỡng HSA/TSA/SAT/ACT.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Nhánh tốt nhất hiện tại
              </p>
              <p className="mt-2 text-2xl font-bold text-emerald-900">
                {method.bestBranch402 ?? "-"}
              </p>
              <p className="mt-1 text-sm text-emerald-800">
                Điểm cuối: {method.scoreDisplay ?? "-"} / thang {method.maxScale}
              </p>
            </div>
  
            <div className="space-y-4">
              {branches.map((branch) => {
                const isBest = branch.branch === method.bestBranch402
  
                return (
                  <div
                    key={branch.branch}
                    className={`rounded-2xl border p-4 ${
                      isBest
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-bold text-slate-900">
                          {branch.branch}
                        </p>
                        <p className="text-sm text-slate-600">
                          Thang điểm gốc: {branch.maxScale}
                        </p>
                      </div>
  
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Tổng điểm xét tuyển
                        </p>
                        <p className="text-2xl font-bold text-slate-900">
                          {branch.finalScore}
                        </p>
                      </div>
                    </div>
  
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        <div className="rounded-xl bg-white px-4 py-4 min-h-[132px]">
                            <div className="h-[44px]">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Điểm gốc bài thi
                            </p>
                            </div>
                            <p className="mt-3 text-lg font-bold text-slate-900">{branch.rawBase}</p>
                        </div>

                        <div className="rounded-xl bg-white px-4 py-4 min-h-[132px]">
                            <div className="h-[44px]">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Ưu tiên sau giảm
                            </p>
                            </div>
                            <p className="mt-3 text-lg font-bold text-slate-900">
                            {Number(branch.priorityAdjusted.toFixed(9))}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white px-4 py-4 min-h-[132px]">
                            <div className="h-[44px]">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Điểm ưu tiên
                            </p>
                            <p className="text-xs text-slate-500">thang {branch.maxScale}</p>
                            </div>
                            <p className="mt-3 text-lg font-bold text-slate-900">
                            {Number(branch.priorityAdjustedScaled.toFixed(9))}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white px-4 py-4 min-h-[132px]">
                            <div className="h-[44px]">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Điểm xét thưởng
                            </p>
                            </div>
                            <p className="mt-3 text-lg font-bold text-slate-900">{branch.awardScore}</p>
                        </div>

                        <div className="rounded-xl bg-white px-4 py-4 min-h-[132px]">
                            <div className="h-[44px]">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Điểm khuyến khích
                            </p>
                            </div>
                            <p className="mt-3 text-lg font-bold text-slate-900">
                            {branch.encouragementScore}
                            </p>
                        </div>

                        <div className="rounded-xl bg-white px-4 py-4 min-h-[132px]">
                            <div className="h-[44px]">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Tổng điểm cộng thang 30
                            </p>
                            </div>
                            <p className="mt-3 text-lg font-bold text-slate-900">{branch.totalBonus30}</p>
                        </div>
                        </div>
  
                    <div className="mt-3 rounded-xl bg-white px-4 py-3 text-sm text-slate-600">
                      Công thức tính: {branch.rawBase} + {branch.totalBonusScaled} ={" "}
                      <span className="font-semibold text-slate-900">
                        {branch.finalScore}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
  
            {method.certificateUsed ? (
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Chứng chỉ sử dụng để tính khuyến khích
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  {method.certificateUsed.certificateType} -{" "}
                  {String(method.certificateUsed.rawValue)}
                </p>
              </div>
            ) : null}
  
            {method.note ? (
              <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {method.note}
              </div>
            ) : null}
          </div>
        )}
      </div>
    )
  }

  export default function ResultCard({
    result,
  }: {
    result: CalculationResponse
  }) {
    const primaryBucket = result.scoreBuckets?.[0]
  
    return (
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-slate-900">Kết quả phân tích</h2>
          </div>
  
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Số phương thức đủ điều kiện
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {result.summary.totalEligibleMethods}
              </p>
            </div>
  
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Phương thức đề xuất
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {result.summary.recommendedMethod ?? "-"}
              </p>
            </div>
          </div>
  
          <div className="mt-5">
            <BestMethodBanner method={primaryBucket?.bestComparableMethod ?? null} />
          </div>
        </section>
  
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              So sánh các phương thức 100, 409, 500
            </h3>
          </div>
  
          <MethodTable methods={primaryBucket?.comparableMethods ?? []} />
        </section>
  
        <section className="grid gap-6 xl:grid-cols-2">
          <MethodSummaryCard
            title="Phương thức 410"
            method={primaryBucket?.method410 ?? null}
            scoreLabel="ĐIỂM XÉT TUYỂN"
          />
  
          <Method402Card method={result.method402} />
        </section>
      </div>
    )
  }