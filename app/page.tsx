"use client";

import { useMemo, useState } from "react";

type ExerciseId = "bench_press" | "squat" | "pull_up" | "deadlift";

type Exercise = {
  id: ExerciseId;
  name: string;
  muscles: string[];
  description: string;
};

const EXERCISES: Exercise[] = [
  {
    id: "bench_press",
    name: "卧推 Bench Press",
    muscles: ["胸大肌", "前三角肌", "肱三头肌"],
    description: "经典上肢推举动作，主要刺激胸大肌，同时激活肩部与肱三头肌。",
  },
  {
    id: "squat",
    name: "深蹲 Squat",
    muscles: ["股四头肌", "臀大肌", "腘绳肌", "核心肌群"],
    description: "下肢基础动作王，提升下肢力量与稳定性，对全身代谢负荷极高。",
  },
  {
    id: "pull_up",
    name: "引体向上 Pull-up",
    muscles: ["背阔肌", "菱形肌", "肱二头肌", "前臂"],
    description: "自身体重上拉动作，强化背部厚度与宽度，同时提升握力。",
  },
  {
    id: "deadlift",
    name: "硬拉 Deadlift",
    muscles: ["臀大肌", "腘绳肌", "竖脊肌", "斜方肌"],
    description: "后链综合力量动作，几乎调动全身大肌群，对力量提升效果显著。",
  },
];

type TrainingEntry = {
  id: string;
  exerciseId: ExerciseId;
  sets: number;
  reps: number;
  createdAt: number;
};

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3.5 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_14px_30px_rgba(15,23,42,0.15)] sm:px-5 sm:py-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-2xl font-semibold tracking-tight text-slate-900">
          {value}
        </span>
        <span className="text-xs text-slate-400">次训练</span>
      </div>
    </div>
  );
}

