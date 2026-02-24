"use client";

import { useEffect, useMemo, useState } from "react";

type TrainingGroup = "back" | "shoulders" | "glutes_legs";
type ExerciseId = string;

type Exercise = {
  id: ExerciseId;
  name: string;
  muscles: string[];
  description: string;
  group: TrainingGroup;
};

const EXERCISES: Exercise[] = [
  {
    id: "bench_press",
    name: "卧推 Bench Press",
    muscles: ["胸大肌", "前三角肌", "肱三头肌"],
    description: "经典上肢推举动作，主要刺激胸大肌，同时激活肩部与肱三头肌。",
    group: "shoulders",
  },
  {
    id: "back_lat_pulldown",
    name: "高位下拉 Lat Pulldown",
    muscles: ["背阔肌", "大圆肌", "肱二头肌"],
    description: "经典背部宽度动作，模拟引体向上路径，更友好地激活背阔肌。",
    group: "back",
  },
  {
    id: "back_neutral_lat_pulldown",
    name: "对握下拉 Neutral Grip Pulldown",
    muscles: ["背阔肌", "菱形肌", "肱二头肌"],
    description: "中立握姿势减轻手腕压力，更集中在背阔肌与上背部。",
    group: "back",
  },
  {
    id: "back_supinated_lat_pulldown",
    name: "反手下拉 Supinated Pulldown",
    muscles: ["背阔肌", "肱二头肌"],
    description: "反手握强调下束背阔肌，同时显著参与肱二头肌发力。",
    group: "back",
  },
  {
    id: "back_close_cable_row",
    name: "窄距坐姿划船 Close Grip Row",
    muscles: ["菱形肌", "斜方肌中部", "背阔肌"],
    description: "注重背部厚度，帮助塑造立体的上背轮廓。",
    group: "back",
  },
  {
    id: "back_wide_cable_row",
    name: "宽距坐姿划船 Wide Grip Row",
    muscles: ["背阔肌", "后三角肌", "菱形肌"],
    description: "更强调整体背部展开感，兼顾宽度与厚度。",
    group: "back",
  },
  {
    id: "back_bent_over_row",
    name: "俯身划船 Bent-over Row",
    muscles: ["背阔肌", "竖脊肌", "斜方肌"],
    description: "自由重量背部基础动作，对核心与腰背稳定性要求较高。",
    group: "back",
  },
  {
    id: "back_one_arm_row",
    name: "单臂划船 One-arm Row",
    muscles: ["背阔肌", "菱形肌", "后三角肌"],
    description: "单侧训练有助于纠正左右不平衡，并增强背部感知度。",
    group: "back",
  },
  {
    id: "back_straight_arm_pushdown",
    name: "直臂下压 Straight-arm Pulldown",
    muscles: ["背阔肌", "大圆肌"],
    description: "孤立背阔肌的拉伸与收缩，常作为背部辅助或收尾动作。",
    group: "back",
  },
  {
    id: "back_pull_up",
    name: "引体向上 Pull-up",
    muscles: ["背阔肌", "菱形肌", "肱二头肌", "前臂"],
    description: "自身体重上拉动作，强化背部厚度与宽度，同时提升握力。",
    group: "back",
  },
  // 肩部
  {
    id: "shoulder_reverse_fly",
    name: "俯身飞鸟 Reverse Fly",
    muscles: ["后三角肌", "菱形肌"],
    description: "突出后三角与上背，有助于改善含胸与圆肩。",
    group: "shoulders",
  },
  {
    id: "shoulder_pec_deck_reverse",
    name: "蝴蝶机飞鸟 Rear Delt Fly",
    muscles: ["后三角肌", "中下斜方肌"],
    description: "器械引导轨迹，降低代偿，更精准刺激后三角。",
    group: "shoulders",
  },
  {
    id: "shoulder_face_pull",
    name: "绳索面拉 Face Pull",
    muscles: ["后三角肌", "菱形肌", "旋转袖"],
    description: "对肩关节健康非常友好，改善圆肩和上背稳定性。",
    group: "shoulders",
  },
  {
    id: "shoulder_lateral_raise",
    name: "侧平举飞鸟 Lateral Raise",
    muscles: ["中束三角肌"],
    description: "打造肩部“圆润感”的核心动作，提升肩宽视觉效果。",
    group: "shoulders",
  },
  {
    id: "shoulder_overhead_press",
    name: "推肩 Overhead Press",
    muscles: ["前三角肌", "中束三角肌", "肱三头肌"],
    description: "自由重量推举，全面提升肩带与上肢推举力量。",
    group: "shoulders",
  },
  {
    id: "shoulder_scott_press",
    name: "斯科特推举 Scott Press",
    muscles: ["三角肌全束"],
    description: "特别强调肩部峰值收缩的高级变式，控制感要求较高。",
    group: "shoulders",
  },
  // 臀腿
  {
    id: "glute_abduction_lean_back",
    name: "后仰位髋外展 Seated Abduction (Lean Back)",
    muscles: ["臀中肌", "臀小肌"],
    description: "身体后仰增加臀中肌参与，对侧臀线与稳定性有帮助。",
    group: "glutes_legs",
  },
  {
    id: "glute_abduction_neutral",
    name: "中立髋外展 Neutral Abduction",
    muscles: ["臀中肌", "臀小肌"],
    description: "更偏向标准轨迹的髋外展，适合作为臀部激活或主练动作。",
    group: "glutes_legs",
  },
  {
    id: "glute_abduction_lean_forward",
    name: "俯身髋外展 Lean Forward Abduction",
    muscles: ["臀小肌", "臀中肌"],
    description: "身体前倾改变受力角度，更集中于上外侧臀部。",
    group: "glutes_legs",
  },
  {
    id: "glute_adduction",
    name: "髋内收 Adduction",
    muscles: ["大收肌", "长收肌"],
    description: "训练大腿内侧肌群，辅助骨盆稳定与下肢控制力。",
    group: "glutes_legs",
  },
  {
    id: "glute_rdl",
    name: "罗马尼亚硬拉 Romanian Deadlift",
    muscles: ["臀大肌", "腘绳肌", "竖脊肌"],
    description: "强调髋铰链与后链拉伸，对臀腿后侧线条非常友好。",
    group: "glutes_legs",
  },
  {
    id: "glute_single_leg_rdl",
    name: "单腿硬拉 Single-leg RDL",
    muscles: ["臀大肌", "臀中肌", "腘绳肌"],
    description: "单侧稳定性挑战更高，改善平衡与臀部激活度。",
    group: "glutes_legs",
  },
  {
    id: "glute_bulgarian_split_squat",
    name: "保加利亚蹲 Bulgarian Split Squat",
    muscles: ["臀大肌", "股四头肌", "腘绳肌"],
    description: "极具挑战性的单侧腿部动作，提高臀腿力量与稳定性。",
    group: "glutes_legs",
  },
  {
    id: "glute_squat",
    name: "深蹲 Squat",
    muscles: ["股四头肌", "臀大肌", "腘绳肌", "核心肌群"],
    description: "下肢基础动作王，提升下肢力量与稳定性，对全身代谢负荷极高。",
    group: "glutes_legs",
  },
  {
    id: "glute_stiff_leg_deadlift",
    name: "直腿硬拉 Stiff-leg Deadlift",
    muscles: ["腘绳肌", "臀大肌", "竖脊肌"],
    description: "在更大程度下放的同时保持腿部相对伸直，强调后侧链条。",
    group: "glutes_legs",
  },
  {
    id: "glute_t_bar_deadlift",
    name: "T 杆硬拉 T-bar Deadlift",
    muscles: ["臀大肌", "腘绳肌", "竖脊肌"],
    description: "借助 T 杆路径，更容易控制重心，兼顾安全与刺激强度。",
    group: "glutes_legs",
  },
  {
    id: "glute_hip_thrust",
    name: "臀推 Hip Thrust",
    muscles: ["臀大肌", "臀中肌"],
    description: "孤立臀大肌发力的旗舰动作，显著提升臀部力量与围度。",
    group: "glutes_legs",
  },
  {
    id: "glute_cable_kickback",
    name: "绳索后提 Cable Kickback",
    muscles: ["臀大肌", "臀中肌"],
    description: "持续张力下的臀部孤立动作，适合作为收尾或激活。",
    group: "glutes_legs",
  },
  {
    id: "glute_cable_side_kick",
    name: "绳索侧踢 Cable Side Kick",
    muscles: ["臀中肌", "臀小肌"],
    description: "偏向侧臀与稳定肌，对塑造臀部外侧线条有帮助。",
    group: "glutes_legs",
  },
];

