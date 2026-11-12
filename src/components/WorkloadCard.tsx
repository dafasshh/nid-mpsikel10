import { ArrowUpRight } from "lucide-react";
import { capacity, members, type Task } from "../data";
import { Avatar, CapacityBar, Card, IconButton } from "./ui";

export function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-500">
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        Aman &lt;75%
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-amber-400" />
        Hampir penuh
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-rose-500" />
        Berlebih ≥90%
      </span>
    </div>
  );
}

export function WorkloadCard({
  tasks,
  onOpen,
  detailed = false,
}: {
  tasks: Task[];
  onOpen?: () => void;
  detailed?: boolean;
}) {
  const rows = members
    .map((m) => ({
      m,
      cap: capacity(m),
      active: tasks.filter((t) => t.status !== "done" && t.assignees.includes(m.id)).length,
    }))
    .sort((a, b) => b.cap.pct - a.cap.pct);
  const avg = Math.round(rows.reduce((s, r) => s + r.cap.pct, 0) / rows.length);
  const overloaded = rows.filter((r) => r.cap.pct >= 90).length;

  return (
    <Card className="p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Analitik Beban Kerja</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Jam teralokasi dibandingkan kapasitas mingguan (40 jam)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Legend />
          {onOpen && (
            <IconButton label="Buka beban kerja" onClick={onOpen}>
              <ArrowUpRight className="h-4 w-4" />
            </IconButton>
          )}
        </div>
      </div>

      <ul className="space-y-5">
        {rows.map(({ m, cap, active }) => (
          <li
            key={m.id}
            className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 sm:grid-cols-[minmax(0,210px)_1fr_auto]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar id={m.id} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{m.name}</p>
                <p className="truncate text-xs text-slate-500">
                  {m.role}
                  {detailed && ` · ${active} tugas aktif`}
                </p>
              </div>
            </div>
            <div className="col-span-2 flex items-center gap-3 sm:col-span-1">
              <CapacityBar pct={cap.pct} bar={cap.bar} />
              <span className="w-20 shrink-0 text-right text-xs tabular-nums text-slate-500">
                {m.allocated}/{m.capacity} jam
              </span>
            </div>
            <div className="col-start-2 row-start-1 flex items-center justify-end gap-2 sm:col-start-auto sm:row-start-auto">
              <span className={`text-sm font-semibold tabular-nums ${cap.text}`}>{cap.pct}%</span>
              <span
                className={`w-[92px] rounded-full py-0.5 text-center text-[11px] font-semibold ring-1 ring-inset ${cap.badge}`}
              >
                {cap.label}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid grid-cols-3 divide-x divide-slate-100 rounded-2xl bg-slate-50 py-3 text-center">
        <div>
          <p className="text-lg font-semibold tabular-nums">{avg}%</p>
          <p className="text-[11px] font-medium text-slate-500">Rata-rata tim</p>
        </div>
        <div>
          <p className="text-lg font-semibold tabular-nums text-rose-600">{overloaded}</p>
          <p className="text-[11px] font-medium text-slate-500">Kelebihan beban</p>
        </div>
        <div>
          <p className="text-lg font-semibold tabular-nums text-emerald-600">
            {members.reduce((s, m) => s + Math.max(0, m.capacity - m.allocated), 0)} jam
          </p>
          <p className="text-[11px] font-medium text-slate-500">Sisa kapasitas</p>
        </div>
      </div>
    </Card>
  );
}
