import { useEffect } from "react";
import { CalendarDays, ListChecks, Lock, MessageSquare, X } from "lucide-react";
import {
  dueInfo,
  formatDate,
  memberById,
  projectById,
  statusLabels,
  type Status,
  type Task,
} from "../data";
import { Avatar, DueChip, PriorityBadge } from "./ui";
import { Logo } from "./Logo";

const order: Status[] = ["todo", "inprogress", "done"];

export function TaskDetail({
  task,
  editable,
  onMove,
  onClose,
}: {
  task: Task;
  editable: boolean;
  onMove: (id: string, s: Status) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const p = projectById(task.projectId);
  const [sd, st] = task.subtasks;
  const done = task.status === "done";

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-slate-900/30 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-detail-title"
        onMouseDown={(e) => e.stopPropagation()}
        className="flex w-full flex-col overflow-y-auto bg-[#F8FAFC] sm:max-h-[90vh] sm:max-w-2xl sm:rounded-3xl sm:border sm:border-white sm:shadow-2xl sm:shadow-slate-900/20"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200/70 bg-white/80 px-5 py-3.5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="h-5 w-px bg-slate-200" />
            <span className="text-xs font-semibold text-slate-500">Detail Tugas</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:text-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-7">
          <div className="rounded-3xl border border-slate-200/70 bg-white p-6">
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold ${p.soft}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />
              {p.name} · {p.client}
            </span>
            <h2
              id="task-detail-title"
              className="mt-3 text-xl font-semibold tracking-tight text-slate-900"
            >
              {task.title}
            </h2>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <PriorityBadge priority={task.priority} />
              <DueChip {...dueInfo(task)} />
              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(task.dueOffset, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200/70 bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Penanggung jawab
              </p>
              <ul className="mt-3 space-y-3">
                {task.assignees.length === 0 && (
                  <li className="text-sm text-slate-500">Belum ditugaskan</li>
                )}
                {task.assignees.map((id) => {
                  const m = memberById(id);
                  return (
                    <li key={id} className="flex items-center gap-3">
                      <Avatar id={id} />
                      <div>
                        <p className="text-sm font-semibold">{m.name}</p>
                        <p className="text-xs text-slate-500">{m.role}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200/70 bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Progres
              </p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <ListChecks className="h-4 w-4" /> Subtugas
                </span>
                <span className="font-semibold tabular-nums">
                  {st ? `${done ? st : sd}/${st}` : "—"}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${done ? "bg-emerald-500" : "bg-slate-800"}`}
                  style={{ width: `${st ? ((done ? st : sd) / st) * 100 : done ? 100 : 0}%` }}
                />
              </div>
              <p className="mt-4 flex items-center gap-1.5 text-sm text-slate-600">
                <MessageSquare className="h-4 w-4" /> {task.comments} komentar
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/70 bg-white p-6">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Status
              </p>
              {!editable && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                  <Lock className="h-3 w-3" /> Lihat saja
                </span>
              )}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {order.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={!editable}
                  onClick={() => onMove(task.id, s)}
                  aria-pressed={task.status === s}
                  className={`rounded-2xl px-3 py-2.5 text-xs font-semibold transition disabled:cursor-not-allowed ${
                    task.status === s
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-600 enabled:hover:border-slate-300 enabled:hover:text-slate-900 disabled:opacity-50"
                  }`}
                >
                  {statusLabels[s]}
                </button>
              ))}
            </div>
            {!editable && (
              <p className="mt-3 text-xs text-slate-500">
                Status hanya dapat diubah oleh anggota yang ditugaskan atau Manajer Proyek.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