function formatDateTime(timestamp: number) {
  return new Date(timestamp).toLocaleString("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function countByRange(entries: TrainingEntry[], days: number) {
  const now = Date.now();
  const rangeMs = days * 24 * 60 * 60 * 1000;
  return entries.filter((e) => now - e.createdAt <= rangeMs).length;
}

export default function Home() {
  const [selectedExerciseId, setSelectedExerciseId] =
    useState<ExerciseId>("bench_press");
  const [sets, setSets] = useState<string>("3");
  const [reps, setReps] = useState<string>("10");
  const [entries, setEntries] = useState<TrainingEntry[]>([]);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const selectedExercise = useMemo(
    () => EXERCISES.find((e) => e.id === selectedExerciseId)!,
    [selectedExerciseId]
  );

  const stats = useMemo(() => {
    return {
      week: countByRange(entries, 7),
      month: countByRange(entries, 30),
      quarter: countByRange(entries, 90),
      year: countByRange(entries, 365),
    };
  }, [entries]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!sets || !reps) return;

    const setsNum = Number(sets);
    const repsNum = Number(reps);
    if (!Number.isFinite(setsNum) || !Number.isFinite(repsNum)) return;
    if (setsNum <= 0 || repsNum <= 0) return;

    const now = Date.now();
    setEntries((prev) => [
      {
        id: `${now}-${prev.length}`,
        exerciseId: selectedExerciseId,
        sets: setsNum,
        reps: repsNum,
        createdAt: now,
      },
      ...prev,
    ]);

    setIsSaving(true);
    setJustSaved(true);

    setTimeout(() => {
      setIsSaving(false);
    }, 450);

    setTimeout(() => {
      setJustSaved(false);
    }, 1400);
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 text-slate-900 antialiased"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif',
      }}
    >
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-16 pt-10 sm:px-8 sm:pt-14">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
              FITNESS · JOURNAL
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              训练记录
            </h1>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              用接近 Apple 健身环的质感，安静记录每一次进步。
            </p>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/60 px-3 py-1 text-xs text-slate-500 shadow-sm backdrop-blur sm:flex">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            数据仅保存在本地浏览器
          </div>
        </header>

        {/* 顶部统计卡片 */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="本周" value={stats.week} />
          <StatCard label="本月" value={stats.month} />
          <StatCard label="本季度" value={stats.quarter} />
          <StatCard label="本年度" value={stats.year} />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]">
          {/* 表单区域 */}
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
                  记录一次训练
                </h2>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  选择动作、组数与次数，点击保存即可写入历史。
                </p>
              </div>
              <div className="hidden rounded-full bg-slate-100 px-3 py-1 text-[10px] font-medium text-slate-500 sm:inline-flex">
                今日专注 · 小而稳定的进步
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSave}>
              {/* 动作选择 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="exercise"
                    className="text-sm font-medium text-slate-800"
                  >
                    动作名称
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowExerciseModal(true)}
                    className="group inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900"
                  >
                    <span className="h-4 w-4 rounded-full bg-slate-900 text-[9px] font-semibold text-white shadow-sm group-hover:bg-slate-700">
                      i
                    </span>
                    查看肌肉解剖图
                  </button>
                </div>
                <div className="relative mt-1">
                  <select
                    id="exercise"
                    value={selectedExerciseId}
                    onChange={(e) =>
                      setSelectedExerciseId(e.target.value as ExerciseId)
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 py-3 text-sm text-slate-900 shadow-inner outline-none ring-0 transition-all duration-200 placeholder:text-slate-400 focus:border-slate-900/70 focus:bg-white focus:shadow-[0_0_0_1px_rgba(15,23,42,0.06),0_12px_30px_rgba(15,23,42,0.12)]"
                  >
                    {EXERCISES.map((exercise) => (
                      <option key={exercise.id} value={exercise.id}>
                        {exercise.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      className="translate-y-[1px]"
                    >
                      <path
                        d="M4.5 6L8 9.5L11.5 6"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* 组数 / 每组次数 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label
                    htmlFor="sets"
                    className="text-sm font-medium text-slate-800"
                  >
                    组数
                  </label>
                  <div className="relative">
                    <input
                      id="sets"
                      type="number"
                      min={1}
                      inputMode="numeric"
                      value={sets}
                      onChange={(e) => setSets(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 py-3 text-sm text-slate-900 shadow-inner outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-slate-900/70 focus:bg-white focus:shadow-[0_0_0_1px_rgba(15,23,42,0.06),0_12px_30px_rgba(15,23,42,0.12)]"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[11px] text-slate-400">
                      sets
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="reps"
                    className="text-sm font-medium text-slate-800"
                  >
                    每组次数
                  </label>
                  <div className="relative">
                    <input
                      id="reps"
                      type="number"
                      min={1}
                      inputMode="numeric"
                      value={reps}
                      onChange={(e) => setReps(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 py-3 text-sm text-slate-900 shadow-inner outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-slate-900/70 focus:bg-white focus:shadow-[0_0_0_1px_rgba(15,23,42,0.06),0_12px_30px_rgba(15,23,42,0.12)]"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[11px] text-slate-400">
                      reps
                    </span>
                  </div>
                </div>
              </div>

              {/* 底部操作区 */}
              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] text-slate-400 sm:text-xs">
                  小提示：长期记录更容易看见趋势，而不是单次状态。
                </p>
                <div className="inline-flex items-center gap-2">
                  {justSaved && (
                    <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-600 shadow-sm shadow-emerald-100 transition-opacity duration-500">
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      已保存
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={[
                      "relative inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(15,23,42,0.35)] outline-none transition-all duration-400",
                      "bg-gradient-to-tr from-slate-900 via-slate-900 to-slate-700",
                      "hover:shadow-[0_20px_40px_rgba(15,23,42,0.40)] hover:-translate-y-[1px]",
                      "active:translate-y-0.5 active:scale-[0.98]",
                      isSaving ? "opacity-80" : "",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "inline-flex items-center gap-1.5 transition-transform duration-300",
                        isSaving ? "translate-y-[2px]" : "",
                      ].join(" ")}
                    >
                      {isSaving ? (
                        <>
                          <span className="h-3 w-3 animate-spin rounded-full border border-white/40 border-t-transparent" />
                          正在保存…
                        </>
                      ) : (
                        <>
                          <span className="relative flex h-4 w-4 items-center justify-center">
                            <span className="absolute inline-flex h-4 w-4 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-400 opacity-90" />
                            <span className="relative h-1.5 w-1.5 rounded-full bg-white" />
                          </span>
                          保存本次训练
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* 训练历史 */}
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur sm:p-7">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
                  训练历史
                </h2>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  最近的训练会显示在这里，方便你回顾与复盘。
                </p>
              </div>
              {entries.length > 0 && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500">
                  共 {entries.length} 次记录
                </span>
              )}
            </div>

            {entries.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 text-center">
                <p className="text-sm font-medium text-slate-500">
                  暂无训练记录
                </p>
                <p className="mt-1 max-w-xs text-xs text-slate-400">
                  从左侧添加你的第一条记录。
                  建议保持每周 2-3 次训练节奏。
                </p>
              </div>
            ) : (
              <ul className="space-y-2.5">
                {entries.map((entry) => {
                  const exercise = EXERCISES.find(
                    (e) => e.id === entry.exerciseId
                  )!;
                  return (
                    <li
                      key={entry.id}
                      className="group flex items-center justify-between rounded-2xl bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition-all duration-200 hover:bg-white hover:shadow-[0_10px_30px_rgba(15,23,42,0.10)]"
                    >
                      <div className="flex flex-1 flex-col">
                        <span className="font-medium tracking-tight text-slate-900">
                          {exercise.name}
                        </span>
                        <span className="mt-0.5 text-[11px] text-slate-500">
                          {entry.sets} 组 × {entry.reps} 次
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[11px] text-slate-400">
                          {formatDateTime(entry.createdAt)}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedExerciseId(entry.exerciseId);
                            setShowExerciseModal(true);
                          }}
                          className="text-[10px] font-medium text-slate-400 underline-offset-2 transition-colors hover:text-slate-700 hover:underline"
                        >
                          查看肌肉群
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        {/* 模态框：动作肌肉解剖图 */}
        {showExerciseModal && (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm">
            <button
              type="button"
              aria-label="关闭"
              className="absolute inset-0 h-full w-full"
              onClick={() => setShowExerciseModal(false)}
            />
            <div className="relative z-40 w-full max-w-md origin-center scale-100 rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white via-white/98 to-slate-50/95 p-5 shadow-[0_26px_60px_rgba(15,23,42,0.35)] sm:p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                    MUSCLE · MAP
                  </p>
                  <h3 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
                    {selectedExercise.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    对应的主要肌肉群示意，下色区域为核心发力区。
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowExerciseModal(false)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 shadow-sm transition-colors hover:bg-slate-200 hover:text-slate-700"
                >
                  <span className="sr-only">关闭</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path
                      d="M4.5 4.5L11.5 11.5M11.5 4.5L4.5 11.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              {/* 解剖示意图（抽象极简） */}
              <div className="relative mb-4 flex items-center justify-center rounded-2xl bg-slate-900/95 px-4 py-5 text-slate-100 shadow-inner shadow-slate-900/60">
                <div className="relative h-40 w-32">
                  {/* 躯干 */}
                  <div className="absolute inset-x-4 top-4 h-16 rounded-full bg-gradient-to-b from-slate-700 to-slate-900" />
                  {/* 胸 / 背 / 臀等高亮区域，简单用渐变块替代解剖图 */}
                  <div className="absolute inset-x-5 top-7 h-10 rounded-full bg-gradient-to-r from-rose-400/90 via-amber-300/90 to-emerald-300/90 opacity-95 blur-[1px]" />
                  {/* 骨盆 / 臀 */}
                  <div className="absolute inset-x-7 top-24 h-8 rounded-full bg-gradient-to-t from-amber-400/90 via-rose-400/90 to-emerald-300/80 opacity-95" />
                  {/* 大腿后侧 */}
                  <div className="absolute left-6 top-28 h-10 w-4 rounded-full bg-gradient-to-b from-emerald-300/90 to-sky-400/90 opacity-90" />
                  <div className="absolute right-6 top-28 h-10 w-4 rounded-full bg-gradient-to-b from-emerald-300/90 to-sky-400/90 opacity-90" />
                  {/* 头部 */}
                  <div className="absolute left-1/2 top-0 h-7 w-7 -translate-x-1/2 rounded-full bg-gradient-to-b from-slate-100 to-slate-500" />
                </div>
                <div className="ml-5 space-y-2 text-xs">
                  <p className="text-[11px] font-medium text-slate-300">
                    主要发力肌群
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedExercise.muscles.map((muscle) => (
                      <span
                        key={muscle}
                        className="inline-flex items-center rounded-full bg-white/10 px-2 py-1 text-[11px] text-slate-50 ring-1 ring-white/15"
                      >
                        <span className="mr-1 inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/10" />
              </div>

              <p className="text-xs leading-relaxed text-slate-600">
                {selectedExercise.description}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
