import { CalendarDays, CircleCheck, Timer } from "lucide-react";
import {
  capacity,
  dueInfo,
  formatDate,
  isOverdue,
  members,
  projectById,
  projects,
  statusLabels,
  type Priority,
  type Task,
} from "../data";
import { Avatar, AvatarStack, CapacityBar, Card, DueChip, PriorityBadge } from "../components/ui";
import { Legend, WorkloadCard } from "../components/WorkloadCard";

export function ProjectsView({ tasks, query }: { tasks: Task[]; query: string }) {
  const q = query.trim().toLowerCase();
  const list = projects.filter((p) => !q || `${p.name} ${p.client}`.toLowerCase().includes(q));
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {list.map((p) => {
        const pt = tasks.filter((t) => t.projectId === p.id);
        const team = [...new Set(pt.flatMap((t) => t.assignees))];
        const open = pt.filter((t) => t.status !== "done").length;
        const late = pt.filter(isOverdue).length;
        return (
          <Card key={p.id} className="flex flex-col p-6">
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${p.soft}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />
                {p.client}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(p.dueOffset, { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
            <h2 className="mt-4 text-lg font-semibold tracking-tight">{p.name}</h2>
            <div className="mt-5 flex items-baseline justify-between">
              <span className="text-3xl font-semibold tabular-nums tracking-tight">
                {p.progress}%
              </span>
              <span className="text-xs text-slate-500">selesai</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`bar-stripes h-full rounded-full ${p.dot}`}
                style={{ width: `${p.progress}%` }}
              />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              {[
                { l: "Tugas", v: pt.length, c: "text-slate-900" },
                { l: "Berjalan", v: open, c: "text-sky-600" },
                { l: "Terlambat", v: late, c: late ? "text-rose-600" : "text-slate-900" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl bg-slate-50 py-2">
                  <p className={`text-base font-semibold tabular-nums ${s.c}`}>{s.v}</p>
                  <p className="text-[11px] text-slate-500">{s.l}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <AvatarStack ids={team} size="md" />
              <span className="text-xs text-slate-500">{team.length} anggota</span>
            </div>
          </Card>
        );
      })}
      {list.length === 0 && (
        <p className="col-span-full py-20 text-center text-sm text-slate-500">
          Tidak ada proyek yang cocok dengan “{query}”.
        </p>
      )}
    </div>
  );
}

export function TeamView({ tasks }: { tasks: Task[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {members.map((m) => {
        const cap = capacity(m);
        const mine = tasks.filter((t) => t.assignees.includes(m.id));
        const active = mine.filter((t) => t.status !== "done");
        const next = [...active].sort((a, b) => a.dueOffset - b.dueOffset)[0];
        return (
          <Card key={m.id} className="p-6">
            <div className="flex items-center gap-4">
              <Avatar id={m.id} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{m.name}</p>
                <p className="truncate text-sm text-slate-500">{m.role}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${cap.badge}`}
              >
                {cap.label}
              </span>
            </div>
            <div className="mt-6 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-500">Kapasitas</span>
              <span className={`font-semibold tabular-nums ${cap.text}`}>
                {cap.pct}% · {m.allocated}/{m.capacity} jam
              </span>
            </div>
            <div className="mt-2">
              <CapacityBar pct={cap.pct} bar={cap.bar} />
            </div>
            <div className="mt-5 flex gap-2">
              <span className="flex flex-1 items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                <Timer className="h-3.5 w-3.5 text-sky-600" />
                {active.length} aktif
              </span>
              <span className="flex flex-1 items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                <CircleCheck className="h-3.5 w-3.5 text-emerald-600" />
                {mine.length - active.length} selesai
              </span>
            </div>
            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Berikutnya
              </p>
              {next ? (
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-medium">{next.title}</p>
                  <DueChip {...dueInfo(next)} />
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-500">Tidak ada tugas terbuka</p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export function WorkloadView({ tasks }: { tasks: Task[] }) {
  const ranked = members
    .map((m) => ({ m, cap: capacity(m) }))
    .sort((a, b) => b.cap.pct - a.cap.pct);
  const over = ranked.filter((r) => r.cap.pct >= 90);
  const spare = ranked.filter((r) => r.cap.pct < 75);
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="xl:col-span-2">
        <WorkloadCard tasks={tasks} detailed />
      </div>
      <Card className="p-6">
        <h2 className="text-lg font-semibold tracking-tight">Rekomendasi Redistribusi Tugas</h2>
        <p className="mt-0.5 text-sm text-slate-500">
          Alihkan pekerjaan terbuka dari anggota yang kelebihan beban
        </p>
        <ul className="mt-5 space-y-3">
          {over.flatMap(({ m }) =>
            tasks
              .filter((t) => t.status === "todo" && t.assignees.includes(m.id))
              .slice(0, 2)
              .map((t, i) => {
                const target = spare[i % Math.max(spare.length, 1)]?.m;
                return (
                  <li key={`${m.id}-${t.id}`} className="rounded-2xl border border-slate-100 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-semibold">{t.title}</p>
                      <PriorityBadge priority={t.priority} />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{projectById(t.projectId).name}</p>
                    {target && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                        <Avatar id={m.id} size="sm" />
                        <span className="text-slate-400">→</span>
                        <Avatar id={target.id} size="sm" />
                        <span>
                          Alihkan ke{" "}
                          <span className="font-semibold">{target.name.split(" ")[0]}</span> (
                          {capacity(target).pct}%)
                        </span>
                      </div>
                    )}
                  </li>
                );
              }),
          )}
        </ul>
        <div className="mt-5">
          <Legend />
        </div>
      </Card>
    </div>
  );
}

export function ReportsView({ tasks }: { tasks: Task[] }) {
  const byStatus = [
    { l: statusLabels.todo, v: tasks.filter((t) => t.status === "todo").length, c: "bg-slate-300" },
    {
      l: statusLabels.inprogress,
      v: tasks.filter((t) => t.status === "inprogress").length,
      c: "bg-sky-500",
    },
    {
      l: statusLabels.done,
      v: tasks.filter((t) => t.status === "done").length,
      c: "bg-emerald-500",
    },
  ];
  const total = Math.max(tasks.length, 1);
  const prios: Priority[] = ["Critical", "High", "Medium", "Low"];
  const maxPrio = Math.max(...prios.map((p) => tasks.filter((t) => t.priority === p).length), 1);
  const velocity = [6, 9, 7, 11, 10, 13, byStatus[2].v + 8];
  const maxV = Math.max(...velocity);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <h2 className="text-lg font-semibold tracking-tight">Distribusi Status Tugas</h2>
        <p className="mt-0.5 text-sm text-slate-500">{tasks.length} tugas di seluruh proyek</p>
        <div className="mt-6 flex h-4 overflow-hidden rounded-full bg-slate-100">
          {byStatus.map((s) => (
            <div
              key={s.l}
              className={`${s.c} h-full transition-[width] duration-500`}
              style={{ width: `${(s.v / total) * 100}%` }}
            />
          ))}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {byStatus.map((s) => (
            <div key={s.l} className="rounded-2xl bg-slate-50 p-4">
              <span className={`block h-2 w-6 rounded-full ${s.c}`} />
              <p className="mt-3 text-2xl font-semibold tabular-nums">{s.v}</p>
              <p className="text-xs text-slate-500">
                {s.l} · {Math.round((s.v / total) * 100)}%
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold tracking-tight">Tugas Selesai per Iterasi</h2>
        <p className="mt-0.5 text-sm text-slate-500">7 iterasi terakhir</p>
        <div className="mt-6 flex h-44 items-end gap-3">
          {velocity.map((v, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-[11px] font-semibold tabular-nums text-slate-500">{v}</span>
              <div
                className={`w-full rounded-xl ${i === velocity.length - 1 ? "bg-slate-900" : "bg-slate-200"}`}
                style={{ height: `${(v / maxV) * 130}px` }}
              />
              <span className="text-[11px] text-slate-400">It-{8 + i}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold tracking-tight">Tugas Berdasarkan Prioritas</h2>
        <ul className="mt-5 space-y-4">
          {prios.map((p) => {
            const n = tasks.filter((t) => t.priority === p).length;
            return (
              <li key={p} className="grid grid-cols-[90px_1fr_32px] items-center gap-4">
                <PriorityBadge priority={p} />
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-800"
                    style={{ width: `${(n / maxPrio) * 100}%` }}
                  />
                </div>
                <span className="text-right text-sm font-semibold tabular-nums">{n}</span>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold tracking-tight">Penyelesaian per Proyek</h2>
        <ul className="mt-5 space-y-4">
          {projects.map((p) => {
            const pt = tasks.filter((t) => t.projectId === p.id);
            const d = pt.filter((t) => t.status === "done").length;
            const pct = pt.length ? Math.round((d / pt.length) * 100) : 0;
            return (
              <li key={p.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <span className={`h-2 w-2 rounded-full ${p.dot}`} />
                    {p.name}
                  </span>
                  <span className="text-xs tabular-nums text-slate-500">
                    {d}/{pt.length} tugas · {pct}%
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${p.dot}`} style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
