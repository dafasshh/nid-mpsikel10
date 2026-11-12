import { useState, type FormEvent } from "react";
import {
  Circle,
  CircleCheck,
  CircleDashed,
  ListChecks,
  Lock,
  MessageSquare,
  Plus,
  Timer,
  X,
} from "lucide-react";
import {
  dueInfo,
  members,
  priorityLabels,
  projectById,
  projects,
  statusLabels,
  type Priority,
  type Status,
  type Task,
} from "../data";
import { Avatar, AvatarStack, DueChip, PriorityBadge } from "../components/ui";
import { TaskDetail } from "../components/TaskDetail";

const columns: { id: Status; icon: typeof Circle; tone: string }[] = [
  { id: "todo", icon: CircleDashed, tone: "text-slate-500" },
  { id: "inprogress", icon: Timer, tone: "text-sky-600" },
  { id: "done", icon: CircleCheck, tone: "text-emerald-600" },
];

const priorities: (Priority | "All")[] = ["All", "Critical", "High", "Medium", "Low"];

function TaskCard({
  task,
  onToggle,
  onDragStart,
  dragging,
  editable = true,
  onOpen,
}: {
  task: Task;
  onToggle: () => void;
  onDragStart: () => void;
  dragging: boolean;
  editable?: boolean;
  onOpen: () => void;
}) {
  const p = projectById(task.projectId);
  const due = dueInfo(task);
  const done = task.status === "done";
  const [sd, st] = task.subtasks;

  return (
    <article
      draggable={editable}
      onDragStart={(e) => {
        if (!editable) return e.preventDefault();
        e.dataTransfer.setData("text/plain", task.id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      className={`group rounded-2xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition ${
        editable
          ? "cursor-grab hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgba(15,23,42,0.18)] active:cursor-grabbing"
          : "cursor-default"
      } ${dragging ? "opacity-40" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold ${p.soft}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />
          {p.name}
        </span>
        {editable ? (
          <button
            type="button"
            onClick={onToggle}
            aria-label={done ? "Tandai belum selesai" : "Tandai selesai"}
            className={`-m-1 rounded-full p-1 transition ${done ? "text-emerald-500" : "text-slate-300 hover:text-emerald-500"}`}
          >
            {done ? <CircleCheck className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
          </button>
        ) : (
          <span
            title="Hanya dapat diubah oleh anggota yang ditugaskan"
            aria-label="Terkunci: hanya dapat dilihat"
            className="-m-1 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500"
          >
            <Lock className="h-3 w-3" />
            Lihat saja
          </span>
        )}
      </div>

      <h3
        className={`mt-3 text-sm font-semibold leading-snug ${done ? "text-slate-400 line-through decoration-slate-300" : "text-slate-900"}`}
      >
        <button
          type="button"
          onClick={onOpen}
          className="text-left hover:underline hover:underline-offset-4"
        >
          {task.title}
        </button>
      </h3>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PriorityBadge priority={task.priority} />
        <DueChip {...due} />
      </div>

      {st > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ListChecks className="h-3.5 w-3.5" />
              Subtugas
            </span>
            <span className="tabular-nums">
              {done ? st : sd}/{st}
            </span>
          </div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${done ? "bg-emerald-500" : "bg-slate-800"}`}
              style={{ width: `${((done ? st : sd) / st) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        {task.assignees.length ? (
          <AvatarStack ids={task.assignees} />
        ) : (
          <span className="text-[11px] font-medium text-slate-400">Belum ditugaskan</span>
        )}
        <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
          <MessageSquare className="h-3.5 w-3.5" />
          {task.comments}
        </span>
      </div>
    </article>
  );
}

function QuickAdd({
  onAdd,
  onCancel,
}: {
  onAdd: (title: string, priority: Priority, projectId: string) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [projectId, setProjectId] = useState(projects[0].id);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), priority, projectId);
    setTitle("");
  };
  const select =
    "h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-medium text-slate-700 outline-none focus:border-slate-300";
  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && onCancel()}
        placeholder="Judul tugas"
        className="w-full bg-transparent px-1 py-1 text-sm font-medium outline-none placeholder:text-slate-400"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className={`${select} min-w-0 flex-1`}
          aria-label="Proyek"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className={select}
          aria-label="Prioritas"
        >
          {(["Critical", "High", "Medium", "Low"] as Priority[]).map((p) => (
            <option key={p} value={p}>
              {priorityLabels[p]}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white disabled:bg-slate-300"
        >
          Tambah tugas
        </button>
      </div>
    </form>
  );
}

export function Kanban({
  tasks,
  query,
  onClearQuery,
  onMove,
  onAdd,
  canAdd = true,
  restrictTo,
}: {
  tasks: Task[];
  query: string;
  onClearQuery: () => void;
  onMove: (id: string, status: Status) => void;
  onAdd: (task: Omit<Task, "id">) => void;
  canAdd?: boolean;
  /** When set (Anggota Tim), only tasks assigned to this member are shown and editable. */
  restrictTo?: string;
}) {
  const [priority, setPriority] = useState<Priority | "All">("All");
  const [assignee, setAssignee] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<Status | null>(null);
  const [adding, setAdding] = useState<Status | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const openTask = tasks.find((t) => t.id === openId);

  const restricted = restrictTo !== undefined;
  const canEdit = (t: Task) => !restricted || t.assignees.includes(restrictTo);

  const q = query.trim().toLowerCase();
  const visible = tasks.filter(
    (t) =>
      (priority === "All" || t.priority === priority) &&
      (!assignee || t.assignees.includes(assignee)) &&
      (!q ||
        t.title.toLowerCase().includes(q) ||
        projectById(t.projectId).name.toLowerCase().includes(q)),
  );
  const filtered = priority !== "All" || assignee || q;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1 rounded-full border border-slate-200/80 bg-white p-1">
          {priorities.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${priority === p ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              {p === "All" ? "Semua" : priorityLabels[p]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {filtered && (
            <button
              type="button"
              onClick={() => {
                setPriority("All");
                setAssignee(null);
                onClearQuery();
              }}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-white hover:text-slate-900"
            >
              <X className="h-3.5 w-3.5" />
              Hapus filter{q && ` (“${query}”)`}
            </button>
          )}
          {restricted && (
            <span
              title="Tugas anggota lain hanya dapat dilihat"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600"
            >
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              Anda hanya dapat mengubah tugas milik Anda
            </span>
          )}
          <div className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white p-1">
            {members.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setAssignee((a) => (a === m.id ? null : m.id))}
                aria-pressed={assignee === m.id}
                className={`rounded-full transition ${assignee === m.id ? "ring-2 ring-slate-900 ring-offset-2" : assignee ? "opacity-40 hover:opacity-100" : ""}`}
              >
                <Avatar id={m.id} size="sm" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {columns.map(({ id, icon: Icon, tone }) => {
          const items = visible.filter((t) => t.status === id);
          const isOver =
            overCol === id && dragId !== null && tasks.find((t) => t.id === dragId)?.status !== id;
          return (
            <section
              key={id}
              onDragOver={(e) => {
                e.preventDefault();
                setOverCol(id);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setOverCol(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                const taskId = e.dataTransfer.getData("text/plain");
                const dropped = tasks.find((t) => t.id === taskId);
                if (dropped && canEdit(dropped)) onMove(taskId, id);
                setOverCol(null);
                setDragId(null);
              }}
              className={`flex min-h-[520px] flex-col rounded-3xl border border-dashed p-3 transition ${
                isOver ? "border-indigo-300 bg-indigo-50/60" : "border-slate-200 bg-slate-100/50"
              }`}
            >
              <header className="mb-3 flex items-center justify-between px-2 pt-1">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${tone}`} strokeWidth={2} />
                  <h2 className="text-sm font-semibold text-slate-900">{statusLabels[id]}</h2>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold tabular-nums text-slate-500 ring-1 ring-slate-200/70">
                    {items.length}
                  </span>
                </div>
                {canAdd && (
                  <button
                    type="button"
                    onClick={() => setAdding(id)}
                    aria-label={`Tambah tugas ke ${statusLabels[id]}`}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-white hover:text-slate-900"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                )}
              </header>

              <div className="flex flex-1 flex-col gap-3" onDragEnd={() => setDragId(null)}>
                {adding === id && (
                  <QuickAdd
                    onCancel={() => setAdding(null)}
                    onAdd={(title, pr, projectId) =>
                      onAdd({
                        title,
                        priority: pr,
                        projectId,
                        status: id,
                        assignees: assignee ? [assignee] : [],
                        dueOffset: 7,
                        comments: 0,
                        subtasks: [0, 0],
                      })
                    }
                  />
                )}
                {items.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    dragging={dragId === t.id}
                    editable={canEdit(t)}
                    onOpen={() => setOpenId(t.id)}
                    onDragStart={() => setDragId(t.id)}
                    onToggle={() => onMove(t.id, t.status === "done" ? "todo" : "done")}
                  />
                ))}
                {items.length === 0 && adding !== id && (
                  <div className="flex flex-1 flex-col items-center justify-center rounded-2xl px-6 py-10 text-center">
                    <p className="text-sm font-medium text-slate-500">
                      {filtered ? "Tidak ada tugas yang cocok" : "Belum ada tugas"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {canAdd
                        ? "Seret kartu ke sini atau tambahkan tugas baru."
                        : "Seret kartu ke sini untuk memperbarui status."}
                    </p>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
      {openTask && (
        <TaskDetail
          task={openTask}
          editable={canEdit(openTask)}
          onMove={(id, st) => canEdit(openTask) && onMove(id, st)}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  );
}
