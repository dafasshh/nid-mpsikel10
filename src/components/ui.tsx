import { useEffect, useRef, type ReactNode } from "react";
import { CalendarClock, CircleAlert, CircleCheck } from "lucide-react";
import { memberById, priorityLabels, type DueTone, type Priority } from "../data";

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}

export function Avatar({
  id,
  size = "md",
  ring = false,
}: {
  id: string;
  size?: "sm" | "md" | "lg";
  ring?: boolean;
}) {
  const m = memberById(id);
  const sizes = { sm: "h-7 w-7 text-[10px]", md: "h-9 w-9 text-xs", lg: "h-12 w-12 text-sm" };
  return (
    <span
      title={m.name}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-tight ${m.tone} ${sizes[size]} ${ring ? "ring-2 ring-white" : ""}`}
    >
      {initials(m.name)}
    </span>
  );
}

export function AvatarStack({ ids, size = "sm" }: { ids: string[]; size?: "sm" | "md" }) {
  return (
    <div className="flex -space-x-2">
      {ids.map((id) => (
        <Avatar key={id} id={id} size={size} ring />
      ))}
    </div>
  );
}

const priorityStyles: Record<Priority, string> = {
  Critical: "bg-rose-50 text-rose-600 ring-rose-100",
  High: "bg-orange-50 text-orange-600 ring-orange-100",
  Medium: "bg-sky-50 text-sky-600 ring-sky-100",
  Low: "bg-slate-100 text-slate-500 ring-slate-200/70",
};

const priorityDots: Record<Priority, string> = {
  Critical: "bg-rose-500",
  High: "bg-orange-500",
  Medium: "bg-sky-500",
  Low: "bg-slate-400",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${priorityStyles[priority]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${priorityDots[priority]}`} />
      {priorityLabels[priority]}
    </span>
  );
}

const dueStyles: Record<DueTone, string> = {
  overdue: "bg-rose-50 text-rose-600",
  soon: "bg-amber-50 text-amber-700",
  normal: "bg-slate-100 text-slate-600",
  done: "bg-emerald-50 text-emerald-700",
};

export function DueChip({ label, tone }: { label: string; tone: DueTone }) {
  const Icon = tone === "overdue" ? CircleAlert : tone === "done" ? CircleCheck : CalendarClock;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium ${dueStyles[tone]}`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      {label}
    </span>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-3xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}
    >
      {children}
    </section>
  );
}

export function IconButton({
  children,
  label,
  onClick,
  className = "",
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 ${className}`}
    >
      {children}
    </button>
  );
}

export function CapacityBar({ pct, bar }: { pct: number; bar: string }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={`bar-stripes h-full rounded-full transition-[width] duration-700 ${bar}`}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  );
}

export function useClickOutside<T extends HTMLElement>(open: boolean, onClose: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", esc);
    };
  }, [open, onClose]);
  return ref;
}