const STORAGE_KEY_ENTRIES = "fitness_journal_entries_v1";

type TrainingEntry = {
  id: string;
  exercises: {
    id: string;
    exerciseId: ExerciseId;
    sets: number;
    reps: number;
  }[];
  createdAt: number;
  group: TrainingGroup;
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
  const [selectedGroup, setSelectedGroup] =
    useState<TrainingGroup>("back");
  const [selectedExerciseId, setSelectedExerciseId] =
    useState<ExerciseId>("back_lat_pulldown");
  const [sets, setSets] = useState<string>("3");
  const [reps, setReps] = useState<string>("10");
  const [currentExercises, setCurrentExercises] = useState<
    TrainingEntry["exercises"]
  >([]);
  const [entries, setEntries] = useState<TrainingEntry[]>([]);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // 从 localStorage 恢复历史记录
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY_ENTRIES);
      if (!raw) return;
      const parsed = JSON.parse(raw) as TrainingEntry[];
      if (Array.isArray(parsed)) {
        setEntries(parsed);
      }
    } catch {
      // ignore parse error
    }
  }, []);

  // 每次历史变化时写入 localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY_ENTRIES,
        JSON.stringify(entries)
      );
    } catch {
      // ignore write error
    }
  }, [entries]);

  const selectedExercise = useMemo(
    () => EXERCISES.find((e) => e.id === selectedExerciseId)!,
    [selectedExerciseId]
  );

  const stats = useMemo(() => {
    const now = new Date();

    // 本周：当前日期往前推 7 天（滚动 7 天）
    const weekCount = countByRange(entries, 7);

    // 本月：当前自然月
    const monthCount = entries.filter((e) => {
      const d = new Date(e.createdAt);
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth()
      );
    }).length;

    // 本季度（当前 3 个月内）：从当前日期往前推 2 个月的同一天起算
    const quarterStart = new Date(
      now.getFullYear(),
      now.getMonth() - 2,
      now.getDate(),
      0,
      0,
      0,
      0
    ).getTime();
    const quarterCount = entries.filter(
      (e) => e.createdAt >= quarterStart
    ).length;

    // 本年度：从今年 1 月 1 日到现在
    const yearStart = new Date(now.getFullYear(), 0, 1).getTime();
    const yearCount = entries.filter(
      (e) => e.createdAt >= yearStart
    ).length;

    return {
      week: weekCount,
      month: monthCount,
      quarter: quarterCount,
      year: yearCount,
    };
  }, [entries]);

  function handleAddExercise(e: React.FormEvent) {
    e.preventDefault();
    if (!sets || !reps) return;

    const setsNum = Number(sets);
    const repsNum = Number(reps);
    if (!Number.isFinite(setsNum) || !Number.isFinite(repsNum)) return;
    if (setsNum <= 0 || repsNum <= 0) return;

    const now = Date.now();
    const exercise = selectedExercise;
    setCurrentExercises((prev) => [
      ...prev,
      {
        id: `${now}-${prev.length}`,
        exerciseId: selectedExerciseId,
        sets: setsNum,
        reps: repsNum,
      },
    ]);
  }

  function handleSaveSession() {
    if (currentExercises.length === 0) return;

    const now = Date.now();

    setEntries((prev) => [
      {
        id: `${now}-${prev.length}`,
        exercises: currentExercises,
        createdAt: now,
        group: selectedGroup,
      },
      ...prev,
    ]);

    setCurrentExercises([]);

    setIsSaving(true);
    setJustSaved(true);

    setTimeout(() => {
      setIsSaving(false);
    }, 350);
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

            <form className="space-y-4" onSubmit={handleAddExercise}>
              {/* 训练部位选择 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">
                  本次训练部位
                </label>
                <div className="inline-flex rounded-full bg-slate-100 p-1 text-xs font-medium text-slate-500 shadow-inner">
                  {[
                    { key: "back", label: "背部" },
                    { key: "shoulders", label: "肩部" },
                    { key: "glutes_legs", label: "臀腿" },
                  ].map((option) => {
                    const active = selectedGroup === option.key;
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => {
                          setSelectedGroup(option.key as TrainingGroup);
                          const firstInGroup = EXERCISES.find(
                            (e) => e.group === option.key
                          );
                          if (firstInGroup) {
                            setSelectedExerciseId(firstInGroup.id);
                          }
                        }}
                        className={[
                          "relative rounded-full px-3.5 py-1.5 transition-all",
                          active
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-800",
                        ].join(" ")}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

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
                    {EXERCISES.filter(
                      (exercise) => exercise.group === selectedGroup
                    ).map((exercise) => (
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

              {/* 本次训练已添加的动作预览 */}
              <div className="rounded-2xl bg-slate-50/70 px-3.5 py-3 text-xs text-slate-600 ring-1 ring-slate-100">
                {currentExercises.length === 0 ? (
                  <p>
                    先选择动作与组数，点击下方
                    <span className="font-semibold text-slate-900">
                      「添加到本次训练」
                    </span>
                    ，本次训练可以包含多个动作。
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900">
                        本次已添加 {currentExercises.length} 个动作
                      </p>
                    </div>
                    <ul className="space-y-1">
                      {currentExercises.map((item) => {
                        const meta = EXERCISES.find(
                          (e) => e.id === item.exerciseId
                        );
                        return (
                          <li
                            key={item.id}
                            className="flex items-center justify-between rounded-xl bg-white/70 px-2 py-1.5"
                          >
                            <div className="flex flex-col">
                              <span className="text-[11px] font-medium text-slate-900">
                                {meta?.name ?? "未命名动作"}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {item.sets} 组 × {item.reps} 次
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setCurrentExercises((prev) =>
                                  prev.filter((x) => x.id !== item.id)
                                )
                              }
                              className="text-[10px] text-slate-400 underline-offset-2 hover:text-slate-700 hover:underline"
                            >
                              移除
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

              {/* 底部操作区 */}
              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] text-slate-400 sm:text-xs">
                  小提示：先把本次训练的所有动作添加进来，再点击右侧按钮整体保存为一次训练。
                </p>
                <div className="inline-flex items-center gap-2">
                  {justSaved && (
                    <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-600 shadow-sm shadow-emerald-100 transition-opacity duration-500">
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      已保存
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleAddExercise}
                    className="hidden items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 sm:inline-flex"
                  >
                    添加到本次训练
                  </button>
                  <button
                    type="button"
                    disabled={isSaving || currentExercises.length === 0}
                    onClick={handleSaveSession}
                    className={[
                      "relative inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(15,23,42,0.35)] outline-none transition-all duration-400",
                      justSaved
                        ? "bg-gradient-to-tr from-emerald-500 via-emerald-500 to-teal-400"
                        : "bg-gradient-to-tr from-slate-900 via-slate-900 to-slate-700",
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
                            <span
                              className={[
                                "absolute inline-flex h-4 w-4 rounded-full",
                                justSaved
                                  ? "bg-gradient-to-tr from-emerald-200 to-emerald-400 animate-pulse"
                                  : "bg-gradient-to-tr from-emerald-400 to-teal-400 opacity-90",
                              ].join(" ")}
                            />
                            <span className="relative h-1.5 w-1.5 rounded-full bg-white" />
                          </span>
                          {justSaved ? "已保存" : "保存本次训练"}
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
                  共 {entries.length} 次训练
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
                  const groupLabel =
                    entry.group === "back"
                      ? "背部"
                      : entry.group === "shoulders"
                      ? "肩部"
                      : "臀腿";
                  const summaryParts = entry.exercises.map((ex) => {
                    const meta = EXERCISES.find(
                      (e) => e.id === ex.exerciseId
                    );
                    const name = meta?.name ?? "未命名动作";
                    return `${name}（${ex.sets}×${ex.reps}）`;
                  });
                  const summaryText =
                    summaryParts.length <= 2
                      ? summaryParts.join("，")
                      : `${summaryParts.slice(0, 2).join("，")} 等 ${
                          summaryParts.length
                        } 个动作`;
                  return (
                    <li
                      key={entry.id}
                      className="group flex items-center justify-between rounded-2xl bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition-all duration-200 hover:bg-white hover:shadow-[0_10px_30px_rgba(15,23,42,0.10)]"
                    >
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-slate-900/90 px-2 py-0.5 text-[10px] font-medium text-slate-50">
                            {groupLabel}
                          </span>
                          <span className="font-medium tracking-tight text-slate-900">
                            本次训练 · {entry.exercises.length} 个动作
                          </span>
                        </div>
                        <span className="mt-0.5 text-[11px] text-slate-500">
                          {summaryText}
                        </span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[11px] text-slate-400">
                          {formatDateTime(entry.createdAt)}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const first = entry.exercises[0];
                            if (first) {
                              setSelectedExerciseId(first.exerciseId);
                              setShowExerciseModal(true);
                            }
                          }}
                          className="text-[10px] font-medium text-slate-400 underline-offset-2 transition-colors hover:text-slate-700 hover:underline"
                        >
                          查看动作肌肉群
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
