import { ArrowRight, CircleAlert, CircleCheck, ListChecks, Play, Timer } from "lucide-react";
import {
  capacity,
  dueInfo,
  isOverdue,
  memberById,
  projectById,
  statusLabels,
  type Status,
  type Task,
  type View,
} from "../data";
import { CapacityBar, Card, DueChip, PriorityBadge } from "../components/ui";
import { greeting } from "./Dashboard";

export function MemberDashboard({
  tasks,
  name,
  memberId,
  onMove,
  onNavigate,
}: {
  tasks: Task[];
  name: string;
  memberId?: string;
  onMove: (id: string, s: Status) => void;
  onNavigate: (v: View) => void;
}) {
  const mine = memberId ? tasks.filter((t) => t.assignees.includes(memberId)) : [];
  const open = mine.filter((t) => t.status !== "done").sort((a, b) => a.dueOffset - b.dueOffset);
  const week = open.filter((t) => t.dueOffset >= 0 && t.dueOffset <= 7).length;
  const member = memberId ? memberById(memberId) : undefined;
  const cap = member ? capacity(member) : undefined;

  const stats = [
    {
      label: "Belum dimulai",
      value: mine.filter((t) => t.status === "todo").length,
      icon: ListChecks,
      tone: "bg-slate-100 text-slate-600",
    },
    {
      label: "Sedang dikerjakan",
      value: mine.filter((t) => t.status === "inprogress").length,
      icon: Timer,
      tone: "bg-sky-50 text-sky-600",
    },
    {
      label: "Selesai",
      value: mine.filter((t) => t.status === "done").length,
      icon: CircleCheck,
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Terlambat",
      value: mine.filter(isOverdue).length,
      icon: CircleAlert,
      tone: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-7 text-white sm:p-9">
        <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-emerald-400/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 right-1/3 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              Ruang kerja pribadi
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              {greeting()}, {name.split(" ")[0]}.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
              Anda memiliki{" "}
              <span className="font-semibold text-white">{open.length} tugas aktif</span>, {week} di
              antaranya jatuh tempo dalam 7 hari ke depan.
            </p>
            <button
              type="button"
              onClick={() => onNavigate("tasks")}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Buka papan tugas
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          {cap && member && (
            <div className="w-full rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur md:w-80">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Kapasitas minggu ini</span>
                <span className="font-semibold">{cap.pct}%</span>
              </div>
              <div className="mt-3">
                <CapacityBar pct={cap.pct} bar={cap.bar} />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                {member.allocated}/{member.capacity} jam teralokasi · {cap.label}
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <Card key={label} className="p-6">
            <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}>
              <Icon className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <p className="mt-6 text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums">{value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold tracking-tight">Tugas Saya</h2>
        <p className="mt-0.5 text-sm text-slate-500">Diurutkan berdasarkan tenggat terdekat</p>
        {open.length === 0 ? (
          <p className="mt-5 rounded-2xl bg-slate-50 p-8 text-center text-sm text-slate-500">
            {memberId
              ? "Seluruh tugas Anda telah selesai. Kerja bagus!"
              : "Belum ada tugas yang ditugaskan kepada Anda. Manajer Proyek akan membagikan tugas segera."}
          </p>
        ) : (
          <ul className="mt-5 space-y-2.5">
            {open.map((t) => {
              const p = projectById(t.projectId);
              const next: Status = t.status === "todo" ? "inprogress" : "done";
              return (
                <li
                  key={t.id}
                  className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-100 p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{t.title}</p>
                    <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />
                      {p.name} · {statusLabels[t.status]}
                    </p>
                  </div>
                  <PriorityBadge priority={t.priority} />
                  <DueChip {...dueInfo(t)} />
                  <button
                    type="button"
                    onClick={() => onMove(t.id, next)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
                  >
                    {next === "inprogress" ? (
                      <Play className="h-3.5 w-3.5" />
                    ) : (
                      <CircleCheck className="h-3.5 w-3.5" />
                    )}
                    {next === "inprogress" ? "Mulai kerjakan" : "Tandai selesai"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
