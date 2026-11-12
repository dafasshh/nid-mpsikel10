import {
  ArrowRight,
  ArrowUpRight,
  BellRing,
  Briefcase,
  CircleAlert,
  ListChecks,
  TriangleAlert,
} from "lucide-react";
import {
  capacity,
  dueInfo,
  formatDate,
  isOverdue,
  members,
  projectById,
  projects,
  type Task,
  type View,
} from "../data";
import { WorkloadCard } from "../components/WorkloadCard";
import { AvatarStack, Card, IconButton, PriorityBadge } from "../components/ui";

export function greeting() {
  const h = new Date().getHours();
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 18) return "Selamat sore";
  return "Selamat malam";
}

function Banner({
  tasks,
  onNavigate,
  userName,
}: {
  tasks: Task[];
  onNavigate: (v: View) => void;
  userName: string;
}) {
  const active = tasks.filter((t) => t.status !== "done").length;
  const overloaded = members.filter((m) => capacity(m).pct >= 90);
  const overdue = tasks.filter(isOverdue).length;
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-7 text-white sm:p-9">
      <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-indigo-500/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-1/3 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 top-0 h-60 w-60 rounded-full bg-violet-500/20 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{today}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-[34px]">
            {greeting()}, {userName.split(" ")[0]}.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
            Tim Anda memiliki <span className="font-semibold text-white">{active} tugas aktif</span>{" "}
            di {projects.length} proyek.{" "}
            {overloaded.length > 0 && (
              <>
                <span className="font-semibold text-rose-300">{overloaded.length} hambatan</span>{" "}
                memerlukan perhatian — {overloaded.map((m) => m.name.split(" ")[0]).join(" dan ")}{" "}
                telah mencapai atau melampaui batas kapasitas.
              </>
            )}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate("workload")}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Seimbangkan beban kerja
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate("tasks")}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              Buka papan tugas
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 lg:w-[380px]">
          {[
            {
              label: "Sedang dikerjakan",
              value: tasks.filter((t) => t.status === "inprogress").length,
              tone: "text-sky-300",
            },
            { label: "Hambatan", value: overloaded.length, tone: "text-rose-300" },
            { label: "Terlambat", value: overdue, tone: "text-amber-300" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur"
            >
              <p className={`text-2xl font-semibold tabular-nums ${s.tone}`}>{s.value}</p>
              <p className="mt-1 text-xs text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  note,
  icon: Icon,
  iconTone,
  noteTone = "text-slate-500",
  onOpen,
}: {
  label: string;
  value: number;
  note: string;
  icon: typeof Briefcase;
  iconTone: string;
  noteTone?: string;
  onOpen: () => void;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconTone}`}>
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <IconButton label={`Buka ${label}`} onClick={onOpen}>
          <ArrowUpRight className="h-4 w-4" />
        </IconButton>
      </div>
      <p className="mt-6 text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-1 flex items-baseline justify-between gap-3">
        <p className="text-4xl font-semibold tracking-tight tabular-nums">{value}</p>
        <p className={`text-xs font-medium ${noteTone}`}>{note}</p>
      </div>
    </Card>
  );
}

function Deadlines({ tasks, onOpen }: { tasks: Task[]; onOpen: () => void }) {
  const items = tasks
    .filter((t) => t.status !== "done" && (t.priority === "Critical" || t.priority === "High"))
    .sort((a, b) => a.dueOffset - b.dueOffset)
    .slice(0, 6);

  return (
    <Card className="flex flex-col p-6">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Tenggat & Pengingat</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Pekerjaan dengan prioritas kritis dan tinggi
          </p>
        </div>
        <IconButton label="Buka papan tugas" onClick={onOpen}>
          <BellRing className="h-4 w-4" />
        </IconButton>
      </div>
      {items.length === 0 ? (
        <p className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
          Tidak ada tenggat kritis. Kerja bagus!
        </p>
      ) : (
        <ul className="space-y-2.5">
          {items.map((t) => {
            const due = dueInfo(t);
            const p = projectById(t.projectId);
            return (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={onOpen}
                  className="flex w-full items-center gap-4 rounded-2xl border border-slate-100 p-3 text-left transition hover:border-slate-200 hover:bg-slate-50/70"
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl ${
                      due.tone === "overdue"
                        ? "bg-rose-50 text-rose-600"
                        : due.tone === "soon"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <span className="text-base font-semibold leading-none tabular-nums">
                      {formatDate(t.dueOffset, { day: "numeric" })}
                    </span>
                    <span className="mt-0.5 text-[10px] font-semibold uppercase">
                      {formatDate(t.dueOffset, { month: "short" })}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-900">
                      {t.title}
                    </span>
                    <span className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />
                      <span className="truncate">{p.name}</span>
                    </span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1.5">
                    <PriorityBadge priority={t.priority} />
                    <span
                      className={`text-[11px] font-medium ${due.tone === "overdue" ? "text-rose-600" : due.tone === "soon" ? "text-amber-700" : "text-slate-500"}`}
                    >
                      {due.label}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

function ProjectsStrip({ tasks, onOpen }: { tasks: Task[]; onOpen: () => void }) {
  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Progres Proyek</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Status penyelesaian proyek yang sedang berjalan
          </p>
        </div>
        <IconButton label="Buka proyek" onClick={onOpen}>
          <ArrowUpRight className="h-4 w-4" />
        </IconButton>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {projects.map((p) => {
          const team = [
            ...new Set(tasks.filter((t) => t.projectId === p.id).flatMap((t) => t.assignees)),
          ];
          return (
            <div key={p.id} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${p.dot}`} />
                <span className="truncate text-xs font-medium text-slate-500">{p.client}</span>
              </div>
              <p className="mt-2 truncate text-sm font-semibold">{p.name}</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="font-semibold tabular-nums">{p.progress}%</span>
                <span className="text-slate-500">Tenggat {formatDate(p.dueOffset)}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200/70">
                <div
                  className={`h-full rounded-full ${p.dot}`}
                  style={{ width: `${p.progress}%` }}
                />
              </div>
              <div className="mt-4">
                <AvatarStack ids={team} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function Dashboard({
  tasks,
  onNavigate,
  userName,
}: {
  tasks: Task[];
  onNavigate: (v: View) => void;
  userName: string;
}) {
  const overdue = tasks.filter(isOverdue);
  const done = tasks.filter((t) => t.status === "done").length;
  const dueThisMonth = projects.filter((p) => p.dueOffset <= 30).length;

  return (
    <div className="space-y-6">
      <Banner tasks={tasks} onNavigate={onNavigate} userName={userName} />

      <div className="grid gap-6 md:grid-cols-3">
        <Metric
          label="Proyek Aktif"
          value={projects.length}
          note={`${dueThisMonth} jatuh tempo dalam 30 hari`}
          icon={Briefcase}
          iconTone="bg-indigo-50 text-indigo-600"
          onOpen={() => onNavigate("projects")}
        />
        <Metric
          label="Total Tugas"
          value={tasks.length}
          note={`${done} selesai`}
          icon={ListChecks}
          iconTone="bg-emerald-50 text-emerald-600"
          noteTone="text-emerald-600"
          onOpen={() => onNavigate("tasks")}
        />
        <Metric
          label="Tugas Terlambat"
          value={overdue.length}
          note={overdue.length ? "Perlu perhatian" : "Semua sesuai jadwal"}
          icon={overdue.length ? TriangleAlert : CircleAlert}
          iconTone="bg-rose-50 text-rose-600"
          noteTone={overdue.length ? "text-rose-600" : "text-emerald-600"}
          onOpen={() => onNavigate("tasks")}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <WorkloadCard tasks={tasks} onOpen={() => onNavigate("workload")} />
        </div>
        <div className="xl:col-span-2">
          <Deadlines tasks={tasks} onOpen={() => onNavigate("tasks")} />
        </div>
      </div>

      <ProjectsStrip tasks={tasks} onOpen={() => onNavigate("projects")} />
    </div>
  );
}
